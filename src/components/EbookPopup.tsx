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
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Submitting ebook form:', {
        email: email.trim(),
        name: name.trim()
      });

    // Integration with Supabase Edge Function for ebook signups
    const payload = {
      email: email.trim(),
      firstName: name.trim(),
      name: name.trim(),
      listType: 'ebook'
    };

    const response = await fetch(
      'https://yvmqcqrewqvwroxinzvn.supabase.co/functions/v1/ebook_signups',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bXFjcXJld3F2d3JveGluenZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzQxMDEsImV4cCI6MjA3MjgxMDEwMX0.R0dPQK8ELH3OXmwxbJaEMa2CIU4E6G0hWEwj-sKK9Vc'
        },
        body: JSON.stringify(payload),
      }
    );

    // If a Make webhook URL is configured, trigger it with the same payload
    if (makeWebhookUrl && makeWebhookUrl.trim()) {
      try {
        fetch(makeWebhookUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(err => console.warn('Webhook post failed', err));
      } catch (err) {
        console.warn('Webhook error', err);
      }
    }

if (!response.ok) {
  const errorData = await response.json();
  console.error('Integration error:', errorData);
  toast({
    title: "Error",
    description: errorData?.message || "Failed to submit form. Please try again.",
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
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0 p-4 safe-top safe-bottom">
      <div className={`relative w-full overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100 ${isMobile ? 'max-w-sm' : 'max-w-5xl'} max-h-[90vh] overflow-y-auto`}>
        <div className={`${isMobile ? 'flex flex-col' : 'flex flex-row min-h-[550px]'}`}>
          {/* Left Side - E-book Cover */}
          <div className={`bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center ${isMobile ? 'flex-none p-8' : 'flex-1 p-12'}`}>
            <div className="text-center">
              <img 
                src="/ebook.png" 
                alt="OFW Real Talk E-book" 
                className={`mx-auto object-contain ${isMobile ? 'w-48 h-60' : 'w-72 h-96'}`}
                style={{
                  filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.4)) drop-shadow(0 10px 10px rgba(0, 0, 0, 0.3))',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                }}
                loading="lazy"
                decoding="async"
              />
              <p className={`text-white font-medium mt-6 ${isMobile ? 'text-sm' : 'text-lg'}`}>
                Your Ultimate Guide to OFW Success
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className={`relative bg-gradient-to-br from-white to-slate-50 ${isMobile ? 'flex-1 p-6' : 'flex-1 p-12'}`}>
            <div className="absolute top-6 right-6 flex gap-2">
              
              <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                <X className="h-6 w-6" />
              </Button>
            </div>

            {!isSuccess ? <div className={`mx-auto ${isMobile ? 'max-w-full' : 'max-w-md'}`}>
                <h2 className={`font-extrabold text-gray-900 mb-4 text-center leading-tight ${isMobile ? 'text-xl' : 'text-3xl lg:text-4xl'}`}>
                  Get Your FREE E-book Now!
                </h2>
                <p className={`text-gray-600 mb-8 text-center leading-relaxed ${isMobile ? 'text-sm' : 'text-lg'}`}>
                  Discover real insights and practical advice from successful OFWs. Delivered straight to your inbox—no spam, just value.
                </p>

                {showWebhookConfig && <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <label className="text-sm font-bold mb-2 block text-gray-900">Make.com Webhook URL (Optional)</label>
                    <Input type="url" placeholder="https://hook.make.com/..." value={makeWebhookUrl} onChange={e => setMakeWebhookUrl(e.target.value)} className="text-sm" />
                    <p className="text-xs text-gray-600 mt-2">
                      Enter your Make.com webhook URL to trigger automation when someone signs up.
                    </p>
                  </div>}

                <form onSubmit={handleSubmit} className={`${isMobile ? 'space-y-4' : 'space-y-5'}`}>
                  <div>
                    <Input type="email" placeholder="Enter your email address *" value={email} onChange={e => setEmail(e.target.value)} required className={`w-full border-2 border-gray-200 rounded-xl focus:border-primary transition-all ${isMobile ? 'h-12 text-base px-4' : 'h-14 text-lg px-5'}`} />
                  </div>
                  <div>
                    <Input type="text" placeholder="Enter your first name *" value={name} onChange={e => setName(e.target.value)} required className={`w-full border-2 border-gray-200 rounded-xl focus:border-primary transition-all ${isMobile ? 'h-12 text-base px-4' : 'h-14 text-lg px-5'}`} />
                  </div>
                  <Button type="submit" className={`w-full bg-gradient-to-r from-primary via-accent to-primary hover:scale-[1.02] hover:shadow-xl transition-all duration-300 text-white font-bold rounded-xl uppercase tracking-wide ${isMobile ? 'py-4 text-base' : 'py-5 text-lg'}`}>
                    Send to My Email
                  </Button>
                </form>

                <p className={`text-gray-500 mt-6 text-center leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  🔒 We respect your privacy. Your email will only be used for the e-book and valuable updates. Unsubscribe anytime.
                </p>
              </div> : <div className={`mx-auto text-center flex flex-col items-center justify-center ${isMobile ? 'max-w-full py-12' : 'max-w-md py-20'}`}>
                <div className={`bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${isMobile ? 'w-16 h-16' : 'w-20 h-20'}`}>
                  <svg className={`text-white ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className={`font-extrabold text-gray-900 mb-3 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Thank You!</h3>
                <p className={`text-gray-600 leading-relaxed ${isMobile ? 'text-base' : 'text-lg'}`}>
                  Your free e-book is on its way! Check your inbox for the download link.
                </p>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default EbookPopup;
