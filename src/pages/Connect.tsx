import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

const SERVICE_OPTIONS = [
  { value: "full-stack-web-development", label: "Full Stack Web Development" },
  { value: "web-renovation-migration", label: "Web Renovation & Migration" },
  { value: "mobile-app-development", label: "Mobile App Development" },
  { value: "advertising", label: "Advertising" },
  { value: "interview-guesting", label: "Interview Guesting" },
  { value: "others", label: "Others" }
];

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: SERVICE_OPTIONS[0].value,
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Frontend validation - ensure all fields are filled
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.service || !form.message.trim()) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      // Log the data being sent for debugging
      console.log('Sending form data:', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        service: form.service,
        message: form.message,
      });

      // Call the Edge Function directly using fetch for anonymous access
      const supabaseUrl = "https://yvmqcqrewqvwroxinzvn.supabase.co";
      const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bXFjcXJld3F2d3JveGluenZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzQxMDEsImV4cCI6MjA3MjgxMDEwMX0.R0dPQK8ELH3OXmwxbJaEMa2CIU4E6G0hWEwj-sKK9Vc";

      const response = await fetch(`${supabaseUrl}/functions/v1/contact_submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          service: form.service,
          message: form.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Edge Function error:', data);
        throw new Error(data.error || 'Failed to submit form');
      }

      if (!data.success) {
        console.error('Function response error:', data);
        throw new Error(data.error || 'Form submission failed');
      }

      // Success
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", service: SERVICE_OPTIONS[0].value, message: "" });
    } catch (err) {
      console.error('Form submission error:', err);
      // More specific error messages
      if (err.message?.includes('JWT') || err.message?.includes('401')) {
        setError("Authentication error. Please refresh the page and try again.");
      } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(`Error: ${err.message || "Something went wrong. Please try again."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-gradient-to-br from-white via-slate-50 to-white rounded-3xl shadow-2xl p-8 lg:p-16 space-y-6 border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-5xl font-extrabold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">Tell Us About Your Needs</h2>
        <p className="text-lg text-gray-700 mb-3 leading-relaxed max-w-3xl mx-auto">Share your requirements, project details, or any questions you have. Whether it's web development, app creation, or interview opportunities—we're here to help bring your vision to life.</p>
        <p className="text-base text-gray-600 leading-relaxed">Our team reviews every inquiry personally and will respond within <span className="font-bold text-primary">72 hours</span>.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">Full Name *</label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            required 
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-5 py-4 text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-gray-300 shadow-sm" 
            placeholder="John Doe" 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">Email Address *</label>
          <input 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
            required 
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-5 py-4 text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-gray-300 shadow-sm" 
            placeholder="john@example.com" 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">Phone Number *</label>
          <input 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            required 
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-5 py-4 text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-gray-300 shadow-sm" 
            placeholder="+420 123 456 789" 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">Service Type *</label>
          <select 
            name="service" 
            value={form.service} 
            onChange={handleChange} 
            className="w-full bg-white border-2 border-gray-200 rounded-xl px-5 py-4 text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-gray-300 shadow-sm cursor-pointer"
          >
            {SERVICE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">Your Message *</label>
        <textarea 
          name="message" 
          value={form.message} 
          onChange={handleChange} 
          required 
          className="w-full bg-white border-2 border-gray-200 rounded-xl px-5 py-4 text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-gray-300 shadow-sm resize-none" 
          rows={6} 
          placeholder="Tell us about your project, requirements, or any questions you have..." 
        />
      </div>

      <div className="pt-4">
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-white font-extrabold px-8 py-5 rounded-2xl text-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg uppercase tracking-wide"
        >
          {loading ? "Sending Your Message..." : "Send Message"}
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 text-center">
          <p className="text-green-700 font-bold text-lg mb-2">✓ Message Sent Successfully!</p>
          <p className="text-green-600">Thank you! We'll get back to you within 72 hours.</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-6 text-center">
          <p className="text-red-700 font-bold text-lg mb-2">⚠ Error</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </form>
  );
}

const Connect = () => {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Diary of an OFW",
    "url": "https://www.diaryofanofw.com",
    "contactPoint": [{
      "@type": "ContactPoint",
      "telephone": "+420774900384",
      "contactType": "customer support",
      "email": "info@diaryofanofw.com",
      "areaServed": "Worldwide",
      "availableLanguage": ["English"]
    }]
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <Header />
      <main className="py-20 lg:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-center mb-16 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">Let Us Know How We Can Help You</h1>
          <div className="flex justify-center mb-12">
            <img
              src="/services.png"
              alt="OFW IT Professionals and Promoters"
              className="rounded-2xl shadow-2xl w-full max-w-4xl h-80 lg:h-96 border border-gray-100"
              style={{ objectFit: "cover" }}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              // Avoid infinite loop if fallback also fails
              t.onerror = null;
              // Inline SVG fallback avoids needing an extra file
              t.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="24">Image unavailable</text></svg>';
            }}
            />
          </div>
          
          <div className="text-center mb-16">
            <p className="text-xl lg:text-2xl text-gray-800 mb-6 max-w-4xl mx-auto leading-relaxed font-medium">
              We offer a comprehensive range of digital services to empower your business and amplify your story. From cutting-edge web development to strategic advertising and media opportunities—we're your partner in success.
            </p>
            <p className="text-lg text-gray-600 mb-0 max-w-3xl mx-auto leading-relaxed">
              Fill out the form below to request a <span className="font-bold text-primary">free consultation</span> tailored to your specific needs.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 mb-16 max-w-5xl mx-auto border border-gray-100">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">Our Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="text-2xl text-primary font-bold">→</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl lg:text-2xl mb-2">Full Stack Web Development</h3>
                  <p className="text-gray-600 text-base">Build modern, scalable websites and web applications from the ground up.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="text-2xl text-primary font-bold">→</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl lg:text-2xl mb-2">Web Renovation & Migration</h3>
                  <p className="text-gray-600 text-base">Upgrade, redesign, or migrate your existing site to cutting-edge platforms.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="text-2xl text-primary font-bold">→</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl lg:text-2xl mb-2">Mobile App Development</h3>
                  <p className="text-gray-600 text-base">Create engaging, user-friendly mobile experiences for iOS and Android.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="text-2xl text-primary font-bold">→</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl lg:text-2xl mb-2">Advertising</h3>
                  <p className="text-gray-600 text-base">Boost your brand visibility with strategic digital marketing and targeted ad campaigns.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="text-2xl text-primary font-bold">→</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl lg:text-2xl mb-2">Interview Guesting</h3>
                  <p className="text-gray-600 text-base">Share your inspiring story or expertise on our podcast and media channels.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="text-2xl text-primary font-bold">→</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl lg:text-2xl mb-2">Custom Solutions</h3>
                  <p className="text-gray-600 text-base">Tailored services designed for your unique business or personal goals.</p>
                </div>
              </div>
            </div>
          </div>
          
          <ContactForm />
        </div>

        {/* Contact details */}
        <section className="py-20 lg:py-28 px-4 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">Contact Details</h2>
            <p className="text-center text-gray-600 mb-12 text-lg">We're here to answer your questions and bring your ideas to life</p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <Mail className="mx-auto mb-4 w-12 h-12 text-primary" />
                <h3 className="font-bold text-xl mb-3 text-gray-900">Email</h3>
                <a href="mailto:info@diaryofanofw.com" className="text-primary hover:text-accent font-semibold transition-colors">info@diaryofanofw.com</a>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <Phone className="mx-auto mb-4 w-12 h-12 text-primary" />
                <h3 className="font-bold text-xl mb-3 text-gray-900">Phone</h3>
                <a href="tel:+420774900384" className="text-primary hover:text-accent font-semibold transition-colors">+420 774 900 384</a>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <MapPin className="mx-auto mb-4 w-12 h-12 text-primary" />
                <h3 className="font-bold text-xl mb-3 text-gray-900">Office</h3>
                <address className="not-italic text-gray-700 font-medium">Czech Republic<br/>(Central Europe)<br/>Diary of an OFW</address>
              </div>
            </div>
            <p className="text-center text-base text-gray-500 mt-10 leading-relaxed">For media inquiries, partnerships, or urgent matters, please include <span className="font-bold text-primary">"URGENT"</span> in the subject line.</p>
          </div>
        </section>
        {/* Structured data for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
      </main>
      <Footer />
    </div>
  );
};

export default Connect;
