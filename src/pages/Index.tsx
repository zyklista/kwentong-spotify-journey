
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MediaSection from "@/components/MediaSection";
import ContactFormUI from "@/components/ContactFormUI";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";
import EbookPopup from "@/components/EbookPopup";
import ChatBot from "@/components/ChatBot";


import GDPRPolicy from "@/components/GDPRPolicy";
import CookieConsent from "@/components/CookieConsent";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <MediaSection />
  <ContactFormUI endpoint="https://your-project.supabase.co/functions/v1/contact-form" />
        <ReviewsSection />
      </main>
      <GDPRPolicy />
      <Footer />
      <EbookPopup />
      <ChatBot />
      <CookieConsent />
    </div>
  );
};

export default Index;
