import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SpotifyEpisodes from "@/components/SpotifyEpisodes";
import ContactForm from "@/components/ContactForm";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <SpotifyEpisodes />
        <ContactForm />
      </main>
    </div>
  );
};

export default Index;
