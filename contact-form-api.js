// Local contact form API removed.
// Express API for local testing of contact form
// Save as contact-form-api.js and run with: node contact-form-api.js


import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';


const app = express();
app.use(bodyParser.json());


// Prefer the new secrets names if provided. Keep backward compatibility with BREVO_API_KEY.
const BREVO_API_KEY = process.env.BREVO_CONTACT_SUBMISSIONS_API || process.env.BREVO_API_KEY;
const DEFAULT_BREVO_LIST_ID = process.env.BREVO_CONTACT_LIST_ID ? parseInt(process.env.BREVO_CONTACT_LIST_ID, 10) : undefined;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;


let supabase = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
} else {
  console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. Database inserts will be skipped.');
}


// Optional mapping of service => Brevo list id. If you set BREVO_CONTACT_LIST_ID env var, it will take precedence.
const serviceListMap = {
  'full-stack-web-development': 10,
  'web-renovation-migration': 11,
  'mobile-app-development': 12,
  'advertising': 13,
  'interview-guesting': 14,
  'others': 9
};

// Lightweight local fallback responder used when OpenAI is unavailable (429/quota) or downstream errors occur.
function generateFallbackReply(userMessage) {
  const msg = (userMessage || '').toLowerCase();
  // Simple heuristic responses for common OFW topics
  if (msg.includes('remit') || msg.includes('remittance') || msg.includes('send money') || msg.includes('money')) {
    return `Here are 3 quick tips for sending money safely:
1) Use a licensed money transfer service or a reputable bank; compare fees and exchange rates.
2) Double-check recipient details before sending; confirm full name and account numbers.
3) Keep transaction receipts and use tracking; avoid sharing PINs or OTPs with anyone.`;
  }
  if (msg.includes('work') || msg.includes('job') || msg.includes('visa') || msg.includes('contract')) {
    return `Quick guidance on work and contracts: always read your contract carefully, verify employer details, keep copies of important documents, and consult the nearest Philippine embassy or labor office for assistance.`;
  }
  if (msg.includes('health') || msg.includes('insurance') || msg.includes('medical')) {
    return `For health and insurance: check what medical coverage your employer provides, register with local health services, and consider supplemental international travel or expatriate insurance for emergencies.`;
  }

  // Generic fallback
  return `Sorry — our AI assistant is temporarily unavailable. Meanwhile: 1) Try simple, direct questions (e.g., "How do I send remittances safely?"). 2) Check our blog and resources for guides. 3) For urgent support, email us at info@diaryofanofw.com and we'll assist you.`;
}

// Prefer the new secret `OPEN_AI_CHATBOT` for the chatbot proxy, fall back to older env names
const CHATBOT_KEY = process.env.OPEN_AI_CHATBOT || process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;

app.post('/api/contact-form', async (req, res) => {
  try {
    const { type, data } = req.body;
    if (type !== 'contact') {
      return res.status(400).json({ error: 'Invalid request type' });
    }
    if (!BREVO_API_KEY) {
      return res.status(500).json({ error: 'Missing API key' });
    }
    // Save to Supabase if configured; otherwise continue and still try Brevo so local testing works.
    if (supabase) {
      const { error: dbError } = await supabase.from('contact_submissions').insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          message: data.message,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
      if (dbError) {
        return res.status(500).json({ error: 'Failed to save to database', details: dbError });
      }
    } else {
      console.log('Supabase not configured — skipping DB save for contact submission.');
    }
    // Send to Brevo (contacts). Prefer the configured list id secret; otherwise fallback to service-specific lists.
    const listId = DEFAULT_BREVO_LIST_ID ?? serviceListMap[data.service];
    const brevoPayload = {
      email: data.email,
      attributes: {
        NAME: data.name,
        PHONE: data.phone,
        SERVICE: data.service,
        MESSAGE: data.message
      },
      updateEnabled: true
    };
    if (listId) {
      brevoPayload.listIds = [listId];
    }

    // Helper: send payload to Brevo with one retry and improved error handling/logging
    async function sendToBrevo(payload, attempts = 2) {
      const url = 'https://api.brevo.com/v3/contacts';
      let lastError = null;
      for (let i = 0; i < attempts; i++) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              'api-key': BREVO_API_KEY
            },
            body: JSON.stringify(payload),
            timeout: 10000
          });
            const text = await response.text();
            let json;
            try { json = JSON.parse(text); } catch { json = { raw: text }; }
            if (response.ok) {
              console.log('Brevo: contact created/updated', json);
              return { ok: true, status: response.status, body: json };
            }
            // Handle common Brevo duplicate contact error gracefully — updateEnabled should already cover this,
            // but some API responses may return 400 with specific messages. We'll log and treat duplicates as success.
            const bodyStr = typeof json === 'string' ? json : JSON.stringify(json);
            if (bodyStr && bodyStr.toLowerCase().includes('already exist')) {
              console.warn('Brevo: contact already exists, treating as success', bodyStr);
              return { ok: true, status: response.status, body: json };
            }
            lastError = { status: response.status, body: json };
            console.warn('Brevo request failed', lastError);
        } catch (err) {
          lastError = err;
          console.error('Brevo request error', err);
        }
        // small backoff before retry
        await new Promise(r => setTimeout(r, 500 * (i + 1)));
      }
      return { ok: false, error: lastError };
    }

    const brevoResult = await sendToBrevo(brevoPayload, 2);
    if (!brevoResult.ok) {
      // Log and return a 202 (accepted) to avoid failing the entire submission when Brevo is temporarily unreachable.
      console.error('Failed to deliver contact to Brevo after retries', brevoResult.error);
      return res.status(202).json({ success: true, warning: 'Saved locally but failed to send to Brevo', brevoError: brevoResult.error });
    }
    return res.status(200).json({ success: true, brevo: brevoResult.body });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// Single chatbot proxy endpoint (returns clear error if key missing)
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message, messages } = req.body || {};

    if (!CHATBOT_KEY) {
      return res.status(500).json({ error: 'OPEN_AI_CHATBOT (or fallback) not configured on server' });
    }

    const chatMessages = [
      { role: 'system', content: 'You are an empathetic assistant for Overseas Filipino Workers (OFWs). Provide concise, helpful, and culturally appropriate responses.' }
    ];

    if (Array.isArray(messages) && messages.length) {
      messages.forEach(m => { if (m && m.role && m.content) chatMessages.push({ role: m.role, content: m.content }); });
    } else if (message) {
      chatMessages.push({ role: 'user', content: message });
    } else {
      return res.status(400).json({ error: 'Missing message or messages in request body' });
    }

    const openaiUrl = 'https://api.openai.com/v1/chat/completions';
    const resp = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHATBOT_KEY}`
      },
      body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: chatMessages, temperature: 0.7, max_tokens: 512 }),
      timeout: 20000
    });

    const text = await resp.text();
    let json;
    try { json = JSON.parse(text); } catch { json = { raw: text }; }

    if (!resp.ok) {
      // If OpenAI signals quota (429), return a helpful local fallback reply instead of an error
      if (resp.status === 429) {
        const fallback = generateFallbackReply(message || (messages && messages.slice(-1)[0]?.content));
        console.warn('OpenAI quota hit — returning local fallback reply');
        return res.status(200).json({ reply: fallback, fallback: true, reason: 'quota' });
      }
      // Otherwise forward the exact status from OpenAI (401/unauthorized, etc.)
      return res.status(resp.status).json({ error: 'OpenAI API error', status: resp.status, body: json });
    }

    const reply = json?.choices?.[0]?.message?.content ?? (typeof json === 'string' ? json : JSON.stringify(json));
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chatbot proxy error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Contact form API running on http://localhost:${PORT}/api/contact-form`);
});

// -------------------------
// YouTube enrichment endpoint
// -------------------------
// Server-side YouTube Data API key. Provide as env var YOUTUBE_DATA_API_KEY or YT_DATA_API_KEY.
const YOUTUBE_DATA_API_KEY = process.env.YOUTUBE_DATA_API_KEY || process.env.YT_DATA_API_KEY;
// Simple in-memory cache for enriched youtube results
let youtubeCache = { ts: 0, data: null };
const YOUTUBE_CACHE_TTL = 1000 * 60 * 10; // 10 minutes

// Helper: parse ISO 8601 duration to seconds
function parseIsoDurationToSeconds(iso) {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  return hours * 3600 + minutes * 60 + seconds;
}

// Fetch and enrich recent videos for a channel (returns array of items)
async function fetchEnrichedItems(channelId) {
  // Step 1: fetch RSS to get recent video IDs
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const rssResp = await fetch(rssUrl);
  if (!rssResp.ok) {
    const txt = await rssResp.text();
    throw new Error(`Failed to fetch YouTube RSS: ${rssResp.status} ${txt.slice(0,200)}`);
  }
  const xml = await rssResp.text();
  const entries = xml.split('<entry>').slice(1);
  const videoIds = entries.map(e => (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || '')).filter(Boolean);
  if (videoIds.length === 0) return [];

  // YouTube Data API videos endpoint allows up to 50 ids per request
  const batchIds = videoIds.slice(0, 50).join(',');
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${batchIds}&key=${YOUTUBE_DATA_API_KEY}`;
  const videosResp = await fetch(videosUrl);
  if (!videosResp.ok) {
    const txt = await videosResp.text();
    throw new Error(`YouTube Data API failed: ${videosResp.status} ${txt.slice(0,300)}`);
  }
  const videosJson = await videosResp.json();
  const items = (videosJson.items || []).map(it => {
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
  })
  // Filter to 5+ minute videos by default (>= 300 seconds)
  .filter(i => (i.duration_seconds || 0) >= 300);

  return items;
}

app.get('/api/media/youtube-enriched', async (req, res) => {
  try {
    const channelId = req.query.channel_id || req.query.channelId || req.query.channel || 'UCANMUQ39X4PcnUENrxFocbw';
    const force = req.query.force === '1' || req.query.force === 'true';

    // Return cached data when valid unless force refresh requested
    if (!force && youtubeCache.data && (Date.now() - youtubeCache.ts) < YOUTUBE_CACHE_TTL) {
      return res.status(200).json({ items: youtubeCache.data, cached: true });
    }

    // Fetch enriched items (prefer server-side Data API). If no server key is present,
    // fetch and return basic RSS-parsed items so the browser client doesn't need to hit YouTube RSS (CORS).
    let items = [];
    if (YOUTUBE_DATA_API_KEY) {
      items = await fetchEnrichedItems(channelId);
    } else {
      // Fetch RSS and parse basic fields
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const rssResp = await fetch(rssUrl);
      if (!rssResp.ok) {
        const txt = await rssResp.text().catch(() => '');
        console.warn('Failed to fetch YouTube RSS', rssResp.status, txt.slice(0, 200));
        return res.status(502).json({ error: 'Failed to fetch YouTube RSS', status: rssResp.status });
      }
      const xml = await rssResp.text();
      const entries = xml.split('<entry>').slice(1);
      const basic = entries.map(e => {
        const vid = e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || '';
        const title = (e.match(/<title>([^<]+)<\/title>/)?.[1] || '').trim();
        const published = e.match(/<published>([^<]+)<\/published>/)?.[1] || null;
        const description = e.match(/<media:description>([^<]+)<\/media:description>/)?.[1] || '';
        const thumb = e.match(/<media:thumbnail url=\"([^\"]+)\"\/>/)?.[1] || (vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : null);
        const url = vid ? `https://www.youtube.com/watch?v=${vid}` : '';
        return {
          id: vid,
          video_id: vid,
          title,
          description,
          thumbnail_url: thumb,
          url,
          published_at: published,
          duration_iso: null,
          duration_seconds: null
        };
      });

      // Heuristic: filter out probable Shorts / very short videos when no Data API key
      const isProbableShort = (it) => {
        const t = (it.title || '').toLowerCase();
        const d = (it.description || '').toLowerCase();
        const url = (it.url || '').toLowerCase();
        if (url.includes('/shorts/')) return true;
        if (t.includes('#shorts') || t.includes('shorts') || t.includes('short')) return true;
        if (d.includes('#shorts') || d.includes('shorts')) return true;
        return false;
      };

      items = basic.filter(i => !isProbableShort(i));
      // Cache basic items
      youtubeCache = { ts: Date.now(), data: items };
      return res.status(200).json({ items, cached: false });
    }

    // Optional: persist to Supabase when requested via query param (persist=1)
    if ((req.query.persist === '1' || req.query.persist === 'true') && supabase) {
      try {
        const now = new Date().toISOString();
        const rows = items.map(i => ({
          video_id: i.video_id,
          title: i.title,
          description: i.description || null,
          thumbnail_url: i.thumbnail_url || null,
          published_at: i.published_at || null,
          duration: i.duration_iso || (i.duration_seconds ? String(i.duration_seconds) : null),
          view_count: null,
          updated_at: now,
          created_at: now
        }));
        const { data: upserted, error: upsertErr } = await supabase.from('youtube_videos').upsert(rows, { onConflict: 'video_id' }).select();
        if (upsertErr) console.error('Failed to persist youtube_videos:', upsertErr);
        else console.log(`Persisted ${upserted?.length ?? rows.length} youtube_videos`);
      } catch (e) {
        console.error('Error persisting youtube videos', e);
      }
    }

    // Cache and return
    youtubeCache = { ts: Date.now(), data: items };
    return res.status(200).json({ items, cached: false });
  } catch (err) {
    console.error('youtube-enriched error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});


// Endpoint to trigger a sync and persist enriched items into Supabase (if configured)
app.get('/api/media/sync', async (req, res) => {
  try {
    const channelId = req.query.channel_id || req.query.channelId || req.query.channel || 'UCANMUQ39X4PcnUENrxFocbw';
    const items = await fetchEnrichedItems(channelId);

    if (!supabase) {
      return res.status(200).json({ synced: false, reason: 'supabase not configured', count: items.length, items });
    }

    const now = new Date().toISOString();
    const rows = items.map(i => ({
      video_id: i.video_id,
      title: i.title,
      description: i.description || null,
      thumbnail_url: i.thumbnail_url || null,
      published_at: i.published_at || null,
      duration: i.duration_iso || (i.duration_seconds ? String(i.duration_seconds) : null),
      view_count: null,
      updated_at: now,
      created_at: now
    }));

    const { data, error } = await supabase.from('youtube_videos').upsert(rows, { onConflict: 'video_id' }).select();
    if (error) {
      console.error('Failed to upsert youtube_videos', error);
      return res.status(500).json({ synced: false, error });
    }

    youtubeCache = { ts: Date.now(), data: items };
    return res.status(200).json({ synced: true, count: data?.length ?? rows.length, rows: data });
  } catch (err) {
    console.error('media sync error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});


