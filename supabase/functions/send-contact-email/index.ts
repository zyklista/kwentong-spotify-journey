import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
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
    const { name, email, phone, service, message }: ContactEmailRequest = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
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

    // Store contact submission in database
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert([{ name, email, phone, service, message }]);

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue with email sending even if DB insert fails
    }

    // Store in unified email list
    const { error: emailListError } = await supabase
      .from('email_list')
      .insert([{ 
        email, 
        name, 
        source: 'contact_form'
      }])
      .select()
      .single();

    if (emailListError) {
      console.error('Email list error:', emailListError);
      // Continue with email sending even if email list insert fails
    }

    // Send auto-reply to the visitor
    const visitorHtmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Contacting Us!</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 3px solid #1e4a72;">
            <img src="https://diaryofanofw.com/logo.png" alt="Diary of an OFW Logo" style="max-width: 150px; height: auto; margin-bottom: 10px;" />
            <h1 style="color: #1e4a72; margin: 0; font-size: 28px;">Diary of an OFW</h1>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Real Talk. Real Stories. Real Solutions.</p>
          </div>
          
          <!-- Main Content -->
          <div style="background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%); padding: 30px; border-radius: 12px; border-left: 5px solid #1e4a72; margin-bottom: 20px;">
            <h2 style="color: #1e4a72; margin-top: 0; font-size: 24px;">Thank You for Reaching Out! 🙏</h2>
            
            <p style="font-size: 16px;">Hi ${name},</p>
            
            <p style="font-size: 16px; margin: 20px 0;">Thank you for contacting <strong>Diary of an OFW</strong>. We've received your message and truly appreciate you taking the time to reach out to us.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #1e4a72;">
              <p style="margin: 0; font-size: 14px; color: #666;"><strong>Your Message Summary:</strong></p>
              <p style="margin: 10px 0 0 0; font-size: 15px;">"${message.substring(0, 150)}${message.length > 150 ? '...' : ''}"</p>
            </div>
            
            <p style="font-size: 16px;">Our team will analyze your concern and respond to you within <strong>72 hours</strong>. We're committed to providing you with the support and information you need.</p>
            
            <div style="background-color: #1e4a72; color: white; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0; font-size: 16px; text-align: center;">
                <strong>While you wait, explore our:</strong><br/>
                📖 Free OFW guides and resources<br/>
                🎧 Real talk podcast episodes<br/>
                💬 Community stories and tips<br/>
                📝 Latest blog posts
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://diaryofanofw.com" style="background-color: #1e4a72; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Visit Our Website</a>
            </div>
            
            <p style="font-size: 16px;">We're here to support you on your OFW journey. Thank you for being part of our community!</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="margin-bottom: 5px; font-size: 16px;"><strong>Best regards,</strong></p>
              <p style="color: #1e4a72; font-weight: bold; margin: 0; font-size: 18px;">Diary of an OFW Team</p>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Empowering OFWs worldwide 🌍</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666; margin: 5px 0;">
              This is an automated confirmation. We'll reply to your message personally soon.
            </p>
            <p style="font-size: 12px; color: #666; margin: 5px 0;">
              © Diary of an OFW - Real stories, real solutions for overseas Filipino workers
            </p>
          </div>
        </div>
      </body>
    </html>`;

    // Send notification to admin
    const adminHtmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>New Contact Form Submission</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 3px solid #dc2626;">
            <img src="https://diaryofanofw.com/logo.png" alt="Diary of an OFW Logo" style="max-width: 150px; height: auto; margin-bottom: 10px;" />
            <h1 style="color: #dc2626; margin: 0; font-size: 28px;">New Contact Submission</h1>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Diary of an OFW Admin Panel</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #1e4a72;">
              ${message}
            </div>
          </div>
          
          <p style="font-size: 12px; color: #666;">
            Submitted: ${new Date().toLocaleString()}
          </p>
        </div>
      </body>
    </html>`;

    // Send both emails
    const [visitorEmail, adminEmail] = await Promise.allSettled([
      resend.emails.send({
        from: "Diary of an OFW <info@diaryofanofw.com>",
        to: [email],
        subject: "Thank You for Contacting Us! - Diary of an OFW",
        html: visitorHtmlBody,
      }),
      resend.emails.send({
        from: "Diary of an OFW <info@diaryofanofw.com>",
        to: ["info@diaryofanofw.com"],
        subject: `New Contact Form: ${name} - ${service || 'General Inquiry'}`,
        html: adminHtmlBody,
      })
    ]);

    console.log("Contact form emails sent:", { visitorEmail, adminEmail });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Thank you! We'll get back to you soon."
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
    console.error("Error in send-contact-email function:", error);
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