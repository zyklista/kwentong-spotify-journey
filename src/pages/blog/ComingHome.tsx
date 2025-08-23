import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import homeImage from "@/assets/blog/coming-home.jpg";

const ComingHome = () => {
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
                src={homeImage} 
                alt="OFW returning home to Philippines" 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Coming Home: Reintegration Guide
              </h1>
              <div className="text-muted-foreground mb-6">
                <time>January 25, 2024</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Practical advice for OFWs planning to return to the Philippines.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                🏠 After years of working abroad, returning home to the Philippines can be both exciting and challenging. The country you left may have changed, your family dynamics might be different, and you have certainly grown as a person. Here is how to make your homecoming smooth and successful.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Financial Preparation for Return</h2>
              <p>
                💰 <strong>Secure your financial foundation before coming home:</strong> Proper financial planning ensures a smooth transition.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Save 6-12 months of living expenses</li>
                <li>Plan your final remittance and fund transfers</li>
                <li>Research current costs of living in your target area</li>
                <li>Consider exchange rate timing for large transfers</li>
                <li>Set up Philippine bank accounts and investment accounts</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Career Transition Planning</h2>
              <p>
                🔄 <strong>Prepare for the Philippine job market:</strong> Your international experience is valuable, but the local market may have different requirements.
              </p>
              
              <p>
                <strong>Options to consider:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Corporate employment:</strong> Use international experience for senior roles</li>
                <li><strong>Entrepreneurship:</strong> Start your own business using savings and skills</li>
                <li><strong>Consulting:</strong> Offer expertise to companies entering international markets</li>
                <li><strong>Teaching/Training:</strong> Share your skills and international experience</li>
                <li><strong>Remote work:</strong> Continue working for international clients</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Family Reintegration</h2>
              <p>
                👨‍👩‍👧‍👦 <strong>Rebuilding relationships takes time and patience:</strong> Family dynamics may have changed during your absence.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Spend quality time getting to know your children again</li>
                <li>Respect the independence your spouse has developed</li>
                <li>Be patient with children who may feel distant initially</li>
                <li>Create new family traditions and routines</li>
                <li>Consider family counseling if needed</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Reverse Culture Shock</h2>
              <p>
                😵 <strong>Coming home can be culturally jarring:</strong> You may have adopted foreign customs and perspectives that contrast with local practices.
              </p>
              
              <p>
                <strong>Common experiences:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Frustration with Philippine bureaucracy and inefficiency</li>
                <li>Difficulty readjusting to local work culture</li>
                <li>Missing the independence and lifestyle abroad</li>
                <li>Feeling like an outsider in your own country</li>
                <li>Language mixing and communication challenges</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Housing and Lifestyle Adjustments</h2>
              <p>
                🏡 <strong>Creating your new home environment:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Research housing options in advance</li>
                <li>Consider renting before buying to get reacquainted</li>
                <li>Budget for initial setup costs and utilities</li>
                <li>Plan for climate readjustment (air conditioning, etc.)</li>
                <li>Set up reliable internet for potential remote work</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Business and Investment Opportunities</h2>
              <p>
                📈 <strong>Leverage your international experience:</strong> Your global perspective can identify unique business opportunities.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Import businesses bringing foreign products to Philippines</li>
                <li>Service businesses targeting OFW families</li>
                <li>Training and consultancy for aspiring OFWs</li>
                <li>Tourism services for international visitors</li>
                <li>Real estate investments in growing areas</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Legal and Administrative Tasks</h2>
              <p>
                📋 <strong>Important paperwork to handle upon return:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Update your Philippine residence status</li>
                <li>Register for Philippine taxes and BIR requirements</li>
                <li>Update SSS, PhilHealth, and Pag-IBIG records</li>
                <li>Transfer or convert foreign licenses and certifications</li>
                <li>Set up local banking and financial services</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Maintaining International Connections</h2>
              <p>
                🌍 <strong>Keep your global network alive:</strong> Your international connections are valuable assets.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Stay in touch with former colleagues and employers</li>
                <li>Join international professional associations</li>
                <li>Attend alumni gatherings of OFW groups</li>
                <li>Consider part-time or project-based international work</li>
                <li>Mentor new OFWs preparing to work abroad</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Contributing to the Community</h2>
              <p>
                🤝 <strong>Give back using your international experience:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Volunteer for OFW support organizations</li>
                <li>Share your expertise with government agencies</li>
                <li>Mentor young professionals and entrepreneurs</li>
                <li>Support community development projects</li>
                <li>Advocate for better OFW policies and protections</li>
              </ul>
              
              <p>
                🇵🇭 Coming home is not the end of your journey - it is the beginning of a new chapter. You return not just with money, but with invaluable experience, skills, and a global perspective that can benefit not only your family but your entire community. Welcome home, and congratulations on your successful OFW journey!
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ComingHome;