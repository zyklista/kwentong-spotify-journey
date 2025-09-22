// Local contact form API removed.
// Express API for local testing of contact form
// Save as contact-form-api.js and run with: node contact-form-api.js


import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';


const app = express();
app.use(bodyParser.json());


const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;


const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);


const serviceListMap = {
  'website-development': 10,
  'mobile-development': 11,
  'advertising': 12,
  'interview-guest': 13,
  'others': 9
};

app.post('/api/contact-form', async (req, res) => {
  try {
    const { type, data } = req.body;
    if (type !== 'contact') {
      return res.status(400).json({ error: 'Invalid request type' });
    }
    if (!BREVO_API_KEY) {
      return res.status(500).json({ error: 'Missing API key' });
    }
    // Save to Supabase
    const { error: dbError } = await supabase.from('contact_submissions').insert([
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
    if (dbError) {
      return res.status(500).json({ error: 'Failed to save to database', details: dbError });
    }
    // Send to Brevo
    const listId = serviceListMap[data.service] || undefined;
    const brevoPayload = {
      email: data.email,
      attributes: {
        NAME: data.name,
        PHONE: data.phone,
        SERVICE: data.service,
        MESSAGE: data.message
      },
      updateEnabled: true
    };
    if (listId) {
      brevoPayload.listIds = [listId];
    }
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(brevoPayload)
    });
    const rawText = await brevoRes.text();
    let brevoJson;
    try {
      brevoJson = JSON.parse(rawText);
    } catch {
      brevoJson = { raw: rawText };
    }
    if (!brevoRes.ok) {
      return res.status(brevoRes.status).json({ error: brevoJson });
    }
    return res.status(200).json({ success: true, brevo: brevoJson });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Contact form API running on http://localhost:${PORT}/api/contact-form`);
});
