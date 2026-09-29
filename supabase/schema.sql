-- =====================================================================
-- SCENTÉ — Supabase schema. Paste into Supabase → SQL Editor → Run.
-- Safe to re-run.
--
-- HOW AUTHORIZATION WORKS
--  1. Users sign in with Google (Supabase Auth). Row in auth.users.
--  2. A trigger creates public.profiles(id,email,role). role = 'admin' ONLY
--     when the email is aniketar111@gmail.com AND the provider is google.
--  3. public.is_admin() checks the caller's profile (id = auth.uid()) has
--     role 'admin' and that exact email.
--  4. RLS policies call is_admin() for every write. Clients have NO
--     insert/update/delete rights on profiles, so nobody can self-promote.
--  Public visitors (anon) can only read ACTIVE products.
-- =====================================================================

-- ---------- tables ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  role       text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text check (name is null or char_length(name) <= 80),
  image_url     text check (image_url is null or image_url ~* '^https://'),
  affiliate_url text not null check (affiliate_url ~* '^https://'),
  category      text not null,
  featured      boolean not null default false,
  active        boolean not null default true,
  sort_order    integer not null default 0,
  click_count   integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists products_public_idx on public.products (active, sort_order);
create index if not exists products_category_idx on public.products (category);

create table if not exists public.affiliate_clicks (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  clicked_at timestamptz not null default now()
);
create index if not exists affiliate_clicks_product_idx on public.affiliate_clicks (product_id, clicked_at desc);

-- ---------- updated_at ----------
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin
  if new.click_count is not distinct from old.click_count then new.updated_at := now(); end if;
  return new;
end $$;
drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();

-- ---------- admin strategy ----------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin' and lower(p.email) = 'aniketar111@gmail.com'
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email,
    case when lower(new.email) = 'aniketar111@gmail.com'
          and new.raw_app_meta_data->>'provider' = 'google' then 'admin' else 'user' end)
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Backfill users who signed in before this ran
insert into public.profiles (id, email, role)
select id, email, case when lower(email) = 'aniketar111@gmail.com' and raw_app_meta_data->>'provider' = 'google' then 'admin' else 'user' end
from auth.users on conflict (id) do nothing;

-- ---------- click tracking (only way to write clicks) ----------
create or replace function public.track_click(p_product_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.products where id = p_product_id and active) then
    insert into public.affiliate_clicks (product_id) values (p_product_id);
    update public.products set click_count = click_count + 1 where id = p_product_id;
  end if;
end $$;
revoke all on function public.track_click(uuid) from public;
grant execute on function public.track_click(uuid) to anon, authenticated;

-- ---------- RLS ----------
alter table public.profiles         enable row level security;
alter table public.products         enable row level security;
alter table public.affiliate_clicks enable row level security;

-- Table privileges (RLS still applies on top)
revoke all on public.profiles, public.products, public.affiliate_clicks from anon, authenticated;
grant select on public.profiles to authenticated;
grant select (id, name, image_url, affiliate_url, category, featured, active, sort_order, created_at, updated_at) on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant select on public.affiliate_clicks to authenticated;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles for select to authenticated using (id = auth.uid());

drop policy if exists "products: public read active" on public.products;
create policy "products: public read active" on public.products for select to anon, authenticated using (active = true);
drop policy if exists "products: admin read all" on public.products;
create policy "products: admin read all" on public.products for select to authenticated using (public.is_admin());
drop policy if exists "products: admin insert" on public.products;
create policy "products: admin insert" on public.products for insert to authenticated with check (public.is_admin());
drop policy if exists "products: admin update" on public.products;
create policy "products: admin update" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "products: admin delete" on public.products;
create policy "products: admin delete" on public.products for delete to authenticated using (public.is_admin());

drop policy if exists "clicks: admin read" on public.affiliate_clicks;
create policy "clicks: admin read" on public.affiliate_clicks for select to authenticated using (public.is_admin());

-- ---------- Storage: product-images ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

-- Public bucket: image URLs are readable by anyone. Only the admin can list/write/delete.
drop policy if exists "product-images: admin read"   on storage.objects;
drop policy if exists "product-images: admin insert" on storage.objects;
drop policy if exists "product-images: admin update" on storage.objects;
drop policy if exists "product-images: admin delete" on storage.objects;
create policy "product-images: admin read"   on storage.objects for select to authenticated using (bucket_id = 'product-images' and public.is_admin());
create policy "product-images: admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
create policy "product-images: admin update" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_admin()) with check (bucket_id = 'product-images' and public.is_admin());
create policy "product-images: admin delete" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());
