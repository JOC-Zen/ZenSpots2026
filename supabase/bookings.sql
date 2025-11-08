-- Create bookings table (if not exists)
create table if not exists public.bookings (
  id bigserial primary key,
  space_id bigint not null references public.spaces(id) on delete cascade,
  user_id bigint not null references public.users(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  total_price numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

-- Ensure columns exist for pre-existing tables (idempotent safety)
alter table public.bookings add column if not exists space_id bigint;
alter table public.bookings add column if not exists user_id bigint;
alter table public.bookings add column if not exists date date;
alter table public.bookings add column if not exists start_time time;
alter table public.bookings add column if not exists end_time time;
alter table public.bookings add column if not exists total_price numeric(10,2) not null default 0;
alter table public.bookings add column if not exists created_at timestamptz not null default now();

-- Add FKs if missing
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_space_id_fkey'
  ) then
    alter table public.bookings
      add constraint bookings_space_id_fkey foreign key (space_id)
      references public.spaces(id) on delete cascade;
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_user_id_fkey'
  ) then
    alter table public.bookings
      add constraint bookings_user_id_fkey foreign key (user_id)
      references public.users(id) on delete cascade;
  end if;
end $$;

-- Enable Row Level Security
alter table public.bookings enable row level security;

-- Reset policies (idempotent)
drop policy if exists "Bookings readable by owner and hosts" on public.bookings;
drop policy if exists "Authenticated can insert bookings for themselves" on public.bookings;
drop policy if exists "Users can update their own booking" on public.bookings;
drop policy if exists "Users can delete their own booking" on public.bookings;

-- Read: only authenticated, and either booking owner or (optionally) host of the space
-- For simplicidad inicial: solo propietario
create policy "Bookings readable by owner and hosts" on public.bookings
for select
to authenticated
using (
  user_id = (
    select u.id from public.users u where u.email = auth.email()
  )
);

-- Insert: only authenticated and must insert as themselves
create policy "Authenticated can insert bookings for themselves" on public.bookings
for insert
to authenticated
with check (
  user_id = (
    select u.id from public.users u where u.email = auth.email()
  )
);

-- Update: only owner
create policy "Users can update their own booking" on public.bookings
for update
to authenticated
using (
  user_id = (
    select u.id from public.users u where u.email = auth.email()
  )
)
with check (
  user_id = (
    select u.id from public.users u where u.email = auth.email()
  )
);

-- Delete: only owner
create policy "Users can delete their own booking" on public.bookings
for delete
to authenticated
using (
  user_id = (
    select u.id from public.users u where u.email = auth.email()
  )
);