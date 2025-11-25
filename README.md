# Aurium Waitlist

Welcome! This is the Aurium waitlist application with automated welcome emails powered by Supabase and Resend.

## Features

- ✅ Beautiful waitlist landing page
- ✅ Email validation and duplicate detection
- ✅ Automated welcome emails
- ✅ Supabase database integration
- ✅ Serverless API with Vercel Edge Functions
- ✅ Production-ready deployment

## Getting Started Locally

> **Prerequisites:**
> [NodeJS](https://nodejs.org/en/) must be installed on your system.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Get your credentials:**

   ### Supabase Setup
   - Go to [supabase.com](https://supabase.com) and sign in
   - Select your project (or create a new one)
   - Go to **Project Settings** → **API**
   - Copy the **Project URL** → use as `SUPABASE_URL`
   - Copy the **service_role** key (under "Project API keys") → use as `SUPABASE_SERVICE_ROLE_KEY`
   
   **Database Table:**
   Your `waitlist_users` table should have this schema:
   ```sql
   CREATE TABLE waitlist_users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );
   ```

   ### Resend Setup
   - Go to [resend.com](https://resend.com) and sign in
   - Go to **API Keys** → **Create API Key**
   - Copy the API key → use as `RESEND_API_KEY`
   - Use your verified domain email as `RESEND_FROM` (e.g., `no-reply@aurium.site`)

4. **Run development server:**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:5173/](http://localhost:5173/)

## Deploying to Vercel

### 1. Push to GitHub
Make sure your code is in a GitHub repository.

### 2. Import to Vercel
- Go to [vercel.com](https://vercel.com) and sign in
- Click **"Add New..."** → **"Project"**
- Import your GitHub repository
- Vercel will auto-detect it as a Vite project

### 3. Configure Environment Variables
In the Vercel dashboard, go to **Settings** → **Environment Variables** and add:

| Name | Value | Where to Get It |
|------|-------|-----------------|
| `SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Supabase Dashboard → Settings → API → service_role key |
| `RESEND_API_KEY` | Your Resend API key | Resend Dashboard → API Keys |
| `RESEND_FROM` | `no-reply@aurium.site` | Your verified domain from Resend |

### 4. Deploy
Click **"Deploy"** and Vercel will build and deploy your application!

### 5. Test
Once deployed:
1. Visit your Vercel URL
2. Submit an email to join the waitlist
3. Check that:
   - The email appears in your Supabase `waitlist_users` table
   - A welcome email was sent (check the email inbox)
   - The Resend dashboard shows the sent email

## Project Structure

```
waitlist/
├── api/
│   ├── join.ts              # Serverless function handling waitlist signups
│   └── email-template.ts    # HTML email template
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/
│   │   └── WaitlistBeta/
│   │       └── WaitlistBeta.tsx  # Main waitlist page component
│   └── index.tsx            # App entry point
├── public/                  # Static assets
├── vercel.json             # Vercel configuration
└── .env.example            # Environment variables template
```

## How It Works

1. User enters their email on the landing page
2. Frontend calls `/api/join` endpoint
3. API validates email and checks for duplicates in Supabase
4. If valid and new, the email is added to `waitlist_users` table
5. A welcome email is automatically sent via Resend
6. User sees success confirmation

## Troubleshooting

**Emails not sending?**
- Verify your domain is verified in Resend dashboard
- Check that `RESEND_FROM` uses your verified domain
- Check Vercel logs for any API errors

**Database errors?**
- Verify the `waitlist_users` table exists in Supabase
- Check that `SUPABASE_SERVICE_ROLE_KEY` is the service role key (not the anon key)

**Local development not working?**
- Make sure `.env` file exists with all required variables
- Run `npm install` to ensure dependencies are installed

## License

© 2025 Aurium. All rights reserved.
