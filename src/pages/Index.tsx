import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MediaSection from "@/components/MediaSection";
import EbookOptIn from "@/components/EbookOptIn";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <MediaSection />
        <EbookOptIn />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
