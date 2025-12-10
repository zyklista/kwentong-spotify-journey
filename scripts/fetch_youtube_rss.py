#!/usr/bin/env python3
"""
Fetch the YouTube channel RSS and print JSON for up to N items.
Usage:
  YT_CHANNEL_ID=<channel_id> python3 scripts/fetch_youtube_rss.py [max_items]
Example:
  YT_CHANNEL_ID=UCANMUQ39X4PcnUENrxFocbw python3 scripts/fetch_youtube_rss.py 10
"""

import sys
import urllib.request
import xml.etree.ElementTree as ET
import json
import os

def fetch(channel_id, max_items=10, timeout=15):
    url = f'https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}'
    req = urllib.request.Request(url, headers={'User-Agent': 'kwentong-media-sync/1.0'})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = resp.read()

    try:
        root = ET.fromstring(data)
    except ET.ParseError as e:
        raise RuntimeError(f'Failed to parse RSS XML: {e}')

    ns = {'yt': 'http://www.youtube.com/xml/schemas/2015', 'media': 'http://search.yahoo.com/mrss/'}
    # Try common entry paths
    entries = root.findall('{http://www.w3.org/2005/Atom}entry') or root.findall('entry') or root.findall('.//entry')
    out = []
    for e in entries[:max_items]:
        # video id is namespaced under yt:videoId
        vid_el = e.find('yt:videoId', ns) or e.find('{http://www.youtube.com/xml/schemas/2015}videoId')
        if vid_el is None or not (vid_el.text and vid_el.text.strip()):
            continue
        vid_text = vid_el.text.strip()

        # title and published may be namespaced or not
        title_el = e.find('{http://www.w3.org/2005/Atom}title') or e.find('title')
        published_el = e.find('{http://www.w3.org/2005/Atom}published') or e.find('published')

        # description and thumbnail usually live under media:group
        desc_el = None
        thumb_el = None
        media_group = e.find('media:group', ns) or None
        if media_group is not None:
            desc_el = media_group.find('media:description', ns) or media_group.find('{http://search.yahoo.com/mrss/}description')
            # thumbnails can be multiple; prefer 'high' if present
            thumb_el = media_group.find('media:thumbnail', ns) or media_group.find('{http://search.yahoo.com/mrss/}thumbnail')

        title = title_el.text.strip() if (title_el is not None and title_el.text) else None
        published = published_el.text.strip() if (published_el is not None and published_el.text) else None
        description = desc_el.text.strip() if (desc_el is not None and desc_el.text) else None

        thumbnail_url = None
        if thumb_el is not None:
            thumbnail_url = thumb_el.get('url') or thumb_el.get('src')
        if not thumbnail_url:
            thumbnail_url = f'https://img.youtube.com/vi/{vid_text}/hqdefault.jpg'

        out.append({
            'video_id': vid_text,
            'title': title,
            'published_at': published,
            'description': description,
            'thumbnail_url': thumbnail_url,
        })
    return out

if __name__ == '__main__':
    channel = os.getenv('YT_CHANNEL_ID', '')
    if not channel:
        print(json.dumps({'error': 'Set YT_CHANNEL_ID environment variable or pass channel id as first arg'}))
        sys.exit(1)
    max_items = 10
    if len(sys.argv) > 1:
        try:
            max_items = int(sys.argv[1])
        except ValueError:
            pass
    try:
        items = fetch(channel, max_items=max_items)
        print(json.dumps({'items': items}, ensure_ascii=False, indent=2))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)
