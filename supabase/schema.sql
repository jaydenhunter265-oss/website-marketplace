-- ============================================================
-- FuturiMarket — Database Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- ── Users ────────────────────────────────────────────────────
-- Extends Supabase Auth's auth.users with a public profile.
create table if not exists public.users (
  id         uuid references auth.users(id) on delete cascade primary key,
  email      text not null,
  created_at timestamptz default now() not null
);

alter table public.users enable row level security;

drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Auto-create profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── Listings ─────────────────────────────────────────────────
create table if not exists public.listings (
  id               uuid default gen_random_uuid() primary key,
  -- Core fields (map to existing Listing type)
  title            text not null,
  description      text not null,
  price            numeric not null,
  image_url        text,
  user_id          uuid references public.users(id) on delete cascade not null,
  -- Financial details
  category         text not null,
  tech_stack       text,
  monthly_revenue  numeric default 0,
  monthly_profit   numeric default 0,
  monthly_traffic  integer default 0,
  monetization     text,
  -- Seller metadata
  website_url      text,
  age_bracket      text,
  contact_name     text,
  contact_email    text,
  contact_telegram text,
  notes            text,
  -- Status: pending → active → sold / removed
  status           text default 'active'
                     check (status in ('pending', 'active', 'sold', 'removed')),
  created_at       timestamptz default now() not null
);

alter table public.listings enable row level security;

drop policy if exists "Anyone can view active listings" on public.listings;
create policy "Anyone can view active listings"
  on public.listings for select
  using (status = 'active');

drop policy if exists "Authenticated users can create listings" on public.listings;
create policy "Authenticated users can create listings"
  on public.listings for insert
  with check (auth.uid() = user_id);

drop policy if exists "Owners can update their listings" on public.listings;
create policy "Owners can update their listings"
  on public.listings for update
  using (auth.uid() = user_id);

drop policy if exists "Owners can delete their listings" on public.listings;
create policy "Owners can delete their listings"
  on public.listings for delete
  using (auth.uid() = user_id);


-- ── Orders ───────────────────────────────────────────────────
create table if not exists public.orders (
  id         uuid default gen_random_uuid() primary key,
  buyer_id   uuid references public.users(id) on delete cascade not null,
  listing_id uuid references public.listings(id) on delete cascade not null,
  status     text default 'pending'
               check (status in ('pending', 'accepted', 'completed', 'cancelled')),
  created_at timestamptz default now() not null
);

alter table public.orders enable row level security;

drop policy if exists "Buyers can view their own orders" on public.orders;
create policy "Buyers can view their own orders"
  on public.orders for select
  using (auth.uid() = buyer_id);

drop policy if exists "Sellers can view orders on their listings" on public.orders;
create policy "Sellers can view orders on their listings"
  on public.orders for select
  using (
    exists (
      select 1 from public.listings
      where listings.id = orders.listing_id
        and listings.user_id = auth.uid()
    )
  );

drop policy if exists "Authenticated users can create orders" on public.orders;
create policy "Authenticated users can create orders"
  on public.orders for insert
  with check (auth.uid() = buyer_id);

drop policy if exists "Buyers can cancel their own orders" on public.orders;
create policy "Buyers can cancel their own orders"
  on public.orders for update
  using (auth.uid() = buyer_id);


-- ── Stripe + Admin additions ──────────────────────────────────
-- Run these after the base schema if upgrading an existing project.

-- Add admin flag to users
alter table public.users add column if not exists is_admin boolean default false;

-- Add Stripe payment fields to orders
alter table public.orders add column if not exists stripe_session_id text;
alter table public.orders add column if not exists amount_paid numeric;

-- Admins can view ALL listings (including sold/pending/removed)
drop policy if exists "Admins can view all listings" on public.listings;
create policy "Admins can view all listings"
  on public.listings for select
  using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

-- Admins can update any listing (e.g. change status, remove)
drop policy if exists "Admins can update any listing" on public.listings;
create policy "Admins can update any listing"
  on public.listings for update
  using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

-- Admins can delete any listing
drop policy if exists "Admins can delete any listing" on public.listings;
create policy "Admins can delete any listing"
  on public.listings for delete
  using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

-- Admins can view all orders
drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders"
  on public.orders for select
  using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

-- Admins can view all user profiles
drop policy if exists "Admins can view all users" on public.users;
create policy "Admins can view all users"
  on public.users for select
  using (exists (select 1 from public.users where id = auth.uid() and is_admin = true));

-- ── To make a user an admin (run in SQL editor) ───────────────
-- update public.users set is_admin = true where email = 'admin@yourdomain.com';
