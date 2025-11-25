import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getWelcomeEmailHtml } from './email-template';

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Check Environment Variables
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESEND_FROM = process.env.RESEND_FROM || 'no-reply@aurium.site';

  if (!SUPABASE_URL) return res.status(500).json({ error: 'Server Config Error: Missing SUPABASE_URL' });
  if (!SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ error: 'Server Config Error: Missing SUPABASE_SERVICE_ROLE_KEY' });
  if (!RESEND_API_KEY) return res.status(500).json({ error: 'Server Config Error: Missing RESEND_API_KEY' });

  // 2. Initialize Clients
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const resend = new Resend(RESEND_API_KEY);

  const email = (req.body?.email && String(req.body.email).trim().toLowerCase()) || '';

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // 3. Check for existing email in Supabase
    const { data: existing, error: selectError } = await supabase
      .from('waitlist_users')
      .select('id, email')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (selectError) {
      console.error('Supabase select error:', selectError);
      return res.status(500).json({ error: `Database Error: ${selectError.message}` });
    }

    if (existing) {
      return res.status(409).json({ message: 'Already on waitlist' });
    }

    // 4. Insert new entry
    const { data: inserted, error: insertError } = await supabase
      .from('waitlist_users')
      .insert([{ email }])
      .select('id, email, created_at')
      .maybeSingle();

    if (insertError) {
      if ((insertError as any).code === '23505') {
        return res.status(409).json({ message: 'Already on waitlist' });
      }
      console.error('Supabase insert error:', insertError);
      return res.status(500).json({ error: `Insert Error: ${insertError.message}` });
    }

    // 5. Send welcome email
    try {
      await resend.emails.send({
        from: RESEND_FROM,
        to: [email],
        subject: 'Welcome to the Waitlist! 🚀',
        html: getWelcomeEmailHtml(email),
      });
      console.log('Welcome email sent to:', email);
    } catch (emailError: any) {
      console.error('Email send error:', emailError);
      // We don't fail the request if email fails, but we log it
    }

    return res.status(201).json({
      message: 'Joined waitlist successfully',
      entry: inserted
    });

  } catch (error: any) {
    console.error('Unhandled error:', error);
    return res.status(500).json({ error: `Server Error: ${error.message}` });
  }
}
