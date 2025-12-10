#!/usr/bin/env python3
"""
Fetch YouTube channel RSS, optionally enrich durations via YouTube Data API,
and upsert results into the Supabase `youtube_videos` table using the
service role key.

Usage:
  SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> YT_CHANNEL_ID=<id> \
    [YOUTUBE_DATA_API_KEY=<key>] python3 scripts/sync_youtube_to_supabase.py

Environment variables:
  SUPABASE_URL                 (required) e.g. https://xyz.supabase.co
  SUPABASE_SERVICE_ROLE_KEY    (required) service_role key for upsert
  YT_CHANNEL_ID                (optional) channel id; default is channel in script
  YOUTUBE_DATA_API_KEY         (optional) to fetch durations
  MIN_DURATION                 (optional) seconds threshold; default 300
  LIMIT                        (optional) max items to upsert; default 0 => all
"""

import os
import sys
import urllib.request
import urllib.error
import urllib.parse
import json
import time
from typing import List, Dict, Optional

DEFAULT_CHANNEL = 'UCANMUQ39X4PcnUENrxFocbw'

def fetch_rss(channel_id: str, timeout=15) -> List[Dict]:
    url = f'https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}'
    req = urllib.request.Request(url, headers={'User-Agent': 'kwentong-media-sync/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = resp.read()
    except urllib.error.URLError as e:
        # Provide an explicit, actionable error message for network/DNS issues
        print(f"Network error while fetching RSS ({url}): {e}", file=sys.stderr)
        print("Possible causes: no internet access from this environment, DNS failure, or proxy/firewall blocking outbound requests.", file=sys.stderr)
        print("Quick checks:", file=sys.stderr)
        print("  - Can you `curl https://www.youtube.com/feeds/videos.xml?channel_id=...` from this machine?", file=sys.stderr)
        print("  - Check environment proxy vars: $http_proxy $https_proxy", file=sys.stderr)
        print("  - Check /etc/resolv.conf for DNS servers", file=sys.stderr)
        sys.exit(1)
    # Simple, minimal parsing using string operations / basic xml parsing
    text = data.decode('utf-8')
    entries = text.split('<entry>')[1:]
    out = []
    for e in entries:
        vid = (e.split('<yt:videoId>')[-1].split('</yt:videoId>')[0]) if '<yt:videoId>' in e else None
        title = (e.split('<title>')[-1].split('</title>')[0]) if '<title>' in e else None
        published = (e.split('<published>')[-1].split('</published>')[0]) if '<published>' in e else None
        desc = None
        if '<media:description' in e:
            try:
                desc = e.split('<media:description')[-1].split('>')[1].split('</media:description>')[0]
            except Exception:
                desc = None
        thumb = None
        if 'media:thumbnail' in e:
            try:
                part = e.split('media:thumbnail')[-1]
                url_part = part.split('url="')[-1]
                thumb = url_part.split('"')[0]
            except Exception:
                thumb = None
        if vid:
            out.append({
                'video_id': vid.strip(),
                'title': (title or '').strip(),
                'published_at': (published or '').strip() or None,
                'description': (desc or '').strip() or None,
                'thumbnail_url': thumb or f'https://img.youtube.com/vi/{vid.strip()}/hqdefault.jpg'
            })
    return out


def parse_iso_duration(iso: Optional[str]) -> int:
    if not iso:
        return 0
    # Very small parser for ISO 8601 durations like PT1H23M45S
    import re
    m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', iso)
    if not m:
        return 0
    h = int(m.group(1) or 0)
    mm = int(m.group(2) or 0)
    s = int(m.group(3) or 0)
    return h*3600 + mm*60 + s


def fetch_youtube_details(video_ids: List[str], api_key: str) -> Dict[str, Dict]:
    out = {}
    if not api_key or not video_ids:
        return out
    # Batch up to 50
    for i in range(0, len(video_ids), 50):
        batch = video_ids[i:i+50]
        qs = urllib.parse.urlencode({
            'part': 'snippet,contentDetails',
            'id': ','.join(batch),
            'key': api_key,
        })
        url = f'https://www.googleapis.com/youtube/v3/videos?{qs}'
        req = urllib.request.Request(url, headers={'User-Agent': 'kwentong-media-sync/1.0'})
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                j = json.load(resp)
        except Exception as e:
            print('YouTube API request failed for batch:', e, file=sys.stderr)
            continue
        for it in j.get('items', []):
            vid = it.get('id')
            duration_iso = it.get('contentDetails', {}).get('duration')
            dsec = parse_iso_duration(duration_iso)
            snippet = it.get('snippet', {})
            out[vid] = {
                'duration_iso': duration_iso,
                'duration_seconds': dsec,
                'title': snippet.get('title'),
                'description': snippet.get('description'),
                'thumbnail_url': (snippet.get('thumbnails') or {}).get('high', {}).get('url') or (snippet.get('thumbnails') or {}).get('default', {}).get('url')
            }
        time.sleep(0.1)
    return out


def upsert_to_supabase(rows: List[Dict], supabase_url: str, service_role_key: str) -> Dict:
    endpoint = supabase_url.rstrip('/') + '/rest/v1/youtube_videos'
    body = json.dumps(rows).encode('utf-8')
    headers = {
        'Content-Type': 'application/json',
        'apikey': service_role_key,
        'Authorization': f'Bearer {service_role_key}',
        'Prefer': 'resolution=merge-duplicates,return=representation'
    }
    req = urllib.request.Request(endpoint, data=body, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            raw = resp.read().decode('utf-8', errors='ignore')
            try:
                parsed = json.loads(raw)
            except Exception:
                parsed = raw
            # show status via resp.getcode()
            return {'status': resp.getcode(), 'body': parsed}
    except urllib.error.HTTPError as he:
        msg = he.read().decode('utf-8', errors='ignore')
        raise RuntimeError(f'Supabase upsert failed {he.code}: {msg}')


def main():
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    if not supabase_url or not supabase_key:
        print('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables', file=sys.stderr)
        sys.exit(1)

    channel = os.getenv('YT_CHANNEL_ID') or DEFAULT_CHANNEL
    yt_key = os.getenv('YOUTUBE_DATA_API_KEY') or os.getenv('YT_DATA_API_KEY')
    min_duration = int(os.getenv('MIN_DURATION') or '300')
    limit = int(os.getenv('LIMIT') or '0')

    print('Fetching RSS for channel', channel)
    items = fetch_rss(channel)
    print(f'Fetched {len(items)} items from RSS')
    if limit > 0:
        items = items[:limit]
    if not items:
        print('No items found in RSS')
        return

    if yt_key:
        ids = [it['video_id'] for it in items]
        print('Enriching with YouTube Data API for', len(ids), 'ids')
        details = fetch_youtube_details(ids, yt_key)
        # merge details
        for it in items:
            det = details.get(it['video_id']) or {}
            it['duration_iso'] = det.get('duration_iso')
            it['duration_seconds'] = det.get('duration_seconds')
            # prefer enrichment title/description/thumb if present
            it['title'] = det.get('title') or it.get('title')
            it['description'] = det.get('description') or it.get('description')
            it['thumbnail_url'] = det.get('thumbnail_url') or it.get('thumbnail_url')
    else:
        # No API key, duration unknown
        for it in items:
            it['duration_iso'] = None
            it['duration_seconds'] = None

    # Filter by min_duration only when duration_seconds is known
    filtered = []
    for it in items:
        ds = it.get('duration_seconds')
        if ds is None:
            # keep it when no duration info (so function behaves non-destructively)
            filtered.append(it)
        else:
            if ds >= min_duration:
                filtered.append(it)

    rows = []
    for it in filtered:
        rows.append({
            'video_id': it['video_id'],
            'title': it.get('title') or None,
            'description': it.get('description') or None,
            'thumbnail_url': it.get('thumbnail_url') or None,
            'published_at': it.get('published_at') or None,
            'duration': it.get('duration_iso') or (str(it.get('duration_seconds')) if it.get('duration_seconds') is not None else None),
            'duration_seconds': it.get('duration_seconds') if it.get('duration_seconds') is not None else None,
        })

    if not rows:
        print('No rows to upsert after filtering')
        return

    # Verbose output for diagnostics
    print(f'Prepared {len(rows)} rows for upsert. Sample ids: {[r["video_id"] for r in rows[:10]]}')
    # Respect dry run / no persist env var for testing
    dry = os.getenv('DRY_RUN', '').lower() in ('1', 'true', 'yes') or os.getenv('PERSIST', '').lower() in ('0', 'false', 'no')
    if dry:
        print('DRY RUN enabled - skipping actual upsert. Showing payload preview:')
        try:
            print(json.dumps({'rows': rows[:20]}, indent=2, ensure_ascii=False))
        except Exception:
            print(rows[:20])
        return

    print(f'Upserting {len(rows)} rows to Supabase')
    res = upsert_to_supabase(rows, supabase_url, supabase_key)
    print('Upsert response preview:')
    try:
        # upsert_to_supabase now returns {'status': code, 'body': parsed}
        if isinstance(res, dict) and 'status' in res:
            print(f"HTTP status: {res['status']}")
            print(json.dumps(res.get('body', {}), indent=2, ensure_ascii=False))
        else:
            print(json.dumps(res if isinstance(res, dict) else {'rows': res}, indent=2, ensure_ascii=False))
    except Exception:
        print(res)

if __name__ == '__main__':
    main()
