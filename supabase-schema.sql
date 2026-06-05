-- Clubhouse Baseball Development - Supabase test schema
-- Run this once in Supabase SQL Editor before using the hosted auth/data flow.

create table if not exists public.clubhouse_records (
  store text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (store, id)
);

alter table public.clubhouse_records enable row level security;

drop policy if exists "clubhouse authenticated read" on public.clubhouse_records;
drop policy if exists "clubhouse authenticated insert" on public.clubhouse_records;
drop policy if exists "clubhouse authenticated update" on public.clubhouse_records;
drop policy if exists "clubhouse authenticated delete" on public.clubhouse_records;

create policy "clubhouse authenticated read"
on public.clubhouse_records for select
to authenticated
using (true);

create policy "clubhouse authenticated insert"
on public.clubhouse_records for insert
to authenticated
with check (true);

create policy "clubhouse authenticated update"
on public.clubhouse_records for update
to authenticated
using (true)
with check (true);

create policy "clubhouse authenticated delete"
on public.clubhouse_records for delete
to authenticated
using (true);

create index if not exists clubhouse_records_store_idx
on public.clubhouse_records (store);
