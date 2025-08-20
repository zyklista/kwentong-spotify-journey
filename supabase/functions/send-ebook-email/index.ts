import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EbookEmailRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { email, name }: EbookEmailRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store signup in database
    const { error: dbError } = await supabase
      .from('ebook_signups')
      .insert([{ email, name }]);

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue with email sending even if DB insert fails
    }

    // Create HTML email template
    const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your eBook Is Ready!</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 3px solid #1e4a72;">
            <h1 style="color: #1e4a72; margin: 0; font-size: 28px;">Diary of an OFW</h1>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Real Talk. Real Stories. Real Solutions.</p>
          </div>
          
          <!-- Main Content -->
          <div style="background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%); padding: 30px; border-radius: 12px; border-left: 5px solid #1e4a72; margin-bottom: 20px;">
            <h2 style="color: #1e4a72; margin-top: 0; font-size: 24px;">Your eBook Is Ready! 📘</h2>
            
            ${name ? `<p style="font-size: 16px;">Hi ${name},</p>` : '<p style="font-size: 16px;">Hi there,</p>'}
            
            <p style="font-size: 16px; margin: 20px 0;">Thanks for your interest in <strong>"OFW REAL TALK: Uwing-uwi ka na ba?"</strong></p>
            
            <div style="background-color: #1e4a72; color: white; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0; font-size: 16px; text-align: center;">
                <strong>🎯 What's Inside:</strong><br/>
                ✓ Smart budgeting strategies for OFWs<br/>
                ✓ Investment tips that actually work<br/>
                ✓ Your roadmap to financial freedom<br/>
                ✓ Breaking free from the OFW cycle
              </p>
            </div>
            
            <p style="font-size: 16px;">This comprehensive guide is specially written for our fellow Filipinos working abroad, packed with practical advice you can start using today.</p>
            
            <p style="font-size: 16px; color: #1e4a72; font-weight: bold;">Your download link will be sent to you shortly, or you can access it directly from our website.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://diaryofanofw.com" style="background-color: #1e4a72; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Visit Our Website</a>
            </div>
            
            <p style="font-size: 16px;">Feel free to reach out if you have any questions or want to share your own OFW story!</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="margin-bottom: 5px; font-size: 16px;"><strong>Best regards,</strong></p>
              <p style="color: #1e4a72; font-weight: bold; margin: 0; font-size: 18px;">Diary of an OFW Team</p>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Empowering OFWs worldwide 🌍</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666; margin: 5px 0;">
              This email contains your requested OFW Real Talk eBook information.
            </p>
            <p style="font-size: 12px; color: #666; margin: 5px 0;">
              © Diary of an OFW - Real stories, real solutions for overseas Filipino workers
            </p>
            <p style="font-size: 11px; color: #999; margin: 10px 0 0 0;">
              You received this email because you requested our free eBook. We respect your privacy.
            </p>
          </div>
        </div>
      </body>
    </html>`;

    // Plain text version
    const textBody = `Hi ${name || 'there'},

Thanks for your interest in "OFW REAL TALK: Uwing-uwi ka na ba?"

This comprehensive guide covers:
- Smart budgeting strategies for OFWs
- Investment tips that actually work  
- Your roadmap to financial freedom
- Breaking free from the OFW cycle

Your download link will be sent to you shortly, or you can access it directly from our website at diaryofanofw.com

Feel free to reach out if you have any questions!

Best regards,
Diary of an OFW Team
Empowering OFWs worldwide`;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Diary of an OFW <info@diaryofanofw.com>",
      to: [email],
      subject: "Your eBook Is Ready! 📘 - OFW Real Talk",
      html: htmlBody,
      text: textBody,
    });

    console.log("eBook auto-response email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-ebook-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email", 
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);