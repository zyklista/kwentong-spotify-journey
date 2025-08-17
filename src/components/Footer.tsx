import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* EXTRA LARGE COLORFUL SOCIAL ICONS */}
        <div className="flex justify-center items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-20 h-20 hover:bg-blue-500/20 hover:text-blue-500 text-blue-600 transition-all duration-300 hover:scale-110"
            aria-label="Facebook"
            onClick={() => window.open('https://www.facebook.com/diaryofanofw', '_blank')}
          >
            <Facebook className="w-12 h-12" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-20 h-20 hover:bg-sky-500/20 hover:text-sky-500 text-sky-600 transition-all duration-300 hover:scale-110"
            aria-label="Twitter"
          >
            <Twitter className="w-12 h-12" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-20 h-20 hover:bg-pink-500/20 hover:text-pink-500 text-pink-600 transition-all duration-300 hover:scale-110"
            aria-label="Instagram"
            onClick={() => window.open('https://instagram.com/diary_of_an_ofw', '_blank')}
          >
            <Instagram className="w-12 h-12" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-20 h-20 hover:bg-red-500/20 hover:text-red-500 text-red-600 transition-all duration-300 hover:scale-110"
            aria-label="YouTube"
            onClick={() => window.open('https://youtube.com/@diaryofanofw?si=kQW85veqiwAgd7cn', '_blank')}
          >
            <Youtube className="w-12 h-12" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;