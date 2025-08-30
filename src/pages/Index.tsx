import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MediaSection from "@/components/MediaSection";
import YouTubeSection from "@/components/YouTubeSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import EbookPopup from "@/components/EbookPopup";
import ChatBot from "@/components/ChatBot";
import MediaSyncTrigger from "@/components/MediaSyncTrigger";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <MediaSection />
        <YouTubeSection />
        <ContactForm />
      </main>
      <Footer />
      <EbookPopup />
      <ChatBot />
      <MediaSyncTrigger />
    </div>
  );
};

export default Index;
