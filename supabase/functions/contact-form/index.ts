import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Data shape for the request
interface ContactFormRequest {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  others?: string;
}

// Service string to Brevo ENV key mapping
const serviceListMap: Record<string, string> = {
  'web development': 'CONTACT_LISTS_ID_WEBDEV',
  'mobile app development': 'CONTACT_LISTS_ID_MOBILEDEV',
  'advertising partnership': 'CONTACT_LISTS_ID_ADS',
  'be our interview guest': 'CONTACT_LISTS_ID_INTERV',
  'others': 'BREVO_CONTACT_LIST_ID',
};

function getListIdFromEnvKey(envKey: string | undefined) {
  if (!envKey) return null;
  const raw = Deno.env.get(envKey);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isInteger(n) ? n : null;
}

function resolveBrevoListId(service?: string) {
  if (!service) return getListIdFromEnvKey('BREVO_CONTACT_LIST_ID');
  const normalized = service.trim().toLowerCase();
  const envKey = serviceListMap[normalized] || 'BREVO_CONTACT_LIST_ID';
  return getListIdFromEnvKey(envKey);
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { name, email, phone, service, message, others }: ContactFormRequest = await req.json();

    // Validate
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Write to contact_submissions_relaxed
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const { error: contactError } = await supabase
      .from('contact_submissions_relaxed')
      .insert([
        {
          name,
          email,
          phone: phone || null,
          service: service || null,
          message,
          others: others || null
        }
      ]);
    if (contactError) {
      console.error('Contact submission error:', contactError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit contact form' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Brevo integration
    const brevoApiKey = Deno.env.get('BREVO_CONTACT_SUBMISSIONS_API');
    const listId = resolveBrevoListId(service);
    if (brevoApiKey && listId) {
      const brevoPayload = {
        email,
        attributes: {
          FIRSTNAME: name,
          PHONE: phone || "",
          MESSAGE: message,
          OTHERS: others || ""
        },
        listIds: [listId],
        updateEnabled: true
      };

      try {
        const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'api-key': brevoApiKey
          },
          body: JSON.stringify(brevoPayload)
        });
        const brevoResult = await brevoResponse.json();
        if (!brevoResponse.ok) {
          console.error('Brevo error:', brevoResult);
        } else {
          console.log('Successfully added to Brevo:', brevoResult);
        }
      } catch (brevoError) {
        console.error('Brevo API error:', brevoError);
      }
    } else {
      console.log('Brevo API key or listId not found');
    }

    // Success
    return new Response(
      JSON.stringify({ success: true, message: 'Contact form submitted successfully!' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error in contact-form function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
