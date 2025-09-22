// Backend API endpoint to save contact form data to Supabase and send to Brevo
const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Map service to Brevo list ID
const SERVICE_LIST_IDS = {
  'full-stack-web-development': '10',
  'web-renovation-migration': '16',
  'mobile-app-development': '11',
  'advertising': '12',
  'interview-guesting': '13',
  'others': '9',
};

app.post('/api/contact-brevo', async (req, res) => {
  const { name, email, phone, service, message } = req.body;
  try {
    // Save to Supabase
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert([{ name, email, phone, service, message }]);
    if (dbError) {
      return res.status(500).json({ success: false, error: dbError.message });
    }
    // Send to Brevo
    const listId = SERVICE_LIST_IDS[service] || SERVICE_LIST_IDS['others'];
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: name, SMS: phone },
        listIds: [listId],
        updateEnabled: true,
      }),
    });
    const brevoData = await brevoRes.json();
    console.log('Brevo response:', brevoRes.status, brevoData); // Debug log
    if (!brevoRes.ok) {
      return res.status(500).json({ success: false, error: brevoData.message || 'Brevo error', details: brevoData });
    }
    res.json({ success: true, brevo: brevoData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = app;
