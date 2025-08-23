import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import careerImage from "@/assets/blog/career-growth.jpg";

const CareerGrowth = () => {
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
                src={careerImage} 
                alt="Professional career growth for OFWs" 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Career Growth Strategies
              </h1>
              <div className="text-muted-foreground mb-6">
                <time>January 20, 2024</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Advancing your professional career as an overseas Filipino worker.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                📊 Being an OFW does not mean your career has to stagnate. In fact, working abroad offers unique opportunities for professional growth that you might not find in the Philippines. Here is how to strategically advance your career while working overseas.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Setting Clear Career Goals</h2>
              <p>
                🎯 <strong>Define your professional destination:</strong> Without clear goals, it is easy to get stuck in survival mode and miss growth opportunities.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Write down your 5-year and 10-year career vision</li>
                <li>Identify specific skills you need to develop</li>
                <li>Set annual performance and learning targets</li>
                <li>Create timelines for certifications and promotions</li>
                <li>Regularly review and adjust your goals</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Building Professional Relationships</h2>
              <p>
                🤝 <strong>Your network is your net worth:</strong> Strong professional relationships open doors to opportunities.
              </p>
              
              <p>
                <strong>Networking strategies:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Join professional associations in your field</li>
                <li>Attend industry conferences and seminars</li>
                <li>Connect with colleagues on LinkedIn</li>
                <li>Participate in workplace committees and projects</li>
                <li>Mentor newer employees or fellow OFWs</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Continuous Learning and Development</h2>
              <p>
                📚 <strong>Stay relevant in a changing workplace:</strong> The pace of change in most industries requires ongoing education.
              </p>
              
              <p>
                <strong>Learning opportunities:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Employer-sponsored training programs</li>
                <li>Online courses and certifications</li>
                <li>Industry workshops and seminars</li>
                <li>Cross-training in different departments</li>
                <li>Higher education degrees (part-time or online)</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Performance Excellence</h2>
              <p>
                🌟 <strong>Exceed expectations consistently:</strong> Outstanding performance is the foundation of career advancement.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Always deliver high-quality work on time</li>
                <li>Take initiative on projects and improvements</li>
                <li>Volunteer for challenging assignments</li>
                <li>Document your achievements and contributions</li>
                <li>Seek feedback and implement improvements</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Communication and Leadership Skills</h2>
              <p>
                🗣️ <strong>Develop skills that differentiate you:</strong> Technical skills get you hired, but soft skills get you promoted.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Improve your presentation and public speaking abilities</li>
                <li>Learn to facilitate meetings and manage projects</li>
                <li>Develop conflict resolution and negotiation skills</li>
                <li>Practice active listening and emotional intelligence</li>
                <li>Take on team leadership opportunities</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Understanding Organizational Culture</h2>
              <p>
                🏢 <strong>Navigate workplace politics wisely:</strong> Understanding the unwritten rules helps you advance faster.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Learn the formal and informal power structures</li>
                <li>Understand decision-making processes</li>
                <li>Build relationships with key influencers</li>
                <li>Adapt your communication style to the culture</li>
                <li>Show respect for local customs and traditions</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Seeking Promotion Opportunities</h2>
              <p>
                ⬆️ <strong>Be proactive about advancement:</strong> Promotions rarely happen automatically; you need to actively pursue them.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Discuss career goals with your supervisor</li>
                <li>Apply for internal job postings</li>
                <li>Request expanded responsibilities</li>
                <li>Prepare for promotion conversations with evidence</li>
                <li>Consider lateral moves to gain broader experience</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Building Your Personal Brand</h2>
              <p>
                💼 <strong>Become known for excellence:</strong> A strong professional reputation opens doors.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Identify your unique strengths and value proposition</li>
                <li>Consistently deliver on your promises</li>
                <li>Share your expertise through presentations or articles</li>
                <li>Maintain a professional online presence</li>
                <li>Seek opportunities to represent your organization</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Planning Your Next Career Move</h2>
              <p>
                🔄 <strong>Think strategically about career transitions:</strong> Whether staying abroad or returning home, plan your moves carefully.
              </p>
              
              <p>
                <strong>Options to consider:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Promotion within your current organization</li>
                <li>Moving to a different company abroad</li>
                <li>Transferring to your company\'s Philippine operations</li>
                <li>Starting your own business</li>
                <li>Returning to the Philippines with international experience</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Overcoming Career Obstacles</h2>
              <p>
                🚧 <strong>Address common challenges proactively:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Language barriers:</strong> Invest in language improvement</li>
                <li><strong>Cultural differences:</strong> Learn local business customs</li>
                <li><strong>Limited networking:</strong> Make extra effort to build connections</li>
                <li><strong>Skill gaps:</strong> Identify and address through training</li>
                <li><strong>Discrimination:</strong> Focus on performance and build alliances</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Long-term Career Strategy</h2>
              <p>
                🎯 <strong>Think beyond your current role:</strong> Consider how your international experience positions you for future opportunities.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Develop expertise that is valuable in multiple countries</li>
                <li>Build a portfolio of international experiences</li>
                <li>Maintain connections in both your host country and Philippines</li>
                <li>Consider how your experience can benefit Philippine businesses</li>
                <li>Plan for multiple career scenarios and transitions</li>
              </ul>
              
              <p>
                🚀 Your OFW experience is not just a job - it is career capital that can open doors for decades to come. Invest in yourself, build relationships, and never stop growing. Your international experience makes you uniquely valuable in an increasingly connected world!
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default CareerGrowth;