import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OurStory = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Our Story
            </h1>
            
            <div className="prose max-w-none space-y-6 text-lg leading-relaxed">
              <p className="text-xl">
                🌍 Diary of an OFW was born from a powerful belief: that Overseas Filipino Workers (OFWs) have immense potential to grow, learn, and thrive—when equipped with the right mindset and meaningful support.
              </p>
              
              <p>
                We are a global community of OFWs, connecting with fellow kababayans across borders. Through heartfelt conversations with successful OFWs, we uncover and share their untold stories—stories of resilience, ambition, and triumph. These narratives serve as a source of inspiration for others to dream bigger, push further, and believe in their own capacity to succeed.
              </p>
              
              <p>
                🎯 Our mission is clear: to expose the undocumented successes of OFWs around the world. What began in the Czech Republic is now expanding, as we connect with thriving Filipino entrepreneurs in every corner of the globe.
              </p>
              
              <p>
                💬 And we don't just tell stories—we provide accurate, reliable information by sitting down with the right people: experts, mentors, and experienced OFWs who offer real insights and guidance. Whether it's about starting a business, navigating life abroad, or personal development, we make sure our content is grounded in truth and experience.
              </p>
              
              <p className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                This is more than a platform. It's a movement. It's a diary written by all of us—one story at a time.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OurStory;