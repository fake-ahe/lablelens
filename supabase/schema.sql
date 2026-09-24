-- ==============================================================================
-- FOOD DECODE - SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Create scans table for food-label scanner
create table if not exists public.scans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_name text not null,
  ingredients jsonb default '[]'::jsonb,
  nutrition jsonb default '{}'::jsonb,
  health_score numeric,
  warnings jsonb default '[]'::jsonb,
  image_url text,
  raw_data jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Create favorites table
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  scan_id uuid references public.scans(id) on delete cascade not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  unique(user_id, scan_id)
);

-- Indexes for performance
create index if not exists idx_scans_user_id on public.scans(user_id);
create index if not exists idx_scans_created_at on public.scans(created_at desc);
create index if not exists idx_favorites_user_id on public.favorites(user_id);
create index if not exists idx_favorites_scan_id on public.favorites(scan_id);

-- ==============================================================================
-- 4. Enable Row Level Security (RLS) on all tables
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.scans enable row level security;
alter table public.favorites enable row level security;

-- ==============================================================================
-- 5. Row Level Security Policies
-- ==============================================================================

-- Profiles RLS: Users can only access and modify their own profile
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Scans RLS: Users can only create, read, update, and delete their own scans
drop policy if exists "Users can view own scans" on public.scans;
create policy "Users can view own scans"
  on public.scans for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own scans" on public.scans;
create policy "Users can insert own scans"
  on public.scans for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own scans" on public.scans;
create policy "Users can update own scans"
  on public.scans for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own scans" on public.scans;
create policy "Users can delete own scans"
  on public.scans for delete
  using (auth.uid() = user_id);

-- Favorites RLS: Users can only view, insert, and delete their own favorites
drop policy if exists "Users can view own favorites" on public.favorites;
create policy "Users can view own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own favorites" on public.favorites;
create policy "Users can insert own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own favorites" on public.favorites;
create policy "Users can delete own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- 6. Trigger to automatically create a profile row upon auth.users signup
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url, created_at, updated_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    now(),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger cleanly
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
