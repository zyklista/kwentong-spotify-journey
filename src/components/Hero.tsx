import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users } from "lucide-react";
import heroImage from "@/assets/ofw-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[140vh] overflow-hidden">
      {/* Full Screen Hero Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="OFW Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-glow/70 to-accent/80" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="space-y-8 max-w-4xl">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium">
                <Heart className="w-4 h-4" />
                ito ang kwento nyo
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-primary-foreground leading-tight">
                Diary of an
                <span className="block bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  OFW
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
                Share your journey, connect with fellow Filipinos abroad, and inspire others with your stories of courage, sacrifice, and triumph.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105"
                onClick={() => window.open('https://youtube.com/@diaryofanofw?si=kQW85veqiwAgd7cn', '_blank')}
              >
                Watch Our Latest Episode
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-full bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-all duration-300"
                onClick={() => window.open('https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty', '_blank')}
              >
                <Users className="mr-2 w-5 h-5" />
                Listen to Our New Episode
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Down Arrow */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>

        {/* Who We Are Section - Below Scroll */}
        <div className="absolute bottom-[-120px] left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Diary of an OFW is dedicated to capturing the raw, unfiltered journeys of Overseas Filipino Workers across the globe. We shine a light on the extraordinary achievements and untold stories of Filipinos who have carved out greatness far from home.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Through intimate conversations with notable individuals—especially those thriving in foreign lands—we uncover hidden truths, life-changing lessons, and meaningful insights.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                Our mission is to inspire, uplift, and empower our audience to live with greater joy, purpose, and fulfillment by sharing the voices and victories of the global Filipino community.
              </p>
              
              {/* Latest Episodes Links */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:scale-105"
                  onClick={() => window.open('https://youtube.com/@diaryofanofw?si=kQW85veqiwAgd7cn', '_blank')}
                >
                  Watch Our Latest Episodes in YT
                </Button>
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105"
                  onClick={() => window.open('https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty', '_blank')}
                >
                  Listen to Our Latest Episodes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;