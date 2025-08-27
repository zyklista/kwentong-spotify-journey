import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EmergencyFund = () => {
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
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Building Your Emergency Fund</h1>
              <div className="text-muted-foreground mb-6">
                <time>December 25, 2023</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Creating financial security while working abroad.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                💰 An emergency fund is your financial safety net - money set aside specifically for unexpected expenses or loss of income. For OFWs, having an emergency fund is even more crucial due to the uncertainties of working abroad.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Why OFWs Need Emergency Funds</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Job loss or contract termination:</strong> Sudden unemployment abroad</li>
                <li><strong>Medical emergencies:</strong> Healthcare costs in foreign countries</li>
                <li><strong>Family emergencies back home:</strong> Unexpected expenses in the Philippines</li>
                <li><strong>Travel emergencies:</strong> Urgent trips home or visa issues</li>
                <li><strong>Economic downturns:</strong> Economic instability in host countries</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">How Much Should You Save?</h2>
              <p>
                🎯 <strong>The 3-6 Month Rule:</strong> Aim to save 3-6 months of your living expenses. For OFWs, consider these factors:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Higher target:</strong> 6-12 months if your job is unstable</li>
                <li><strong>Include repatriation costs:</strong> Emergency ticket home</li>
                <li><strong>Consider family obligations:</strong> Support you send home</li>
                <li><strong>Healthcare buffer:</strong> Medical insurance gaps</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Building Your Emergency Fund Step by Step</h2>
              <p>
                📊 <strong>Start small and be consistent:</strong>
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Set a initial goal:</strong> Start with PHP 50,000 or one month's expenses</li>
                <li><strong>Automate savings:</strong> Set up automatic transfers to savings</li>
                <li><strong>Use windfalls:</strong> Overtime pay, bonuses, tax refunds go to emergency fund</li>
                <li><strong>Cut unnecessary expenses:</strong> Redirect spending to savings</li>
                <li><strong>Track your progress:</strong> Monitor growth monthly</li>
              </ol>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Where to Keep Your Emergency Fund</h2>
              <p>
                🏦 <strong>Accessibility and safety are key:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>High-yield savings account:</strong> Easy access with some interest</li>
                <li><strong>Split between countries:</strong> Part in host country, part in Philippines</li>
                <li><strong>Digital banks:</strong> Higher interest rates, easy transfers</li>
                <li><strong>Avoid investments:</strong> Keep it liquid and stable</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">When to Use Your Emergency Fund</h2>
              <p>
                ⚠️ <strong>True emergencies only:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sudden job loss or contract termination</li>
                <li>Medical emergencies not covered by insurance</li>
                <li>Death or serious illness in the family</li>
                <li>Natural disasters affecting you or your family</li>
                <li>Urgent repatriation needs</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Replenishing Your Emergency Fund</h2>
              <p>
                🔄 After using your emergency fund, make replenishing it your top financial priority. Resume your regular savings schedule immediately and consider temporarily increasing contributions if possible.
              </p>
              
              <p>
                🌟 Remember, an emergency fund isn't just money in the bank - it's peace of mind and financial security that allows you to take calculated risks and pursue opportunities with confidence.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default EmergencyFund;