-- Create reviews table (if not exists)
create table if not exists public.reviews (
  id bigserial primary key,
  space_id bigint not null references public.spaces(id) on delete cascade,
  user_id bigint not null references public.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now()
);

-- Ensure columns exist for pre-existing tables (idempotent safety)
alter table public.reviews add column if not exists space_id bigint;
alter table public.reviews add column if not exists user_id bigint;
alter table public.reviews add column if not exists rating int;
alter table public.reviews add column if not exists comment text;
alter table public.reviews add column if not exists created_at timestamptz not null default now();

-- Add FKs if missing
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'reviews_space_id_fkey'
  ) then
    alter table public.reviews
      add constraint reviews_space_id_fkey foreign key (space_id)
      references public.spaces(id) on delete cascade;
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'reviews_user_id_fkey'
  ) then
    alter table public.reviews
      add constraint reviews_user_id_fkey foreign key (user_id)
      references public.users(id) on delete cascade;
  end if;
end $$;

-- Enable Row Level Security
alter table public.reviews enable row level security;

-- Reset policies (idempotent)
drop policy if exists "Reviews are readable by everyone" on public.reviews;
drop policy if exists "Authenticated can insert reviews for themselves" on public.reviews;
drop policy if exists "Users can update their own review" on public.reviews;
drop policy if exists "Users can delete their own review" on public.reviews;

-- Read: anyone can read
create policy "Reviews are readable by everyone" on public.reviews
for select
to public
using (true);

-- Insert: only authenticated and must insert as themselves
create policy "Authenticated can insert reviews for themselves" on public.reviews
for insert
to authenticated
with check (
  user_id = (
    select u.id from public.users u where u.email = auth.email()
  )
);

-- Update: only owner
create policy "Users can update their own review" on public.reviews
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
create policy "Users can delete their own review" on public.reviews
for delete
to authenticated
using (
  user_id = (
    select u.id from public.users u where u.email = auth.email()
  )
);