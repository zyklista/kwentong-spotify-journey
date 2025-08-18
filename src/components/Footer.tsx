import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
  return <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Connect With Us</h3>
          <p className="text-muted-foreground">Follow our journey and stay updated with the latest OFW stories</p>
        </div>

        {/* Social Media Icons - ENLARGED as requested */}
        <div className="flex justify-center gap-6 mb-8">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => window.open('https://facebook.com', '_blank')}
            className="text-foreground hover:text-blue-600 p-4"
          >
            <Facebook className="w-8 h-8" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => window.open('https://www.tiktok.com/@diary.of.an.ofw?_d=secCgYIASAHKAESPgo8KKVOzdq2py0hfcUqO2sexYFw6EoTmdxiFZQGAY9tWF7clcEyXn26SmkqAjAugeL5cYm2b899gd0gE1uGGgA%3D&_r=1&object_id=7538904547453666326&page_open_method=scan_code&schema_type=4&sec_uid=MS4wLjABAAAAnPvzQsX7aytEyivTZDuLfxhzaxMMWayczr3M5NA42q96wJKFZy28hrzTvtSjvSZB&share_app_id=1180&share_author_id=7538904547453666326&share_uid=7538904547453666326&tt_from=scan_code&utm_campaign=client_scan_code&utm_medium=2&utm_source=scan_code', '_blank')}
            className="text-foreground hover:text-primary p-4"
          >
            <FaTiktok className="w-8 h-8" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => window.open('https://youtube.com/@diaryofanofw?si=kQW85veqiwAgd7cn', '_blank')}
            className="text-foreground hover:text-red-600 p-4"
          >
            <Youtube className="w-8 h-8" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => window.open('https://instagram.com', '_blank')}
            className="text-foreground hover:text-pink-600 p-4"
          >
            <Instagram className="w-8 h-8" />
          </Button>
        </div>

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