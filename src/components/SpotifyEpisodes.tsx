import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock, ExternalLink } from "lucide-react";

const SpotifyEpisodes = () => {
  const episodes = [
    {
      id: 1,
      title: "Journey to Success: From OFW to Entrepreneur",
      description: "A heartfelt conversation about building a business while working abroad and supporting family back home.",
      duration: "45 min",
      date: "Dec 15, 2024",
      thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
      spotifyUrl: "https://spotifycreators-web.app.link/e/qQFi4i31SVb"
    },
    {
      id: 2,
      title: "Mental Health Abroad: Staying Strong",
      description: "Important discussion about maintaining mental wellness while being away from loved ones.",
      duration: "38 min",
      date: "Dec 8, 2024",
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      spotifyUrl: "https://spotifycreators-web.app.link/e/SVISRm31SVb"
    },
    {
      id: 3,
      title: "Family Bonds: Keeping Close Despite Distance",
      description: "Touching stories about maintaining family relationships across continents and time zones.",
      duration: "52 min",
      date: "Dec 1, 2024",
      thumbnail: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop",
      spotifyUrl: "https://spotifycreators-web.app.link/e/at6N6n31SVb"
    },
    {
      id: 4,
      title: "Career Growth: Building Skills Overseas",
      description: "How OFWs develop professionally while working in foreign countries and cultures.",
      duration: "41 min",
      date: "Nov 24, 2024",
      thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
      spotifyUrl: "https://spotifycreators-web.app.link/e/xBLGOp31SVb"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Art Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_hsl(var(--primary))_0%,_transparent_50%)] opacity-5 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_hsl(var(--accent))_0%,_transparent_50%)] opacity-5 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_30%,_hsl(var(--secondary))_50%,_transparent_70%)] opacity-3"></div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-primary">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
          <span className="text-sm font-medium">Scroll Down</span>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 mt-16">
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

          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Latest Spotify Episodes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Listen to our heartfelt conversations with OFWs sharing their incredible journeys, challenges, and triumphs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {episodes.map((episode) => (
              <Card key={episode.id} className="group overflow-hidden border-0 shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-card to-card/50">
                <div className="relative overflow-hidden">
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    Spotify
                  </div>
                  <Button
                    onClick={() => window.open(episode.spotifyUrl, '_blank')}
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground p-0"
                  >
                    <Play className="w-5 h-5 ml-0.5" />
                  </Button>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {episode.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {episode.duration}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {episode.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {episode.description}
                    </p>

                    <Button
                      onClick={() => window.open(episode.spotifyUrl, '_blank')}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground p-0 h-auto font-medium"
                    >
                      Listen on Spotify
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => window.open('https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty', '_blank')}
              size="lg"
              className="px-8 py-6 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-105"
            >
              <Play className="mr-2 w-5 h-5" />
              View All Episodes on Spotify
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpotifyEpisodes;