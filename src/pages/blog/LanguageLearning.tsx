import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const LanguageLearning = () => {
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
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Language Learning for OFWs</h1>
              <div className="text-muted-foreground mb-6">
                <time>January 5, 2024</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Essential language skills to succeed in your host country.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                🗣️ Learning the local language is one of the most valuable investments you can make as an OFW. It opens doors to better job opportunities, deeper cultural integration, and meaningful relationships with locals.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Why Language Learning Matters</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Career advancement:</strong> Better communication leads to promotions</li>
                <li><strong>Daily life ease:</strong> Shopping, banking, and healthcare become simpler</li>
                <li><strong>Cultural understanding:</strong> Language reflects culture and values</li>
                <li><strong>Emergency situations:</strong> Clear communication can be life-saving</li>
                <li><strong>Building relationships:</strong> Connect with colleagues and neighbors</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Getting Started</h2>
              <p>
                📚 <strong>Before you leave the Philippines:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Download language learning apps (Duolingo, Babbel, Rosetta Stone)</li>
                <li>Watch YouTube videos for pronunciation practice</li>
                <li>Learn basic greetings and essential phrases</li>
                <li>Find online language exchange partners</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Practical Learning Strategies</h2>
              <p>
                🎯 <strong>Immersion techniques:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Change your phone settings:</strong> Use the local language</li>
                <li><strong>Watch local TV shows:</strong> Start with subtitles, then without</li>
                <li><strong>Listen to local radio:</strong> Improve listening comprehension</li>
                <li><strong>Read local newspapers:</strong> Build vocabulary and cultural knowledge</li>
                <li><strong>Practice with coworkers:</strong> Ask them to correct your mistakes</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Workplace Communication</h2>
              <p>
                💼 Focus on job-specific vocabulary first. Learn terms related to your profession, safety procedures, and common workplace interactions. Don't be afraid to ask for clarification when you don't understand something.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Free Learning Resources</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Duolingo:</strong> Free comprehensive language courses</li>
                <li><strong>HelloTalk:</strong> Chat with native speakers</li>
                <li><strong>YouTube:</strong> Free lessons and pronunciation guides</li>
                <li><strong>Local libraries:</strong> Often offer free language classes</li>
                <li><strong>Community centers:</strong> Integration programs for immigrants</li>
              </ul>
              
              <p>
                🌟 Remember, language learning is a marathon, not a sprint. Celebrate small improvements and don't get discouraged by mistakes - they're part of the learning process!
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default LanguageLearning;