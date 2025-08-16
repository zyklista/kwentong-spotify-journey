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
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              OFW Pathfinder
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Sama-sama nating ibahagi ang mga kwento, karanasan, at pag-asa ng mga Overseas Filipino Workers. 
              Ito ang platform na nagdudugtong sa ating mga pamilya at pangarap.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-primary" />
              <span>Made with love for our kababayans worldwide</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Mga Link</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Mga Kwento
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Job Opportunities
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Tulong at Gabay
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Komunidad
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Makipag-ugnayan</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-sm">info@ofwpathfinder.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-sm">+63 2 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm">Manila, Philippines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Icons - ENLARGED as requested */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">
                © 2024 OFW Pathfinder. Lahat ng karapatan ay nakalaan.
              </p>
            </div>
            
            {/* ENLARGED SOCIAL ICONS */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;