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
    root = ET.fromstring(data)
    ns = {'yt':'http://www.youtube.com/xml/schemas/2015','media':'http://search.yahoo.com/mrss/'}
    entries = root.findall('{http://www.w3.org/2005/Atom}entry') or root.findall('entry')
    out = []
    for e in entries[:max_items]:
        vid = e.find('yt:videoId', ns)
        if vid is None or not vid.text:
            continue
        title = e.find('{http://www.w3.org/2005/Atom}title') or e.find('title')
        published = e.find('{http://www.w3.org/2005/Atom}published') or e.find('published')
        desc = e.find('media:group/media:description', ns)
        thumb = e.find('media:group/media:thumbnail', ns)
        vid_text = vid.text
        out.append({
            'video_id': vid_text,
            'title': title.text if title is not None else None,
            'published_at': published.text if published is not None else None,
            'description': desc.text if desc is not None else None,
            'thumbnail_url': thumb.get('url') if thumb is not None else f'https://img.youtube.com/vi/{vid_text}/hqdefault.jpg'
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
