import { Card, CardContent } from "@/components/ui/card";
import { Play, Calendar, Clock } from "lucide-react";
import { FaYoutube, FaSpotify } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ofwHeroPhoto from '@/assets/ofw-hero-photo.jpg';
import { parseYoutubeRss } from "@/utils/parseYoutubeRss";
import { supabase } from "@/integrations/supabase/client";

// Public channel ID for Diary of an OFW
const CHANNEL_ID = "UCANMUQ39X4PcnUENrxFocbw";
// Optional Supabase Edge Function URL (set in env as VITE_MEDIA_SYNC_URL)
const MEDIA_SYNC_URL = (import.meta.env as any).VITE_MEDIA_SYNC_URL || (import.meta.env as any).VITE_SUPABASE_MEDIA_SYNC_URL || '';

const MediaSection = () => {
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [latestVideo, setLatestVideo] = useState<any>(null);
  const [spotifyEpisodes, setSpotifyEpisodes] = useState<any[]>([]);
  const [loadingYT, setLoadingYT] = useState(true);
  const [loadingSpotify, setLoadingSpotify] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  // UI state for manual syncing removed (Sync Now button removed)
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // Fetch YouTube videos from the public channel RSS (no API key required)
  useEffect(() => {
    fetchYouTubeVideos();
    fetchSpotifyEpisodes();
    
    // Auto-sync on mount (silent, in background)
    if (autoSyncEnabled) {
      console.log('[MediaSection] Running initial auto-sync');
      syncYouTubeVideos().catch(err => {
        console.warn('[MediaSection] Initial auto-sync failed:', err);
      });
    }

    // Subscribe to Supabase realtime changes so new persisted videos show up automatically
    // We listen for INSERT and UPDATE on `youtube_videos` and update the client list when
    // duration_seconds is >= 300 (5 minutes).
    try {
      const channel = supabase
        .channel('youtube_videos_changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'youtube_videos' }, (payload) => {
          const row = (payload as any).new;
          const seconds = row?.duration_seconds ?? (row?.duration ? getDurationSeconds(row.duration) : 0);
          if (seconds >= 300) {
            const mapped = {
              id: row.video_id,
              title: row.title,
              description: row.description,
              thumbnail_url: row.thumbnail_url || (row.video_id ? `https://img.youtube.com/vi/${row.video_id}/hqdefault.jpg` : ''),
              published_at: row.published_at,
              duration: row.duration_seconds ?? row.duration ?? null,
            };
            setYoutubeVideos(prev => {
              // avoid duplicates
              if (prev.find(v => v.id === mapped.id)) return prev;
              return [mapped, ...prev].slice(0, 12);
            });
            setLatestVideo(prev => {
              if (!prev) return mapped;
              try {
                return new Date(mapped.published_at) > new Date(prev.published_at) ? mapped : prev;
              } catch (e) {
                return mapped;
              }
            });
          }
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'youtube_videos' }, (payload) => {
          const row = (payload as any).new;
          setYoutubeVideos(prev => prev.map(v => v.id === row.video_id ? ({ ...v, duration: row.duration_seconds ?? row.duration ?? v.duration }) : v));
        })
        .subscribe();

      return () => {
        try { channel.unsubscribe(); } catch (e) { /* ignore */ }
      };
    } catch (err) {
      // If realtime isn't available in the environment, swallow the error and keep polling/fetch behavior
      console.warn('Supabase realtime subscription failed (non-fatal):', err);
    }
  }, []);

  const fetchYouTubeVideos = async () => {
    try {
      // First, prefer persisted videos from Supabase if available.
      try {
        // Query all rows and filter client-side to ensure we get all videos with duration info
        const dbResp = await supabase
          .from('youtube_videos')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(50);
        
        if (!dbResp.error && dbResp.data && dbResp.data.length > 0) {
          console.debug('[MediaSection] DB returned', dbResp.data.length, 'total rows');
          console.debug('[MediaSection] Sample raw rows:', dbResp.data.slice(0, 3).map(r => ({
            video_id: r.video_id,
            title: r.title?.substring(0, 50),
            duration: r.duration,
            duration_seconds: r.duration_seconds,
            published_at: r.published_at
          })));
          
          const vids = dbResp.data.map((it: any) => ({
            id: it.video_id,
            title: it.title,
            description: it.description,
            thumbnail_url: it.thumbnail_url || (it.video_id ? `https://img.youtube.com/vi/${it.video_id}/hqdefault.jpg` : ''),
            published_at: it.published_at,
            duration: (it.duration_seconds !== undefined && it.duration_seconds !== null) ? it.duration_seconds : (it.duration || null),
          }));
          
          // Filter client-side: only videos with duration >= 300 seconds (5 minutes)
          const filtered = vids.filter(v => {
            const seconds = getDurationSeconds(v.duration);
            const passes = seconds >= 300;
            if (!passes && v.duration !== null) {
              console.debug('[MediaSection] Filtered out:', v.id, 'duration:', v.duration, 'seconds:', seconds);
            }
            return passes;
          });
          
          console.debug('[MediaSection] Filtered to', filtered.length, 'videos >= 5min');
          console.debug('[MediaSection] Filtered videos:', filtered.slice(0, 3).map(f => ({
            id: f.id,
            title: f.title?.substring(0, 50),
            duration: f.duration,
            published_at: f.published_at
          })));
          
          setYoutubeVideos(filtered.slice(0, 12));
          setLatestVideo(filtered[0] || null);
          setLoadingYT(false);
          return;
        } else if (dbResp.error) {
          console.warn('[MediaSection] DB query error:', dbResp.error.message);
        }
      } catch (dbErr: any) {
        console.warn('Error querying youtube_videos table, falling back to sync endpoints:', dbErr?.message || dbErr);
      }

      // If a Supabase Edge Function URL is configured, try it first
      if (MEDIA_SYNC_URL) {
        try {
          const url = `${MEDIA_SYNC_URL.replace(/\/$/, '')}?channel_id=${CHANNEL_ID}&min_duration=300`;
          const res = await fetch(url);
          if (res.ok) {
            const json = await res.json();
            const items = json.items || [];
            if (items.length > 0) {
              const videos = items.map((it: any) => ({
                id: it.video_id || it.id,
                title: it.title,
                description: it.description,
                thumbnail_url: it.thumbnail_url,
                published_at: it.published_at,
                duration: (it.duration_seconds !== undefined && it.duration_seconds !== null) ? it.duration_seconds : (it.duration_iso || null),
              }));
              // enforce >= 300s on client as a safety net
              const filtered = videos.filter(v => getDurationSeconds(v.duration) >= 300);
              console.debug('[MediaSection] media-sync returned', items.length, 'items, filtered to', filtered.length);
              setYoutubeVideos(filtered);
              setLatestVideo(filtered[0] || null);
              setLoadingYT(false);
              return;
            }
          } else {
            const body = await res.text().catch(() => '');
            console.warn('media-sync function returned non-OK, falling back:', res.status, body.slice ? body.slice(0,300) : body);
          }
        } catch (err) {
          console.warn('Failed to call media-sync function, falling back to local enriched/RSS:', err?.message || err);
        }
      }

      // Try local server-side enriched endpoint next (returns durations). Falls back to public RSS if unavailable.
      try {
        const enrichedRes = await fetch(`/api/media/youtube-enriched?channel_id=${CHANNEL_ID}&min_duration=300`);
        if (enrichedRes.ok) {
          const enrichedJson = await enrichedRes.json();
          const items = enrichedJson.items || [];
          if (items.length > 0) {
            const videos = items.map((it: any) => ({
              id: it.video_id || it.id,
              title: it.title,
              description: it.description,
              thumbnail_url: it.thumbnail_url,
              published_at: it.published_at,
              duration: it.duration_seconds ?? it.duration_iso ?? null,
            }));
            const filtered = videos.filter(v => getDurationSeconds(v.duration) >= 300);
            console.debug('[MediaSection] enriched endpoint returned', items.length, 'items, filtered to', filtered.length);
            setYoutubeVideos(filtered);
            setLatestVideo(filtered[0] || null);
            setLoadingYT(false);
            return;
          }
        } else {
          // If server indicates no server key configured (400) or other issues, we fall back to RSS.
          const body = await enrichedRes.text().catch(() => '');
          console.warn('Enriched endpoint unavailable, falling back to RSS:', enrichedRes.status, body.slice ? body.slice(0,300) : body);
        }
      } catch (err) {
        console.warn('youtube-enriched fetch failed, falling back to RSS', err);
      }

      // Fallback: Use the public RSS feed for the channel which doesn't require an API key
      const rssRes = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
      if (!rssRes.ok) {
        console.error('YouTube RSS fetch failed', rssRes.status, await rssRes.text());
        setYoutubeVideos([]);
        setLatestVideo(null);
        return;
      }
      const xml = await rssRes.text();
      const items = parseYoutubeRss(xml);

      const videos = items.map(item => ({
        id: item.video_id,
        title: item.title,
        description: item.description,
        thumbnail_url: item.thumbnail_url,
        published_at: item.published_at,
        duration: null,
      }));
      // RSS-only items lack duration; we exclude them because we can't verify >=5min
      const filtered = videos.filter(v => getDurationSeconds(v.duration) >= 300);
      console.debug('[MediaSection] RSS fallback returned', items.length, 'items, filtered to', filtered.length);
      setYoutubeVideos(filtered);
      setLatestVideo(filtered[0] || null);
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
    } finally {
      setLoadingYT(false);
    }
  };

  // Poll every 60 seconds as a fallback in case realtime subscription isn't delivering events
  useEffect(() => {
    const id = setInterval(() => {
      console.debug('[MediaSection] Polling for latest YouTube videos');
      fetchYouTubeVideos();
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  // Auto-sync from YouTube every 5 minutes if enabled
  useEffect(() => {
    if (!autoSyncEnabled) return;
    
    const syncInterval = setInterval(() => {
      console.log('[MediaSection] Running periodic auto-sync');
      syncYouTubeVideos().catch(err => {
        console.warn('[MediaSection] Periodic auto-sync failed:', err);
      });
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(syncInterval);
  }, [autoSyncEnabled]);

  // Fetch Spotify episodes from your Supabase table
  const fetchSpotifyEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('spotify_episodes')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Error fetching Spotify episodes:', error);
        return;
      }
      setSpotifyEpisodes(data || []);
    } catch (error) {
      console.error('Error fetching Spotify episodes:', error);
    } finally {
      setLoadingSpotify(false);
    }
  };

  // Trigger YouTube video sync with persistence (silent from UI)
  const syncYouTubeVideos = async () => {
    try {
      console.log('[MediaSection] Triggering sync via Edge Function...');
      const { data, error } = await supabase.functions.invoke('media-sync', {
        body: {
          channel_id: CHANNEL_ID,
          persist: true,
          min_duration: 300,
        },
      });

      if (error) {
        console.error('[MediaSection] Sync error:', error);
      } else {
        console.log('[MediaSection] Sync response:', data);
        // Refresh the list after a short delay so persisted rows become visible
        setTimeout(() => fetchYouTubeVideos(), 1000);
      }
    } catch (err: any) {
      console.error('[MediaSection] Sync exception:', err);
    }
  };

  // Trigger sync for both platforms (legacy)
  const triggerMediaSync = async () => {
    try {
      await supabase.functions.invoke('media-sync', {
        body: { platform: 'youtube', force: false }
      });
      await supabase.functions.invoke('media-sync', {
        body: { platform: 'spotify', force: false }
      });
    } catch (error) {
      console.error('Error triggering media sync:', error);
    }
  };

  const formatDuration = (duration: any) => {
    if (duration === null || duration === undefined || duration === '') return '';
    // If duration is a number (seconds), format directly
    if (typeof duration === 'number') {
      const totalSeconds = Math.floor(duration);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    // Convert ISO 8601 (YouTube) to readable format
    if (typeof duration === 'string' && /^PT/.test(duration)) {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return duration;
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      const seconds = parseInt(match[3]) || 0;
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
    // If it's ms (Spotify) or numeric string
    const ms = parseInt(String(duration));
    if (!isNaN(ms) && String(duration).length > 2) {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return String(duration);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Convert various duration formats to seconds. Returns 0 when unknown.
  const getDurationSeconds = (duration: any): number => {
    if (duration === null || duration === undefined || duration === '') return 0;
    if (typeof duration === 'number') return Math.floor(duration);
    if (typeof duration === 'string') {
      // ISO 8601 e.g. PT1H2M3S
      if (/^PT/.test(duration)) {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return 0;
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        const seconds = parseInt(match[3]) || 0;
        return hours * 3600 + minutes * 60 + seconds;
      }
      // numeric string, treat as seconds
      const n = parseInt(duration, 10);
      if (!isNaN(n)) return n;
    }
    return 0;
  };

  return (
  <section className="bg-white py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-2xl text-gray-700 leading-relaxed mb-6">
              Diary of an OFW is dedicated to capturing the raw, unfiltered journeys of Overseas Filipino Workers across the globe. We shine a light on the extraordinary achievements and untold stories of Filipinos who have carved out greatness far from home.
            </p>
            <p className="text-2xl text-gray-700 leading-relaxed mb-6">
              Through intimate conversations with notable individuals—especially those thriving in foreign lands—we uncover hidden truths, life-changing lessons, and meaningful insights.
            </p>
            <p className="text-2xl text-gray-800 leading-relaxed font-medium mb-12">
              Our mission is to inspire, uplift, and empower our audience to live with greater joy, purpose, and fulfillment by sharing the voices and victories of the global Filipino community.
            </p>

            {/* Add space between notes and image */}
            <div className="mb-8" />


          {/* YouTube Videos Section */}
          {/* OFW-themed hero photo */}
          <div className="w-full mb-8">
            <img 
              src={ofwHeroPhoto} 
              alt="OFW Hero" 
              className="rounded-xl shadow-xl w-full h-64 sm:h-96 object-cover border border-gray-200 bg-white" 
              style={{ display: 'block', width: '100%' }} 
            />
          </div>
          <div className="mb-12 text-left mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-800 mt-16">
                Most Popular Videos
              </h2>
            </div>
          </div>
          <div className="w-full flex flex-col gap-8 mb-12">
            {loadingYT ? (
              <div className="flex justify-center mb-8 w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : youtubeVideos.length > 0 ? (
              youtubeVideos.slice(0, 5).map((video) => (
                <Card key={video.id} onClick={() => setPlayingVideoId(video.id)} className="overflow-hidden hover:shadow-xl transition-all duration-300 w-full bg-transparent cursor-pointer">
                  <div className="flex flex-col md:flex-row w-full items-center md:items-start gap-8">
                    <div className="w-full md:w-1/3 flex-shrink-0">
                      <div className="relative rounded-lg overflow-hidden group">
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-52 object-cover rounded-lg block"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-3 rounded-full bg-white/90 group-hover:scale-110 group-hover:animate-pulse">
                            <Play className="w-8 h-8 text-red-600" />
                            <span className="sr-only">Play video</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-2/3 flex flex-col justify-center">
                      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{video.title}</h3>
                      <p className="text-lg text-muted-foreground mb-4">{video.description?.split('. ')[0] + (video.description?.includes('.') ? '.' : '')}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(video.published_at)}
                          {video.duration ? (
                            <span className="ml-2 flex items-center text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDuration(video.duration)}
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-3">
                            <a href="https://www.youtube.com/@diaryofanofw" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800">
                              <FaYoutube className="w-12 h-12 drop-shadow-2xl bg-white p-2 rounded-full border-2 border-red-600" style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))' }} />
                            </a>
                          <a href="https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                            <FaSpotify className="w-12 h-12 drop-shadow-2xl bg-white p-2 rounded-full border-2 border-green-600" style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))' }} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="w-full text-center text-muted-foreground flex flex-col items-center gap-4">
                No videos available yet.
                <div className="flex justify-center gap-6 mt-4">
                  <a href="https://www.youtube.com/@diaryofanofw" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 text-lg">
                    <FaYoutube className="w-7 h-7 drop-shadow-lg" />
                    YouTube
                  </a>
                  <a href="https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 text-lg">
                    <Play className="w-7 h-7" />
                    Spotify
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Video player modal */}
          <Dialog open={!!playingVideoId} onOpenChange={(open) => { if (!open) setPlayingVideoId(null); }}>
            <DialogContent className="max-w-4xl w-full">
              <DialogTitle>Playing video</DialogTitle>
              {playingVideoId ? (
                <div className="w-full mt-4">
                  <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <iframe
                      title="YouTube player"
                      src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                      frameBorder="0"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    />
                  </div>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>

          {/* Spotify Episodes Section */}

        </div>
      </div>
    </div>
  </section>
  );
};

export default MediaSection;
