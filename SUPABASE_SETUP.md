# SCENTÉ — Supabase + Vercel setup (beginner friendly)

## 1. Create a Supabase project
supabase.com → **New project**. Save the database password. Wait for it to finish provisioning.

## 2. Run the database SQL
Dashboard → **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**.
This creates `products`, `affiliate_clicks`, `profiles`, the RLS policies, the admin rule for `aniketar111@gmail.com`, and the `product-images` storage bucket.

## 3. Check the Storage bucket
**Storage** should list a public bucket named `product-images` (5 MB limit, jpg/png/webp). If missing, create it with those settings and re-run the storage part of the SQL for the policies.

## 4. Get your keys
**Project Settings → API**. Copy **Project URL** and the **anon public** key. Never use the `service_role` key anywhere in this project.

## 5. Enable Google sign-in
1. Google Cloud Console → create a project → **APIs & Services → OAuth consent screen** (External, add your app name and email).
2. **Credentials → Create credentials → OAuth client ID → Web application**.
3. Under **Authorized redirect URIs** add: `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client secret**.
5. Supabase → **Authentication → Providers → Google** → enable, paste both, save.
6. **Authentication → Providers → Email**: turn **off** "Enable email signups" (Google-only login).

## 6. Redirect URLs
Supabase → **Authentication → URL Configuration**
- **Site URL**: your Vercel URL, e.g. `https://scente.vercel.app`
- **Redirect URLs**: add `https://scente.vercel.app/**` and `http://localhost:5173/**`

## 7. Run locally
```
cp .env.example .env      # fill in the two values
npm install
npm run dev
```

## 8. Deploy to Vercel
1. Push the project to GitHub.
2. vercel.com → **Add New → Project** → import the repo (Framework: Vite; build `npm run build`; output `dist`).
3. **Environment Variables** (only these two):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Deploy**. Then update the Supabase Site URL / Redirect URLs to your final domain.
5. Update the `canonical` and `og:url` placeholders in `index.html` to your domain.

## 9. Log into /admin
Open `https://your-domain/admin` → **Continue with Google** → sign in as `aniketar111@gmail.com`. Any other account sees "Access denied." and cannot read or write admin data (enforced by database policies, not just the UI).

**If you signed in before running the SQL:** re-run the SQL; the backfill promotes your existing user.
