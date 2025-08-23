import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import mentalHealthImage from "@/assets/blog/mental-health.jpg";

const MentalHealth = () => {
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
              <img 
                src={mentalHealthImage} 
                alt="Mental health and wellness for OFWs" 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Mental Health and Wellness
              </h1>
              <div className="text-muted-foreground mb-6">
                <time>January 10, 2024</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Taking care of your emotional and psychological well-being abroad.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                🧠 Mental health is just as important as physical health, especially for OFWs facing unique challenges like separation from family, cultural adjustment, and work stress. Prioritizing your psychological well-being is essential for long-term success.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Common Mental Health Challenges</h2>
              <p>
                😔 <strong>Issues many OFWs experience:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Homesickness and loneliness</li>
                <li>Depression and anxiety</li>
                <li>Cultural adjustment stress</li>
                <li>Financial pressure and guilt</li>
                <li>Relationship strain and family conflicts</li>
                <li>Identity and belonging issues</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Coping Strategies</h2>
              <p>
                🛠️ <strong>Healthy ways to manage stress:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Build strong support networks</li>
                <li>Practice mindfulness and meditation</li>
                <li>Maintain regular exercise routines</li>
                <li>Keep a gratitude journal</li>
                <li>Stay connected with family and friends</li>
                <li>Seek professional help when needed</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">When to Seek Professional Help</h2>
              <p>
                🏥 <strong>Warning signs that require attention:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Persistent sadness or hopelessness</li>
                <li>Loss of interest in activities</li>
                <li>Sleep disturbances or changes in appetite</li>
                <li>Difficulty concentrating or making decisions</li>
                <li>Thoughts of self-harm</li>
                <li>Substance abuse as coping mechanism</li>
              </ul>
              
              <p>
                💚 Remember: Seeking help is a sign of strength, not weakness. Your mental health matters, and support is available both locally and from the Philippines.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default MentalHealth;