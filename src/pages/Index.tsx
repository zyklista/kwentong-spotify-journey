import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SpotifySection from "@/components/SpotifySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
        <div className="min-h-screen">
          <Header />
          <HeroSection />
          <SpotifySection />
          <Footer />
        </div>
  );
};

export default Index;
