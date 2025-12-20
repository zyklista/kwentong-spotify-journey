
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { blogPosts } from "@/utils/blogPosts";
import Hero from "@/components/Hero";
import MediaSection from "@/components/MediaSection";
import ReviewsSection from "@/components/ReviewsSection";
import SocialSection from "@/components/SocialSection";
import Footer from "@/components/Footer";
import EbookPopup from "@/components/EbookPopup";
import CookieConsent from "@/components/CookieConsent";
import { useSEO } from "@/hooks/use-seo";

const Index = () => {
  useSEO({
    title: 'Diary of an OFW - Real Stories, Real Solutions for Filipino Workers Abroad',
    description: 'Join thousands of OFWs sharing real stories, practical tips, and support. Listen to inspiring podcasts, read expert blogs on financial planning, homesickness, and career growth.',
    keywords: 'OFW, Overseas Filipino Workers, OFW stories, Filipino abroad, OFW podcast, OFW guide, Filipino workers overseas, OFW blog, OFW community, OFW support',
    url: 'https://diaryofanofw.com'
  });

  return (
  <div className="min-h-screen bg-white">
      <Header />
  <main>
        <Hero />
        <MediaSection />
  {/* Blog Posts Section */}
  <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl lg:text-6xl font-extrabold mb-12 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-center tracking-tight">Latest Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map(post => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}`}
                  className="group block rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 bg-white p-8 hover:-translate-y-1 border border-gray-100"
                >
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-accent group-hover:to-primary transition-all duration-300">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 font-medium">{post.date} • {post.author}</p>
                  <p className="text-gray-600 leading-relaxed text-base">{post.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
  <ReviewsSection />
  <SocialSection />
  {/* Newsletter Subscription */}
  {/* <NewsletterForm /> */}
            {/* Add space below the newsletter section */}
            <div className="mb-8" />
      </main>
  <Footer />
      <div className="fixed bottom-2 left-2 text-[10px] text-muted-foreground flex gap-3 z-50 safe-bottom safe-left">
        <a href="https://www.freeprivacypolicy.com/live/2a202a91-16a0-4765-9522-6cad2827541e" target="_blank" rel="noopener noreferrer" className="hover:underline">Terms & Conditions</a>
        <a href="https://www.privacypolicies.com/live/27147915-fee4-4060-ab38-fe3e3fd1cf61" target="_blank" rel="noopener noreferrer" className="hover:underline">Privacy Policy</a>
        <a href="https://www.freeprivacypolicy.com/live/1df86688-ac06-49d6-b79d-eb1199301a86" target="_blank" rel="noopener noreferrer" className="hover:underline">Cookie Policy</a>
      </div>
      <EbookPopup />
      <CookieConsent />
    </div>
  );
};

export default Index;
