import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SpotifyEpisode {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  external_url: string | null;
  published_at: string | null;
}

const SpotifySection: React.FC = () => {
  const [episodes, setEpisodes] = useState<SpotifyEpisode[]>([]);

  useEffect(() => {
    async function fetchSpotifyEpisodes() {
      const { data } = await supabase
        .from('spotify_episodes')
        .select('id, name, description, image_url, external_url, published_at')
        .order('published_at', { ascending: false })
        .limit(5);
      setEpisodes(data || []);
    }
    fetchSpotifyEpisodes();
  }, []);

  return (
  <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Spotify Episodes</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {episodes.map(ep => (
            <a key={ep.id} href={ep.external_url || '#'} target="_blank" rel="noopener noreferrer" className="block rounded-lg shadow hover:shadow-lg transition overflow-hidden">
              <img src={ep.image_url || ''} alt={ep.name} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{ep.name}</h3>
                <p className="text-muted-foreground text-sm mb-2 line-clamp-3">{ep.description}</p>
                <span className="text-xs text-gray-500">{ep.published_at ? new Date(ep.published_at).toLocaleDateString() : ''}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpotifySection;
