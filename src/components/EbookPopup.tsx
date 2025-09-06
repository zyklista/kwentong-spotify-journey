import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EbookPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [makeWebhookUrl, setMakeWebhookUrl] = useState("");
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // Show popup after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        console.log('Submitting ebook form:', { email, name });
        
        // Use the new form integrations function
        const { error } = await supabase.functions.invoke('form-integrations', {
          body: {
            type: 'ebook',
            data: { email, name },
            makeWebhookUrl: makeWebhookUrl || undefined
          }
        });

        if (error) {
          console.error('Integration error:', error.message);
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        console.log('Ebook form success with integrations');
        setIsSuccess(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
        
      } catch (error) {
        console.error('Error submitting ebook form:', error);
        toast({
          title: "Error",
          description: "Error submitting form. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative mx-4 w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-xl animate-in zoom-in-95 duration-300">
        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Left Side - E-book Cover */}
          <div className="flex-1 bg-gradient-to-br from-primary to-accent p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-64 h-80 mx-auto bg-primary/20 rounded-lg border-4 border-secondary flex flex-col items-center justify-center mb-4">
                <div className="text-white text-4xl font-bold mb-4">OFW</div>
                <div className="border-4 border-secondary rounded-lg p-4 mb-4">
                  <div className="text-secondary text-2xl font-bold">REAL</div>
                  <div className="text-secondary text-2xl font-bold">TALK</div>
                </div>
                <div className="text-white text-lg">E-BOOK</div>
              </div>
              <p className="text-primary-foreground text-sm opacity-90">
                Your guide to OFW success stories
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 p-8 relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowWebhookConfig(!showWebhookConfig)}
                className="text-muted-foreground hover:text-foreground"
                title="Configure Make.com webhook"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {!isSuccess ? (
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                  Get this FREE E-book straight to your inbox!
                </h2>
                <p className="text-muted-foreground mb-6 text-center">
                  Discover real insights and practical advice for OFWs. No spam, just valuable content delivered directly to you.
                </p>

                {showWebhookConfig && (
                  <div className="mb-4 p-4 bg-secondary/20 rounded-lg">
                    <label className="text-sm font-medium mb-2 block">Make.com Webhook URL (Optional)</label>
                    <Input
                      type="url"
                      placeholder="https://hook.make.com/..."
                      value={makeWebhookUrl}
                      onChange={(e) => setMakeWebhookUrl(e.target.value)}
                      className="text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your Make.com webhook URL to trigger automation when someone signs up for the ebook.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Enter your first name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-3"
                  >
                    Send it to my Email
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  We respect your privacy. Your email will only be used to send you the e-book and occasional valuable updates. You can unsubscribe anytime.
                </p>
              </div>
            ) : (
              <div className="max-w-md mx-auto text-center py-16">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-success-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Thank you!</h3>
                <p className="text-muted-foreground">
                  Your free e-book will be sent to your inbox shortly. Check your email for the download link.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookPopup;