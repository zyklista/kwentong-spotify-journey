import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FinancialPlanning = () => {
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
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Financial Planning for OFWs
              </h1>
              <div className="text-muted-foreground mb-6">
                <time>March 5, 2024</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Smart money management strategies for overseas Filipino workers.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                💰 Financial planning as an OFW requires a unique approach. You're earning in a foreign currency, supporting family back home, planning for your future, and managing expenses in two countries. Here's how to make your hard-earned money work smarter for you.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">The OFW Budget Formula</h2>
              <p>
                📊 A successful OFW budget typically follows the <strong>50-30-20 rule with modifications:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>30% - Living Expenses Abroad:</strong> Rent, food, transportation, utilities</li>
                <li><strong>25% - Family Support:</strong> Remittances to the Philippines</li>
                <li><strong>25% - Emergency Fund & Savings:</strong> Build your financial security</li>
                <li><strong>10% - Investments:</strong> Long-term wealth building</li>
                <li><strong>10% - Personal Fund:</strong> Entertainment, personal needs, local experiences</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Smart Remittance Strategies</h2>
              <p>
                🏦 <strong>Timing is everything.</strong> Monitor exchange rates and send money when rates are favorable. Consider using apps that alert you to rate changes. Some OFWs save 5-10% annually just by timing their remittances better.
              </p>
              
              <p>
                💳 <strong>Choose the right channel.</strong> Compare fees between banks, money transfer services, and digital platforms. What seems like small fees can add up to thousands of pesos annually.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Building Your Emergency Fund</h2>
              <p>
                🛡️ <strong>Aim for 6-12 months of expenses.</strong> As an OFW, you face unique risks: contract non-renewal, medical emergencies, or urgent travel needs. Your emergency fund should cover:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>3-6 months of living expenses abroad</li>
                <li>Emergency flight tickets to the Philippines</li>
                <li>Medical expenses not covered by insurance</li>
                <li>Transition costs if you need to find new employment</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Investment Options for OFWs</h2>
              <p>
                📈 <strong>Diversify across countries and currencies:</strong>
              </p>
              
              <p>
                <strong>In the Philippines:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Mutual funds and UITFs through major banks</li>
                <li>Pag-IBIG MP2 savings program</li>
                <li>Philippine Stock Exchange through online brokers</li>
                <li>Real estate investments (condos, lots)</li>
              </ul>
              
              <p>
                <strong>In your host country:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Local pension schemes (if eligible)</li>
                <li>Bank savings accounts and term deposits</li>
                <li>Index funds and ETFs</li>
                <li>Government bonds</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Preparing for Your Return</h2>
              <p>
                🏡 <strong>Plan your Philippine reintegration:</strong> Whether you're planning to return permanently or temporarily, prepare financially. Consider:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Business capital if you plan to start a venture</li>
                <li>House and lot down payment</li>
                <li>Education fund for children</li>
                <li>Healthcare and retirement planning</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Common Financial Mistakes to Avoid</h2>
              <p>
                ⚠️ <strong>Learn from others' mistakes:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sending too much money home without saving for yourself</li>
                <li>Not having adequate insurance coverage</li>
                <li>Investing in "get-rich-quick" schemes</li>
                <li>Not tracking expenses in multiple currencies</li>
                <li>Delaying investment decisions</li>
              </ul>
              
              <p>
                🎯 Remember: Your OFW journey is temporary, but the financial habits you build will serve you for life. Start with small steps, be consistent, and always keep learning about money management. Your future self will thank you!
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default FinancialPlanning;