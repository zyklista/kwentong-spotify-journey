import { useState } from "react";

const ContactFormUI = ({ endpoint }: { endpoint: string }) => {
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
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", name, email })
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
  <form onSubmit={handleSubmit} className="w-full bg-gradient-to-b from-background to-secondary/5 rounded-none shadow-none p-0 space-y-6 flex flex-col items-center">
          <div className="flex flex-col items-center mb-6 w-full">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-base font-semibold shadow mb-2">Newsletter</span>
            <p className="text-3xl font-bold text-center text-gray-800 mb-2">Subscribe for Updates</p>
            <p className="text-base text-center text-gray-700">Get the latest stories, news, and exclusive content delivered to your inbox.</p>
          </div>
          <div className="w-full max-w-md flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input name="name" type="text" value={name} onChange={handleNameChange} required className="w-full border rounded px-3 py-2" placeholder="Enter your name" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input name="email" type="email" value={email} onChange={handleEmailChange} required className="w-full border rounded px-3 py-2" placeholder="Enter your email address" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full max-w-md bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-6 py-2 rounded">
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
          {success && <div className="text-green-600 mt-2">Thank you for subscribing!</div>}
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </form>
      </div>
    </section>
  );
};

export default ContactFormUI;
