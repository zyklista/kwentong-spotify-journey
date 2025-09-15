import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock, Youtube } from "lucide-react";
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
        .limit(5);

      if (error) {
        console.error('Error fetching YouTube videos:', error);
        return;
      }
      setYoutubeVideos(data || []);
      setLatestVideo(data?.[0] || null);
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
        .limit(4);

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
    <section className="py-20 relative overflow-hidden">
      {/* Animated Art Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_hsl(var(--primary))_0%,_transparent_50%)] opacity-5 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_hsl(var(--accent))_0%,_transparent_50%)] opacity-5 animate-pulse" style={{
          animationDelay: '1s'
        }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_30%,_hsl(var(--secondary))_50%,_transparent_70%)] opacity-3"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4 animate-fade-in">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Diary of an OFW is dedicated to capturing the raw, unfiltered journeys of Overseas Filipino Workers across the globe. We shine a light on the extraordinary achievements and untold stories of Filipinos who have carved out greatness far from home.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Through intimate conversations with notable individuals—especially those thriving in foreign lands—we uncover hidden truths, life-changing lessons, and meaningful insights.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium mb-12">
              Our mission is to inspire, uplift, and empower our audience to live with greater joy, purpose, and fulfillment by sharing the voices and victories of the global Filipino community.
            </p>
          </div>

          {/* Latest YouTube Episode Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Latest YouTube Episode
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Watch our newest video content featuring inspiring OFW stories and interviews.
            </p>
            {loadingYT ? (
              <div className="flex justify-center mb-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : latestVideo ? (
              <Card className="max-w-2xl mx-auto mb-8 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img
                    src={latestVideo.thumbnail_url}
                    alt={latestVideo.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-all duration-300">
                    <Button
                      onClick={() => window.open(latestVideo.url, '_blank')}
                      size="lg"
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4"
                    >
                      <Play className="w-8 h-8" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{latestVideo.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{latestVideo.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(latestVideo.published_at)}
                    </div>
                    {latestVideo.duration && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDuration(latestVideo.duration)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : null}
            <Button onClick={() => window.open('https://youtube.com/@diaryofanofw', '_blank')} size="lg" className="px-8 py-6 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:scale-105 text-lg">
              <Youtube className="mr-2 w-6 h-6" />
              Watch on YouTube
            </Button>
          </div>

          {/* Spotify Episodes Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Latest Spotify Episodes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Listen to our heartfelt conversations with OFWs sharing their incredible journeys, challenges, and triumphs.
            </p>
          </div>
          {/* Dynamically loaded Spotify episodes */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {loadingSpotify ? (
              <div className="flex justify-center mb-8 col-span-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : spotifyEpisodes.length > 0 ? (
              spotifyEpisodes.map((episode) => (
                <Card key={episode.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <img
                      src={episode.image_url}
                      alt={episode.name}
                      className="w-full h-52 object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{episode.name}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{episode.description}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(episode.published_at)}
                      </div>
                      {episode.duration_ms && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDuration(episode.duration_ms.toString())}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => window.open(episode.external_url, '_blank')}
                      size="sm"
                      className="mt-4 px-5 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105"
                    >
                      <Play className="mr-2 w-5 h-5" />
                      Listen on Spotify
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center text-muted-foreground">
                No episodes available yet.
              </div>
            )}
          </div>

          <div className="text-center mb-8">
            <Button onClick={() => window.open('https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty', '_blank')} size="lg" className="px-8 py-6 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105">
              <Play className="mr-2 w-5 h-5" />
              View All Episodes on Spotify
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
