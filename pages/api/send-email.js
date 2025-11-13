import { createClient } from '@supabase/supabase-js';
import Resend from 'resend';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const { email, name } = req.body;

  const { data: template } = await supabase
    .from('email_templates')
    .select('*')
    .eq('name', 'welcome_email')
    .single();

  const subject = template.subject;
  const body = template.body.replace('{{name}}', name);

  try {
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: email,
      subject,
      html: body,
    });

    await supabase.from('emails').insert({ email, subject, body, status: 'sent' });

    res.status(200).json({ message: 'Email sent!' });
  } catch (error) {
    await supabase.from('emails').insert({ email, subject, body, status: 'failed' });
    res.status(500).json({ error: error.message });
  }
}
