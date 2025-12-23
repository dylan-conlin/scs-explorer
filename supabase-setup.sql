-- SCS Explorer Database Setup
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/xzhicwhgselnlwpjfipz/sql

-- =====================================================
-- TABLES
-- =====================================================

-- User profiles (auto-created on signup)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Favorites (materials, hardware, finishes)
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  item_type text check (item_type in ('material', 'hardware', 'finish')) not null,
  item_id integer not null,
  item_sku text,
  notes text,
  created_at timestamptz default now() not null,

  -- Prevent duplicate favorites
  unique(user_id, item_type, item_id)
);

-- Create indexes for faster queries
create index if not exists favorites_user_id_idx on favorites(user_id);
create index if not exists favorites_item_type_idx on favorites(item_type);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table favorites enable row level security;

-- Profiles Policies
-- Users can read their own profile
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Automatically create profile on signup
create policy "Users can insert own profile on signup"
  on profiles for insert
  with check (auth.uid() = id);

-- Favorites Policies
-- Users can read their own favorites
create policy "Users can read own favorites"
  on favorites for select
  using (auth.uid() = user_id);

-- Users can insert their own favorites
create policy "Users can insert own favorites"
  on favorites for insert
  with check (auth.uid() = user_id);

-- Users can update their own favorites
create policy "Users can update own favorites"
  on favorites for update
  using (auth.uid() = user_id);

-- Users can delete their own favorites
create policy "Users can delete own favorites"
  on favorites for delete
  using (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at on profiles
drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at();

-- Function to auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile when user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();

-- =====================================================
-- DONE!
-- =====================================================

-- Verify tables were created
select
  table_name,
  (select count(*) from information_schema.columns where table_name = t.table_name) as column_count
from information_schema.tables t
where table_schema = 'public'
  and table_name in ('profiles', 'favorites')
order by table_name;
