import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ourStoryHero from "@/assets/our-story-hero.jpg";
import { blogPosts } from "@/utils/blogPosts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const OurStory = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-[28rem] lg:h-[32rem] overflow-hidden">
          <img 
            src={ourStoryHero} 
            alt="Our Story - Diary of an OFW community across the globe" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50 flex items-center justify-center">
            <h1 className="text-6xl lg:text-8xl font-extrabold text-center text-white tracking-tight" style={{ textShadow: '3px 3px 10px rgba(0,0,0,0.6), 0 0 30px rgba(255,255,255,0.15)' }}>
              Our Story
            </h1>
          </div>
        </section>
        <section className="py-20 lg:py-28 px-4 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto max-w-5xl">
            
            <div className="space-y-8 text-lg lg:text-xl leading-relaxed">
              <p className="text-2xl lg:text-3xl font-semibold text-gray-900 leading-snug">
                🌍 Diary of an OFW was born from a powerful belief: that Overseas Filipino Workers (OFWs) have immense potential to grow, learn, and thrive—when equipped with the right mindset and meaningful support.
              </p>
              
              <p className="text-gray-700">
                We are a global community of OFWs, connecting with fellow kababayans across borders. Through heartfelt conversations with successful OFWs, we uncover and share their untold stories—stories of resilience, ambition, and triumph. These narratives serve as a source of inspiration for others to dream bigger, push further, and believe in their own capacity to succeed.
              </p>
              
              <p className="text-gray-700">
                🎯 Our mission is clear: to expose the undocumented successes of OFWs around the world. What began in the Czech Republic is now expanding, as we connect with thriving Filipino entrepreneurs in every corner of the globe.
              </p>
              
              <p className="text-gray-700">
                💬 And we don't just tell stories—we provide accurate, reliable information by sitting down with the right people: experts, mentors, and experienced OFWs who offer real insights and guidance. Whether it's about starting a business, navigating life abroad, or personal development, we make sure our content is grounded in truth and experience.
              </p>
              
              <p className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-snug pt-4">
                This is more than a platform. It's a movement. It's a diary written by all of us—one story at a time.
              </p>
            </div>
          </div>
        </section>

        {/* Blog preview section */}
        <section className="py-20 lg:py-28 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-center mb-12 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">From the Blog</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map((post) => (
                <Card key={post.slug} className="rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 bg-white p-8 border border-gray-100 hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{post.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-2 font-medium">{post.date} • {post.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed text-base">{post.description}</p>
                    <Link to={`/blog/${post.slug.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}`} className="inline-block mt-6 text-primary hover:text-accent font-bold transition-colors duration-200">Read More →</Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/blog" className="inline-block px-8 py-4 text-lg rounded-full bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105">See All Posts</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OurStory;