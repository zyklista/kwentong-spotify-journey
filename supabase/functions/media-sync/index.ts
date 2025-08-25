import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyEpisode {
  id: string;
  name: string;
  description: string;
  duration_ms: number;
  release_date: string;
  images: Array<{ url: string; height: number; width: number }>;
  external_urls: {
    spotify: string;
  };
}

interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      high: { url: string };
    };
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { platform, force = false } = await req.json();

    console.log(`Starting media sync for platform: ${platform}`);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (platform === 'spotify' || !platform) {
      await syncSpotifyEpisodes(supabase, force);
    }

    if (platform === 'youtube' || !platform) {
      await syncYouTubeVideos(supabase, force);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Media sync completed for ${platform || 'all platforms'}` 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error('Error in media-sync function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

async function syncSpotifyEpisodes(supabase: any, force: boolean) {
  try {
    console.log('Syncing Spotify episodes...');

    // Update sync status
    await supabase
      .from('media_sync_status')
      .upsert([
        {
          platform: 'spotify',
          sync_status: 'in_progress',
          last_sync_at: new Date().toISOString()
        }
      ]);

    // Get Spotify access token
    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('Spotify credentials not configured');
    }

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData: SpotifyTokenResponse = await tokenResponse.json();

    // Search for Diary of an OFW podcast episodes
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=Diary%20of%20an%20OFW&type=episode&limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const searchData = await searchResponse.json();
    const episodes = searchData.episodes?.items || [];

    console.log(`Found ${episodes.length} Spotify episodes`);

    // Process each episode
    for (const episode of episodes) {
      const episodeData = {
        spotify_id: episode.id,
        title: episode.name,
        description: episode.description,
        duration_ms: episode.duration_ms,
        release_date: episode.release_date,
        thumbnail_url: episode.images?.[0]?.url || null,
        spotify_url: episode.external_urls.spotify,
        external_urls: episode.external_urls
      };

      // Upsert episode data
      const { error } = await supabase
        .from('spotify_episodes')
        .upsert([episodeData], { 
          onConflict: 'spotify_id',
          ignoreDuplicates: !force 
        });

      if (error) {
        console.error('Error upserting Spotify episode:', error);
      }
    }

    // Update sync status to completed
    await supabase
      .from('media_sync_status')
      .upsert([
        {
          platform: 'spotify',
          sync_status: 'completed',
          last_sync_at: new Date().toISOString(),
          error_message: null
        }
      ]);

    console.log('Spotify sync completed successfully');

  } catch (error) {
    console.error('Error syncing Spotify episodes:', error);
    
    // Update sync status to failed
    await supabase
      .from('media_sync_status')
      .upsert([
        {
          platform: 'spotify',
          sync_status: 'failed',
          last_sync_at: new Date().toISOString(),
          error_message: error.message
        }
      ]);
  }
}

async function syncYouTubeVideos(supabase: any, force: boolean) {
  try {
    console.log('Syncing YouTube videos...');

    // Update sync status
    await supabase
      .from('media_sync_status')
      .upsert([
        {
          platform: 'youtube',
          sync_status: 'in_progress',
          last_sync_at: new Date().toISOString()
        }
      ]);

    const apiKey = Deno.env.get('YOUTUBE_API_KEY');

    if (!apiKey) {
      throw new Error('YouTube API key not configured');
    }

    // Search for Diary of an OFW videos
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=id,snippet&q=Diary%20of%20an%20OFW&type=video&maxResults=50&key=${apiKey}`
    );

    const searchData = await searchResponse.json();
    const videoIds = searchData.items?.map((item: any) => item.id.videoId).join(',') || '';

    if (!videoIds) {
      console.log('No YouTube videos found');
      return;
    }

    // Get detailed video information
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails,statistics&id=${videoIds}&key=${apiKey}`
    );

    const videosData = await videosResponse.json();
    const videos = videosData.items || [];

    console.log(`Found ${videos.length} YouTube videos`);

    // Process each video
    for (const video of videos) {
      const videoData = {
        youtube_id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        duration: video.contentDetails.duration,
        published_at: video.snippet.publishedAt,
        thumbnail_url: video.snippet.thumbnails?.high?.url || null,
        youtube_url: `https://www.youtube.com/watch?v=${video.id}`,
        view_count: parseInt(video.statistics?.viewCount || '0'),
        like_count: parseInt(video.statistics?.likeCount || '0')
      };

      // Upsert video data
      const { error } = await supabase
        .from('youtube_videos')
        .upsert([videoData], { 
          onConflict: 'youtube_id',
          ignoreDuplicates: !force 
        });

      if (error) {
        console.error('Error upserting YouTube video:', error);
      }
    }

    // Update sync status to completed
    await supabase
      .from('media_sync_status')
      .upsert([
        {
          platform: 'youtube',
          sync_status: 'completed',
          last_sync_at: new Date().toISOString(),
          error_message: null
        }
      ]);

    console.log('YouTube sync completed successfully');

  } catch (error) {
    console.error('Error syncing YouTube videos:', error);
    
    // Update sync status to failed
    await supabase
      .from('media_sync_status')
      .upsert([
        {
          platform: 'youtube',
          sync_status: 'failed',
          last_sync_at: new Date().toISOString(),
          error_message: error.message
        }
      ]);
  }
}

serve(handler);