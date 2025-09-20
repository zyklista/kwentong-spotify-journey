
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactFormUI from "@/components/ContactFormUI";

const Connect = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Connect With Us</h1>
        <ContactFormUI endpoint="https://your-project.supabase.co/functions/v1/contact-form" />
      </main>
      <Footer />
    </div>
  );
};

export default Connect;
