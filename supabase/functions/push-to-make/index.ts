import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const { table, row } = await req.json();
    
    console.log(`Processing ${table} data for Make.com:`, row);

    // Get Make.com webhook URL from environment or use default
    const makeWebhookUrl = Deno.env.get('MAKE_WEBHOOK_URL');
    
    if (!makeWebhookUrl) {
      console.log('MAKE_WEBHOOK_URL not configured, skipping Make.com integration');
      return new Response(
        JSON.stringify({ success: true, message: 'No webhook configured' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Prepare payload for Make.com
    const payload = {
      table,
      timestamp: new Date().toISOString(),
      data: row,
      source: 'diary-of-an-ofw-trigger'
    };

    console.log('Sending to Make.com webhook:', payload);

    // Send to Make.com webhook
    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Make.com webhook error:', response.status, errorText);
      throw new Error(`Make.com webhook failed: ${response.status} ${errorText}`);
    }

    console.log('Make.com integration successful');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Data sent to Make.com successfully' 
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
    console.error('Error in push-to-make function:', error);
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

serve(handler);