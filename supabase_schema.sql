-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  xp integer not null default 0,
  streak integer not null default 0,
  last_visit text,
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- Row Level Security: users can only access their own row
alter table public.user_progress enable row level security;

create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can upsert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);
