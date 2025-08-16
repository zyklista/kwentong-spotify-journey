import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, User, Mail, Phone, Briefcase, Facebook, Instagram, Youtube } from "lucide-react";
import { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-secondary/5 to-background">
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
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We offer various services to support your journey. Tell us what you need and we'll get back to you.
          </p>
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
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number (Optional)
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="h-12"
                  />
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
                      <SelectItem value="interviews">Interviews</SelectItem>
                      <SelectItem value="website-development">Website Development</SelectItem>
                      <SelectItem value="mobile-development">Mobile Development</SelectItem>
                      <SelectItem value="admin-tasks">Admin Tasks</SelectItem>
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
                <Input
                  id="message"
                  name="message"
                  placeholder="Tell us more about your project or requirements..."
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="text-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="text-lg px-12 py-6 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105"
                >
                  Submit Request
                  <Send className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Social Media Icons - Extra Large as requested */}
        <div className="flex justify-center gap-2 sm:gap-4 lg:gap-6 mt-20 px-4">
          <Button
            variant="ghost"
            size="lg"
            className="text-primary hover:bg-primary/20 p-6 sm:p-8 lg:p-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28"
            onClick={() => window.open('https://www.facebook.com/diaryofanofw', '_blank')}
          >
            <Facebook className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="text-primary hover:bg-primary/20 p-6 sm:p-8 lg:p-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28"
            onClick={() => window.open('https://instagram.com/diary_of_an_ofw', '_blank')}
          >
            <Instagram className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="text-primary hover:bg-primary/20 p-6 sm:p-8 lg:p-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28"
            onClick={() => window.open('https://youtube.com/@diaryofanofw?si=kQW85veqiwAgd7cn', '_blank')}
          >
            <Youtube className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="text-primary hover:bg-primary/20 p-6 sm:p-8 lg:p-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28"
            onClick={() => window.open('https://open.spotify.com/show/5oJDj8gVSPa87Mds6Oe9ty', '_blank')}
          >
            <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;