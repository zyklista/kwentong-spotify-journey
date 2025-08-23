import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import businessImage from "@/assets/blog/entrepreneurship.jpg";

const Entrepreneurship = () => {
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
                src={businessImage} 
                alt="Filipino entrepreneur working on business plans" 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                OFW Entrepreneurship
              </h1>
              <div className="text-muted-foreground mb-6">
                <time>February 10, 2024</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Starting your own business while working abroad or after returning home.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                🚀 Many successful Filipino entrepreneurs started their journey as OFWs. Working abroad provides unique advantages for aspiring business owners: international exposure, diverse skills, strong work ethic, and financial resources. Here is how you can transition from employee to entrepreneur.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Business Ideas for OFWs</h2>
              <p>
                💡 <strong>Leverage your overseas experience:</strong> Your international background gives you unique business opportunities that local entrepreneurs might not see.
              </p>
              
              <p>
                <strong>Service-based businesses:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Immigration and visa consultation</li>
                <li>International remittance services</li>
                <li>Language translation and interpretation</li>
                <li>Cultural training for companies</li>
                <li>OFW preparation seminars</li>
              </ul>
              
              <p>
                <strong>Product-based businesses:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Import/export of unique foreign products</li>
                <li>Filipino food products for international markets</li>
                <li>Handicrafts and cultural items</li>
                <li>Online retail of international brands</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Starting While Still Abroad</h2>
              <p>
                🌍 <strong>Test your business idea before coming home:</strong> Working abroad gives you the perfect opportunity to validate and refine your business concept.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Start small with online services or digital products</li>
                <li>Use social media to build your brand and audience</li>
                <li>Network with other Filipino entrepreneurs abroad</li>
                <li>Save and invest profits back into the business</li>
                <li>Learn local business practices and regulations</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Preparing for Your Return</h2>
              <p>
                🏠 <strong>Plan your Philippine business launch:</strong> Returning to start a business requires careful planning and preparation.
              </p>
              
              <p>
                <strong>Financial preparation:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Save at least 1-2 years of living expenses</li>
                <li>Prepare 6-12 months of business operating capital</li>
                <li>Understand peso conversion and timing</li>
                <li>Plan for taxes and legal requirements</li>
              </ul>
              
              <p>
                <strong>Market research:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Study the current Philippine market conditions</li>
                <li>Identify your target customers and competitors</li>
                <li>Test demand for your product or service</li>
                <li>Understand local regulations and permits needed</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Digital Business Opportunities</h2>
              <p>
                💻 <strong>The internet has no borders:</strong> Digital businesses allow you to serve customers worldwide while living anywhere.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Online consulting and coaching</li>
                <li>E-commerce and dropshipping</li>
                <li>Digital marketing agency</li>
                <li>Online education and training</li>
                <li>Virtual assistant services</li>
                <li>Content creation and social media management</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Common Entrepreneurship Challenges</h2>
              <p>
                ⚠️ <strong>Be prepared for these obstacles:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Capital constraints:</strong> Limited access to business loans</li>
                <li><strong>Market changes:</strong> Philippines market may have evolved during your absence</li>
                <li><strong>Competition:</strong> Established players with local connections</li>
                <li><strong>Regulations:</strong> Complex permits and bureaucracy</li>
                <li><strong>Family pressure:</strong> Expectations to provide immediate income</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Success Strategies</h2>
              <p>
                🎯 <strong>Maximize your chances of success:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Start lean and scale gradually</li>
                <li>Focus on solving real problems</li>
                <li>Build strong partnerships and networks</li>
                <li>Invest in continuous learning</li>
                <li>Maintain international connections</li>
                <li>Stay adaptable and customer-focused</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Government Support Programs</h2>
              <p>
                🏛️ <strong>Take advantage of available assistance:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>DTI entrepreneurship programs</li>
                <li>OWWA business development training</li>
                <li>BSP financial literacy programs</li>
                <li>Local government unit (LGU) business incentives</li>
                <li>Cooperative development programs</li>
              </ul>
              
              <p>
                💼 Remember: Entrepreneurship is not just about making money - it is about creating value, solving problems, and building something lasting. Your OFW experience has given you the skills, perspective, and resources to succeed. The question is not whether you can do it, but what kind of impact you want to make!
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Entrepreneurship;