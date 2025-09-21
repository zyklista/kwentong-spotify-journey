
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MediaSection from "@/components/MediaSection";
import SpotifySection from "@/components/SpotifySection";
import ContactFormUI from "@/components/ContactFormUI";
import ReviewsSection from "@/components/ReviewsSection";
import SocialSection from "@/components/SocialSection";
import Footer from "@/components/Footer";
import EbookPopup from "@/components/EbookPopup";
import ChatBot from "@/components/ChatBot";
import GDPRPolicy from "@/components/GDPRPolicy";
import CookieConsent from "@/components/CookieConsent";
import MediaSyncTrigger from "@/components/MediaSyncTrigger";

const Index = () => {
  return (
  <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      <Header />
      <main>
  <Hero />
  <MediaSection />

  <SocialSection />
  <ContactFormUI endpoint="https://your-project.supabase.co/functions/v1/contact-form" />
  <ReviewsSection />
      </main>
      <Footer />
      <div className="fixed bottom-2 left-2 text-[10px] text-muted-foreground flex gap-3 z-50">
        <a href="/terms" className="hover:underline">Terms & Conditions</a>
        <a href="/privacy" className="hover:underline">Privacy Policy</a>
        <a href="/cookie" className="hover:underline">Cookie Policy</a>
      </div>
      <EbookPopup />
      <ChatBot />
      <CookieConsent />
      <MediaSyncTrigger />
    </div>
  );
};

export default Index;
