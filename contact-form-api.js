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


// Prefer the new secrets names if provided. Keep backward compatibility with BREVO_API_KEY.
const BREVO_API_KEY = process.env.BREVO_CONTACT_SUBMISSIONS_API || process.env.BREVO_API_KEY;
const DEFAULT_BREVO_LIST_ID = process.env.BREVO_CONTACT_LIST_ID ? parseInt(process.env.BREVO_CONTACT_LIST_ID, 10) : undefined;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;


let supabase = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
} else {
  console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. Database inserts will be skipped.');
}


// Optional mapping of service => Brevo list id. If you set BREVO_CONTACT_LIST_ID env var, it will take precedence.
const serviceListMap = {
  'full-stack-web-development': 10,
  'web-renovation-migration': 11,
  'mobile-app-development': 12,
  'advertising': 13,
  'interview-guesting': 14,
  'others': 9
};

// Lightweight local fallback responder used when OpenAI is unavailable (429/quota) or downstream errors occur.
function generateFallbackReply(userMessage) {
  const msg = (userMessage || '').toLowerCase();
  // Simple heuristic responses for common OFW topics
  if (msg.includes('remit') || msg.includes('remittance') || msg.includes('send money') || msg.includes('money')) {
    return `Here are 3 quick tips for sending money safely:
1) Use a licensed money transfer service or a reputable bank; compare fees and exchange rates.
2) Double-check recipient details before sending; confirm full name and account numbers.
3) Keep transaction receipts and use tracking; avoid sharing PINs or OTPs with anyone.`;
  }
  if (msg.includes('work') || msg.includes('job') || msg.includes('visa') || msg.includes('contract')) {
    return `Quick guidance on work and contracts: always read your contract carefully, verify employer details, keep copies of important documents, and consult the nearest Philippine embassy or labor office for assistance.`;
  }
  if (msg.includes('health') || msg.includes('insurance') || msg.includes('medical')) {
    return `For health and insurance: check what medical coverage your employer provides, register with local health services, and consider supplemental international travel or expatriate insurance for emergencies.`;
  }

  // Generic fallback
  return `Sorry — our AI assistant is temporarily unavailable. Meanwhile: 1) Try simple, direct questions (e.g., "How do I send remittances safely?"). 2) Check our blog and resources for guides. 3) For urgent support, email us at info@diaryofanofw.com and we'll assist you.`;
}

// Prefer the new secret `OPEN_AI_CHATBOT` for the chatbot proxy, fall back to older env names
const CHATBOT_KEY = process.env.OPEN_AI_CHATBOT || process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;

app.post('/api/contact-form', async (req, res) => {
  try {
    const { type, data } = req.body;
    if (type !== 'contact') {
      return res.status(400).json({ error: 'Invalid request type' });
    }
    if (!BREVO_API_KEY) {
      return res.status(500).json({ error: 'Missing API key' });
    }
    // Save to Supabase if configured; otherwise continue and still try Brevo so local testing works.
    if (supabase) {
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
    } else {
      console.log('Supabase not configured — skipping DB save for contact submission.');
    }
    // Send to Brevo (contacts). Prefer the configured list id secret; otherwise fallback to service-specific lists.
    const listId = DEFAULT_BREVO_LIST_ID ?? serviceListMap[data.service];
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

    // Helper: send payload to Brevo with one retry and improved error handling/logging
    async function sendToBrevo(payload, attempts = 2) {
      const url = 'https://api.brevo.com/v3/contacts';
      let lastError = null;
      for (let i = 0; i < attempts; i++) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              'api-key': BREVO_API_KEY
            },
            body: JSON.stringify(payload),
            timeout: 10000
          });
            const text = await response.text();
            let json;
            try { json = JSON.parse(text); } catch { json = { raw: text }; }
            if (response.ok) {
              console.log('Brevo: contact created/updated', json);
              return { ok: true, status: response.status, body: json };
            }
            // Handle common Brevo duplicate contact error gracefully — updateEnabled should already cover this,
            // but some API responses may return 400 with specific messages. We'll log and treat duplicates as success.
            const bodyStr = typeof json === 'string' ? json : JSON.stringify(json);
            if (bodyStr && bodyStr.toLowerCase().includes('already exist')) {
              console.warn('Brevo: contact already exists, treating as success', bodyStr);
              return { ok: true, status: response.status, body: json };
            }
            lastError = { status: response.status, body: json };
            console.warn('Brevo request failed', lastError);
        } catch (err) {
          lastError = err;
          console.error('Brevo request error', err);
        }
        // small backoff before retry
        await new Promise(r => setTimeout(r, 500 * (i + 1)));
      }
      return { ok: false, error: lastError };
    }

    const brevoResult = await sendToBrevo(brevoPayload, 2);
    if (!brevoResult.ok) {
      // Log and return a 202 (accepted) to avoid failing the entire submission when Brevo is temporarily unreachable.
      console.error('Failed to deliver contact to Brevo after retries', brevoResult.error);
      return res.status(202).json({ success: true, warning: 'Saved locally but failed to send to Brevo', brevoError: brevoResult.error });
    }
    return res.status(200).json({ success: true, brevo: brevoResult.body });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// Single chatbot proxy endpoint (returns clear error if key missing)
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message, messages } = req.body || {};

    if (!CHATBOT_KEY) {
      return res.status(500).json({ error: 'OPEN_AI_CHATBOT (or fallback) not configured on server' });
    }

    const chatMessages = [
      { role: 'system', content: 'You are an empathetic assistant for Overseas Filipino Workers (OFWs). Provide concise, helpful, and culturally appropriate responses.' }
    ];

    if (Array.isArray(messages) && messages.length) {
      messages.forEach(m => { if (m && m.role && m.content) chatMessages.push({ role: m.role, content: m.content }); });
    } else if (message) {
      chatMessages.push({ role: 'user', content: message });
    } else {
      return res.status(400).json({ error: 'Missing message or messages in request body' });
    }

    const openaiUrl = 'https://api.openai.com/v1/chat/completions';
    const resp = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHATBOT_KEY}`
      },
      body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: chatMessages, temperature: 0.7, max_tokens: 512 }),
      timeout: 20000
    });

    const text = await resp.text();
    let json;
    try { json = JSON.parse(text); } catch { json = { raw: text }; }

    if (!resp.ok) {
      // If OpenAI signals quota (429), return a helpful local fallback reply instead of an error
      if (resp.status === 429) {
        const fallback = generateFallbackReply(message || (messages && messages.slice(-1)[0]?.content));
        console.warn('OpenAI quota hit — returning local fallback reply');
        return res.status(200).json({ reply: fallback, fallback: true, reason: 'quota' });
      }
      // Otherwise forward the exact status from OpenAI (401/unauthorized, etc.)
      return res.status(resp.status).json({ error: 'OpenAI API error', status: resp.status, body: json });
    }

    const reply = json?.choices?.[0]?.message?.content ?? (typeof json === 'string' ? json : JSON.stringify(json));
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chatbot proxy error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Contact form API running on http://localhost:${PORT}/api/contact-form`);
});


