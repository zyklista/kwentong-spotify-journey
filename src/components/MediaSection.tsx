import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock, ExternalLink, Youtube } from "lucide-react";
import podcastMic from "@/assets/3d-podcast-mic.jpg";
import geometricBg from "@/assets/3d-geometric-bg.jpg";
const MediaSection = () => {
  const episodes = [{
    id: 1,
    title: "Journey to Success: From OFW to Entrepreneur",
    description: "A heartfelt conversation about building a business while working abroad and supporting family back home.",
    duration: "45 min",
    date: "Dec 15, 2024",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    spotifyUrl: "https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty"
  }, {
    id: 2,
    title: "Mental Health Abroad: Staying Strong",
    description: "Important discussion about maintaining mental wellness while being away from loved ones.",
    duration: "38 min",
    date: "Dec 8, 2024",
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    spotifyUrl: "https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty"
  }, {
    id: 3,
    title: "Family Bonds: Keeping Close Despite Distance",
    description: "Touching stories about maintaining family relationships across continents and time zones.",
    duration: "52 min",
    date: "Dec 1, 2024",
    thumbnail: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop",
    spotifyUrl: "https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty"
  }, {
    id: 4,
    title: "Career Growth: Building Skills Overseas",
    description: "How OFWs develop professionally while working in foreign countries and cultures.",
    duration: "41 min",
    date: "Nov 24, 2024",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
    spotifyUrl: "https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty"
  }];
  return <section className="py-20 relative overflow-hidden">
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
            <Button onClick={() => window.open('https://youtube.com/@diaryofanofw?si=kQW85veqiwAgd7cn', '_blank')} size="lg" className="px-8 py-6 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:scale-105 text-lg">
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

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="flex justify-center relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 opacity-30">
                <img src={podcastMic} alt="3D Podcast Mic" className="w-full h-full object-cover rounded-lg" />
              </div>
              <iframe 
                src="https://creators.spotify.com/pod/profile/diaryofanofw/embed/episodes/How-to-apply-an-employee-card-e2nm042/a-abgfv4a" 
                height="102px" 
                width="400px" 
                frameBorder="0" 
                scrolling="no"
                className="rounded-lg relative z-10"
              ></iframe>
            </div>
            <div className="flex justify-center relative">
              <div className="absolute -top-4 -right-4 w-20 h-20 opacity-30">
                <img src={geometricBg} alt="3D Geometric Background" className="w-full h-full object-cover rounded-lg" />
              </div>
              <iframe 
                src="https://creators.spotify.com/pod/profile/diaryofanofw/embed/episodes/Tips-para-hindi-ka-mascam-sa-pag-aaply-e2nf4ca/a-abg8p43" 
                height="102px" 
                width="400px" 
                frameBorder="0" 
                scrolling="no"
                className="rounded-lg relative z-10"
              ></iframe>
            </div>
            <div className="flex justify-center relative">
              <div className="absolute -bottom-4 -left-4 w-20 h-20 opacity-30">
                <img src={geometricBg} alt="3D Geometric Background" className="w-full h-full object-cover rounded-lg" />
              </div>
              <iframe 
                src="https://creators.spotify.com/pod/profile/diaryofanofw/embed/episodes/Salary-reveal-sa-Czech-e2n8hb4/a-abfvdc3" 
                height="102px" 
                width="400px" 
                frameBorder="0" 
                scrolling="no"
                className="rounded-lg relative z-10"
              ></iframe>
            </div>
            <div className="flex justify-center relative">
              <div className="absolute -bottom-4 -right-4 w-20 h-20 opacity-30">
                <img src={podcastMic} alt="3D Podcast Mic" className="w-full h-full object-cover rounded-lg" />
              </div>
              <iframe 
                src="https://creators.spotify.com/pod/profile/diaryofanofw/embed/episodes/Pwede-ba-magpart-time-sa-Czech-e2nj38u/a-abgcea1" 
                height="102px" 
                width="400px" 
                frameBorder="0" 
                scrolling="no"
                className="rounded-lg relative z-10"
              ></iframe>
            </div>
          </div>

          <div className="text-center">
            <Button onClick={() => window.open('https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty', '_blank')} size="lg" className="px-8 py-6 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105">
              <Play className="mr-2 w-5 h-5" />
              View All Episodes on Spotify
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default MediaSection;