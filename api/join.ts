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

export const config = {
  runtime: 'edge',
};

function isValidEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  let body: any;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const email = (body && body.email && String(body.email).trim().toLowerCase()) || '';

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email format' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
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
      return new Response(JSON.stringify({ error: 'Database error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    if (existing) {
      return new Response(JSON.stringify({ message: 'Already on waitlist' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    }

    // Insert new waitlist entry
    const { data: inserted, error: insertError } = await supabase
      .from('waitlist_users')
      .insert([{ email }])
      .select('id, email, created_at')
      .maybeSingle();

    if (insertError) {
      if ((insertError as any).code === '23505') {
        return new Response(JSON.stringify({ message: 'Already on waitlist' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
      }
      console.error('Supabase insert error:', insertError);
      return new Response(JSON.stringify({ error: 'Database insert error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Send welcome email via Resend — do not block or roll back DB if email fails
    try {
      const res = await resend.emails.send({
        from: RESEND_FROM,
        to: [email],
        subject: 'Welcome to the Waitlist! 🚀',
        html: getWelcomeEmailHtml(email),
        text: `Hi ${email},\n\nThanks for joining our waitlist — we'll reach out with updates!`,
      });
      console.info('Resend sent id:', (res as any)?.id || 'no-id');
    } catch (err) {
      console.error('Resend send error:', err);
    }

    return new Response(JSON.stringify({ message: 'Joined waitlist', entry: inserted || null }), { status: 201, headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('Unhandled error in join handler:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
