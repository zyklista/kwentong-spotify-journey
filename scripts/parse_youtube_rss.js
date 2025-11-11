(async () => {
  try {
    const CHANNEL_ID = 'UCANMUQ39X4PcnUENrxFocbw';
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const xml = await res.text();
    const entries = xml.split('<entry>').slice(1);
    const parsed = entries.map(entry => {
      const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || '';
      const title = entry.match(/<title>([^<]+)<\/title>/)?.[1] || '';
      const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] || '';
      const description = entry.match(/<media:description>([^<]+)<\/media:description>/)?.[1] || '';
      const thumbnail = entry.match(/<media:thumbnail url=\"([^\"]+)\"\/>/)?.[1] || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '');
      return {
        video_id: videoId,
        title,
        published_at: published,
        description,
        thumbnail_url: thumbnail,
        url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''
      };
    });
    console.log(JSON.stringify(parsed[0] || null, null, 2));
  } catch (err) {
    console.error('Error parsing RSS:', err);
    process.exit(2);
  }
})();
