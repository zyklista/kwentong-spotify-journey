
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { blogPosts } from "@/utils/blogPosts";
import Hero from "@/components/Hero";
import YouTubeSection from "@/components/YouTubeSection";
import MediaSection from "@/components/MediaSection";
import SpotifySection from "@/components/SpotifySection";
import ContactFormUI from "@/components/ContactFormUI";
import ReviewsSection from "@/components/ReviewsSection";
import SocialSection from "@/components/SocialSection";
import Footer from "@/components/Footer";
import EbookPopup from "@/components/EbookPopup";
import ChatBot from "@/components/ChatBot";
import GDPRPolicy from "@/components/GDPRPolicy";
import CookieConsent from "@/components/CookieConsent";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      <Header />
      <main>
        <Hero />
        <MediaSection />
        {/* Blog Posts Section */}
        <section className="py-8 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Latest Blog Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map(post => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}`}
                  className="block rounded-xl shadow-lg hover:shadow-xl transition bg-transparent p-6"
                >
                  <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{post.title}</h3>
                  <p className="text-muted-foreground mb-2">{post.date} • {post.author}</p>
                  <p className="text-gray-700">{post.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <ReviewsSection />
        <SocialSection />
        <ContactFormUI endpoint="https://your-project.supabase.co/functions/v1/contact-form" />
            {/* Add space below the newsletter section */}
            <div className="mb-8" />
      </main>
      <Footer />
      <div className="fixed bottom-2 left-2 text-[10px] text-muted-foreground flex gap-3 z-50">
        <a href="https://www.freeprivacypolicy.com/live/2a202a91-16a0-4765-9522-6cad2827541e" target="_blank" rel="noopener noreferrer" className="hover:underline">Terms & Conditions</a>
        <a href="https://www.privacypolicies.com/live/27147915-fee4-4060-ab38-fe3e3fd1cf61" target="_blank" rel="noopener noreferrer" className="hover:underline">Privacy Policy</a>
        <a href="https://www.freeprivacypolicy.com/live/1df86688-ac06-49d6-b79d-eb1199301a86" target="_blank" rel="noopener noreferrer" className="hover:underline">Cookie Policy</a>
      </div>
      <EbookPopup />
      <ChatBot />
      <CookieConsent />
    </div>
  );
};

export default Index;
