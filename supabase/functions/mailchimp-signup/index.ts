import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MailchimpSignupRequest {
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
    const { email, name, source }: MailchimpSignupRequest = await req.json();

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

    // Add to Mailchimp
    const mailchimpApiKey = Deno.env.get('MAILCHIMP_API_KEY');
    const mailchimpListId = Deno.env.get('MAILCHIMP_LIST_ID');

    if (mailchimpApiKey && mailchimpListId) {
      const datacenter = mailchimpApiKey.split('-')[1];
      const mailchimpUrl = `https://${datacenter}.api.mailchimp.com/3.0/lists/${mailchimpListId}/members`;

      const mailchimpData = {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: name ? name.split(' ')[0] : '',
          LNAME: name ? name.split(' ').slice(1).join(' ') : ''
        },
        tags: [source]
      };

      try {
        const mailchimpResponse = await fetch(mailchimpUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mailchimpApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mailchimpData),
        });

        const mailchimpResult = await mailchimpResponse.json();
        
        if (!mailchimpResponse.ok) {
          console.error('Mailchimp error:', mailchimpResult);
          
          // If email already exists, try to update instead
          if (mailchimpResult.title === 'Member Exists') {
            const updateResponse = await fetch(`${mailchimpUrl}/${btoa(email.toLowerCase())}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${mailchimpApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...mailchimpData,
                status: 'subscribed'
              }),
            });
            
            console.log('Mailchimp update response:', await updateResponse.json());
          }
        } else {
          console.log('Successfully added to Mailchimp:', mailchimpResult);
        }
      } catch (mailchimpError) {
        console.error('Mailchimp API error:', mailchimpError);
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