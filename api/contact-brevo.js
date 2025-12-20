import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('Edge function starting...')

Deno.serve(async (req) => {
  console.log('Request received:', req.method, req.url)

  // Handle CORS
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight')
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      console.log('Method not allowed:', req.method)
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Parsing request body...')
    const body = await req.json()
    console.log('Request body parsed:', Object.keys(body))

    const { name, email, phone, service, message } = body

    // Validate required fields
    if (!name || !email || !phone || !service || !message) {
      console.log('Validation failed - missing fields')
      return new Response(
        JSON.stringify({ error: 'All fields are required (name, email, phone, service, message)' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email)
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Validation passed, initializing Supabase client...')

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    console.log('SUPABASE_URL present:', !!supabaseUrl)
    console.log('SUPABASE_SERVICE_ROLE_KEY present:', !!supabaseServiceKey)

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error - missing database credentials' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log('Supabase client created')

    // STEP 1: Save to database first (this is the primary requirement)
    console.log('Saving to contact_submissions table...')
    const { data: dbData, error: dbError } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          phone,
          service,
          message,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({
          error: 'Failed to save to database: ' + dbError.message,
          success: false
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('✅ Successfully saved to database:', dbData)

    // STEP 2: Add to Brevo mailing list (secondary - don't fail if this fails)
    console.log('Adding to Brevo mailing list...')
    const brevoApiKey = Deno.env.get('BREVO_CONTACT_FORM_API_KEY')

    let brevoSuccess = false
    if (brevoApiKey) {
      try {
        const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': brevoApiKey
          },
          body: JSON.stringify({
            email: email,
            attributes: {
              FIRSTNAME: name.split(' ')[0],
              LASTNAME: name.split(' ').slice(1).join(' '),
              PHONE: phone,
              SERVICE_INTEREST: service,
              MESSAGE: message
            },
            listIds: [9], // Mandatory list ID 9
            updateEnabled: true // Update if contact already exists
          })
        })

        const brevoData = await brevoResponse.json()
        console.log('Brevo response status:', brevoResponse.status)
        console.log('Brevo response:', brevoData)

        if (brevoResponse.ok || brevoResponse.status === 400) { // 400 might mean already exists
          brevoSuccess = true
          console.log('✅ Successfully added to Brevo list')
        } else {
          console.error('❌ Brevo API error:', brevoData)
        }
      } catch (brevoError) {
        console.error('❌ Brevo request failed:', brevoError.message)
      }
    } else {
      console.warn('⚠️ BREVO_CONTACT_FORM_API_KEY not configured, skipping Brevo integration')
    }

    // STEP 3: Send admin notification email (optional)
    console.log('Sending admin notification email...')
    let emailSuccess = false
    if (brevoApiKey) {
      try {
        const adminEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': brevoApiKey
          },
          body: JSON.stringify({
            sender: { email: 'noreply@diaryofanofw.com', name: 'Diary of an OFW Contact Form' },
            to: [{ email: 'info@diaryofanofw.com' }],
            subject: `New Contact Form Submission: ${service}`,
            htmlContent: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Service:</strong> ${service}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
              <hr>
              <p><em>This message was sent from the contact form on diaryofanofw.com</em></p>
            `
          })
        })

        if (adminEmailResponse.ok) {
          emailSuccess = true
          console.log('✅ Admin notification email sent')
        } else {
          console.error('❌ Admin email failed:', await adminEmailResponse.text())
        }
      } catch (emailError) {
        console.error('❌ Admin email request failed:', emailError.message)
      }
    }

    console.log('Function completed successfully')

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contact form submitted successfully',
        databaseSaved: true,
        brevoAdded: brevoSuccess,
        emailSent: emailSuccess,
        recordId: dbData?.[0]?.id
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error: ' + error.message,
        success: false
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})