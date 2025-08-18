import { Button } from "@/components/ui/button";
import { BookOpen, Menu, Search, User, Globe, PenTool } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FaTiktok } from "react-icons/fa";
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
          
          {/* TikTok Icon */}
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => window.open('https://www.tiktok.com/@diary.of.an.ofw?_d=secCgYIASAHKAESPgo8KKVOzdq2py0hfcUqO2sexYFw6EoTmdxiFZQGAY9tWF7clcEyXn26SmkqAjAugeL5cYm2b899gd0gE1uGGgA%3D&_r=1&object_id=7538904547453666326&page_open_method=scan_code&schema_type=4&sec_uid=MS4wLjABAAAAnPvzQsX7aytEyivTZDuLfxhzaxMMWayczr3M5NA42q96wJKFZy28hrzTvtSjvSZB&share_app_id=1180&share_author_id=7538904547453666326&share_uid=7538904547453666326&tt_from=scan_code&utm_campaign=client_scan_code&utm_medium=2&utm_source=scan_code', '_blank')}
            className="text-foreground hover:text-primary"
          >
            <FaTiktok className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>;
};
export default Header;