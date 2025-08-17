import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
      </main>
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
