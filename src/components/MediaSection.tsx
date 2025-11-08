import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock } from "lucide-react";
import { FaYoutube, FaSpotify } from "react-icons/fa";
import { useEffect, useState } from "react";
import ofwHeroPhoto from '@/assets/ofw-hero-photo.jpg';
// Replace with your YouTube Data API key and channel ID
const YOUTUBE_API_KEY = "AIzaSyC5UC4kcPjIcJMR4wgr4MN100zmhEKti30";
const CHANNEL_ID = "UCANMUQ39X4PcnUENrxFocbw";

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
    // Removed triggerMediaSync
  }, []);

  const fetchYouTubeVideos = async () => {
    try {
      // Step 1: Get video IDs from search
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=20`
      );
      const searchData = await searchRes.json();
      const videoIds = searchData.items
        .filter(item => item.id.kind === "youtube#video")
        .map(item => item.id.videoId)
        .join(",");

      if (!videoIds) {
        setYoutubeVideos([]);
        setLatestVideo(null);
        setLoadingYT(false);
        return;
      }

      // Step 2: Get video details (including duration)
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,contentDetails`
      );
      const videosData = await videosRes.json();

      // Step 3: Filter videos by duration
      const minSeconds = 300; // 5 minutes
      const parseDuration = (iso) => {
        const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = parseInt(match?.[1] || 0);
        const minutes = parseInt(match?.[2] || 0);
        const seconds = parseInt(match?.[3] || 0);
        return hours * 3600 + minutes * 60 + seconds;
      };

      const videos = videosData.items
        .filter(item => parseDuration(item.contentDetails.duration) >= minSeconds)
        .map(item => ({
          id: item.id,
          title: item.snippet.title,
          description: (() => {
            const desc = item.snippet.description.trim();
            const match = desc.match(/^(.*?\.)\s/);
            if (match) return match[1];
            const firstPeriod = desc.indexOf('.');
            if (firstPeriod !== -1) return desc.slice(0, firstPeriod + 1);
            return desc;
          })(),
          thumbnail_url: item.snippet.thumbnails.high.url,
          published_at: item.snippet.publishedAt,
          duration: item.contentDetails.duration,
        }));

      setYoutubeVideos(videos);
      setLatestVideo(videos[0] || null);
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
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
  <section className="bg-white py-20 relative overflow-hidden">
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

            {/* Add space between notes and image */}
            <div className="mb-8" />


          {/* YouTube Videos Section */}
          {/* OFW-themed hero photo */}
          <div className="w-full mb-8">
            <img 
              src={ofwHeroPhoto} 
              alt="OFW Hero" 
              className="rounded-xl shadow-xl w-full h-64 sm:h-96 object-cover border border-gray-200 bg-white" 
              style={{ display: 'block', width: '100%' }} 
            />
          </div>
          <div className="mb-12 text-left mt-10">
            <h2 className="text-2xl lg:text-3xl font-extrabold mb-4 text-gray-800 mt-16">
              Most Popular Videos
            </h2>
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
                      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{video.title}</h3>
                      <p className="text-lg text-muted-foreground mb-4">{video.description?.split('. ')[0] + (video.description?.includes('.') ? '.' : '')}</p>
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
