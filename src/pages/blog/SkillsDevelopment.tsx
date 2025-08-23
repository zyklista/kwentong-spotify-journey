import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import skillsImage from "@/assets/blog/skills-development.jpg";

const SkillsDevelopment = () => {
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
                src={skillsImage} 
                alt="Skills Development for OFWs" 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Skills Development Abroad
              </h1>
              <div className="text-muted-foreground mb-6">
                <time>February 28, 2024</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                How to enhance your skills and advance your career while working overseas.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                📚 Working abroad presents unique opportunities for personal and professional growth. The key to maximizing your OFW experience is continuous learning and skill development. Whether you are in healthcare, engineering, hospitality, or any other field, investing in yourself pays the highest dividends.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Language Learning: Your Greatest Asset</h2>
              <p>
                🗣️ <strong>Master the local language.</strong> Nothing opens doors faster than being able to communicate effectively in your host country's language. Even basic conversational skills can dramatically improve your job prospects and social integration.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Use language learning apps like Duolingo or Babbel during your commute</li>
                <li>Join local language exchange programs</li>
                <li>Watch local TV shows and news with subtitles</li>
                <li>Practice with colleagues and neighbors</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Technical Skills Upgrade</h2>
              <p>
                💻 <strong>Stay current with technology.</strong> The digital landscape evolves rapidly, and staying updated with the latest tools and technologies in your field is crucial for career advancement.
              </p>
              
              <p>
                <strong>Popular skill development platforms:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Coursera - University-level courses</li>
                <li>LinkedIn Learning - Professional development</li>
                <li>Udemy - Practical skills training</li>
                <li>Khan Academy - Free educational content</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Professional Certifications</h2>
              <p>
                🏆 <strong>Invest in credentials that matter.</strong> Professional certifications can significantly boost your earning potential and job security. Many employers abroad value certified professionals.
              </p>
              
              <p>
                <strong>High-value certifications by field:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>IT:</strong> AWS, Google Cloud, Microsoft Azure, Cisco</li>
                <li><strong>Healthcare:</strong> BLS, ACLS, specialized nursing certifications</li>
                <li><strong>Business:</strong> PMP, Six Sigma, Digital Marketing</li>
                <li><strong>Hospitality:</strong> Food safety, wine sommelier, hotel management</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Networking and Soft Skills</h2>
              <p>
                🤝 <strong>Build meaningful professional relationships.</strong> Your network is your net worth, especially when working abroad. Developing strong communication and leadership skills opens doors to better opportunities.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Financial Literacy</h2>
              <p>
                💰 <strong>Understand money management in multiple currencies.</strong> Learn about investments, taxes, and financial planning in both your host country and the Philippines. This knowledge will serve you throughout your career.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Creating Your Learning Schedule</h2>
              <p>
                ⏰ <strong>Make learning a habit:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dedicate 30 minutes daily to skill development</li>
                <li>Use weekends for longer courses or practice sessions</li>
                <li>Set monthly learning goals</li>
                <li>Track your progress and celebrate milestones</li>
              </ul>
              
              <p>
                🎯 Remember: The skills you develop today determine your opportunities tomorrow. Your time abroad is an investment in your future - make it count by continuously growing and learning!
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default SkillsDevelopment;