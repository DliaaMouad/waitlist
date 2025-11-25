import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getWelcomeEmailHtml } from './email-template.js';

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export default async function handler(req, res) {
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

    // Check Environment Variables
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM = process.env.RESEND_FROM || 'no-reply@aurium.site';

    if (!SUPABASE_URL) return res.status(500).json({ error: 'Missing SUPABASE_URL' });
    if (!SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' });
    if (!RESEND_API_KEY) return res.status(500).json({ error: 'Missing RESEND_API_KEY' });

    // Initialize Clients
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
        // Check for existing email
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

        // Insert new entry
        const { data: inserted, error: insertError } = await supabase
            .from('waitlist_users')
            .insert([{ email }])
            .select('id, email, created_at')
            .maybeSingle();

        if (insertError) {
            if (insertError.code === '23505') {
                return res.status(409).json({ message: 'Already on waitlist' });
            }
            console.error('Supabase insert error:', insertError);
            message: 'Joined waitlist successfully',
                entry: inserted
        });

    } catch (error) {
        console.error('Unhandled error:', error);
        return res.status(500).json({ error: `Server Error: ${error.message}` });
    }
}
