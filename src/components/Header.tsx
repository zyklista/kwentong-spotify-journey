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

  return <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/60 z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo and Tagline */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
              <img
                src="/lovable-uploads/0965794f-f490-4dee-8031-bbad64aaa5a1.png"
                alt="Diary of an OFW Logo"
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="min-w-0">
              <h1 className={`font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent ${isMobile ? 'text-base' : 'text-xl lg:text-2xl'} leading-tight tracking-tight whitespace-nowrap`}>
                DIARY OF AN OFW
              </h1>
              <p className="text-xs lg:text-sm text-gray-600 hidden sm:block font-medium">ito ang kwento nyo</p>
            </div>
          </Link>

          {/* Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "icon"}
                className="h-8 w-8 sm:h-10 sm:w-10 hover:scale-105 transition-transform bg-white data-[state=open]:bg-white"
                aria-label="Open menu"
              >
                <Menu className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 sm:w-60 bg-white border border-gray-200 z-[60] shadow-xl rounded-xl"
            >
              <DropdownMenuItem asChild>
                <Link to="/" className="w-full text-base font-semibold py-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-colors">HOME</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/our-story" className="w-full text-base font-semibold py-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-colors">OUR STORY</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://youtube.com/@diaryofanofw" target="_blank" rel="noopener noreferrer" className="w-full text-base font-semibold py-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-colors">
                  INTERVIEWS
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://www.facebook.com/groups/filipinoinjihlava/" target="_blank" rel="noopener noreferrer" className="w-full text-base font-semibold py-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-colors">
                  COMMUNITY
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://dmw.gov.ph" target="_blank" rel="noopener noreferrer" className="w-full text-base font-semibold py-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-colors">
                  HELPFUL LINKS
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/blog" className="w-full text-base font-semibold py-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-colors">BLOG POSTS</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/connect" className="w-full text-base font-semibold py-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-colors">CONNECT</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>;
};
export default Header;