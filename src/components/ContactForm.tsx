import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, User, Mail, Phone, Briefcase, Facebook, Instagram, Youtube } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      service: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://dvfdyckisluzgunpcsyi.supabase.co/functions/v1/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again or contact us directly at info@diaryofanofw.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section id="contact" className="py-20 bg-gradient-to-b from-secondary/5 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4" />
            Our Services
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            How Can We Help You?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">We offer various services to support your journey. But just like the doctor, we want to know if we fits your needs. Send us how can we help you and we'll get in touch with you within 72hrs.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 shadow-soft">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <Input id="name" name="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={handleInputChange} required className="h-12" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Input id="email" name="email" type="email" placeholder="Enter your email address" value={formData.email} onChange={handleInputChange} required className="h-12" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number (Optional)
                  </label>
                  <Input id="phone" name="phone" type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={handleInputChange} className="h-12" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="service" className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Service Needed
                  </label>
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-development">Web Development</SelectItem>
                      <SelectItem value="mobile-development">Mobile Development</SelectItem>
                      <SelectItem value="admin-tasks">Admin Tasks</SelectItem>
                      <SelectItem value="interviews">Interviews</SelectItem>
                      <SelectItem value="advertising">Advertising</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Additional Details
                </label>
                <Input id="message" name="message" placeholder="Tell us more about your project or requirements..." value={formData.message} onChange={handleInputChange} required className="h-12" />
              </div>

              <div className="text-center pt-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="text-lg px-12 py-6 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Submit Request"}
                  <Send className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Social Media Icons - Extra Large as requested */}
        <div className="flex justify-center gap-2 sm:gap-4 lg:gap-6 mt-20 px-4">
          <Button variant="ghost" size="lg" onClick={() => window.open('https://www.facebook.com/diaryofanOFWofficial', '_blank')} className="text-primary hover:bg-primary/20 p-6 sm:p-8 lg:p-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-[32px] py-[60px] px-[60px]">
            <Facebook className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
          </Button>
          <Button variant="ghost" size="lg" onClick={() => window.open('https://instagram.com/diary_of_an_ofw', '_blank')} className="text-primary hover:bg-primary/20 p-6 sm:p-8 lg:p-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 px-[60px] mx-[29px] py-[60px]">
            <Instagram className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
          </Button>
          <Button variant="ghost" size="lg" onClick={() => window.open('https://youtube.com/@diaryofanofw?si=kQW85veqiwAgd7cn', '_blank')} className="text-primary hover:bg-primary/20 p-6 sm:p-8 lg:p-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 px-[60px] mx-[30px] py-[60px]">
            <Youtube className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
          </Button>
          <Button variant="ghost" size="lg" onClick={() => window.open('https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty', '_blank')} className="text-primary hover:bg-primary/20 p-6 sm:p-8 lg:p-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 px-[60px] mx-[30px] py-[60px]">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </Button>
          <Button variant="ghost" size="lg" onClick={() => window.open('https://www.tiktok.com/@diary.of.an.ofw?_d=secCgYIASAHKAESPgo8KKVOzdq2py0hfcUqO2sexYFw6EoTmdxiFZQGAY9tWF7clcEyXn26SmkqAjAugeL5cYm2b899gd0gE1uGGgA%3D&_r=1&object_id=7538904547453666326&page_open_method=scan_code&schema_type=4&sec_uid=MS4wLjABAAAAnPvzQsX7aytEyivTZDuLfxhzaxMMWayczr3M5NA42q96wJKFZy28hrzTvtSjvSZB&share_app_id=1180&share_author_id=7538904547453666326&share_uid=7538904547453666326&tt_from=scan_code&utm_campaign=client_scan_code&utm_medium=2&utm_source=scan_code', '_blank')} className="text-primary hover:bg-primary/20 p-6 sm:p-8 lg:p-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 px-[60px] mx-[30px] py-[60px]">
            <FaTiktok className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
          </Button>
        </div>
      </div>
    </section>;
};
export default ContactForm;