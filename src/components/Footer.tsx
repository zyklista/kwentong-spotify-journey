import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
const Footer = () => {
  return <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="text-center mb-8">
          
          
        </div>

        {/* Social Media Icons - ENLARGED as requested */}
        

        {/* Copyright */}
        <div className="text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500" /> for the Filipino community worldwide
          </p>
          <p className="text-sm mt-2">© 2024 Diary of an OFW. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;