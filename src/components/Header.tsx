import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  return <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border/50 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Tagline */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-soft overflow-hidden">
              <img 
                src="/lovable-uploads/0965794f-f490-4dee-8031-bbad64aaa5a1.png" 
                alt="Diary of an OFW Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                DIARY OF AN OFW
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Ito ang kwento nyo</p>
            </div>
          </Link>
          
          {/* Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/our-story">OUR STORY</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://www.facebook.com/diaryofanOFWofficial" target="_blank" rel="noopener noreferrer">
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