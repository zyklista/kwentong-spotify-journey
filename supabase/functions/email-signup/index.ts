import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailSignupRequest {
  email: string;
  name?: string;
  source: string;
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
    const { email, name, source }: EmailSignupRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log('Processing signup:', { email, name, source });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store in database
    const { error: dbError } = await supabase
      .from('email_list')
      .insert([
        {
          email,
          name: name || null,
          source,
          subscribed: true
        }
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
    }

    // Add to visitor tracking
    const { error: visitorError } = await supabase
      .from('visitors')
      .insert([
        {
          email,
          name: name || null,
          signup_source: source,
          user_agent: req.headers.get('user-agent') || null
        }
      ]);

    if (visitorError) {
      console.error('Visitor tracking error:', visitorError);
    }

    // Add to SENDER.NET
    const senderNetApiKey = Deno.env.get('SENDER_NET_API_KEY');

    console.log('SENDER.NET credentials check:', { 
      hasApiKey: !!senderNetApiKey,
      apiKeyPrefix: senderNetApiKey?.substring(0, 8) + '...'
    });

    if (senderNetApiKey) {
      const senderNetUrl = 'https://api.sender.net/v2/subscribers';

      const senderNetData = {
        email: email,
        firstname: name ? name.split(' ')[0] : '',
        lastname: name ? name.split(' ').slice(1).join(' ') : '',
        groups: [source], // Use source as group/tag
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
        message: 'Successfully subscribed to newsletter!' 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error('Error in mailchimp-signup function:', error);
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