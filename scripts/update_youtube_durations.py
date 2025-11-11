#!/usr/bin/env python3
"""
Update persisted YouTube rows in Supabase with duration from YouTube Data API.

Usage: load env (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, YOUTUBE_DATA_API_KEY) then run:
  python3 scripts/update_youtube_durations.py
"""
import os
import sys
import json
import urllib.request
import urllib.parse


def fetch_url(url, headers=None, method="GET", data=None):
    req = urllib.request.Request(url, data=data, method=method)
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8")


SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_DATA_API_KEY") or os.environ.get("YT_DATA_API_KEY")
if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    print("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment", file=sys.stderr)
    sys.exit(2)
if not YOUTUBE_API_KEY:
    print("Missing YOUTUBE_DATA_API_KEY in environment; cannot fetch durations", file=sys.stderr)
    sys.exit(2)

def main():
    print("Fetching video_ids with null duration...")
    # fetch rows where either duration ISO or duration_seconds is null
    # URL-encode the 'or' clause to avoid Bad Request errors
    or_clause = urllib.parse.quote("(duration.is.null,duration_seconds.is.null)")
    params = f"select=video_id&or={or_clause}&limit=1000"
    endpoint = f"{SUPABASE_URL.rstrip('/')}/rest/v1/youtube_videos?{params}"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
    }
    try:
        resp = fetch_url(endpoint, headers=headers)
    except Exception as e:
        # If the duration_seconds column doesn't exist yet, the 'or' filter will cause a 400.
        # Fall back to querying only where duration is null.
        print('First query failed, retrying with duration IS NULL only:', e)
        endpoint2 = f"{SUPABASE_URL.rstrip('/')}/rest/v1/youtube_videos?select=video_id&duration=is.null&limit=1000"
        resp = fetch_url(endpoint2, headers=headers)
    rows = json.loads(resp)
    ids = [r["video_id"] for r in rows if r.get("video_id")]
    print(f"Found {len(ids)} videos to update")
    if not ids:
        return

    chunks = [ids[i : i + 50] for i in range(0, len(ids), 50)]
    updated = 0
    for chunk in chunks:
        idlist = ",".join(chunk)
        yt_url = (
            "https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id="
            + urllib.parse.quote(idlist)
            + "&key="
            + urllib.parse.quote(YOUTUBE_API_KEY)
        )
        try:
            jraw = fetch_url(yt_url)
        except Exception as e:
            print("YouTube API request failed:", e, file=sys.stderr)
            continue
        j = json.loads(jraw)
        items = j.get("items", [])
        if not items:
            print("No items returned for batch", file=sys.stderr)
            continue
        for it in items:
            vid = it.get("id")
            cont = it.get("contentDetails", {})
            dur = cont.get("duration")
            if not vid or not dur:
                print("Missing duration for", vid)
                continue
            # compute seconds from ISO duration (PT#H#M#S)
            def iso_to_seconds(iso_str: str) -> int:
                import re
                if not iso_str:
                    return 0
                m = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso_str)
                if not m:
                    return 0
                h = int(m.group(1) or 0)
                mm = int(m.group(2) or 0)
                s = int(m.group(3) or 0)
                return h * 3600 + mm * 60 + s

            secs = iso_to_seconds(dur)
            patch_url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/youtube_videos?video_id=eq.{urllib.parse.quote(vid)}"
            payload = json.dumps({"duration": dur, "duration_seconds": secs}).encode("utf-8")
            h = {
                "Content-Type": "application/json",
                "apikey": SUPABASE_SERVICE_ROLE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
                "Prefer": "return=representation",
            }
            try:
                presp = fetch_url(patch_url, headers=h, method="PATCH", data=payload)
                prespj = json.loads(presp)
                if prespj:
                    updated += 1
                    print("Updated", vid, "->", dur, "(secs:", secs, ")")
                else:
                    print("Patch returned empty for", vid)
            except Exception as e:
                print("Patch failed for", vid, e, file=sys.stderr)

    print(f"Done. Updated {updated} rows.")


if __name__ == "__main__":
    main()
