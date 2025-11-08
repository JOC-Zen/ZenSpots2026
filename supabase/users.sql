-- Create users table (if not exists)
create table if not exists public.users (
  id bigserial primary key,
  name text not null,
  email text not null unique,
  avatar_url text,
  bio text,
  is_host boolean not null default false,
  created_at timestamptz not null default now()
);

-- Ensure columns exist for pre-existing tables (idempotent safety)
alter table public.users add column if not exists name text not null default '';
alter table public.users add column if not exists email text unique;
alter table public.users add column if not exists avatar_url text;
alter table public.users add column if not exists bio text;
alter table public.users add column if not exists is_host boolean not null default false;
alter table public.users add column if not exists created_at timestamptz not null default now();

-- Enable Row Level Security
alter table public.users enable row level security;

-- Reset policies (idempotent)
drop policy if exists "Users are readable by everyone" on public.users;
drop policy if exists "Authenticated can insert user profiles" on public.users;
drop policy if exists "Users can update their own profile" on public.users;

-- Read: anyone can read (anon + authenticated)
create policy "Users are readable by everyone" on public.users
for select
to public
using (true);

-- Insert: only authenticated users
create policy "Authenticated can insert user profiles" on public.users
for insert
to authenticated
with check (true);

-- Update: authenticated users can update their own profile
create policy "Users can update their own profile" on public.users
for update
to authenticated
using (email = auth.email())
with check (email = auth.email());