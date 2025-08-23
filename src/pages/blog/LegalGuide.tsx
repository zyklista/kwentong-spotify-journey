import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import legalImage from "@/assets/blog/legal-guide.jpg";

const LegalGuide = () => {
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
                src={legalImage} 
                alt="Legal rights and protection for OFWs" 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Legal Rights and Protection
              </h1>
              <div className="text-muted-foreground mb-6">
                <time>January 15, 2024</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Understanding your rights and legal protections as an OFW.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                ⚖️ As an OFW, you have specific rights and protections under Philippine law and international agreements. Understanding these rights empowers you to work safely and seek help when needed.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Philippine Government Support</h2>
              <p>
                🇵🇭 <strong>Key agencies protecting OFWs:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>POEA:</strong> Regulates recruitment and deployment</li>
                <li><strong>OWWA:</strong> Provides welfare services and benefits</li>
                <li><strong>DFA:</strong> Assists through embassies and consulates</li>
                <li><strong>NLRC:</strong> Handles labor disputes and claims</li>
                <li><strong>DMW:</strong> Overall policy and coordination</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Your Employment Rights</h2>
              <p>
                💼 <strong>What your contract should include:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Clear job description and working conditions</li>
                <li>Specified salary and benefits</li>
                <li>Working hours and overtime compensation</li>
                <li>Accommodation and meal arrangements</li>
                <li>Leave entitlements and home visits</li>
                <li>Termination procedures and repatriation</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">When to Seek Help</h2>
              <p>
                🚨 <strong>Red flags requiring immediate assistance:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Passport or documents being withheld</li>
                <li>Non-payment or delayed payment of salary</li>
                <li>Physical, sexual, or psychological abuse</li>
                <li>Forced to work beyond contract terms</li>
                <li>Unsafe working conditions</li>
                <li>Restricted movement or communication</li>
              </ul>
              
              <p>
                📞 <strong>Emergency contacts and resources are available 24/7 through Philippine embassies and consulates worldwide.</strong>
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default LegalGuide;