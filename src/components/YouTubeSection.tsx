import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, Youtube, Clock, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface YouTubeVideo {
  id: string;
  video_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration: string | null;
  view_count: number | null;
  like_count: number | null;
  published_at: string;
  created_at: string;
  updated_at: string;
}

const YouTubeSection = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchYouTubeVideos();
  }, []);

  const fetchYouTubeVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching YouTube videos:', error);
        return;
      }

      setVideos(data as YouTubeVideo[]);
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration: string | null) => {
    if (!duration) return '';
    // Convert ISO 8601 duration to readable format
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count: number | null) => {
    if (!count) return '0 views';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
    return `${count} views`;
  };

  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <section className="py-24 px-4 bg-gradient-to-br from-background via-background/50 to-primary/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Latest YouTube Videos</h2>
          <p className="text-muted-foreground">Loading videos...</p>
        </div>
      </section>
    );
  }

  const featuredVideo = videos[0];
  const otherVideos = videos.slice(1);

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-background via-background/50 to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full animate-float"></div>
        <div className="absolute top-1/2 -right-16 w-32 h-32 bg-primary/10 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-primary/5 rounded-full animate-float"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Latest YouTube Videos
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Watch our latest episodes and interviews with overseas Filipino workers sharing their stories, experiences, and insights.
          </p>
        </div>

        {featuredVideo && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Featured Video</h3>
            <Card className="overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 bg-gradient-to-br from-card via-card to-card/90 border-primary/20">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative group">
                  <img
                    src={featuredVideo.thumbnail_url || '/placeholder.svg'}
                    alt={featuredVideo.title}
                    className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-6 shadow-2xl hover:scale-110 transition-all duration-300"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${featuredVideo.video_id}`, '_blank')}
                    >
                      <Play className="w-8 h-8 ml-1" fill="currentColor" />
                    </Button>
                  </div>
                  {featuredVideo.duration && (
                    <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(featuredVideo.duration)}
                    </div>
                  )}
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    {formatPublishedDate(featuredVideo.published_at)}
                    {featuredVideo.view_count && (
                      <span className="ml-4">{formatViewCount(featuredVideo.view_count)}</span>
                    )}
                  </div>
                  <h4 className="text-2xl font-bold mb-4 line-clamp-2">{featuredVideo.title}</h4>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredVideo.description || 'Watch this episode on YouTube.'}
                  </p>
                  <Button 
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${featuredVideo.video_id}`, '_blank')}
                    className="bg-red-600 hover:bg-red-700 text-white w-fit"
                  >
                    <Youtube className="w-4 h-4 mr-2" />
                    Watch on YouTube
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {otherVideos.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-8 text-center">More Videos</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-card to-card/90 border-primary/10">
                  <div className="relative">
                    <img
                      src={video.thumbnail_url || '/placeholder.svg'}
                      alt={video.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3"
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${video.video_id}`, '_blank')}
                      >
                        <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                      </Button>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                        {formatDuration(video.duration)}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3 h-3" />
                      {formatPublishedDate(video.published_at)}
                    </div>
                    <h4 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {video.description || 'Watch this episode on YouTube.'}
                    </p>
                    <div className="flex items-center justify-between">
                      {video.view_count && (
                        <span className="text-xs text-muted-foreground">
                          {formatViewCount(video.view_count)}
                        </span>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${video.video_id}`, '_blank')}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Watch
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-16">
          <Button
            size="lg"
            onClick={() => window.open('https://youtube.com/@diaryofanofw', '_blank')}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Youtube className="w-5 h-5 mr-2" />
            Visit Our YouTube Channel
          </Button>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;