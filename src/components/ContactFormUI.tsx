import { useState } from "react";

const SERVICE_OPTIONS = [
  { value: "website-development", label: "Website Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "advertising", label: "Advertising" },
  { value: "interview-guest", label: "Interview Guest" },
  { value: "others", label: "Others" }
];

const ContactFormUI = ({ endpoint }: { endpoint: string }) => {
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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
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
      <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2 rounded font-semibold w-full">
        {loading ? "Sending..." : "Send Message"}
      </button>
      {success && <div className="text-green-600 mt-2">Thank you! Your message has been sent.</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default ContactFormUI;
