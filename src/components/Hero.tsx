import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import heroImage from "@/assets/ofw-hero.jpg";

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Full Screen Hero Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="OFW Community"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
  <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-4 py-16 sm:py-20 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className={`space-y-6 sm:space-y-8 ${isMobile ? 'max-w-sm' : 'max-w-4xl'}`}>
            <div className="space-y-3 sm:space-y-4">
              <div className={`inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground rounded-full font-medium ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}>
                <Heart className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                ito ang kwento nyo
              </div>
              <h1 className={`font-extrabold text-white leading-[0.95] tracking-tight ${isMobile ? 'text-5xl' : 'text-7xl lg:text-[7rem]'}`}> 
                <span className="text-white">Diary</span>{' '}
                <span className="text-white">of an</span>
                <span className="block text-white mt-2">
                  OFW
                </span>
              </h1>
              <p className={`text-white/95 mx-auto leading-relaxed font-medium ${isMobile ? 'text-lg max-w-sm' : 'text-2xl lg:text-3xl max-w-3xl'}`} style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.5)' }}> 
                Share your journey, connect with fellow Filipinos abroad, and inspire others with your stories of courage, sacrifice, and triumph.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 justify-center">
              <Button
                size={isMobile ? "default" : "lg"}
                className={`rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105 ${isMobile ? 'text-sm px-6 py-4 w-full' : 'text-lg px-8 py-6'}`}
                onClick={() => window.open('https://www.youtube.com/@diaryofanofw?si=kQW85veqiwAgd7cn', '_blank')}
              >
                Watch Our Latest Episode
                <ArrowRight className={`ml-2 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
              </Button>
              <Button
                size={isMobile ? "default" : "lg"}
                className={`rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-105 ${isMobile ? 'text-sm px-6 py-4 w-full' : 'text-lg px-8 py-6'}`}
                onClick={() => { window.location.href = '/connect'; }}
              >
                <Users className={`mr-2 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
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
}

export default Hero;
