import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SeasonalWork = () => {
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
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Seasonal Work Opportunities</h1>
              <div className="text-muted-foreground mb-6">
                <time>December 20, 2023</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Finding temporary and seasonal jobs in different countries.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                🌱 Seasonal work offers unique opportunities for OFWs to experience different countries, earn good money during peak seasons, and build diverse work experience. These temporary positions can be stepping stones to permanent employment or ways to supplement income.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Popular Seasonal Work Destinations</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">🇦🇺 Australia</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Fruit picking:</strong> Summer harvest season (November-April)</li>
                <li><strong>Tourism:</strong> Hotels and resorts during peak seasons</li>
                <li><strong>Christmas retail:</strong> Temporary retail positions</li>
                <li><strong>Working Holiday Visa:</strong> Available for eligible Filipinos</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">🇨🇦 Canada</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Agricultural work:</strong> Seasonal Agricultural Worker Program</li>
                <li><strong>Summer camps:</strong> Childcare and activity instruction</li>
                <li><strong>Tourism industry:</strong> Rocky Mountain resort jobs</li>
                <li><strong>Christmas tree farms:</strong> Holiday season work</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">🇺🇸 United States</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>H-2A Agricultural workers:</strong> Crop harvesting and planting</li>
                <li><strong>H-2B Non-agricultural:</strong> Tourism, hospitality, landscaping</li>
                <li><strong>Ski resorts:</strong> Winter season employment</li>
                <li><strong>Summer camps:</strong> J-1 exchange visitor programs</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Types of Seasonal Work</h2>
              
              <p>
                🌾 <strong>Agricultural Work:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fruit and vegetable harvesting</li>
                <li>Planting and seeding</li>
                <li>Greenhouse operations</li>
                <li>Vineyard work</li>
              </ul>
              
              <p>
                🏨 <strong>Tourism and Hospitality:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Resort and hotel staff</li>
                <li>Restaurant servers and kitchen staff</li>
                <li>Tour guides and activity coordinators</li>
                <li>Ski instructors and lift operators</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Advantages of Seasonal Work</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Higher pay during peak seasons:</strong> Premium wages for temporary work</li>
                <li><strong>Experience different cultures:</strong> Work in various countries</li>
                <li><strong>Networking opportunities:</strong> Meet people from around the world</li>
                <li><strong>Pathway to permanent work:</strong> Prove yourself for long-term opportunities</li>
                <li><strong>Adventure and travel:</strong> Combine work with exploration</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">How to Find Seasonal Work</h2>
              <p>
                🔍 <strong>Job search strategies:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Specialized agencies:</strong> Companies that focus on seasonal placements</li>
                <li><strong>Government programs:</strong> Official seasonal worker programs</li>
                <li><strong>Online platforms:</strong> Websites dedicated to seasonal jobs</li>
                <li><strong>Direct applications:</strong> Contact farms, resorts, and businesses directly</li>
                <li><strong>Word of mouth:</strong> Network with other seasonal workers</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Preparation Tips</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Physical fitness:</strong> Many seasonal jobs are physically demanding</li>
                <li><strong>Flexible attitude:</strong> Be ready to adapt to different work conditions</li>
                <li><strong>Save money:</strong> Have funds for travel and setup costs</li>
                <li><strong>Research visa requirements:</strong> Understand legal work requirements</li>
                <li><strong>Learn basic language skills:</strong> Helpful for communication</li>
              </ul>
              
              <p>
                🌟 Seasonal work can be an excellent way to earn money, gain experience, and explore the world. With proper planning and the right attitude, it can open doors to exciting opportunities and lifelong memories.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default SeasonalWork;