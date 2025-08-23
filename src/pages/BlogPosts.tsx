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
                  switch(id) {
                    case 1: return '/blog/starting-your-journey';
                    case 2: return '/blog/success-stories-czech';
                    case 3: return '/blog/financial-planning';
                    default: return '/blog';
                  }
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