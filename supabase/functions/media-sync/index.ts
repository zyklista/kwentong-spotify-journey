// deno-lint-ignore-file no-import-prefix no-explicit-any prefer-const
// @ts-ignore: allow remote std import for runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Allow usage of the Deno global when type-checking in this container
declare const Deno: any;
// Supabase Edge Function: media-sync
// Fetches YouTube RSS, optionally enriches with YouTube Data API (server-side key), and
// optionally persists/upserts results into the `youtube_videos` table via Supabase REST.

const DEFAULT_CHANNEL = "UCANMUQ39X4PcnUENrxFocbw";
const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_DATA_API_KEY") || Deno.env.get("YT_DATA_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

function parseRssEntries(xml: string) {
  const entries = xml.split('<entry>').slice(1);
    return entries.map(entry => {
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
    const title = (entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? "").trim();
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? null;
    const description = entry.match(/<media:description>([^<]+)<\/media:description>/)?.[1] ?? "";
    const thumbnail = entry.match(/<media:thumbnail url=\"([^\"]+)\"\/>/)?.[1]
      ?? (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "");
    const url = videoId ? `https://www.youtube.com/watch?v=${videoId}` : '';
    return { video_id: videoId, title, published_at: published, description, thumbnail_url: thumbnail, url, duration_iso: null, duration_seconds: null };
  }).filter(v => v.video_id);
}

function parseIsoDurationToSeconds(iso?: string | null) {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  return hours * 3600 + minutes * 60 + seconds;
}

async function fetchYouTubeVideosWithDurations(videoIds: string[]): Promise<any[]> {
  if (!YOUTUBE_API_KEY) return [];
  if (videoIds.length === 0) return [];
  const batch = videoIds.slice(0, 50).join(',');
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${batch}&key=${YOUTUBE_API_KEY}`;
  const resp = await fetch(url, { method: 'GET' });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`YouTube Data API error ${resp.status}: ${txt.slice(0, 500)}`);
  }
  const j = await resp.json();
  const items = (j.items || []).map((it: any) => {
    const durationIso = it.contentDetails?.duration || null;
    const durationSeconds = parseIsoDurationToSeconds(durationIso);
    return {
      id: it.id,
      video_id: it.id,
      title: it.snippet?.title || '',
      description: it.snippet?.description || '',
      thumbnail_url: it.snippet?.thumbnails?.high?.url || it.snippet?.thumbnails?.default?.url || `https://img.youtube.com/vi/${it.id}/hqdefault.jpg`,
      published_at: it.snippet?.publishedAt || null,
      duration_iso: durationIso,
      duration_seconds: durationSeconds
    };
  });
  return items;
}

async function persistToSupabase(items: any[]) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('Supabase URL or service role key not configured');
  if (!items || items.length === 0) return { count: 0 };
  const rows = items.map(i => ({
    video_id: i.video_id,
    title: i.title,
    description: i.description || null,
    thumbnail_url: i.thumbnail_url || null,
    published_at: i.published_at || null,
    // store both ISO (preferred) and numeric seconds for easier filtering
    duration: i.duration_iso || (i.duration_seconds ? String(i.duration_seconds) : null),
    duration_seconds: i.duration_seconds ?? null,
  }));

  const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/youtube_videos`;
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Prefer': 'resolution=merge-duplicates,return=representation'
    },
    body: JSON.stringify(rows),
  });
  const data = await resp.json().catch(() => null);
  if (!resp.ok) {
    throw new Error(`Supabase upsert failed ${resp.status}: ${JSON.stringify(data).slice(0,500)}`);
  }
  return { count: data?.length ?? rows.length, rows: data };
}

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const method = req.method;
    let params: any = {};
    if (method === 'GET') {
      params.channel_id = url.searchParams.get('channel_id') || url.searchParams.get('channelId') || url.searchParams.get('channel') || DEFAULT_CHANNEL;
      params.force = url.searchParams.get('force') === '1' || url.searchParams.get('force') === 'true';
      params.persist = url.searchParams.get('persist') === '1' || url.searchParams.get('persist') === 'true';
      params.min_duration = parseInt(url.searchParams.get('min_duration') || url.searchParams.get('minDuration') || '0', 10) || 0;
    } else if (method === 'POST') {
      const body = await req.json().catch(() => ({}));
      params.channel_id = body.channel_id || body.channel || DEFAULT_CHANNEL;
      params.force = body.force === true;
      params.persist = body.persist === true;
      params.min_duration = parseInt(body.min_duration || body.minDuration || 0, 10) || 0;
    } else {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const channelId = params.channel_id || DEFAULT_CHANNEL;

    // Fetch RSS
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const rssResp = await fetch(rssUrl);
    if (!rssResp.ok) {
      const text = await rssResp.text().catch(() => '');
      return new Response(JSON.stringify({ error: 'Failed to fetch RSS', status: rssResp.status, body: text.slice(0, 300) }), { status: 502 });
    }
    const xml = await rssResp.text();
    const basicItems = parseRssEntries(xml);

    // Try to enrich with server-side API key
    let enrichedItems: any[] = [];
    const minDur = Number(params.min_duration || 0) || 0;
    if (YOUTUBE_API_KEY) {
      try {
        const ids = basicItems.map(i => i.video_id);
        const itemsWithDur = await fetchYouTubeVideosWithDurations(ids);
        // Keep order of RSS; map by video_id
        const byId: Record<string, any> = {};
        itemsWithDur.forEach(it => { byId[it.video_id] = it; });
        enrichedItems = basicItems.map(b => byId[b.video_id] ? Object.assign({}, b, byId[b.video_id]) : b);
        // If duration provided, filter to >= minDur when requested (or no filtering if minDur=0)
        if (minDur > 0) {
          enrichedItems = enrichedItems.filter(it => (it.duration_seconds ? it.duration_seconds >= minDur : false));
        }
      } catch (err) {
        // On error, fallback to basicItems
        console.warn('YouTube enrichment failed', String(err));
        enrichedItems = basicItems;
      }
    } else {
      // Add duration fields (null) so client can rely on consistent shape. Try to
      // infer duration from title/description when possible, then filter by minDur.
      const inferDurationFromText = (text: string | null) => {
        if (!text) return 0;
        const s = String(text).toLowerCase();
        // look for HH:MM:SS or MM:SS
        const timeMatch = s.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
        if (timeMatch) {
          const parts = timeMatch[1].split(':').map(p => parseInt(p, 10));
          if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
          if (parts.length === 2) return parts[0] * 60 + parts[1];
        }
        // look for "12 min" or "12m"
        const minMatch = s.match(/(\d{1,3})\s*(?:min|mins|minutes)\b/);
        if (minMatch) {
          const mins = parseInt(minMatch[1], 10);
          if (!isNaN(mins)) return mins * 60;
        }
        const shortM = s.match(/\b(\d{1,3})m\b/);
        if (shortM) {
          const mins = parseInt(shortM[1], 10);
          if (!isNaN(mins)) return mins * 60;
        }
        return 0;
      };

      enrichedItems = basicItems.map(b => {
        const inferred = inferDurationFromText((b.title || '') + ' ' + (b.description || ''));
        return Object.assign({}, b, { duration_iso: null, duration_seconds: inferred || null, url: b.url || (`https://www.youtube.com/watch?v=${b.video_id}`) });
      });

      // If minDur requested, keep only items whose inferred duration meets threshold
      if (minDur > 0) {
        enrichedItems = enrichedItems.filter(it => (it.duration_seconds ? it.duration_seconds >= minDur : false));
      }
    }

    // Persist if requested
    let persistResult = null;
    if (params.persist) {
      try {
        persistResult = await persistToSupabase(enrichedItems);
      } catch (err) {
        console.error('Persist failed', String(err));
        return new Response(JSON.stringify({ error: 'Persist failed', details: String(err) }), { status: 500 });
      }
    }

    return new Response(JSON.stringify({ items: enrichedItems, persisted: persistResult }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('media-sync function error', String(err));
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
