import { useState } from "react";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // Use the endpoint prop, fallback to the correct default URL
  const edgeFunctionUrl = "https://yvmqcqrewqvwroxinzvn.supabase.co/functions/v1/newsletter-signup";
  const res = await fetch(edgeFunctionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setName("");
        setEmail("");
      } else {
        setError(data.error?.message || "Subscription failed.");
      }
    } catch (err: any) {
      setError(err.message || "Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <section className="bg-gradient-to-b from-secondary/30 to-background/80 relative overflow-hidden">
    <div className="w-full relative z-10">
      <form onSubmit={handleSubmit} className="w-full bg-gradient-to-b from-background to-secondary/5 rounded-none shadow-none p-0 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6 w-full">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-base font-semibold shadow mb-2 mt-6">Newsletter</span>
          <p className="text-3xl font-bold text-center text-gray-800 mb-2">Subscribe for Updates</p>
          <p className="text-base text-center text-gray-700">Get the latest stories, news, and exclusive content delivered to your inbox.</p>
        </div>
        <div className="w-full flex flex-row gap-4 items-center justify-center">
          <input name="name" type="text" value={name} onChange={handleNameChange} required className="w-64 border rounded px-4 py-2 mx-2" placeholder="Your name" />
          <input name="email" type="email" value={email} onChange={handleEmailChange} required className="w-64 border rounded px-4 py-2 mx-2" placeholder="Your email address" />
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-6 py-2 rounded whitespace-nowrap mx-2">
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
        {success && <div className="text-green-600 mt-2">Thank you for subscribing!</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  </section>
  );
};

export default NewsletterForm;
