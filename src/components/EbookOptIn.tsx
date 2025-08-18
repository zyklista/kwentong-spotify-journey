import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Download, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const EbookOptIn = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate form submission
    setIsSubmitted(true);
    toast({
      title: "Success!",
      description: "We'll send the ebook to your inbox shortly.",
    });

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-strong bg-gradient-to-r from-card to-card/80 border-2 border-secondary/20">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative bg-primary/10 flex items-center justify-center p-8 min-h-[400px]">
                <div className="relative">
                  <img
                    src="/lovable-uploads/fe42482f-265f-4ce9-b722-f20c03a356a3.png"
                    alt="OFW Real Talk Ebook"
                    className="w-full max-w-[300px] h-auto rounded-lg shadow-medium transform hover:scale-105 transition-transform duration-300"
                  />
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-secondary rounded-full opacity-40"></div>
                </div>
              </div>

              {/* Form Section */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Download className="w-4 h-4" />
                    Free Ebook
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                    Get Your Free Copy
                  </h3>
                  
                  <p className="text-lg font-semibold text-accent mb-6 leading-relaxed">
                    WE'LL SEND THIS EBOOK STRAIGHT TO YOUR INBOX
                  </p>
                  
                  <p className="text-muted-foreground mb-8">
                    Discover real stories, practical tips, and valuable insights from fellow OFWs around the world.
                  </p>

                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="ebook-email" className="text-sm font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address
                        </label>
                        <Input
                          id="ebook-email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 text-base"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full text-lg py-6 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105"
                      >
                        Send Me The Ebook
                        <Download className="ml-2 w-5 h-5" />
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
                        <CheckCircle className="w-8 h-8 text-success" />
                      </div>
                      <h4 className="text-xl font-semibold text-success mb-2">
                        Thank You!
                      </h4>
                      <p className="text-muted-foreground">
                        Check your inbox for the ebook download link.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EbookOptIn;