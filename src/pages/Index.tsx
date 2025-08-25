import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MediaSection from "@/components/MediaSection";
import MediaSyncTrigger from "@/components/MediaSyncTrigger";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import EbookPopup from "@/components/EbookPopup";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <MediaSection />
        <ContactForm />
      </main>
      <Footer />
      <MediaSyncTrigger />
      <EbookPopup />
      <ChatBot />
    </div>
  );
};

export default Index;
