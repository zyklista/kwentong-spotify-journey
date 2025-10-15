// Supabase Edge Function to add newsletter signup to Brevo and database
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
const BREVO_LIST_ID = 15;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }
  try {
    const { name, email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Save to database
    const { error: dbError } = await supabase
      .from("newsletter_signups")
      .insert([{ email, name }]);
    
    if (dbError) {
      return new Response(
        JSON.stringify({ error: "Failed to save to database", details: dbError }), 
        { status: 500 }
      );
    }

    // Send to Brevo
    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: name },
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });
    const brevoData = await brevoRes.json();
    if (!brevoRes.ok) {
      return new Response(JSON.stringify({ error: brevoData.message || "Brevo error", details: brevoData }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true, brevo: brevoData }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
