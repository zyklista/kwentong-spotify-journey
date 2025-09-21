import React from "react";
import { FaYoutube } from "react-icons/fa";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { FaSpotify } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

const socialLinks = [
  { name: "Facebook", url: "https://www.facebook.com/diaryofanOFWofficial", icon: <Facebook /> },
  { name: "Instagram", url: "https://instagram.com/diary_of_an_ofw", icon: <Instagram /> },
  { name: "YouTube", url: "https://www.youtube.com/@diaryofanofw", icon: <FaYoutube /> },
  { name: "Spotify", url: "https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty", icon: <FaSpotify /> },
  { name: "TikTok", url: "https://www.tiktok.com/@diary.of.an.ofw?_d=secCgYIASAHKAESPgo8KKVOzdq2py0hfcUqO2sexYFw6EoTmdxiFZQGAY9tWF7clcEyXn26SmkqAjAugeL5cYm2b899gd0gE1uGGgA%3D&_r=1&object_id=7538904547453666326&page_open_method=scan_code&schema_type=4&sec_uid=MS4wLjABAAAAnPvzQsX7aytEyivTZDuLfxhzaxMMWayczr3M5NA42q96wJKFZy28hrzTvtSjvSZB&share_app_id=1180&share_author_id=7538904547453666326&share_uid=7538904547453666326&tt_from=scan_code&utm_campaign=client_scan_code&utm_medium=2&utm_source=scan_code", icon: <FaTiktok /> },
];

const SocialSection = () => (
  <section className="bg-gradient-to-b from-secondary/50 to-background/90 py-12 relative overflow-hidden">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Subscribe to your favorite platform</h2>
      <p className="text-lg text-gray-700 mb-8">Follow us and stay updated with the latest stories, news, and events for OFWs worldwide.</p>
      <div className="flex justify-center gap-8 flex-wrap mb-6">
        {socialLinks.map(link => (
          <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition text-lg">
            {React.cloneElement(link.icon, {
              className: "w-14 h-14 drop-shadow-2xl bg-white p-2 rounded-full border-2",
              style:
                link.name === "YouTube"
                  ? { borderColor: '#ff0000', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))' }
                  : link.name === "Spotify"
                  ? { borderColor: '#1db954', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))' }
                  : link.name === "Facebook"
                  ? { borderColor: '#1877f3', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))' }
                  : link.name === "Instagram"
                  ? { borderColor: '#e1306c', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))' }
                  : link.name === "TikTok"
                  ? { borderColor: '#000', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))' }
                  : {}
            })}
            <span>{link.name}</span>
          </a>
        ))}
      </div>
      {/* Website display removed as requested */}
    </div>
  </section>
);

export default SocialSection;
