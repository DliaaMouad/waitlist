import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getWelcomeEmailHtml } from './email-template';

// Environment variables (set these in your deployment or local env)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || 'no-reply@aurium.site';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.');
}
if (!RESEND_API_KEY) {
  console.warn('Warning: RESEND_API_KEY is not set.');
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '');
const resend = new Resend(RESEND_API_KEY || '');

function isValidEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export default async function handler(req: any, res: any) {
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

  const email = (req.body?.email && String(req.body.email).trim().toLowerCase()) || '';

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Check deduplication first
    const { data: existing, error: selectError } = await supabase
      .from('waitlist_users')
      .select('id, email')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (selectError) {
      console.error('Supabase select error:', selectError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (existing) {
      return res.status(409).json({ message: 'Already on waitlist' });
    }

    // Insert new waitlist entry
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
      return res.status(500).json({ error: 'Database insert error' });
    }

    // Send welcome email via Resend — do not block or roll back DB if email fails
    try {
      const emailRes = await resend.emails.send({
        from: RESEND_FROM,
        to: [email],
        subject: 'Welcome to the Waitlist! 🚀',
        html: getWelcomeEmailHtml(email),
        text: `Hi ${email},\n\nThanks for joining our waitlist — we'll reach out with updates!`,
      });
      console.info('Resend sent id:', (emailRes as any)?.id || 'no-id');
    } catch (err) {
      console.error('Resend send error:', err);
    }

    return res.status(201).json({ message: 'Joined waitlist', entry: inserted || null });

  } catch (err) {
    console.error('Unhandled error in join handler:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
