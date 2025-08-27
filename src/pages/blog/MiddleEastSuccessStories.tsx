import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const MiddleEastSuccessStories = () => {
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
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">OFW Success Stories from the Middle East</h1>
              <div className="text-muted-foreground mb-6">
                <time>December 30, 2023</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Inspiring journeys of Filipino workers in Gulf countries.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                🏜️ The Middle East has been home to millions of Filipino workers for decades. From humble beginnings as domestic workers and laborers, many OFWs have risen to become successful entrepreneurs, professionals, and community leaders in the Gulf region.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">From Maid to Manager: Luz's Story</h2>
              <p>
                👩‍💼 <strong>Luz</strong> arrived in Dubai in 2005 as a domestic helper. Through determination and continuous learning, she worked her way up to become a household manager for a prominent family, now overseeing a staff of 12 and earning a salary that allowed her to buy properties in the Philippines.
              </p>
              
              <p>
                "I never stopped learning," Luz shares. "I took online courses in household management, learned Arabic, and always went above and beyond what was expected of me."
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">The Construction Success Story</h2>
              <p>
                🏗️ <strong>Roberto</strong> started as a construction worker in Qatar in 2010. Today, he owns a construction company with 50 Filipino employees. His secret? He saved aggressively for five years, learned the local regulations, and built strong relationships with Qatari partners.
              </p>
              
              <p>
                "The Middle East rewards hard work and expertise," Roberto explains. "I saw an opportunity in the construction boom and took calculated risks to establish my own business."
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Healthcare Excellence in Saudi Arabia</h2>
              <p>
                🏥 <strong>Dr. Carmen</strong> moved to Riyadh as a nurse in 2008. Through sponsored education programs, she became a nurse practitioner and now leads a team of healthcare professionals at one of Saudi Arabia's leading hospitals.
              </p>
              
              <p>
                "Saudi Arabia invested in my education, and I gave my best in return," Dr. Carmen says. "The healthcare system here values competence and dedication."
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Key Success Factors in the Middle East</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cultural Respect:</strong> Understanding and respecting local customs</li>
                <li><strong>Professional Excellence:</strong> Consistently delivering high-quality work</li>
                <li><strong>Language Skills:</strong> Learning Arabic opens many doors</li>
                <li><strong>Networking:</strong> Building relationships with locals and expatriates</li>
                <li><strong>Financial Discipline:</strong> Saving and investing wisely</li>
                <li><strong>Continuous Learning:</strong> Upgrading skills and qualifications</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Challenges and How They Overcame Them</h2>
              <p>
                🎯 Common challenges include cultural differences, language barriers, and homesickness. Successful OFWs in the Middle East emphasize the importance of patience, adaptability, and maintaining a positive attitude despite difficulties.
              </p>
              
              <p>
                🌟 These success stories prove that with dedication, respect for local culture, and continuous self-improvement, Filipino workers can thrive and build prosperous careers in the Middle East.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default MiddleEastSuccessStories;