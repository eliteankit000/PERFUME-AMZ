# SCENTÉ

Premium perfume affiliate storefront. React + Vite, Supabase (Postgres, Auth, Storage), deployed on Vercel. No cart, checkout, prices, or Amazon API — each product is an image plus your own affiliate link.

```
npm install && npm run dev      # http://localhost:5173
npm run build && npm run preview
```
Setup: see **SUPABASE_SETUP.md**. Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` only.

## Structure
- `src/pages` Home, Admin, AuthCallback · `src/components` storefront · `src/components/admin` dashboard
- `src/lib` supabase, auth, products, analytics · `src/hooks` useProducts, useAuth
- `supabase/schema.sql` tables, RLS, storage policies

## Notes
- `products.category` stores the category key (`men`, `women`, `date`, …); labels live in `src/lib/constants.js`.
- Clicks are recorded through the `track_click` RPC (fire-and-forget; the link never depends on it). Visitors cannot write to any table directly.
- Public visitors read only active products, without `click_count`.

## Security review
- RLS enabled on all three tables; writes require `is_admin()` (profile role `admin` + exact email, granted only to Google sign-ins). Clients cannot write to `profiles`.
- Storage: public read via URL; only the admin can list/upload/replace/delete.
- Only the anon key is in the frontend; no service-role key, no secrets in the repo.
- `/admin` is guarded in the UI and by RLS; it is `noindex` and disallowed in robots.txt.
- Affiliate/image URLs must be HTTPS (form and DB constraints). All text is rendered by React (escaped); no `dangerouslySetInnerHTML`.
- Recommended: keep email sign-ups disabled in Supabase Auth.
- Known limit: click tracking has no rate limiting, so counts can be inflated by scripted requests.
