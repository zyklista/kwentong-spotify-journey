import React from "react";
// ...existing code...
// Add a simple ContactFormPage component for default export
const ContactFormPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Contact Form Page</h1>
      {/* You can add your form UI here or import an existing form component */}
    </div>
  );
};

export default ContactFormPage;
// ContactFormPage.ts (frontend)
const serviceListMap: Record<string, number> = {
  "website-development": 10,
  "mobile-development": 11,
  "advertising": 12,
  "interview-guest": 13,
  "others": 9
};

export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) {
  try {
    const payload = {
      type: "contact",
      data: formData
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("❌ Server error:", result);
      throw new Error(result.error || "Something went wrong");
    }

    console.log("✅ Contact form submitted:", result);
    return result;
  } catch (err) {
    console.error("💥 Submission failed:", err);
    throw err;
  }
}
