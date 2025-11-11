media-sync Supabase Edge Function

What it does
- Fetches a YouTube channel's public RSS feed and parses recent entries.
- Optionally enriches those entries with YouTube Data API (snippet + contentDetails) using the server-side `YOUTUBE_DATA_API_KEY` environment variable.
- Optionally persists/upserts results into the `youtube_videos` table using Supabase REST (requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`).

Endpoints
- GET /?channel_id=...&force=1&persist=1
- POST (JSON body) { channel_id, force, persist }

Environment variables
- YOUTUBE_DATA_API_KEY (or YT_DATA_API_KEY) - optional, required to fetch durations and filter 5+ minute videos.
- SUPABASE_URL - optional, required to persist data
- SUPABASE_SERVICE_ROLE_KEY - required if you want to persist/upsert data

Usage examples
- Fetch feed and return items (no persist):
  curl "https://<your-fn-url>/?channel_id=UCANMUQ39X4PcnUENrxFocbw"

- Fetch + persist into Supabase:
  curl "https://<your-fn-url>/?channel_id=...&persist=1"

Notes
- The function preserves RSS order and only filters by duration if the server-side YouTube API key is present.
- Use the service role key carefully; do not expose it to the client.
