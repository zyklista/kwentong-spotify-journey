import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const HandlingHomesickness = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <article className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            
            <header className="mb-12">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Handling Homesickness and Loneliness</h1>
              <div className="text-muted-foreground mb-6">
                <time>March 10, 2024</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Practical strategies to cope with emotional challenges of working abroad.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                💔 Homesickness is one of the most common challenges faced by OFWs. The longing for home, family, and familiar surroundings can be overwhelming, especially during your first few months abroad. Remember, these feelings are completely normal and part of the adjustment process.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Understanding Homesickness</h2>
              <p>
                🏠 Homesickness isn't just missing your physical home - it's missing the sense of belonging, comfort, and identity that comes with being in familiar surroundings. It can manifest as sadness, anxiety, difficulty sleeping, or loss of appetite.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Immediate Coping Strategies</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Stay connected daily:</strong> Schedule regular video calls with family</li>
                <li><strong>Create a comfort corner:</strong> Set up a space with photos and items from home</li>
                <li><strong>Cook Filipino food:</strong> Familiar tastes can provide emotional comfort</li>
                <li><strong>Find Filipino communities:</strong> Connect with fellow OFWs in your area</li>
                <li><strong>Maintain routines:</strong> Keep some of your home habits and traditions</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Building New Connections</h2>
              <p>
                🤝 While maintaining connections with home is important, building new relationships in your host country is equally crucial. Join local Filipino organizations, attend community events, or participate in workplace social activities.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">When to Seek Help</h2>
              <p>
                ⚠️ If homesickness persists and significantly affects your daily life, work performance, or mental health, don't hesitate to seek professional help. Many countries offer counseling services for expatriate workers.
              </p>
              
              <p>
                🌟 Remember, homesickness often lessens with time as you adapt to your new environment. Be patient with yourself and celebrate small victories in your adjustment journey.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default HandlingHomesickness;