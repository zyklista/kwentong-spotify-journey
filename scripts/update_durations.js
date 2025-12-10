#!/usr/bin/env node

/**
 * Update existing YouTube videos in Supabase with duration information
 * This script fetches videos that don't have duration_seconds set and updates them
 */

const https = require('https');
const { URL } = require('url');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_DATA_API_KEY || process.env.YT_DATA_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !YOUTUBE_API_KEY) {
  console.error('Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, YOUTUBE_API_KEY');
  process.exit(1);
}

function makeRequest(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function updateVideoDurations() {
  console.log('Fetching videos without duration_seconds...');

  // Fetch videos that don't have duration_seconds set
  const queryUrl = new URL(`${SUPABASE_URL}/rest/v1/youtube_videos`);
  queryUrl.searchParams.set('select', 'video_id,title');
  queryUrl.searchParams.set('duration_seconds', 'is.null');
  queryUrl.searchParams.set('limit', '100');

  const response = await makeRequest(queryUrl, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.status !== 200) {
    console.error('Failed to fetch videos:', response);
    return;
  }

  const videos = response.data;
  if (!videos || videos.length === 0) {
    console.log('No videos found that need duration updates');
    return;
  }

  console.log(`Found ${videos.length} videos to update`);

  // Process in batches of 50 (YouTube API limit)
  for (let i = 0; i < videos.length; i += 50) {
    const batch = videos.slice(i, i + 50);
    const videoIds = batch.map(v => v.video_id);

    console.log(`Processing batch ${Math.floor(i/50) + 1}: ${videoIds.length} videos`);

    // Fetch duration data from YouTube API
    const ytUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    ytUrl.searchParams.set('part', 'contentDetails');
    ytUrl.searchParams.set('id', videoIds.join(','));
    ytUrl.searchParams.set('key', YOUTUBE_API_KEY);

    const ytResponse = await makeRequest(ytUrl);
    if (ytResponse.status !== 200) {
      console.error('YouTube API error:', ytResponse);
      continue;
    }

    // Update each video with duration info
    for (const item of ytResponse.data.items || []) {
      const videoId = item.id;
      const durationIso = item.contentDetails?.duration;

      if (!durationIso) continue;

      // Parse ISO duration to seconds
      const durationSeconds = parseIsoDuration(durationIso);

      // Update the video in Supabase
      const updateUrl = new URL(`${SUPABASE_URL}/rest/v1/youtube_videos`);
      updateUrl.searchParams.set('video_id', `eq.${videoId}`);

      const updateResponse = await makeRequest(updateUrl, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }, {
        duration_seconds: durationSeconds,
        duration_text: formatDurationText(durationSeconds)
      });

      if (updateResponse.status === 200) {
        console.log(`✅ Updated ${videoId}: ${durationSeconds}s`);
      } else {
        console.error(`❌ Failed to update ${videoId}:`, updateResponse);
      }
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('Duration update complete!');
}

function parseIsoDuration(iso) {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  return hours * 3600 + minutes * 60 + seconds;
}

function formatDurationText(seconds) {
  if (seconds <= 0) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

updateVideoDurations().catch(console.error);