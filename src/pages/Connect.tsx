
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

const SERVICE_OPTIONS = [
  { value: "website-development", label: "Website Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "advertising", label: "Advertising" },
  { value: "interview-guest", label: "Interview Guest" },
  { value: "others", label: "Others" }
];

const ContactFormServices = ({ endpoint }: { endpoint: string }) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", data: form })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", service: SERVICE_OPTIONS[0].value, message: "" });
      } else {
        setError(data.error?.message || "Submission failed.");
      }
    } catch (err: any) {
      setError(err.message || "Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-secondary/30 to-background/80 py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-lg p-8 space-y-6">
          <div className="flex justify-center mb-4">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-base font-semibold shadow">Our Services</span>
          </div>
          <p className="text-4xl font-bold text-center text-gray-800 mb-4">How Can We Help You?</p>
          <p className="text-lg text-center text-gray-700 mb-6">We offer various services to support your journey. But just like the doctor, we want to know if we fits your needs. Send us how can we help you and we'll get in touch with you within 72hrs</p>
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Service</label>
            <select name="service" value={form.service} onChange={handleChange} className="w-full border rounded px-3 py-2">
              {SERVICE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} required className="w-full border rounded px-3 py-2" rows={4} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-6 py-2 rounded">
            {loading ? "Sending..." : "Send Message"}
          </button>
          {success && <div className="text-green-600 mt-2">Thank you! Your message has been sent.</div>}
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </form>
      </div>
    </section>
  );
};
const Connect = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Connect With Us</h1>
  <ContactFormServices endpoint="https://your-project.supabase.co/functions/v1/contact-form" />
      </main>
      <Footer />
    </div>
  );
};

export default Connect;
