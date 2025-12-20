import { Card, CardContent } from "@/components/ui/card";
import { Play, Calendar, Clock } from "lucide-react";
import { FaYoutube, FaSpotify } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { parseYoutubeRss } from "@/utils/parseYoutubeRss";
import { supabase } from "@/integrations/supabase/client";

// Public channel ID for Diary of an OFW
const CHANNEL_ID = "UCANMUQ39X4PcnUENrxFocbw";
// Optional Supabase Edge Function URL (set in env as VITE_MEDIA_SYNC_URL)
const MEDIA_SYNC_URL = (import.meta.env as any).VITE_MEDIA_SYNC_URL || (import.meta.env as any).VITE_SUPABASE_MEDIA_SYNC_URL || '';

const MediaSection = () => {
  console.debug('[MediaSection] Component rendering');
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [latestVideo, setLatestVideo] = useState<any>(null);
  const [spotifyEpisodes, setSpotifyEpisodes] = useState<any[]>([]);
  const [loadingYT, setLoadingYT] = useState(true);
  const [loadingSpotify, setLoadingSpotify] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  // UI state for manual syncing removed (Sync Now button removed)
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // Debug: log when videos state changes
  useEffect(() => {
    console.debug('[MediaSection] youtubeVideos state changed:', youtubeVideos.length, 'videos');
    if (youtubeVideos.length > 0) {
      console.debug('[MediaSection] First video:', youtubeVideos[0]);
    }
  }, [youtubeVideos]);

  // Fetch YouTube videos from the public channel RSS (no API key required)
  useEffect(() => {
    console.debug('[MediaSection] Component mounted, starting fetchYouTubeVideos');
    fetchYouTubeVideos();
    fetchSpotifyEpisodes();
    
    // Auto-sync on mount (silent, in background)
    if (autoSyncEnabled) {
      console.log('[MediaSection] Running initial auto-sync');
      syncYouTubeVideos().catch(err => {
        console.warn('[MediaSection] Initial auto-sync failed:', err);
      });

      // Also try to update existing videos that might not have duration info
      console.log('[MediaSection] Running initial duration update');
      updateExistingVideoDurations().catch(err => {
        console.warn('[MediaSection] Initial duration update failed:', err);
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
          // Only add videos that are 5 minutes or longer (300 seconds)
          if (row?.duration_seconds >= 300) {
            const mapped = {
              id: row.video_id,
              title: row.title,
              description: row.description,
              thumbnail_url: row.thumbnail_url || (row.video_id ? `https://img.youtube.com/vi/${row.video_id}/hqdefault.jpg` : ''),
              published_at: row.published_at,
              duration: row.duration_seconds ?? row.duration ?? null,
              duration_text: row.duration_text || null,
            };
            console.log('[MediaSection] Realtime INSERT:', mapped.id, mapped.duration, 'seconds');
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
          // Only update videos that are 5 minutes or longer (300 seconds)
          if (row?.duration_seconds >= 300) {
            console.log('[MediaSection] Realtime UPDATE:', row.video_id, row.duration_seconds, 'seconds');
            setYoutubeVideos(prev => prev.map(v => v.id === row.video_id ? ({ ...v, duration: row.duration_seconds ?? row.duration ?? v.duration, duration_text: row.duration_text || v.duration_text }) : v));
          } else {
            // Remove videos that are now shorter than 5 minutes
            setYoutubeVideos(prev => prev.filter(v => v.id !== row.video_id));
          }
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
    console.debug('[MediaSection] fetchYouTubeVideos called');
    try {
      // First, prefer persisted videos from Supabase if available.
      try {
        console.debug('[MediaSection] Attempting Supabase query...');
        // Filter for videos that are 5 minutes or longer (300 seconds)
        const { data, error } = await supabase
          .from('youtube_videos')
          .select('*')
          .gte('duration_seconds', 300)
          .order('published_at', { ascending: false })
          .limit(50);
        
        if (error) {
          console.warn('[MediaSection] DB query error:', error.message);
        } else if (data && data.length > 0) {
          console.debug('[MediaSection] DB returned', data.length, 'videos (with duration > 0)');
          console.debug('[MediaSection] All videos in database:', data.map(v => ({
            id: v.video_id,
            title: v.title?.substring(0, 30),
            duration_seconds: v.duration_seconds,
            published_at: v.published_at?.substring(0, 10)
          })));
          
          const vids = data.map((it: any) => ({
            id: it.video_id,
            title: it.title,
            description: it.description,
            thumbnail_url: it.thumbnail_url || (it.video_id ? `https://img.youtube.com/vi/${it.video_id}/hqdefault.jpg` : ''),
            published_at: it.published_at,
            duration: it.duration_seconds || 0,
            duration_text: it.duration_text || null,
          }));
          
          // Filter for videos >= 5 minutes
          const filtered = vids.filter(v => v.duration >= 300);
          
          console.debug('[MediaSection] After 5-minute filter:', filtered.length, 'videos');
          console.debug('[MediaSection] Filtered videos:', filtered.map(v => ({
            id: v.id,
            title: v.title?.substring(0, 30),
            duration: v.duration
          })));
          
          setYoutubeVideos(filtered.slice(0, 12));
          setLatestVideo(filtered[0] || null);
          setLoadingYT(false);
          return;
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
                duration_seconds: typeof it.duration_seconds === 'number' ? it.duration_seconds : (it.duration ? Number(it.duration) : null),
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

      // Also update existing video durations periodically
      setTimeout(() => {
        updateExistingVideoDurations().catch(err => {
          console.warn('[MediaSection] Periodic duration update failed:', err);
        });
      }, 10000);
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
          limit: 100, // Fetch more videos to populate the database
          fetch_all: true, // Fetch ALL videos from channel using YouTube API
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

  // Update duration information for existing videos in the database
  const updateExistingVideoDurations = async () => {
    try {
      console.log('[MediaSection] Starting updateExistingVideoDurations...');

      // First, fetch videos that don't have duration_seconds set OR have very low values (might be incorrect)
      const { data: videosToUpdate, error: fetchError } = await supabase
        .from('youtube_videos')
        .select('video_id, title, duration_seconds')
        .or('duration_seconds.is.null,duration_seconds.lt.300')
        .limit(50);

      if (fetchError) {
        console.error('[MediaSection] Error fetching videos to update:', fetchError);
        return;
      }

      console.log('[MediaSection] Videos needing updates:', videosToUpdate?.length || 0);
      if (videosToUpdate && videosToUpdate.length > 0) {
        console.log('[MediaSection] Videos to update:', videosToUpdate.map(v => `${v.video_id}: ${v.duration_seconds}s`));
      }

      if (!videosToUpdate || videosToUpdate.length === 0) {
        console.log('[MediaSection] No videos found that need duration updates');
        return;
      }

      // Call the Edge function with update mode for these specific videos
      console.log('[MediaSection] Calling Edge function to update', videosToUpdate.length, 'videos');
      const { data, error } = await supabase.functions.invoke('media-sync', {
        body: {
          channel_id: CHANNEL_ID,
          persist: true,
          min_duration: 0, // Include all videos for updating
          video_ids: videosToUpdate.map(v => v.video_id), // Specific videos to update
          update_existing: true, // Flag to indicate we're updating existing videos
        },
      });

      if (error) {
        console.error('[MediaSection] Update error:', error);
      } else {
        console.log('[MediaSection] Update response:', data);
        // Refresh the list after update
        setTimeout(() => fetchYouTubeVideos(), 2000);
      }
    } catch (err: any) {
      console.error('[MediaSection] Update exception:', err);
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
  <section className="bg-white py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-4 sm:mb-6 px-2">
              Diary of an OFW is dedicated to capturing the raw, unfiltered journeys of Overseas Filipino Workers across the globe. We shine a light on the extraordinary achievements and untold stories of Filipinos who have carved out greatness far from home.
            </p>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-4 sm:mb-6 px-2">
              Through intimate conversations with notable individuals—especially those thriving in foreign lands—we uncover hidden truths, life-changing lessons, and meaningful insights.
            </p>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-800 leading-relaxed font-medium mb-8 sm:mb-12 px-2">
              Our mission is to inspire, uplift, and empower our audience to live with greater joy, purpose, and fulfillment by sharing the voices and victories of the global Filipino community.
            </p>

            {/* Add space between notes and image */}
            <div className="mb-6 sm:mb-8" />


          {/* YouTube Videos Section */}
          {/* Inspiring OFW success and Filipino diaspora photo */}
          <div className="w-full mb-6 sm:mb-8 px-2">
            <img
              src="/mediasection.png"
              alt="Asian Professional Working in Europe - Filipino Success Story in International Career"
              className="rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl w-full h-48 sm:h-64 lg:h-96 object-cover object-center border border-gray-200 bg-white"
              loading="lazy"
              decoding="async"
              width="1200"
              height="384"
            />
          </div>
          <div className="mb-8 sm:mb-12 text-center mt-6 sm:mt-10 px-2">
            <div className="flex items-center justify-center mb-4">
              <h2 className="text-4xl lg:text-6xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight mt-8 sm:mt-16">
                Most Popular Videos
              </h2>
            </div>
          </div>
          <div className="w-full flex flex-col gap-6 sm:gap-8 mb-8 sm:mb-12 px-2">
            {loadingYT ? (
              <div className="flex justify-center mb-6 sm:mb-8 w-full">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : youtubeVideos.length > 0 ? (
              youtubeVideos.slice(0, 5).map((video) => (
                <Card key={video.id} onClick={() => setPlayingVideoId(video.id)} className="overflow-hidden hover:shadow-xl transition-all duration-300 w-full bg-transparent cursor-pointer border-0 shadow-none sm:shadow-sm sm:border">
                  <div className="flex flex-col lg:flex-row w-full items-center lg:items-start gap-4 sm:gap-6 lg:gap-8 p-2 sm:p-4">
                    <div className="w-full lg:w-1/3 flex-shrink-0">
                      <div className="relative rounded-lg overflow-hidden group">
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-40 sm:h-48 lg:h-52 object-cover rounded-lg block"
                          loading="lazy"
                          decoding="async"
                          width="480"
                          height="360"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-2 sm:p-3 rounded-full bg-white/90 group-hover:scale-110 group-hover:animate-pulse">
                            <Play className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                            <span className="sr-only">Play video</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-2/3 flex flex-col justify-center">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">{video.title}</h3>
                      <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">{video.description?.split('. ')[0] + (video.description?.includes('.') ? '.' : '')}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{formatDate(video.published_at)}</span>
                          {video.duration_text || video.duration ? (
                            <span className="ml-2 flex items-center text-xs text-muted-foreground flex-shrink-0">
                              <Clock className="w-3 h-3 mr-1" />
                              {video.duration_text || formatDuration(video.duration)}
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 justify-end">
                            <a href="https://www.youtube.com/@diaryofanofw" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 transition-colors">
                              <FaYoutube className="w-8 h-8 sm:w-10 sm:w-12 sm:h-10 sm:h-12 drop-shadow-lg bg-white p-1.5 sm:p-2 rounded-full border-2 border-red-600 hover:scale-105 transition-transform" />
                            </a>
                          <a href="https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 transition-colors">
                            <FaSpotify className="w-8 h-8 sm:w-10 sm:w-12 sm:h-10 sm:h-12 drop-shadow-lg bg-white p-1.5 sm:p-2 rounded-full border-2 border-green-600 hover:scale-105 transition-transform" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="w-full text-center text-muted-foreground flex flex-col items-center gap-4 px-2">
                <p className="text-sm sm:text-base">No videos available yet.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-4">
                  <a href="https://www.youtube.com/@diaryofanofw" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 text-sm sm:text-lg transition-colors">
                    <FaYoutube className="w-5 h-5 sm:w-7 sm:h-7 drop-shadow-lg" />
                    YouTube
                  </a>
                  <a href="https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 text-sm sm:text-lg transition-colors">
                    <Play className="w-5 h-5 sm:w-7 sm:h-7" />
                    Spotify
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Video player modal */}
          <Dialog open={!!playingVideoId} onOpenChange={(open) => { if (!open) setPlayingVideoId(null); }}>
            <DialogContent className="max-w-4xl w-full mx-4">
              <DialogTitle className="text-lg sm:text-xl">Playing video</DialogTitle>
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
