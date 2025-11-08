import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import bgImage from "@/assets/3d-geometric-bg.jpg";

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
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .insert([
          {
            name: form.name,
            email: form.email,
            phone: form.phone,
            service: form.service,
            message: form.message,
          },
        ]);
      if (!error) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", service: SERVICE_OPTIONS[0].value, message: "" });
      } else {
        setError(error.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-12 space-y-8">
  <h2 className="text-3xl font-bold text-center mb-2 font-sans text-gray-800">Tell us about your needs</h2>
  <p className="text-xl text-center text-gray-600 italic mb-2 font-sans font-normal">Specify your requirements, project, or questions below.</p>
  <p className="text-xl text-center text-gray-600 italic mb-6 font-sans font-normal">Our team will review your inquiry and get back to you within <span className="font-bold">72 hours</span>.</p>
      <div>
        <label className="block mb-1 font-medium">Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="Your full name" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="Your email address" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Phone Number</label>
        <input name="phone" value={form.phone} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="Your phone number" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Service</label>
        <select name="service" value={form.service} onChange={handleChange} className="w-full border rounded px-3 py-2">
          {SERVICE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} required className="w-full border rounded px-3 py-2" rows={4} placeholder="Tell us about your needs or project" />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-6 py-2 rounded">
        {loading ? "Sending..." : "Send Message"}
      </button>
      {success && <div className="text-green-600 mt-2">Thank you! Your message has been sent. We'll get back to you within 72 hours.</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}

const Connect = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Let us know how can we help you</h1>
        <div className="flex justify-center mb-8">
          <img
            src={bgImage}
            alt="OFW IT Professionals and Promoters"
            className="rounded-xl shadow-lg w-full max-w-2xl h-64"
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
        <p className="text-2xl text-center text-gray-800 mb-10 max-w-3xl mx-auto font-semibold leading-relaxed font-sans">
          We offer a range of digital services to support your journey.<br />
          Fill out the form below to request a free consultation tailored to your needs.<br />
        </p>
        <ul className="max-w-2xl mx-auto mb-10 text-2xl text-muted-foreground list-disc pl-8 font-semibold font-sans">
          <li><strong>Full Stack Web Development:</strong> <span className="font-normal">Build modern, scalable websites and web apps from scratch.</span></li>
          <li><strong>Web Renovation & Migration:</strong> <span className="font-normal">Upgrade, redesign, or migrate your existing site to new platforms.</span></li>
          <li><strong>Mobile App Development:</strong> <span className="font-normal">Create engaging mobile experiences for iOS and Android.</span></li>
          <li><strong>Advertising:</strong> <span className="font-normal">Boost your brand with digital marketing and ad campaigns.</span></li>
          <li><strong>Interview Guesting:</strong> <span className="font-normal">Feature your story or expertise in our podcast and media channels.</span></li>
          <li><strong>Others:</strong> <span className="font-normal">Custom solutions for unique business or personal needs.</span></li>
        </ul>
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Connect;
