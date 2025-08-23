import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import familyImage from "@/assets/blog/staying-connected.jpg";

const StayingConnected = () => {
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
                src={familyImage} 
                alt="Filipino family staying connected through video calls" 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Staying Connected with Family
              </h1>
              <div className="text-muted-foreground mb-6">
                <time>February 20, 2024</time> • By Diary of an OFW Team
              </div>
              <p className="text-xl text-muted-foreground">
                Maintaining strong relationships with loved ones back home.
              </p>
            </header>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p>
                💕 One of the greatest challenges of being an OFW is maintaining close relationships with family members thousands of miles away. Distance can strain even the strongest bonds, but with intention and effort, you can keep your family connections strong and meaningful.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Establishing Communication Routines</h2>
              <p>
                📱 <strong>Create consistent communication schedules.</strong> Regular contact is more valuable than lengthy but infrequent conversations. Find times that work for both you and your family, considering time zone differences.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Set weekly family video calls at the same time</li>
                <li>Send daily good morning/good night messages</li>
                <li>Share photos and updates throughout your day</li>
                <li>Use voice messages when typing is difficult</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Best Apps for OFW Families</h2>
              <p>
                📲 <strong>Choose the right communication tools:</strong>
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>WhatsApp:</strong> Easy group chats and voice messages</li>
                <li><strong>Viber:</strong> Popular in the Philippines, good international rates</li>
                <li><strong>Facebook Messenger:</strong> Video calls and photo sharing</li>
                <li><strong>Skype:</strong> Reliable for longer video conversations</li>
                <li><strong>Zoom:</strong> Great for family gatherings with multiple relatives</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Being Present from Afar</h2>
              <p>
                🎉 <strong>Participate in important moments:</strong> Technology allows you to be part of celebrations, milestones, and daily life events even when you cannot be physically present.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Join birthday parties via video call</li>
                <li>Help children with homework online</li>
                <li>Watch movies together using streaming party apps</li>
                <li>Attend graduations and school events virtually</li>
                <li>Read bedtime stories to young children</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Managing Time Zone Challenges</h2>
              <p>
                🕐 <strong>Work around the clock differences:</strong> Time zones can be tricky, but with planning, you can find windows that work for everyone.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Use world clock apps to track family time zones</li>
                <li>Schedule important calls in advance</li>
                <li>Be flexible with your sleep schedule for special occasions</li>
                <li>Record video messages when live calls are not possible</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Sending More Than Money</h2>
              <p>
                📦 <strong>Thoughtful packages show you care:</strong> While financial support is important, sending personal items creates emotional connections.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Local treats and snacks from your host country</li>
                <li>Clothing or accessories with local designs</li>
                <li>Postcards and souvenirs from places you visit</li>
                <li>Books, toys, or educational materials</li>
                <li>Personal letters written by hand</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Supporting Your Children's Growth</h2>
              <p>
                👨‍👩‍👧‍👦 <strong>Stay involved in your children's development:</strong> Being an OFW parent requires extra effort to remain a positive influence in your children's lives.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Know their friends, teachers, and daily routines</li>
                <li>Set expectations and maintain discipline from afar</li>
                <li>Celebrate their achievements and comfort them during failures</li>
                <li>Share your experiences and teach them about the world</li>
                <li>Plan special activities for your visits home</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Dealing with Loneliness and Guilt</h2>
              <p>
                💔 <strong>It is normal to feel sad sometimes.</strong> Missing important moments and feeling disconnected from daily family life is part of the OFW experience. Acknowledge these feelings and find healthy ways to cope.
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember why you chose to work abroad</li>
                <li>Focus on the positive impact you are making</li>
                <li>Connect with other OFW families who understand</li>
                <li>Plan and look forward to your next visit home</li>
                <li>Consider counseling if feelings become overwhelming</li>
              </ul>
              
              <p>
                ❤️ Distance is just a test of how far love can travel. With effort, creativity, and modern technology, your family bonds can remain strong no matter how many miles separate you. Your sacrifice and love are felt deeply by those back home.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default StayingConnected;