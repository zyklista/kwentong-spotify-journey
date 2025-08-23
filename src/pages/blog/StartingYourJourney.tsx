import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const StartingYourJourney = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <article className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            
            <header className="mb-12">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Starting Your Journey as an OFW
              </h1>
              <div className="text-muted-foreground mb-6">
                <time>March 15, 2024</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Essential tips and guidance for Filipinos planning to work abroad.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                🌍 Deciding to work abroad is one of the biggest decisions you'll ever make. It's a journey filled with excitement, challenges, and endless opportunities for growth. Whether you're driven by the desire to provide better for your family or seeking personal and professional development, becoming an OFW requires careful planning and preparation.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Before You Leave</h2>
              <p>
                📋 <strong>Documentation is key.</strong> Ensure all your documents are in order: passport, visa, work permits, and any certifications required for your job. Start this process early, as it can take several months to complete all requirements.
              </p>
              
              <p>
                💰 <strong>Financial preparation</strong> is crucial. Save enough money to cover your initial expenses abroad, including accommodation deposits, transportation, and emergency funds. Remember, your first salary might take a few weeks to arrive.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Upon Arrival</h2>
              <p>
                🏠 <strong>Find your community.</strong> Connect with fellow Filipinos in your new country. They can provide invaluable support, share local insights, and help you navigate cultural differences. Many countries have active Filipino communities and associations.
              </p>
              
              <p>
                📱 <strong>Stay connected with home.</strong> Regular communication with your family helps maintain strong relationships and provides emotional support during challenging times. Set up reliable internet and communication apps before you leave the Philippines.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Building Your Success</h2>
              <p>
                🎯 <strong>Set clear goals.</strong> Define what success means to you - whether it's financial stability, career advancement, or personal growth. Having clear objectives helps you stay motivated and focused.
              </p>
              
              <p>
                📚 <strong>Invest in yourself.</strong> Take advantage of learning opportunities in your host country. Learn the local language, acquire new skills, and pursue certifications that can advance your career.
              </p>
              
              <p>
                💪 Remember, every successful OFW started where you are now. With determination, preparation, and the right mindset, your journey abroad can be the beginning of an incredible success story. You're not just working overseas - you're building a legacy for yourself and your family.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default StartingYourJourney;