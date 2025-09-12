export function parseYoutubeRss(xml: string) {
  const entries = xml.split("<entry>").slice(1);
  return entries.map(entry => {
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
    const title = entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
    const description = entry.match(/<media:description>([^<]+)<\/media:description>/)?.[1] ?? "";
    const thumbnail_url =
      entry.match(/<media:thumbnail url="([^"]+)"\/>/)?.[1]
      ?? (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "");
    const url = videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";
    return {
      video_id: videoId,
      title,
      published_at: published,
      description,
      thumbnail_url,
      url
    };
  }).filter(v => v.video_id);
}
