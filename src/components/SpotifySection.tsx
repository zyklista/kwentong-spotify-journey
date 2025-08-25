import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Clock, Users, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface SpotifyEpisode {
  id: string;
  spotify_id: string;
  title: string;
  description: string;
  duration_ms: number;
  release_date: string;
  thumbnail_url: string | null;
  spotify_url: string;
}

interface LegacyStory {
  id: number;
  title: string;
  artist: string;
  duration: string;
  plays: string;
  likes: string;
  image: string;
  category: string;
}

const SpotifySection = () => {
  const [episodes, setEpisodes] = useState<SpotifyEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpotifyEpisodes();
  }, []);

  const fetchSpotifyEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('spotify_episodes')
        .select('*')
        .order('release_date', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching Spotify episodes:', error);
      } else if (data && data.length > 0) {
        setEpisodes(data);
      }
    } catch (error) {
      console.error('Error fetching Spotify episodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Static fallback data
  const staticStories: LegacyStory[] = [
    {
      id: 1,
      title: "Pamilyang Nagkakapit sa Pagkakamalayo",
      artist: "Maria Santos - Dubai",
      duration: "12:34",
      plays: "15.2K",
      likes: "892",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop",
      category: "Family Stories"
    },
    {
      id: 2,
      title: "Pangarap na Natupad sa Singapore",
      artist: "Jose Reyes - Singapore",
      duration: "8:45",
      plays: "23.1K",
      likes: "1.2K",
      image: "https://images.unsplash.com/photo-1566577134631-1b2b4b7a7f0b?w=300&h=300&fit=crop",
      category: "Success Stories"
    },
    {
      id: 3,
      title: "Mga Hamon sa Canada",
      artist: "Ana Cruz - Toronto",
      duration: "15:20",
      plays: "8.7K",
      likes: "456",
      image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=300&h=300&fit=crop",
      category: "Challenges"
    },
    {
      id: 4,
      title: "Paglalakbay ng Isang Seaman",
      artist: "Carlos Torres - Worldwide",
      duration: "20:12",
      plays: "31.5K",
      likes: "2.1K",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop",
      category: "Adventure"
    },
    {
      id: 5,
      title: "Nurse sa Gitna ng Pandemya",
      artist: "Grace Miguel - London",
      duration: "11:30",
      plays: "45.8K",
      likes: "3.2K",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop",
      category: "Healthcare Heroes"
    }
  ];

  // Use real episodes if available, otherwise fall back to static data
  const displayData = episodes.length > 0 ? episodes : staticStories;
  const featuredEpisode = displayData[0];
  const gridEpisodes = displayData.slice(1);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading episodes...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Mga Kwentong OFW</h2>
            <p className="text-muted-foreground">
              Pakinggan ang mga inspirational na kwento ng mga kababayan natin sa ibang bansa
            </p>
          </div>
          <Button variant="outline" onClick={() => window.open('https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty', '_blank')}>
            Tingnan Lahat
          </Button>
        </div>

        {/* Featured Story */}
        <Card className="mb-8 overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-primary/20 flex items-center justify-center">
                <img 
                  src={'thumbnail_url' in featuredEpisode ? featuredEpisode.thumbnail_url || '/placeholder.svg' : featuredEpisode.image} 
                  alt={featuredEpisode.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="text-sm text-primary font-medium mb-1">FEATURED STORY</div>
                <h3 className="text-2xl font-bold mb-2">{featuredEpisode.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {'description' in featuredEpisode ? 
                    featuredEpisode.description?.substring(0, 100) + '...' : 
                    featuredEpisode.artist
                  }
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {'duration_ms' in featuredEpisode ? 
                      formatDuration(featuredEpisode.duration_ms) : 
                      featuredEpisode.duration
                    }
                  </div>
                  {'plays' in featuredEpisode && (
                    <>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {featuredEpisode.plays} plays
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {featuredEpisode.likes}
                      </div>
                    </>
                  )}
                </div>
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full md:w-auto bg-green-500 hover:bg-green-600"
                  onClick={() => {
                    const url = 'spotify_url' in featuredEpisode ? 
                      featuredEpisode.spotify_url : 
                      'https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty';
                    window.open(url, '_blank');
                  }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Makinig Ngayon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gridEpisodes.map((episode, index) => (
            <Card key={'spotify_id' in episode ? episode.spotify_id : episode.id} className="group hover:shadow-float transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={'thumbnail_url' in episode ? episode.thumbnail_url || '/placeholder.svg' : episode.image} 
                      alt={episode.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Button 
                    variant="default" 
                    size="icon" 
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg bg-green-500 hover:bg-green-600"
                    onClick={() => {
                      const url = 'spotify_url' in episode ? 
                        episode.spotify_url : 
                        'https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty';
                      window.open(url, '_blank');
                    }}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  {'category' in episode && (
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {episode.category}
                    </div>
                  )}
                </div>
                <h4 className="font-semibold text-sm mb-1 line-clamp-2">{episode.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {'description' in episode ? 
                    episode.description?.substring(0, 60) + '...' : 
                    episode.artist
                  }
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {'duration_ms' in episode ? 
                      formatDuration(episode.duration_ms) : 
                      episode.duration
                    }
                  </div>
                  {'plays' in episode && (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {episode.plays}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {episode.likes}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpotifySection;