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
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
          {/* Logo and Tagline */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-soft overflow-hidden">
              <img
                src="/lovable-uploads/0965794f-f490-4dee-8031-bbad64aaa5a1.png"
                alt="Diary of an OFW Logo"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div>
              <h1 className={`font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ${isMobile ? 'text-sm' : 'text-lg lg:text-xl'} leading-tight`}>
                DIARY OF AN OFW
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">ito ang kwento nyo</p>
            </div>
          </Link>

          {/* Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "icon"}
                className="h-8 w-8 sm:h-10 sm:w-10 hover:scale-105 transition-transform"
                aria-label="Open menu"
              >
                <Menu className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 sm:w-56 bg-background/95 backdrop-blur-md border border-border z-[60] shadow-lg"
            >
              <DropdownMenuItem asChild>
                <Link to="/" className="w-full">HOME</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/our-story" className="w-full">OUR STORY</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://youtube.com/@diaryofanofw" target="_blank" rel="noopener noreferrer" className="w-full">
                  INTERVIEWS
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://www.facebook.com/groups/filipinoinjihlava/" target="_blank" rel="noopener noreferrer" className="w-full">
                  COMMUNITY
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://dmw.gov.ph" target="_blank" rel="noopener noreferrer" className="w-full">
                  HELPFUL LINKS
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/blog" className="w-full">BLOG POSTS</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/connect" className="w-full">CONNECT</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>;
};
export default Header;