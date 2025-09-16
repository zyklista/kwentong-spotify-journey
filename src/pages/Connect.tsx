import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") || "";

// Map service codes from the form to Brevo list IDs
const serviceListMap: Record<string, number> = {
  "website-development": 10,
  "mobile-development": 11,
  "advertising": 12,
  "interview-guest": 13
};

serve(async (req) => {
  try {
    // Log the raw incoming request
    const body = await req.json();
    console.log("📥 Incoming request body:", JSON.stringify(body, null, 2));

    const { type, data } = body;

    if (type !== "contact") {
      console.error("❌ Invalid request type:", type);
      return new Response(JSON.stringify({ error: "Invalid request type" }), { status: 400 });
    }

    if (!BREVO_API_KEY) {
      console.error("❌ BREVO_API_KEY is missing in environment variables");
      return new Response(JSON.stringify({ error: "Missing API key" }), { status: 500 });
    }

    const listId = serviceListMap[data.service] || undefined;

    const brevoPayload: Record<string, any> = {
      email: data.email,
      attributes: {
        NAME: data.name,
        PHONE: data.phone, // ✅ phone number from form
        SERVICE: data.service,
        MESSAGE: data.message
      },
      updateEnabled: true
    };

    if (listId) {
      brevoPayload.listIds = [listId];
    }

    // Log the payload we’re sending to Brevo
    console.log("📤 Sending to Brevo:", JSON.stringify(brevoPayload, null, 2));

    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY
      },
      body: JSON.stringify(brevoPayload)
    });

    const rawText = await brevoRes.text();
    console.log("📡 Brevo HTTP status:", brevoRes.status);
    console.log("📡 Brevo raw response:", rawText);

    let brevoJson: any;
    try {
      brevoJson = JSON.parse(rawText);
    } catch {
      brevoJson = { raw: rawText };
    }

    if (!brevoRes.ok) {
      console.error("❌ Brevo API error:", brevoJson);
      return new Response(JSON.stringify({ error: brevoJson }), { status: brevoRes.status });
    }

    console.log("✅ Brevo API success:", brevoJson);
    return new Response(JSON.stringify({ success: true, brevo: brevoJson }), { status: 200 });

  } catch (err) {
    console.error("💥 Function error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
