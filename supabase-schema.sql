-- Clubhouse Baseball Development - normalized Supabase MVP schema
-- Run this in the Supabase SQL Editor. It keeps clubhouse_records as a
-- compatibility fallback while creating the normalized tables db.js expects.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.clubhouse_records (
  store text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (store, id)
);

create table if not exists public.profiles (
  id text primary key,
  auth_user_id uuid unique references auth.users(id) on delete set null,
  username text not null default '',
  display_name text not null default 'User',
  status text not null default 'active',
  role text not null default '',
  record_type text not null default '',
  is_super_user boolean not null default false,
  login_count integer not null default 0,
  last_login_at timestamptz,
  active boolean not null default true,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists auth_user_id uuid references auth.users(id) on delete set null;
alter table public.profiles add column if not exists username text not null default '';
alter table public.profiles add column if not exists display_name text not null default 'User';
alter table public.profiles add column if not exists status text not null default 'active';
alter table public.profiles add column if not exists role text not null default '';
alter table public.profiles add column if not exists record_type text not null default '';
alter table public.profiles add column if not exists is_super_user boolean not null default false;
alter table public.profiles add column if not exists login_count integer not null default 0;
alter table public.profiles add column if not exists last_login_at timestamptz;
alter table public.profiles add column if not exists active boolean not null default true;
alter table public.profiles add column if not exists created_by text;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create table if not exists public.organizations (
  id text primary key,
  name text not null,
  settings jsonb not null default '{}'::jsonb,
  equipment jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organizations add column if not exists settings jsonb not null default '{}'::jsonb;
alter table public.organizations add column if not exists equipment jsonb not null default '[]'::jsonb;
alter table public.organizations add column if not exists active boolean not null default true;
alter table public.organizations add column if not exists created_by text;
alter table public.organizations add column if not exists created_at timestamptz not null default now();
alter table public.organizations add column if not exists updated_at timestamptz not null default now();

create table if not exists public.teams (
  id text primary key,
  name text not null,
  season text,
  organization_id text references public.organizations(id) on delete set null,
  equipment jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.teams add column if not exists season text;
alter table public.teams add column if not exists organization_id text references public.organizations(id) on delete set null;
alter table public.teams add column if not exists equipment jsonb not null default '[]'::jsonb;
alter table public.teams add column if not exists active boolean not null default true;
alter table public.teams add column if not exists created_by text;
alter table public.teams add column if not exists created_at timestamptz not null default now();
alter table public.teams add column if not exists updated_at timestamptz not null default now();

create table if not exists public.households (
  id text primary key,
  name text not null,
  owner_user_id text references public.profiles(id) on delete set null,
  equipment jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.households add column if not exists owner_user_id text references public.profiles(id) on delete set null;
alter table public.households add column if not exists equipment jsonb not null default '[]'::jsonb;
alter table public.households add column if not exists active boolean not null default true;
alter table public.households add column if not exists created_by text;
alter table public.households add column if not exists created_at timestamptz not null default now();
alter table public.households add column if not exists updated_at timestamptz not null default now();

create table if not exists public.players (
  id text primary key,
  name text not null,
  user_id text references public.profiles(id) on delete set null,
  active boolean not null default true,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.players add column if not exists user_id text references public.profiles(id) on delete set null;
alter table public.players add column if not exists active boolean not null default true;
alter table public.players add column if not exists created_by text;
alter table public.players add column if not exists created_at timestamptz not null default now();
alter table public.players add column if not exists updated_at timestamptz not null default now();

create table if not exists public.user_player_access (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  player_id text not null references public.players(id) on delete cascade,
  permission text not null default 'manage',
  active boolean not null default true,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, player_id)
);

alter table public.user_player_access add column if not exists permission text not null default 'manage';
alter table public.user_player_access add column if not exists active boolean not null default true;
alter table public.user_player_access add column if not exists created_by text;
alter table public.user_player_access add column if not exists created_at timestamptz not null default now();
alter table public.user_player_access add column if not exists updated_at timestamptz not null default now();

create table if not exists public.organization_roles (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  organization_id text not null references public.organizations(id) on delete cascade,
  role text not null default 'director',
  active boolean not null default true,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, organization_id)
);

alter table public.organization_roles add column if not exists role text not null default 'director';
alter table public.organization_roles add column if not exists active boolean not null default true;
alter table public.organization_roles add column if not exists created_by text;
alter table public.organization_roles add column if not exists created_at timestamptz not null default now();
alter table public.organization_roles add column if not exists updated_at timestamptz not null default now();

create table if not exists public.team_coach_roles (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  team_id text not null references public.teams(id) on delete cascade,
  coach_type text not null default 'assistant',
  permissions jsonb not null default '{}'::jsonb,
  specializations jsonb not null default '["All"]'::jsonb,
  active boolean not null default true,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, team_id)
);

alter table public.team_coach_roles add column if not exists coach_type text not null default 'assistant';
alter table public.team_coach_roles add column if not exists permissions jsonb not null default '{}'::jsonb;
alter table public.team_coach_roles add column if not exists specializations jsonb not null default '["All"]'::jsonb;
alter table public.team_coach_roles add column if not exists active boolean not null default true;
alter table public.team_coach_roles add column if not exists created_by text;
alter table public.team_coach_roles add column if not exists created_at timestamptz not null default now();
alter table public.team_coach_roles add column if not exists updated_at timestamptz not null default now();

create table if not exists public.household_memberships (
  id text primary key,
  household_id text not null references public.households(id) on delete cascade,
  user_id text references public.profiles(id) on delete cascade,
  player_id text references public.players(id) on delete cascade,
  role text not null default 'member',
  active boolean not null default true,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or player_id is not null)
);

alter table public.household_memberships add column if not exists role text not null default 'member';
alter table public.household_memberships add column if not exists active boolean not null default true;
alter table public.household_memberships add column if not exists created_by text;
alter table public.household_memberships add column if not exists created_at timestamptz not null default now();
alter table public.household_memberships add column if not exists updated_at timestamptz not null default now();

create table if not exists public.player_team_memberships (
  id text primary key,
  player_id text not null references public.players(id) on delete cascade,
  team_id text not null references public.teams(id) on delete cascade,
  active boolean not null default true,
  priority integer not null default 1,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (player_id, team_id)
);

alter table public.player_team_memberships add column if not exists active boolean not null default true;
alter table public.player_team_memberships add column if not exists priority integer not null default 1;
alter table public.player_team_memberships add column if not exists created_by text;
alter table public.player_team_memberships add column if not exists created_at timestamptz not null default now();
alter table public.player_team_memberships add column if not exists updated_at timestamptz not null default now();

create table if not exists public.record_associations (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  record_type text not null,
  record_id text not null,
  role text not null default 'member',
  active boolean not null default true,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, record_type, record_id)
);

alter table public.record_associations add column if not exists role text not null default 'member';
alter table public.record_associations add column if not exists active boolean not null default true;
alter table public.record_associations add column if not exists created_by text;
alter table public.record_associations add column if not exists created_at timestamptz not null default now();
alter table public.record_associations add column if not exists updated_at timestamptz not null default now();

create table if not exists public.access_requests (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  record_type text not null,
  record_id text not null,
  status text not null default 'pending',
  decided_by text references public.profiles(id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.access_requests add column if not exists status text not null default 'pending';
alter table public.access_requests add column if not exists requested_user_id text references public.profiles(id) on delete cascade;
alter table public.access_requests add column if not exists requested_role text;
alter table public.access_requests add column if not exists requested_by text references public.profiles(id) on delete set null;
alter table public.access_requests add column if not exists reason text;
alter table public.access_requests add column if not exists decided_by text references public.profiles(id) on delete set null;
alter table public.access_requests add column if not exists decided_at timestamptz;
alter table public.access_requests add column if not exists created_at timestamptz not null default now();
alter table public.access_requests add column if not exists updated_at timestamptz not null default now();

create table if not exists public.invitations (
  id text primary key,
  email text not null,
  record_type text not null,
  record_id text,
  role text not null default 'member',
  status text not null default 'pending',
  invited_by text references public.profiles(id) on delete set null,
  accepted_by text references public.profiles(id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.invitations add column if not exists record_id text;
alter table public.invitations add column if not exists role text not null default 'member';
alter table public.invitations add column if not exists status text not null default 'pending';
alter table public.invitations add column if not exists invited_by text references public.profiles(id) on delete set null;
alter table public.invitations add column if not exists accepted_by text references public.profiles(id) on delete set null;
alter table public.invitations add column if not exists accepted_at timestamptz;
alter table public.invitations add column if not exists created_at timestamptz not null default now();
alter table public.invitations add column if not exists updated_at timestamptz not null default now();

create table if not exists public.player_training_state (
  player_id text primary key references public.players(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.player_training_state add column if not exists data jsonb not null default '{}'::jsonb;
alter table public.player_training_state add column if not exists created_at timestamptz not null default now();
alter table public.player_training_state add column if not exists updated_at timestamptz not null default now();

create table if not exists public.calendar_events (
  id text primary key,
  player_id text references public.players(id) on delete cascade,
  team_id text references public.teams(id) on delete cascade,
  title text not null default 'Event',
  type text,
  workload text,
  event_date date,
  repeat text,
  status text not null default 'active',
  assigned_session_id text,
  data jsonb not null default '{}'::jsonb,
  created_by text references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.calendar_events add column if not exists player_id text references public.players(id) on delete cascade;
alter table public.calendar_events add column if not exists team_id text references public.teams(id) on delete cascade;
alter table public.calendar_events add column if not exists type text;
alter table public.calendar_events add column if not exists workload text;
alter table public.calendar_events add column if not exists event_date date;
alter table public.calendar_events add column if not exists repeat text;
alter table public.calendar_events add column if not exists status text not null default 'active';
alter table public.calendar_events add column if not exists assigned_session_id text;
alter table public.calendar_events add column if not exists data jsonb not null default '{}'::jsonb;
alter table public.calendar_events add column if not exists created_by text references public.profiles(id) on delete set null;
alter table public.calendar_events add column if not exists created_at timestamptz not null default now();
alter table public.calendar_events add column if not exists updated_at timestamptz not null default now();

create table if not exists public.alerts (
  id text primary key,
  player_id text references public.players(id) on delete cascade,
  type text,
  title text not null default 'Alert',
  message text,
  status text not null default 'pending',
  read boolean not null default false,
  data jsonb not null default '{}'::jsonb,
  created_by text references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.alerts add column if not exists player_id text references public.players(id) on delete cascade;
alter table public.alerts add column if not exists type text;
alter table public.alerts add column if not exists message text;
alter table public.alerts add column if not exists status text not null default 'pending';
alter table public.alerts add column if not exists read boolean not null default false;
alter table public.alerts add column if not exists data jsonb not null default '{}'::jsonb;
alter table public.alerts add column if not exists created_by text references public.profiles(id) on delete set null;
alter table public.alerts add column if not exists created_at timestamptz not null default now();
alter table public.alerts add column if not exists updated_at timestamptz not null default now();

create table if not exists public.admin_decisions (
  id text primary key,
  player_id text references public.players(id) on delete cascade,
  event_id text references public.calendar_events(id) on delete cascade,
  alert_id text references public.alerts(id) on delete cascade,
  decision_date date,
  action text not null default 'unknown',
  data jsonb not null default '{}'::jsonb,
  created_by text references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_decisions add column if not exists player_id text references public.players(id) on delete cascade;
alter table public.admin_decisions add column if not exists event_id text references public.calendar_events(id) on delete cascade;
alter table public.admin_decisions add column if not exists alert_id text references public.alerts(id) on delete cascade;
alter table public.admin_decisions add column if not exists decision_date date;
alter table public.admin_decisions add column if not exists action text not null default 'unknown';
alter table public.admin_decisions add column if not exists data jsonb not null default '{}'::jsonb;
alter table public.admin_decisions add column if not exists created_by text references public.profiles(id) on delete set null;
alter table public.admin_decisions add column if not exists created_at timestamptz not null default now();
alter table public.admin_decisions add column if not exists updated_at timestamptz not null default now();

create table if not exists public.player_tags (
  id text primary key,
  player_id text not null references public.players(id) on delete cascade,
  tags jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_by text references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.player_tags add column if not exists tags jsonb not null default '[]'::jsonb;
alter table public.player_tags add column if not exists active boolean not null default true;
alter table public.player_tags add column if not exists created_by text references public.profiles(id) on delete set null;
alter table public.player_tags add column if not exists created_at timestamptz not null default now();
alter table public.player_tags add column if not exists updated_at timestamptz not null default now();

create index if not exists clubhouse_records_store_idx on public.clubhouse_records (store);
create index if not exists profiles_auth_user_id_idx on public.profiles (auth_user_id);
create index if not exists profiles_username_idx on public.profiles (lower(username));
create index if not exists teams_organization_id_idx on public.teams (organization_id);
create index if not exists players_user_id_idx on public.players (user_id);
create index if not exists record_associations_user_idx on public.record_associations (user_id);
create index if not exists access_requests_record_idx on public.access_requests (record_type, record_id, status);
create index if not exists invitations_email_idx on public.invitations (lower(email), status);
create index if not exists player_training_state_player_idx on public.player_training_state (player_id);
create unique index if not exists profiles_auth_user_id_unique on public.profiles (auth_user_id) where auth_user_id is not null;
create unique index if not exists user_player_access_user_player_unique on public.user_player_access (user_id, player_id);
create unique index if not exists organization_roles_user_org_unique on public.organization_roles (user_id, organization_id);
create unique index if not exists team_coach_roles_user_team_unique on public.team_coach_roles (user_id, team_id);
create unique index if not exists player_team_memberships_player_team_unique on public.player_team_memberships (player_id, team_id);
create unique index if not exists record_associations_user_record_unique on public.record_associations (user_id, record_type, record_id);

do $$
declare
  t text;
begin
  foreach t in array array[
    'clubhouse_records','profiles','organizations','teams','households','players',
    'user_player_access','organization_roles','team_coach_roles','household_memberships',
    'player_team_memberships','record_associations','access_requests','invitations',
    'player_training_state','calendar_events','alerts','admin_decisions','player_tags'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "%s authenticated read" on public.%I', t, t);
    execute format('drop policy if exists "%s authenticated insert" on public.%I', t, t);
    execute format('drop policy if exists "%s authenticated update" on public.%I', t, t);
    execute format('drop policy if exists "%s authenticated delete" on public.%I', t, t);
    execute format('create policy "%s authenticated read" on public.%I for select to authenticated using (true)', t, t);
    execute format('create policy "%s authenticated insert" on public.%I for insert to authenticated with check (true)', t, t);
    execute format('create policy "%s authenticated update" on public.%I for update to authenticated using (true) with check (true)', t, t);
    execute format('create policy "%s authenticated delete" on public.%I for delete to authenticated using (true)', t, t);
  end loop;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'clubhouse_records','profiles','organizations','teams','households','players',
    'user_player_access','organization_roles','team_coach_roles','household_memberships',
    'player_team_memberships','record_associations','access_requests','invitations',
    'player_training_state','calendar_events','alerts','admin_decisions','player_tags'
  ] loop
    execute format('drop trigger if exists set_%s_updated_at on public.%I', t, t);
    execute format('create trigger set_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end;
$$;

create or replace function public.current_profile_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select id from public.profiles where auth_user_id = auth.uid() limit 1
$$;

create or replace function public.record_exists(p_record_type text, p_record_id text)
returns boolean
language plpgsql
stable
set search_path = public
as $$
begin
  return case p_record_type
    when 'organization' then exists(select 1 from public.organizations where id = p_record_id)
    when 'team' then exists(select 1 from public.teams where id = p_record_id)
    when 'household' then exists(select 1 from public.households where id = p_record_id)
    when 'player' then exists(select 1 from public.players where id = p_record_id)
    when 'coach' then exists(select 1 from public.profiles where id = p_record_id)
    when 'parent' then exists(select 1 from public.profiles where id = p_record_id)
    when 'director' then exists(select 1 from public.profiles where id = p_record_id)
    when 'superUser' then exists(select 1 from public.profiles where id = p_record_id)
    else false
  end;
end;
$$;

create or replace function public.upsert_record_association(
  p_user_id text,
  p_record_type text,
  p_record_id text,
  p_role text default 'member',
  p_created_by text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user_id is null or p_record_type is null or p_record_id is null then
    return;
  end if;

  insert into public.record_associations (id, user_id, record_type, record_id, role, active, created_by)
  values ('assoc-' || gen_random_uuid()::text, p_user_id, p_record_type, p_record_id, coalesce(p_role, 'member'), true, coalesce(p_created_by, p_user_id))
  on conflict (user_id, record_type, record_id)
  do update set
    role = case when public.record_associations.role = 'admin' then 'admin' else excluded.role end,
    active = true,
    updated_at = now();
end;
$$;

create or replace function public.materialize_record_access(
  p_user_id text,
  p_record_type text,
  p_record_id text,
  p_role text default 'member',
  p_created_by text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text := coalesce(nullif(trim(p_role), ''), 'member');
  v_player_id text;
  v_team public.teams%rowtype;
  v_existing_household_id text;
  v_team_id text;
begin
  perform public.upsert_record_association(p_user_id, p_record_type, p_record_id, case when v_role = 'Director' then 'admin' else v_role end, p_created_by);

  if p_record_type = 'team' then
    select * into v_team from public.teams where id = p_record_id;
    if v_role in ('Coach','admin') then
      insert into public.team_coach_roles (id, user_id, team_id, coach_type, permissions, specializations, active, created_by)
      values ('coach-role-' || gen_random_uuid()::text, p_user_id, p_record_id, 'assistant', '{"manageTeam":true,"managePlans":true,"manageParents":false,"manageAssistants":false}'::jsonb, '["All"]'::jsonb, true, p_created_by)
      on conflict (user_id, team_id) do update set active = true, updated_at = now();
    end if;
    if v_role in ('Player','member') then
      select id into v_player_id from public.players where user_id = p_user_id and active limit 1;
      if v_player_id is not null then
        insert into public.player_team_memberships (id, player_id, team_id, active, priority, created_by)
        values ('membership-' || gen_random_uuid()::text, v_player_id, p_record_id, true, 2, p_created_by)
        on conflict (player_id, team_id) do update set active = true, updated_at = now();
      end if;
    end if;
    if v_team.organization_id is not null then
      perform public.upsert_record_association(p_user_id, 'organization', v_team.organization_id, case when v_role = 'admin' then 'admin' else 'member' end, p_created_by);
    end if;
  elsif p_record_type = 'household' then
    select id into v_player_id from public.players where user_id = p_user_id and active limit 1;
    if v_role = 'Player' and v_player_id is not null then
      select id into v_existing_household_id from public.household_memberships where household_id = p_record_id and player_id = v_player_id limit 1;
      if v_existing_household_id is null then
        insert into public.household_memberships (id, household_id, player_id, role, active, created_by)
        values ('hh-' || gen_random_uuid()::text, p_record_id, v_player_id, 'player', true, p_created_by);
      else
        update public.household_memberships set role = 'player', active = true, updated_at = now() where id = v_existing_household_id;
      end if;
    else
      select id into v_existing_household_id from public.household_memberships where household_id = p_record_id and user_id = p_user_id limit 1;
      if v_existing_household_id is null then
        insert into public.household_memberships (id, household_id, user_id, role, active, created_by)
        values ('hh-' || gen_random_uuid()::text, p_record_id, p_user_id, 'parent', true, p_created_by);
      else
        update public.household_memberships set role = 'parent', active = true, updated_at = now() where id = v_existing_household_id;
      end if;
    end if;
  elsif p_record_type = 'organization' and v_role = 'Director' then
    insert into public.organization_roles (id, user_id, organization_id, role, active, created_by)
    values ('org-role-' || gen_random_uuid()::text, p_user_id, p_record_id, 'director', true, p_created_by)
    on conflict (user_id, organization_id) do update set role = 'director', active = true, updated_at = now();
  elsif p_record_type = 'organization' and v_role = 'Player' then
    select id into v_player_id from public.players where user_id = p_user_id and active limit 1;
    if v_player_id is not null then
      for v_team_id in select id from public.teams where organization_id = p_record_id and active loop
        insert into public.player_team_memberships (id, player_id, team_id, active, priority, created_by)
        values ('membership-' || gen_random_uuid()::text, v_player_id, v_team_id, true, 2, p_created_by)
        on conflict (player_id, team_id) do update set active = true, updated_at = now();
      end loop;
    end if;
  elsif p_record_type = 'player' then
    update public.players set user_id = p_user_id, updated_at = now() where id = p_record_id and user_id is null;
  end if;
end;
$$;

create or replace function public.player_parent_approver_ids(p_user_id text)
returns table(parent_user_id text)
language sql
stable
set search_path = public
as $$
  select distinct hm_parent.user_id
  from public.players pl
  join public.household_memberships hm_player on hm_player.player_id = pl.id and hm_player.active
  join public.household_memberships hm_parent on hm_parent.household_id = hm_player.household_id and hm_parent.role = 'parent' and hm_parent.active
  where pl.user_id = p_user_id and pl.active and hm_parent.user_id is not null and hm_parent.user_id <> p_user_id
$$;

create or replace function public.create_record_with_admin_association(
  p_record_type text,
  p_record_id text,
  p_name text,
  p_organization_id text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id text := public.current_profile_id();
begin
  if v_user_id is null then
    raise exception 'Current user profile was not found.';
  end if;

  if p_record_type = 'organization' then
    insert into public.organizations (id, name, settings, equipment, active, created_by)
    values (p_record_id, p_name, '{"directorApprovalRequiredForCoachPlans":false}'::jsonb, '[]'::jsonb, true, v_user_id)
    on conflict (id) do update set name = excluded.name, updated_at = now();
  elsif p_record_type = 'team' then
    insert into public.teams (id, name, season, organization_id, equipment, active, created_by)
    values (p_record_id, p_name, extract(year from now())::text, p_organization_id, '[]'::jsonb, true, v_user_id)
    on conflict (id) do update set name = excluded.name, organization_id = excluded.organization_id, updated_at = now();
  elsif p_record_type = 'household' then
    insert into public.households (id, name, owner_user_id, equipment, active, created_by)
    values (p_record_id, p_name, v_user_id, '[]'::jsonb, true, v_user_id)
    on conflict (id) do update set name = excluded.name, updated_at = now();
  else
    raise exception 'Unsupported record type: %', p_record_type;
  end if;

  perform public.upsert_record_association(v_user_id, p_record_type, p_record_id, 'admin', v_user_id);
end;
$$;

create or replace function public.request_record_link(p_record_type text, p_record_id text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id text := public.current_profile_id();
  v_request_id text;
begin
  if v_user_id is null then
    raise exception 'Current user profile was not found.';
  end if;

  if not public.record_exists(p_record_type, p_record_id) then
    raise exception 'Record not found.';
  end if;

  if exists (
    select 1 from public.record_associations
    where user_id = v_user_id and record_type = p_record_type and record_id = p_record_id and active
  ) then
    return 'already_linked';
  end if;

  select id into v_request_id
  from public.access_requests
  where user_id = v_user_id and record_type = p_record_type and record_id = p_record_id and status = 'pending'
  limit 1;

  if v_request_id is null then
    v_request_id := 'request-' || gen_random_uuid()::text;
    insert into public.access_requests (id, user_id, record_type, record_id, status)
    values (v_request_id, v_user_id, p_record_type, p_record_id, 'pending');
  end if;

  return 'submitted';
end;
$$;

drop function if exists public.invite_or_link_user_to_record(text, text, text);

create or replace function public.invite_or_link_user_to_record(
  p_record_type text,
  p_record_id text,
  p_email text,
  p_role text default 'member'
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inviter text := public.current_profile_id();
  v_email text := lower(trim(p_email));
  v_target text;
  v_role text := coalesce(nullif(trim(p_role), ''), 'member');
  v_parent_id text;
  v_parent_count integer := 0;
begin
  if v_inviter is null then
    raise exception 'Current user profile was not found.';
  end if;

  if not public.record_exists(p_record_type, p_record_id) then
    raise exception 'Record not found.';
  end if;

  select id into v_target from public.profiles where lower(username) = v_email limit 1;
  if v_target is not null then
    update public.profiles set status = 'active', updated_at = now() where id = v_target;

    if p_record_type in ('team','organization') and v_role = 'Player' then
      for v_parent_id in select parent_user_id from public.player_parent_approver_ids(v_target) loop
        if not exists (
          select 1 from public.access_requests
          where user_id = v_parent_id and requested_user_id = v_target and record_type = p_record_type and record_id = p_record_id and status = 'pending'
        ) then
          insert into public.access_requests (id, user_id, requested_user_id, requested_role, requested_by, reason, record_type, record_id, status)
          values ('request-' || gen_random_uuid()::text, v_parent_id, v_target, v_role, v_inviter, 'parent_approval', p_record_type, p_record_id, 'pending');
        end if;
        v_parent_count := v_parent_count + 1;
      end loop;
      if v_parent_count > 0 then
        return 'approval_required';
      end if;
    end if;

    perform public.materialize_record_access(v_target, p_record_type, p_record_id, v_role, v_inviter);
    return 'linked';
  end if;

  insert into public.invitations (id, email, record_type, record_id, role, status, invited_by)
  values ('invite-' || gen_random_uuid()::text, v_email, p_record_type, p_record_id, v_role, 'pending', v_inviter);
  return 'pending';
end;
$$;

create or replace function public.accept_pending_invitations_for_current_user()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id text := public.current_profile_id();
  v_email text;
  v_inv public.invitations%rowtype;
  v_count integer := 0;
  v_parent_id text;
  v_parent_count integer;
begin
  if v_user_id is null then
    return 0;
  end if;

  select lower(username) into v_email from public.profiles where id = v_user_id;
  for v_inv in
    select * from public.invitations
    where lower(email) = v_email and status = 'pending'
  loop
    if v_inv.record_type = 'superUser' then
      update public.profiles
      set is_super_user = true, role = 'Super User', status = 'active', updated_at = now()
      where id = v_user_id;
    else
      v_parent_count := 0;
      if v_inv.record_type in ('team','organization') and v_inv.role = 'Player' then
        for v_parent_id in select parent_user_id from public.player_parent_approver_ids(v_user_id) loop
          if not exists (
            select 1 from public.access_requests
            where user_id = v_parent_id and requested_user_id = v_user_id and record_type = v_inv.record_type and record_id = v_inv.record_id and status = 'pending'
          ) then
            insert into public.access_requests (id, user_id, requested_user_id, requested_role, requested_by, reason, record_type, record_id, status)
            values ('request-' || gen_random_uuid()::text, v_parent_id, v_user_id, v_inv.role, v_inv.invited_by, 'parent_approval', v_inv.record_type, v_inv.record_id, 'pending');
          end if;
          v_parent_count := v_parent_count + 1;
        end loop;
      end if;
      if v_parent_count = 0 then
        perform public.materialize_record_access(v_user_id, v_inv.record_type, v_inv.record_id, coalesce(v_inv.role, 'member'), v_inv.invited_by);
      end if;
    end if;

    update public.invitations
    set status = 'accepted', accepted_by = v_user_id, accepted_at = now(), updated_at = now()
    where id = v_inv.id;
    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

create or replace function public.decide_record_link_request(p_request_id text, p_approve boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_decider text := public.current_profile_id();
  v_req public.access_requests%rowtype;
begin
  if v_decider is null then
    raise exception 'Current user profile was not found.';
  end if;

  select * into v_req from public.access_requests where id = p_request_id;
  if not found then
    raise exception 'Access request not found.';
  end if;

  if p_approve then
    perform public.materialize_record_access(coalesce(v_req.requested_user_id, v_req.user_id), v_req.record_type, v_req.record_id, coalesce(v_req.requested_role, 'member'), v_decider);
  end if;

  update public.access_requests
  set status = case when p_approve then 'approved' else 'denied' end,
      decided_by = v_decider,
      decided_at = now(),
      updated_at = now()
  where id = p_request_id;
end;
$$;

create or replace function public.normalize_current_user_associations()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id text := public.current_profile_id();
  r record;
begin
  if v_user_id is null then
    return;
  end if;

  for r in select * from public.organization_roles where user_id = v_user_id and active loop
    perform public.upsert_record_association(v_user_id, 'organization', r.organization_id, 'admin', coalesce(r.created_by, v_user_id));
  end loop;

  for r in
    select tr.*, t.organization_id
    from public.team_coach_roles tr
    join public.teams t on t.id = tr.team_id
    where tr.user_id = v_user_id and tr.active
  loop
    perform public.upsert_record_association(v_user_id, 'team', r.team_id, case when r.coach_type = 'head' then 'admin' else 'member' end, coalesce(r.created_by, v_user_id));
    if r.organization_id is not null then
      perform public.upsert_record_association(v_user_id, 'organization', r.organization_id, case when r.coach_type = 'head' then 'admin' else 'member' end, coalesce(r.created_by, v_user_id));
    end if;
  end loop;

  for r in select * from public.household_memberships where user_id = v_user_id and active loop
    perform public.upsert_record_association(v_user_id, 'household', r.household_id, case when r.role = 'parent' then 'admin' else 'member' end, coalesce(r.created_by, v_user_id));
  end loop;

  for r in select * from public.players where user_id = v_user_id and active loop
    perform public.upsert_record_association(v_user_id, 'player', r.id, 'admin', coalesce(r.created_by, v_user_id));
  end loop;
end;
$$;

drop function if exists public.access_request_admin_details();

create or replace function public.access_request_admin_details()
returns table (
  id text,
  requester_name text,
  requester_email text,
  approver_name text,
  record_type text,
  record_id text,
  record_name text,
  status text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    ar.id,
    coalesce(rp_user.display_name, p.display_name, 'Unknown user') as requester_name,
    coalesce(rp_user.username, p.username, '') as requester_email,
    coalesce(p.display_name, '') as approver_name,
    ar.record_type,
    ar.record_id,
    coalesce(o.name, t.name, h.name, pl.name, record_profile.display_name, ar.record_id) as record_name,
    ar.status,
    ar.created_at
  from public.access_requests ar
  left join public.profiles p on p.id = ar.user_id
  left join public.profiles rp_user on rp_user.id = ar.requested_user_id
  left join public.organizations o on ar.record_type = 'organization' and o.id = ar.record_id
  left join public.teams t on ar.record_type = 'team' and t.id = ar.record_id
  left join public.households h on ar.record_type = 'household' and h.id = ar.record_id
  left join public.players pl on ar.record_type = 'player' and pl.id = ar.record_id
  left join public.profiles record_profile on ar.record_type in ('coach','parent','director','superUser') and record_profile.id = ar.record_id
  where ar.status = 'pending'
  order by ar.created_at;
end;
$$;
