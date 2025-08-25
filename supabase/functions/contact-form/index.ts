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
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
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
    const { name, email, phone, service, message }: ContactFormRequest = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log('Processing contact form:', { name, email, service });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store contact submission
    const { error: contactError } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          phone: phone || null,
          service: service || null,
          message
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

    // Add to SENDER.NET
    const senderNetApiKey = Deno.env.get('SENDER_NET_API_KEY');

    if (senderNetApiKey) {
      const senderNetUrl = 'https://api.sender.net/v2/subscribers';

      const senderNetData = {
        email: email,
        firstname: name.split(' ')[0],
        lastname: name.split(' ').slice(1).join(' '),
        groups: ['contact_form', service || 'general_inquiry'],
        trigger_automation: true
      };

      try {
        const senderNetResponse = await fetch(senderNetUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${senderNetApiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(senderNetData),
        });

        const senderNetResult = await senderNetResponse.json();
        
        if (!senderNetResponse.ok) {
          console.error('SENDER.NET error:', senderNetResult);
        } else {
          console.log('Successfully added to SENDER.NET:', senderNetResult);
        }
      } catch (senderNetError) {
        console.error('SENDER.NET API error:', senderNetError);
      }
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