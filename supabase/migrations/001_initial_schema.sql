-- ==============================================================================
-- FOOD DECODE - PHASE 1: SUPABASE DATABASE FOUNDATION MIGRATION
-- Migration: 001_initial_schema.sql
-- ==============================================================================

-- Enable UUID extension if not already present
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 1. PROFILES TABLE
-- ==============================================================================
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 2. SCANS TABLE
-- ==============================================================================
create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_name text not null,
  brand text,
  barcode text,
  image_url text,
  analysis_json jsonb not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 3. FAVORITES TABLE
-- ==============================================================================
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  scan_id uuid references public.scans(id) on delete cascade not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  constraint uq_user_favorite_scan unique (user_id, scan_id)
);

-- ==============================================================================
-- 4. USER PREFERENCES TABLE
-- ==============================================================================
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  dietary_preferences jsonb default '[]'::jsonb,
  allergens jsonb default '[]'::jsonb,
  region text default 'US',
  language text default 'en',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 5. USAGE TABLE
-- ==============================================================================
create table if not exists public.usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date default current_date not null,
  scan_count integer default 0 not null,
  chat_count integer default 0 not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  constraint uq_user_usage_date unique (user_id, date)
);

-- ==============================================================================
-- 6. PRODUCTS TABLE (Global verified food catalog)
-- ==============================================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  barcode text unique,
  product_name text not null,
  brand text,
  image_url text,
  ingredients text,
  nutrition_json jsonb,
  source text,
  country text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 7. PERFORMANCE INDEXES
-- ==============================================================================
create index if not exists idx_scans_user_id on public.scans(user_id);
create index if not exists idx_scans_created_at on public.scans(created_at desc);
create index if not exists idx_scans_barcode on public.scans(barcode);

create index if not exists idx_favorites_user_id on public.favorites(user_id);

create index if not exists idx_products_barcode on public.products(barcode);
create index if not exists idx_products_product_name on public.products(product_name);

create index if not exists idx_usage_user_id on public.usage(user_id);
create index if not exists idx_usage_date on public.usage(date);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.scans enable row level security;
alter table public.favorites enable row level security;
alter table public.user_preferences enable row level security;
alter table public.usage enable row level security;
alter table public.products enable row level security;

-- PROFILES POLICIES
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- SCANS POLICIES
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

-- FAVORITES POLICIES
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

-- USER PREFERENCES POLICIES
drop policy if exists "Users can view own preferences" on public.user_preferences;
create policy "Users can view own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own preferences" on public.user_preferences;
create policy "Users can insert own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own preferences" on public.user_preferences;
create policy "Users can update own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

-- USAGE POLICIES
drop policy if exists "Users can view own usage" on public.usage;
create policy "Users can view own usage"
  on public.usage for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own usage" on public.usage;
create policy "Users can insert own usage"
  on public.usage for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own usage" on public.usage;
create policy "Users can update own usage"
  on public.usage for update
  using (auth.uid() = user_id);

-- PRODUCTS POLICIES (Public catalog can be read by everyone)
drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable"
  on public.products for select
  using (true);

drop policy if exists "Products can only be modified by service role" on public.products;
create policy "Products can only be modified by service role"
  on public.products for all
  using (auth.role() = 'service_role');
