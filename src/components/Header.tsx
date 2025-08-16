import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Tagline */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                OFW Pathfinder
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                ito ang kwento nyo
              </p>
            </div>
          </div>

          {/* Center - Navigation (hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Mga Kwento
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Trabaho
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Tulong
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Komunidad
            </a>
          </nav>

          {/* Right side - Search and CTA (no title) */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="hero" size="sm" className="hidden sm:flex">
              Magbahagi ng Kwento
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;