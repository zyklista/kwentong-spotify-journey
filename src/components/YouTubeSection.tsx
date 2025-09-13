import React, { useEffect, useState } from "react";

interface YouTubeVideo {
  video_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  published_at: string;
  url: string;
}

const EDGE_FUNCTION_URL = "https://your-project.supabase.co/functions/v1/youtube_latest_videos";

const YouTubeSection: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  useEffect(() => {
    async function fetchVideos() {
      const res = await fetch(EDGE_FUNCTION_URL, { method: "POST", headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      setVideos(data.latest_videos || []);
    }
    fetchVideos();
  }, []);

  return (
    <section id="youtube-section" style={{ padding: 20, background: "#f9f9f9" }}>
      <h2>Latest Videos</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
        {videos.map(video => (
          <a key={video.video_id} href={video.url} target="_blank" rel="noopener noreferrer"
            style={{
              textDecoration: "none", color: "inherit", border: "1px solid #ddd", borderRadius: 8,
              overflow: "hidden", background: "white", transition: "transform 0.2s", display: "flex", flexDirection: "column"
            }}>
            <img src={video.thumbnail_url} alt={video.title} style={{ width: "100%", display: "block" }} />
            <div style={{ padding: 10 }}>
              <div style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: 8 }}>{video.title}</div>
              <div style={{ fontSize: "0.95rem", color: "#555", marginBottom: 8 }}>{video.description}</div>
              <div style={{ fontSize: "0.85rem", color: "#888" }}>{video.published_at}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default YouTubeSection;
