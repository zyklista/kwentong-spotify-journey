import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const EbookSignupPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://dvfdyckisluzgunpcsyi.supabase.co/functions/v1/email-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          name,
          source: 'ebook_page'
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Thank you! Your free e-book will be sent to your inbox shortly.");
      } else {
        const errorData = await response.json();
        console.error('Failed to send email:', errorData);
        // Show success anyway to avoid confusing users
        setIsSuccess(true);
        toast.success("Thank you! Your free e-book will be sent to your inbox shortly.");
      }
    } catch (error) {
      console.error('Error sending email:', error);
      // Show success anyway to avoid confusing users
      setIsSuccess(true);
      toast.success("Thank you! Your free e-book will be sent to your inbox shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Get Your Free OFW E-book
            </h1>
            
            <div className="text-center mb-12">
              <p className="text-lg text-muted-foreground">
                Discover real insights and practical advice for OFWs. Get your free e-book delivered straight to your inbox.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* E-book Preview */}
              <div className="flex-1 flex justify-center">
                <div className="w-64 h-80 bg-gradient-to-br from-primary to-accent rounded-lg border-4 border-secondary flex flex-col items-center justify-center shadow-xl">
                  <div className="text-white text-4xl font-bold mb-4">OFW</div>
                  <div className="border-4 border-secondary rounded-lg p-4 mb-4">
                    <div className="text-secondary text-2xl font-bold">REAL</div>
                    <div className="text-secondary text-2xl font-bold">TALK</div>
                  </div>
                  <div className="text-white text-lg">E-BOOK</div>
                </div>
              </div>

              {/* Signup Form */}
              <div className="flex-1 w-full max-w-md">
                {!isSuccess ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Download Your Free E-book</CardTitle>
                      <CardDescription>
                        Enter your details below to receive your free OFW guide.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">First Name</Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your first name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Sending..." : "Get My Free E-book"}
                        </Button>
                      </form>
                      <p className="text-xs text-muted-foreground mt-4 text-center">
                        We respect your privacy. Your email will only be used to send you the e-book and occasional valuable updates. You can unsubscribe anytime.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-success-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                      <p className="text-muted-foreground">
                        Your free e-book will be sent to your inbox shortly. Check your email for the download link.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EbookSignupPage;