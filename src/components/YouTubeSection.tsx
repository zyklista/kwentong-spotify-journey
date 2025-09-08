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
    video_id: "dQw4w9WgXcQ",
    // Replace with actual video ID
    title: "Latest OFW Success Story - From Dubai to Dream Career",
    description: "Watch how Maria transformed her career abroad with our guidance and support.",
    thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "PT12M34S",
    view_count: 15000,
    published_at: new Date().toISOString()
  };
  const displayFeaturedVideo = featuredVideo || defaultFeaturedVideo;
  return;
};
export default YouTubeSection;