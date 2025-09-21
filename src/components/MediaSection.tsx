import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock } from "lucide-react";
import { FaYoutube, FaSpotify } from "react-icons/fa";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const MediaSection = () => {
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [latestVideo, setLatestVideo] = useState<any>(null);
  const [spotifyEpisodes, setSpotifyEpisodes] = useState<any[]>([]);
  const [loadingYT, setLoadingYT] = useState(true);
  const [loadingSpotify, setLoadingSpotify] = useState(true);

  // Fetch YouTube videos from your Supabase table
  useEffect(() => {
    fetchYouTubeVideos();
    fetchSpotifyEpisodes();
    triggerMediaSync();
  }, []);

  const fetchYouTubeVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Error fetching YouTube videos:', error);
        return;
      }
      setYoutubeVideos(data || []);
      setLatestVideo((data || [])[0] || null);
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    } finally {
      setLoadingYT(false);
    }
  };

  // Fetch Spotify episodes from your Supabase table
  const fetchSpotifyEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('spotify_episodes')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Error fetching Spotify episodes:', error);
        return;
      }
      setSpotifyEpisodes(data || []);
    } catch (error) {
      console.error('Error fetching Spotify episodes:', error);
    } finally {
      setLoadingSpotify(false);
    }
  };

  // Trigger sync for both platforms
  const triggerMediaSync = async () => {
    try {
      await supabase.functions.invoke('media-sync', {
        body: { platform: 'youtube', force: false }
      });
      await supabase.functions.invoke('media-sync', {
        body: { platform: 'spotify', force: false }
      });
    } catch (error) {
      console.error('Error triggering media sync:', error);
    }
  };

  const formatDuration = (duration: string) => {
    if (!duration) return '';
    // Convert milliseconds (Spotify) or ISO 8601 (YouTube) to readable format
    if (/^PT/.test(duration)) {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return duration;
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      const seconds = parseInt(match[3]) || 0;
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
    // If it's ms (Spotify)
    const ms = parseInt(duration);
    if (!isNaN(ms)) {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return duration;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
  <section className="bg-gradient-to-b from-background to-secondary/5 py-20 relative overflow-hidden">
      {/* Animated Art Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-yellow-100 to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_hsl(var(--primary))_0%,_transparent_70%)] opacity-20 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_hsl(var(--accent))_0%,_transparent_70%)] opacity-20 animate-pulse" style={{
          animationDelay: '1s'
        }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_30%,_hsl(var(--secondary))_40%,_transparent_80%)] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-2xl text-gray-700 leading-relaxed mb-6">
              Diary of an OFW is dedicated to capturing the raw, unfiltered journeys of Overseas Filipino Workers across the globe. We shine a light on the extraordinary achievements and untold stories of Filipinos who have carved out greatness far from home.
            </p>
            <p className="text-2xl text-gray-700 leading-relaxed mb-6">
              Through intimate conversations with notable individuals—especially those thriving in foreign lands—we uncover hidden truths, life-changing lessons, and meaningful insights.
            </p>
            <p className="text-2xl text-gray-800 leading-relaxed font-medium mb-12">
              Our mission is to inspire, uplift, and empower our audience to live with greater joy, purpose, and fulfillment by sharing the voices and victories of the global Filipino community.
            </p>


          {/* YouTube Videos Section */}
          <div className="flex justify-center mb-8">
            <img src={require('@/assets/3d-geometric-bg.jpg')} alt="3D Geometric Background" className="rounded-xl shadow-xl w-full max-w-3xl object-cover" />
          </div>
          <div className="mb-12 text-left mt-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-800">
              Most Popular Videos
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl leading-relaxed">
              Watch inspiring stories and interviews with OFWs from around the world.
            </p>
          </div>
          <div className="w-full flex flex-col gap-8 mb-12">
            {loadingYT ? (
              <div className="flex justify-center mb-8 w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : youtubeVideos.length > 0 ? (
              youtubeVideos.slice(0, 5).map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 w-full bg-transparent">
                  <div className="flex flex-col md:flex-row w-full items-center md:items-start gap-8">
                    <div className="w-full md:w-1/3 flex-shrink-0">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-52 object-cover rounded-lg"
                      />
                    </div>
                    <div className="w-full md:w-2/3 flex flex-col justify-center">
                      <h3 className="text-3xl font-bold mb-2 text-gray-900">{video.title}</h3>
                      <p className="text-lg text-muted-foreground mb-4">{video.description}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(video.published_at)}
                        </div>
                        <div className="flex items-center gap-3">
                          <a href="https://www.youtube.com/@diaryofanofw" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800">
                            <FaYoutube className="w-12 h-12 drop-shadow-2xl bg-white p-2 rounded-full border-2 border-red-600" style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))' }} />
                          </a>
                          <a href="https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                            <FaSpotify className="w-12 h-12 drop-shadow-2xl bg-white p-2 rounded-full border-2 border-green-600" style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))' }} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="w-full text-center text-muted-foreground flex flex-col items-center gap-4">
                No videos available yet.
                <div className="flex justify-center gap-6 mt-4">
                  <a href="https://www.youtube.com/@diaryofanofw" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 text-lg">
                    <FaYoutube className="w-7 h-7 drop-shadow-lg" />
                    YouTube
                  </a>
                  <a href="https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 text-lg">
                    <Play className="w-7 h-7" />
                    Spotify
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Spotify Episodes Section */}

        </div>
      </div>
    </div>
  </section>
  );
};

export default MediaSection;
