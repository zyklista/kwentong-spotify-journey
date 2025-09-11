import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
const EbookPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [makeWebhookUrl, setMakeWebhookUrl] = useState("");
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);
  const {
    toast
  } = useToast();
  const isMobile = useIsMobile();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // Show popup after 3 seconds

    return () => clearTimeout(timer);
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Submitting ebook form:', {
        email: email.trim(),
        name: name.trim()
      });

      // Use the email signup edge function
      const { error } = await supabase.functions.invoke('email-signup', {
        body: {
          email: email.trim(),
          name: name.trim() || null,
          source: 'ebook_popup'
        }
      });

      if (error) {
        console.error('Integration error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to submit form. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Ebook form submitted successfully');
      toast({
        title: "Success!",
        description: "Check your email for the download link."
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting ebook form:', error);
      toast({
        title: "Error",
        description: error?.message || "Network error. Please check your connection and try again.",
        variant: "destructive"
      });
    }
  };
  const handleClose = () => {
    setIsVisible(false);
  };
  if (!isVisible) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0 p-4">
      <div className={`relative w-full overflow-hidden rounded-2xl bg-card shadow-xl animate-in zoom-in-95 duration-300 ${isMobile ? 'max-w-sm' : 'max-w-4xl'}`}>
        <div className={`${isMobile ? 'flex flex-col min-h-[600px]' : 'flex flex-col md:flex-row min-h-[500px]'}`}>
          {/* Left Side - E-book Cover */}
          <div className={`bg-gradient-to-br from-primary to-accent flex items-center justify-center ${isMobile ? 'flex-none p-6' : 'flex-1 p-8'}`}>
            <div className="text-center">
              <div className={`mx-auto bg-primary/20 rounded-lg border-4 border-secondary flex flex-col items-center justify-center mb-4 ${isMobile ? 'w-48 h-60' : 'w-64 h-80'}`}>
                <div className={`text-white font-bold mb-4 ${isMobile ? 'text-2xl' : 'text-4xl'}`}>OFW</div>
                <div className={`border-4 border-secondary rounded-lg mb-4 ${isMobile ? 'p-2' : 'p-4'}`}>
                  <div className={`text-secondary font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>REAL</div>
                  <div className={`text-secondary font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>TALK</div>
                </div>
                <div className={`text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>E-BOOK</div>
              </div>
              <p className={`text-primary-foreground opacity-90 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Your guide to OFW success stories
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className={`relative ${isMobile ? 'flex-1 p-4' : 'flex-1 p-8'}`}>
            <div className="absolute top-4 right-4 flex gap-2">
              
              <Button variant="ghost" size="icon" onClick={handleClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {!isSuccess ? <div className={`mx-auto ${isMobile ? 'max-w-full' : 'max-w-md'}`}>
                <h2 className={`font-bold text-foreground mb-4 text-center ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  Get this FREE E-book straight to your inbox!
                </h2>
                <p className={`text-muted-foreground mb-6 text-center ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Discover real insights and practical advice for OFWs. No spam, just valuable content delivered directly to you.
                </p>

                {showWebhookConfig && <div className="mb-4 p-4 bg-secondary/20 rounded-lg">
                    <label className="text-sm font-medium mb-2 block">Make.com Webhook URL (Optional)</label>
                    <Input type="url" placeholder="https://hook.make.com/..." value={makeWebhookUrl} onChange={e => setMakeWebhookUrl(e.target.value)} className="text-sm" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your Make.com webhook URL to trigger automation when someone signs up for the ebook.
                    </p>
                  </div>}

                <form onSubmit={handleSubmit} className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
                  <div>
                    <Input type="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} required className={`w-full ${isMobile ? 'h-10 text-sm' : ''}`} />
                  </div>
                  <div>
                    <Input type="text" placeholder="Enter your first name" value={name} onChange={e => setName(e.target.value)} className={`w-full ${isMobile ? 'h-10 text-sm' : ''}`} />
                  </div>
                  <Button type="submit" className={`w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold ${isMobile ? 'py-2 text-sm' : 'py-3'}`}>
                    Send it to my Email
                  </Button>
                </form>

                <p className={`text-muted-foreground mt-4 text-center ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  We respect your privacy. Your email will only be used to send you the e-book and occasional valuable updates. You can unsubscribe anytime.
                </p>
              </div> : <div className={`mx-auto text-center ${isMobile ? 'max-w-full py-8' : 'max-w-md py-16'}`}>
                <div className={`bg-success rounded-full flex items-center justify-center mx-auto mb-4 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
                  <svg className={`text-success-foreground ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className={`font-bold text-foreground mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>Thank you!</h3>
                <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Your free e-book will be sent to your inbox shortly. Check your email for the download link.
                </p>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default EbookPopup;