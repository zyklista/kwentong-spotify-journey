import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormRequest {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  others?: string;
}

const BREVO_API_KEY = Deno.env.get('BREVO_CONTACT_SUBMISSIONS_API'); // or your chosen env key

const BREVO_LIST_IDS = {
  web: Number(Deno.env.get('CONTACT_LISTS_ID_WEBDEV') || 10),
  mobile: Number(Deno.env.get('CONTACT_LISTS_ID_MOBILEDEV') || 11),
  ads: Number(Deno.env.get('CONTACT_LISTS_ID_ADS') || 12),
  interview: Number(Deno.env.get('CONTACT_LISTS_ID_INTERV') || 13),
  other: Number(Deno.env.get('BREVO_CONTACT_LIST_ID') || 9)
};

function getBrevoListId(service: string) {
  const s = (service || '').trim().toLowerCase();
  if (s.includes('web')) return BREVO_LIST_IDS.web;
  if (s.includes('mobile')) return BREVO_LIST_IDS.mobile;
  if (s.includes('ads')) return BREVO_LIST_IDS.ads;
  if (s.includes('interview')) return BREVO_LIST_IDS.interview;
  return BREVO_LIST_IDS.other;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { name, email, phone, service, message, others }: ContactFormRequest = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Store contact submission in Supabase
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
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Add to email list
    const { error: emailListError } = await supabase
      .from('email_list')
      .insert([
        {
          email,
          name,
          source: 'contact_form',
          subscribed: true
        }
      ]);
    if (emailListError) {
      console.error('Email list error:', emailListError);
    }

    // Add to visitor tracking
    const { error: visitorError } = await supabase
      .from('visitors')
      .insert([
        {
          email,
          name,
          signup_source: 'contact_form',
          user_agent: req.headers.get('user-agent') || null
        }
      ]);
    if (visitorError) {
      console.error('Visitor tracking error:', visitorError);
    }

    // Send to Brevo
    if (BREVO_API_KEY) {
      const brevoPayload = {
        email,
        attributes: {
          FIRSTNAME: name ?? '',
          PHONE: phone ?? '',
          MESSAGE: message ?? '',
          OTHERS: others ?? ''
        },
        listIds: [getBrevoListId(service)],
        updateEnabled: true
      };

      try {
        const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'api-key': BREVO_API_KEY
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
      console.log('Brevo API key not found');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted successfully!' 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error('Error in contact-form function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

serve(handler);
