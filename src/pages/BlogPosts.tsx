import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const BlogPosts = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Starting Your Journey as an OFW",
      description: "Essential tips and guidance for Filipinos planning to work abroad.",
      date: "March 15, 2024",
      author: "Diary of an OFW Team"
    },
    {
      id: 2,
      title: "Success Stories from the Czech Republic",
      description: "Inspiring stories of Filipino entrepreneurs who made it big in Europe.",
      date: "March 10, 2024",
      author: "Diary of an OFW Team"
    },
    {
      id: 3,
      title: "Financial Planning for OFWs",
      description: "Smart money management strategies for overseas Filipino workers.",
      date: "March 5, 2024",
      author: "Diary of an OFW Team"
    },
    {
      id: 4,
      title: "Skills Development Abroad",
      description: "How to enhance your skills and advance your career while working overseas.",
      date: "February 28, 2024",
      author: "Diary of an OFW Team"
    },
    {
      id: 5,
      title: "Staying Connected with Family",
      description: "Maintaining strong relationships with loved ones back home.",
      date: "February 20, 2024",
      author: "Diary of an OFW Team"
    },
    {
      id: 6,
      title: "Cultural Adaptation Guide",
      description: "Navigating cultural differences and embracing diversity in your host country.",
      date: "February 15, 2024",
      author: "Diary of an OFW Team"
    },
    {
      id: 7,
      title: "OFW Entrepreneurship",
      description: "Starting your own business while working abroad or after returning home.",
      date: "February 10, 2024",
      author: "Diary of an OFW Team"
    },
    {
      id: 8,
      title: "Healthcare Heroes Abroad",
      description: "Filipino healthcare workers making a difference around the world.",
      date: "February 5, 2024",
      author: "Diary of an OFW Team"
    },
    {
      id: 9,
      title: "Work-Life Balance Tips",
      description: "Maintaining mental health and enjoying life while working overseas.",
      date: "January 30, 2024",
      author: "Diary of an OFW Team"
    },
    {
      id: 10,
      title: "Coming Home: Reintegration Guide",
      description: "Practical advice for OFWs planning to return to the Philippines.",
      date: "January 25, 2024",
      author: "Diary of an OFW Team"
    },
    {
      id: 11,
      title: "Career Growth Strategies",
      description: "Advancing your professional career as an overseas Filipino worker.",
      date: "January 20, 2024",
      author: "Diary of an OFW Team"
    },
    {
      id: 12,
      title: "Legal Rights and Protection",
      description: "Understanding your rights and legal protections as an OFW.",
      date: "January 15, 2024",
      author: "Diary of an OFW Team"
    },
    {
      id: 13,
      title: "Mental Health and Wellness",
      description: "Taking care of your emotional and psychological well-being abroad.",
      date: "January 10, 2024",
      author: "Diary of an OFW Team"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Blog Posts
            </h1>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => {
                const getPostSlug = (id: number) => {
                  const slugs = {
                    1: '/blog/starting-your-journey',
                    2: '/blog/success-stories-czech',
                    3: '/blog/financial-planning',
                    4: '/blog/skills-development',
                    5: '/blog/staying-connected',
                    6: '/blog/cultural-adaptation',
                    7: '/blog/entrepreneurship',
                    8: '/blog/healthcare-heroes',
                    9: '/blog/work-life-balance',
                    10: '/blog/coming-home',
                    11: '/blog/career-growth',
                    12: '/blog/legal-guide',
                    13: '/blog/mental-health'
                  };
                  return slugs[id as keyof typeof slugs] || '/blog';
                };
                
                return (
                  <Link key={post.id} to={getPostSlug(post.id)}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader>
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {post.date} • By {post.author}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{post.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-lg text-muted-foreground">
                More blog posts coming soon! Stay tuned for more inspiring stories and helpful content.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPosts;