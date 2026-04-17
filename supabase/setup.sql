-- HVACR Admin — foundation schema
-- Run this in the Supabase SQL editor after creating the project.
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.

-- ============================================================
-- user_profiles: role + per-section permissions for admin users
-- ============================================================
create table if not exists public.user_profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  role        text not null check (role in ('admin', 'employee')),
  permissions text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists user_profiles_role_idx on public.user_profiles(role);

-- Keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profiles_touch on public.user_profiles;
create trigger user_profiles_touch
before update on public.user_profiles
for each row execute function public.touch_updated_at();

-- RLS: users can read their own profile; only admins can read/modify all
alter table public.user_profiles enable row level security;

drop policy if exists "profiles_self_read" on public.user_profiles;
create policy "profiles_self_read" on public.user_profiles
  for select using (auth.uid() = user_id);

drop policy if exists "profiles_admin_read" on public.user_profiles;
create policy "profiles_admin_read" on public.user_profiles
  for select using (
    exists (
      select 1 from public.user_profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "profiles_admin_write" on public.user_profiles;
create policy "profiles_admin_write" on public.user_profiles
  for all using (
    exists (
      select 1 from public.user_profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  ) with check (
    exists (
      select 1 from public.user_profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================================
-- activity_logs: append-only audit trail for admin actions
-- ============================================================
create table if not exists public.activity_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete set null,
  user_email text,
  action     text not null check (action in ('create', 'update', 'delete', 'login', 'logout')),
  table_name text not null,
  record_id  text,
  details    text,
  created_at timestamptz not null default now()
);

create index if not exists activity_logs_created_at_idx on public.activity_logs(created_at desc);
create index if not exists activity_logs_user_id_idx    on public.activity_logs(user_id);
create index if not exists activity_logs_table_name_idx on public.activity_logs(table_name);

alter table public.activity_logs enable row level security;

-- Only admins may read logs. Writes happen via service role, so no insert policy needed.
drop policy if exists "logs_admin_read" on public.activity_logs;
create policy "logs_admin_read" on public.activity_logs
  for select using (
    exists (
      select 1 from public.user_profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );
