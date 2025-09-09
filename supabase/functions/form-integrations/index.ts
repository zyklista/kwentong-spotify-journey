import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FormSubmissionRequest {
  type: 'ebook' | 'contact';
  data: {
    name?: string;
    email: string;
    phone?: string;
    service?: string;
    message?: string;
  };
  makeWebhookUrl?: string;
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
    const { type, data, makeWebhookUrl }: FormSubmissionRequest = await req.json();

    console.log(`Processing ${type} form submission:`, data);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for existing records to prevent duplicates
    let insertResult;
    if (type === 'ebook') {
      // Check if email already exists
      const { data: existingRecord } = await supabase
        .from('ebook_signups')
        .select('id')
        .eq('email', data.email)
        .single();

      if (!existingRecord) {
        insertResult = await supabase
          .from('ebook_signups')
          .insert([{
            email: data.email,
            name: data.name || null
          }]);
      } else {
        console.log('Email already exists in ebook_signups, skipping database insert');
      }
    } else if (type === 'contact') {
      // Always insert contact submissions as they can be multiple inquiries from same person
      insertResult = await supabase
        .from('contact_submissions')
        .insert([{
          name: data.name!,
          email: data.email,
          phone: data.phone || null,
          service: data.service || null,
          message: data.message!
        }]);
    }

    if (insertResult?.error) {
      throw new Error(`Database error: ${insertResult.error.message}`);
    }

    console.log('Data stored successfully in database');

    // Integrate with Brevo
    await integrateBrevo(type, data);

    // Integrate with Sender.net
    await integrateSenderNet(type, data);

    // Integrate with Make.com - check both provided URL and environment variable
    const envMakeWebhookUrl = Deno.env.get('MAKE_WEBHOOK_URL');
    if (makeWebhookUrl || envMakeWebhookUrl) {
      await integrateMakeCom(makeWebhookUrl || envMakeWebhookUrl!, type, data);
    }

    // Send automated email response
    try {
      let emailFunctionName = '';
      if (type === 'ebook') {
        emailFunctionName = 'send-ebook-email';
      } else if (type === 'contact') {
        emailFunctionName = 'send-contact-email';
      }

      if (emailFunctionName) {
        const { error: emailError } = await supabase.functions.invoke(emailFunctionName, {
          body: data
        });
        
        if (emailError) {
          console.error('Email sending error:', emailError);
          // Don't fail the main process if email fails
        } else {
          console.log('Automated email sent successfully');
        }
      }
    } catch (emailError) {
      console.error('Email function error:', emailError);
      // Continue with success response even if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${type} form submitted successfully` 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in form-integrations function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

async function integrateBrevo(type: 'ebook' | 'contact', data: any) {
  try {
    const apiKey = Deno.env.get('BREVO_API_KEY');
    if (!apiKey) {
      console.warn('BREVO_API_KEY not configured');
      return;
    }

    // Create contact payload for Brevo
    const payload = {
      email: data.email,
      attributes: {
        FIRSTNAME: data.name || '',
        ...(type === 'contact' && {
          PHONE: data.phone || '',
          SERVICE: data.service || '',
          MESSAGE: data.message || ''
        })
      },
      listIds: type === 'ebook' ? [1] : [2], // You can configure list IDs in Brevo
      updateEnabled: true // This prevents duplicates by updating existing contacts
    };

    console.log('Sending to Brevo:', payload);

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brevo API error:', response.status, errorText);
    } else {
      const result = await response.json();
      console.log('Brevo integration successful:', result);
    }

  } catch (error) {
    console.error('Error integrating with Brevo:', error);
  }
}

async function integrateSenderNet(type: 'ebook' | 'contact', data: any) {
  try {
    const apiKey = Deno.env.get('SENDER_NET_API_KEY');
    if (!apiKey) {
      console.warn('SENDER_NET_API_KEY not configured');
      return;
    }

    const listId = type === 'ebook' 
      ? Deno.env.get('SENDER_NET_EBOOK_LIST_ID')
      : Deno.env.get('SENDER_NET_CONTACT_LIST_ID');

    if (!listId) {
      console.warn(`SENDER_NET_${type.toUpperCase()}_LIST_ID not configured`);
      return;
    }

    const payload = {
      email: data.email,
      firstName: data.name || '',
      groups: [type === 'ebook' ? 'ebook-subscribers' : 'contact-leads'],
      ...(type === 'contact' && {
        fields: {
          message: data.message || '',
          phone: data.phone || '',
          service: data.service || ''
        }
      })
    };

    console.log('Sending to Sender.net:', payload);

    const response = await fetch('https://api.sender.net/v2/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sender.net API error:', response.status, errorText);
    } else {
      const result = await response.json();
      console.log('Sender.net integration successful:', result);
    }

  } catch (error) {
    console.error('Error integrating with Sender.net:', error);
  }
}

async function integrateMakeCom(webhookUrl: string, type: string, data: any) {
  try {
    const payload = {
      type,
      timestamp: new Date().toISOString(),
      data: {
        ...data,
        source: 'diary-of-an-ofw'
      }
    };

    console.log('Sending to Make.com webhook:', payload);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Make.com webhook error:', response.status, errorText);
    } else {
      console.log('Make.com integration successful');
    }

  } catch (error) {
    console.error('Error integrating with Make.com:', error);
  }
}

serve(handler);