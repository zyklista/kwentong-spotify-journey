import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FamilyDynamics = () => {
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
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">OFW Family Dynamics</h1>
              <div className="text-muted-foreground mb-6">
                <time>December 15, 2023</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Managing relationships and responsibilities from afar.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                👨‍👩‍👧‍👦 Being an OFW fundamentally changes family dynamics. Physical separation creates unique challenges and opportunities for Filipino families. Understanding and navigating these changes is crucial for maintaining strong family bonds despite the distance.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Common Family Challenges for OFWs</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">💔 Role Reversals and Adjustments</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Spouse becomes single parent:</strong> Managing household and children alone</li>
                <li><strong>Children take on adult responsibilities:</strong> Helping with siblings and household</li>
                <li><strong>Extended family involvement:</strong> Grandparents becoming primary caregivers</li>
                <li><strong>Financial decision-making shifts:</strong> Who controls the money?</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">📱 Communication Challenges</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Time zone differences:</strong> Finding mutual convenient times</li>
                <li><strong>Technology gaps:</strong> Different comfort levels with digital tools</li>
                <li><strong>Language changes:</strong> Children picking up foreign words</li>
                <li><strong>Emotional distance:</strong> Difficulty expressing feelings through screens</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Maintaining Strong Relationships</h2>
              
              <p>
                💕 <strong>With Your Spouse:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Daily check-ins:</strong> Share everyday moments, not just important news</li>
                <li><strong>Include them in decisions:</strong> Even small ones, to maintain partnership</li>
                <li><strong>Plan visits:</strong> Regular homecoming visits when possible</li>
                <li><strong>Express appreciation:</strong> Acknowledge their sacrifices and hard work</li>
                <li><strong>Trust and transparency:</strong> Open communication about finances and feelings</li>
              </ul>
              
              <p>
                👶 <strong>With Your Children:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consistent presence:</strong> Regular video calls at predictable times</li>
                <li><strong>Be involved in education:</strong> Help with homework via video call</li>
                <li><strong>Virtual activities:</strong> Watch movies together online, play games</li>
                <li><strong>Send surprises:</strong> Unexpected gifts or letters</li>
                <li><strong>Create traditions:</strong> Special bedtime stories or weekend calls</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Financial Dynamics</h2>
              <p>
                💰 <strong>Money management from abroad:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Clear budgeting:</strong> Establish spending guidelines together</li>
                <li><strong>Joint accounts:</strong> Maintain shared financial access</li>
                <li><strong>Emergency funds:</strong> Both parties should have access</li>
                <li><strong>Investment decisions:</strong> Make major financial choices together</li>
                <li><strong>Teaching financial literacy:</strong> Educate children about money</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Preparing for Reunification</h2>
              <p>
                🏠 <strong>Coming back together:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Adjustment period:</strong> Everyone needs time to readjust</li>
                <li><strong>Changed roles:</strong> Renegotiate family responsibilities</li>
                <li><strong>Children's independence:</strong> They may have become more self-reliant</li>
                <li><strong>Spouse's autonomy:</strong> Respect the independence they've developed</li>
                <li><strong>New routines:</strong> Create fresh family traditions together</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Signs of Family Strain</h2>
              <p>
                ⚠️ <strong>Watch for these warning signs:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Decreased communication frequency</li>
                <li>Children becoming distant or rebellious</li>
                <li>Spouse expressing feeling overwhelmed</li>
                <li>Financial conflicts increasing</li>
                <li>Children's academic performance declining</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Seeking Support</h2>
              <p>
                🤝 Don't hesitate to seek help when needed:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Family counseling:</strong> Virtual sessions for all family members</li>
                <li><strong>OFW support groups:</strong> Connect with families in similar situations</li>
                <li><strong>Community resources:</strong> Local organizations that help OFW families</li>
                <li><strong>Professional guidance:</strong> Financial advisors, child psychologists</li>
              </ul>
              
              <p>
                🌟 Remember, every OFW family is unique. What works for one family may not work for another. The key is open communication, patience, and willingness to adapt as your family's needs change over time.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default FamilyDynamics;