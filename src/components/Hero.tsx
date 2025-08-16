import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users } from "lucide-react";
import heroImage from "@/assets/ofw-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
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
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Watch Our Latest Episode
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-full bg-yellow-500 text-black hover:bg-yellow-600 hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Users className="mr-2 w-5 h-5" />
                Share Your Story
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
      </div>
    </section>
  );
};

export default Hero;