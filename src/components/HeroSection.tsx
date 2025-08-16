import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              ✨ Bagong mga kwento kada araw
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Mga Kwentong 
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block lg:inline">
                {" "}OFW
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Pakinggan ang mga inspirational na karanasan ng mga Overseas Filipino Workers. 
              Mga kwento ng pagtitiis, tagumpay, at pag-asa na magbibigay inspirasyon sa inyong sariling journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="group">
                <Play className="w-5 h-5 mr-2" />
                Makinig sa mga Kwento
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Magbahagi ng Kwento
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary">12K+</div>
                <div className="text-sm text-muted-foreground">Mga Kwento</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Active OFWs</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Filipino overseas workers sharing their stories"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  variant="hero" 
                  size="icon" 
                  className="w-16 h-16 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
                >
                  <Play className="w-8 h-8" />
                </Button>
              </div>

              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">Now Playing</h4>
                    <p className="text-xs text-muted-foreground">Pamilyang Nagkakapit sa Pagkakamalayo</p>
                  </div>
                  <div className="text-xs text-muted-foreground">12:34</div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;