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
      const {
        data,
        error
      } = await supabase.from('youtube_videos').select('*').order('published_at', {
        ascending: false
      }).limit(6);
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
    return <section className="py-24 px-4 bg-gradient-to-br from-background via-background/50 to-primary/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Latest YouTube Videos</h2>
          <p className="text-muted-foreground">Loading videos...</p>
        </div>
      </section>;
  }
  const featuredVideo = videos[0];
  const otherVideos = videos.slice(1);

  // Featured video (can be hardcoded until database is populated)
  const defaultFeaturedVideo = {
    id: "featured-1",
    video_id: "dQw4w9WgXcQ", // Replace with actual video ID
    title: "Latest OFW Success Story - From Dubai to Dream Career",
    description: "Watch how Maria transformed her career abroad with our guidance and support.",
    thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "PT12M34S",
    view_count: 15000,
    published_at: new Date().toISOString()
  };

  const displayFeaturedVideo = featuredVideo || defaultFeaturedVideo;

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-background via-background/50 to-primary/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Youtube className="w-4 h-4" />
            Latest Videos
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Latest YouTube Videos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay updated with our latest insights, success stories, and expert advice for OFWs worldwide.
          </p>
        </div>

        {/* Featured Video */}
        <div className="mb-12">
          <Card className="overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-500 bg-gradient-to-br from-card to-card/50 border-primary/20">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Video Thumbnail */}
              <div className="relative group">
                <img 
                  src={displayFeaturedVideo.thumbnail_url || "/placeholder.svg"} 
                  alt={displayFeaturedVideo.title}
                  className="w-full h-64 lg:h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-primary/90 hover:bg-primary text-primary-foreground rounded-full p-6 transform group-hover:scale-110 transition-all duration-300"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${displayFeaturedVideo.video_id}`, '_blank')}
                  >
                    <Play className="w-8 h-8" />
                  </Button>
                </div>
                {displayFeaturedVideo.duration && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(displayFeaturedVideo.duration)}
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-8">
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                    <Calendar className="w-4 h-4" />
                    {formatPublishedDate(displayFeaturedVideo.published_at)}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 leading-tight">
                  {displayFeaturedVideo.title}
                </h3>
                {displayFeaturedVideo.description && (
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {displayFeaturedVideo.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <span>{formatViewCount(displayFeaturedVideo.view_count)}</span>
                </div>
                <Button 
                  size="lg"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${displayFeaturedVideo.video_id}`, '_blank')}
                  className="w-full lg:w-auto"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Now
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Other Videos Grid */}
        {otherVideos.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {otherVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 group">
                <div className="relative">
                  <img 
                    src={video.thumbnail_url || "/placeholder.svg"} 
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      size="sm"
                      className="bg-primary/90 hover:bg-primary text-primary-foreground rounded-full p-3"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${video.video_id}`, '_blank')}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {formatDuration(video.duration)}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2 leading-tight">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatViewCount(video.view_count)}</span>
                    <span>{formatPublishedDate(video.published_at)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Watch on YouTube Button */}
        <div className="text-center">
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => window.open('https://youtube.com/@YourChannelName', '_blank')}
            className="border-primary/20 hover:bg-primary/10"
          >
            <Youtube className="w-5 h-5 mr-2" />
            Watch on YouTube
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};
export default YouTubeSection;