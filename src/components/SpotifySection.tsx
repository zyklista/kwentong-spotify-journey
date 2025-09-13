import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SpotifyEpisode {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  external_url: string | null;
  release_date: string;
}

const SpotifySection = () => {
  const [episodes, setEpisodes] = useState<SpotifyEpisode[]>([]);

  useEffect(() => {
    fetchSpotifyEpisodes();
  }, []);

  const fetchSpotifyEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('spotify_episodes')
        .select('id, name as title, description, image_url, external_url, published_at as release_date')
        .order('published_at', { ascending: false })
        .limit(5);

      if (!error && data) setEpisodes(data);
      else console.error('Error fetching Spotify episodes:', error);
    } catch (err) {
      console.error('Error fetching Spotify episodes:', err);
    }
  };

  return (
    <section id="spotify-section" style={{ padding: 20, background: "#f9f9f9" }}>
      <h2>Latest Spotify Episodes</h2>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16
      }}>
        {episodes.map(ep => (
          <a key={ep.id} href={ep.external_url || "#"} target="_blank" rel="noopener noreferrer"
             style={{
               textDecoration: "none", color: "inherit", border: "1px solid #ddd", borderRadius: 8,
               overflow: "hidden", background: "white", transition: "transform 0.2s", display: "flex", flexDirection: "column"
             }}>
            <img src={ep.image_url || ""} alt={ep.title} style={{ width: "100%", display: "block" }} />
            <div style={{ padding: 10 }}>
              <div style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: 8 }}>{ep.title}</div>
              <div style={{ fontSize: "0.95rem", color: "#555", marginBottom: 8 }}>{ep.description}</div>
              <div style={{ fontSize: "0.85rem", color: "#888" }}>{ep.release_date}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default SpotifySection;
