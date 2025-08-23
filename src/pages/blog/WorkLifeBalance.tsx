import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import balanceImage from "@/assets/blog/work-life-balance.jpg";

const WorkLifeBalance = () => {
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
                src={balanceImage} 
                alt="Work-life balance for OFWs" 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Work-Life Balance Tips
              </h1>
              <div className="text-muted-foreground mb-6">
                <time>January 30, 2024</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Maintaining mental health and enjoying life while working overseas.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                ⚖️ Working abroad can be intensely demanding, both physically and emotionally. The pressure to maximize earnings, cultural adjustments, and separation from family can make it easy to lose sight of personal well-being. Here is how to maintain a healthy work-life balance as an OFW.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Setting Boundaries</h2>
              <p>
                🚧 <strong>Learn to say no when necessary:</strong> While extra income is tempting, overworking can lead to burnout and health problems.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Set limits on overtime hours</li>
                <li>Take your entitled vacation days</li>
                <li>Establish "off-limits" time for personal activities</li>
                <li>Don\'t feel guilty about resting</li>
                <li>Communicate your boundaries clearly to employers</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Creating a Personal Life Abroad</h2>
              <p>
                🌟 <strong>You are more than just a worker:</strong> Develop interests, hobbies, and relationships that bring joy and fulfillment.
              </p>
              
              <p>
                <strong>Social connections:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Join Filipino community groups</li>
                <li>Make friends with local colleagues</li>
                <li>Participate in religious or spiritual communities</li>
                <li>Join sports clubs or hobby groups</li>
                <li>Volunteer for local charities</li>
              </ul>
              
              <p>
                <strong>Personal interests:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Learn new skills or hobbies</li>
                <li>Explore your host country through travel</li>
                <li>Take up photography or blogging</li>
                <li>Join fitness classes or gyms</li>
                <li>Learn cooking or baking</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Mental Health Maintenance</h2>
              <p>
                🧠 <strong>Prioritize your psychological well-being:</strong> Mental health is just as important as physical health.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Practice regular meditation or prayer</li>
                <li>Keep a journal to process emotions</li>
                <li>Seek counseling if feeling overwhelmed</li>
                <li>Stay connected with family and friends</li>
                <li>Recognize signs of depression or anxiety</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Physical Health and Wellness</h2>
              <p>
                💪 <strong>Take care of your body:</strong> Your physical health directly impacts your ability to work and enjoy life.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintain regular exercise routines</li>
                <li>Eat nutritious meals and avoid junk food</li>
                <li>Get adequate sleep (7-8 hours nightly)</li>
                <li>Have regular medical check-ups</li>
                <li>Stay hydrated and limit alcohol consumption</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Managing Homesickness</h2>
              <p>
                🏠 <strong>Homesickness is normal and manageable:</strong> Everyone experiences it differently, but there are healthy ways to cope.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Schedule regular family video calls</li>
                <li>Cook Filipino food to feel connected to home</li>
                <li>Display photos and mementos from the Philippines</li>
                <li>Plan visits home when financially feasible</li>
                <li>Connect with other Filipinos who understand</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Financial Stress Management</h2>
              <p>
                💳 <strong>Money worries can consume your peace:</strong> Create systems to manage financial anxiety.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Create and stick to a budget</li>
                <li>Build emergency savings for peace of mind</li>
                <li>Communicate honestly with family about finances</li>
                <li>Avoid lifestyle inflation and unnecessary debt</li>
                <li>Seek financial counseling if overwhelmed</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Exploring Your Host Country</h2>
              <p>
                🗺️ <strong>Make the most of your international experience:</strong> Working abroad offers unique opportunities to explore and learn.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Visit museums, historical sites, and cultural landmarks</li>
                <li>Try local cuisines and restaurants</li>
                <li>Attend festivals and cultural events</li>
                <li>Take weekend trips to nearby cities or countries</li>
                <li>Learn about local history and traditions</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Time Management Strategies</h2>
              <p>
                ⏰ <strong>Maximize your free time:</strong> Good time management allows for both productivity and relaxation.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Plan your weeks in advance</li>
                <li>Batch similar activities together</li>
                <li>Use commute time for learning or relaxation</li>
                <li>Delegate household tasks when possible</li>
                <li>Learn to prioritize what truly matters</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Building Long-term Happiness</h2>
              <p>
                😊 <strong>Create sustainable joy in your daily life:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Practice gratitude for your opportunities</li>
                <li>Set personal goals beyond financial ones</li>
                <li>Celebrate small victories and milestones</li>
                <li>Maintain perspective on temporary challenges</li>
                <li>Remember that your happiness matters too</li>
              </ul>
              
              <p>
                🌈 Your well-being is not a luxury - it is a necessity. A balanced, healthy OFW is more productive, more resilient, and better able to support their family. Take care of yourself so you can continue taking care of others.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default WorkLifeBalance;