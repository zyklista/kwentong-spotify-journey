import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  return <header className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border/50 z-50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and Tagline */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-soft overflow-hidden">
              <img 
                src="/lovable-uploads/0965794f-f490-4dee-8031-bbad64aaa5a1.png" 
                alt="Diary of an OFW Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className={`font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ${isMobile ? 'text-lg' : 'text-xl'}`}>
                DIARY OF AN OFW
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Ito ang kwento nyo</p>
            </div>
          </Link>
          
          {/* Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={isMobile ? "sm" : "icon"} className="h-10 w-10">
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-background/95 backdrop-blur-md border border-border z-[60]"
            >
              <DropdownMenuItem asChild>
                <Link to="/our-story">OUR STORY</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://youtube.com/@diaryofanofw" target="_blank" rel="noopener noreferrer">
                  INTERVIEWS
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://www.facebook.com/groups/filipinoinjihlava/" target="_blank" rel="noopener noreferrer">
                  COMMUNITY
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://dmw.gov.ph" target="_blank" rel="noopener noreferrer">
                  HELPFUL LINKS
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/blog">BLOG POSTS</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/connect">CONNECT</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>;
};
export default Header;