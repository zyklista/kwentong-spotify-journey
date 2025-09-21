import Header from "@/components/Header";
import { blogPosts } from "@/utils/blogPosts";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const BlogPosts = () => {
  // blogPosts imported from utils/blogPosts

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
              {blogPosts.map((post) => (
                <Card key={post.slug} className="rounded-xl shadow-lg hover:shadow-xl transition bg-white p-6">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{post.title}</CardTitle>
                    <CardDescription className="text-muted-foreground mb-2">{post.date} • {post.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{post.description}</p>
                    <Link to={`/blog/${post.slug.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}`} className="inline-block mt-4 text-primary hover:underline font-semibold">Read More</Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPosts;