import React, { useEffect, useState } from "react";

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  url: string;
}

const EDGE_FUNCTION_URL = "https://yvmqcqrewqvwroxinzvn.supabase.co/functions/v1/YouTube_rss";

const fetchLatestVideos = async (): Promise<YouTubeVideo[]> => {
  const res = await fetch(EDGE_FUNCTION_URL, { method: "POST", headers: { "Content-Type": "application/json" } });
  const data = await res.json();
  return (data.latest_videos || []).map((item: any) => ({
    videoId: item.video_id,
    title: item.title,
    description: item.description,
    thumbnailUrl: item.thumbnail_url,
    publishedAt: item.published_at,
    url: item.url,
  }));
};

const YouTubeSection: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestVideos().then(v => {
      setVideos(v);
      setLoading(false);
    });
  }, []);

  return (
  <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest YouTube Videos</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {videos.map(video => (
              <a key={video.videoId} href={video.url} target="_blank" rel="noopener noreferrer" className="block rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-3">{video.description}</p>
                  <span className="text-xs text-gray-500">{new Date(video.publishedAt).toLocaleDateString()}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default YouTubeSection;
