-- Careers: Job Postings + Applications
-- Run in Supabase SQL editor after setup.sql

-- ============================================================
-- job_postings
-- ============================================================
create table if not exists public.job_postings (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  location         text not null,
  employment_type  text not null check (employment_type in ('Full-time', 'Part-time', 'Casual', 'Apprenticeship')),
  description      text not null,
  display_order    integer not null default 0,
  is_published     boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists job_postings_display_order_idx on public.job_postings(display_order);

alter table public.job_postings enable row level security;

drop policy if exists "job_postings_public_select" on public.job_postings;
create policy "job_postings_public_select" on public.job_postings
  for select using (is_published = true);

drop policy if exists "job_postings_admin_select" on public.job_postings;
create policy "job_postings_admin_select" on public.job_postings
  for select using (auth.uid() is not null);

drop policy if exists "job_postings_admin_insert" on public.job_postings;
create policy "job_postings_admin_insert" on public.job_postings
  for insert with check (auth.uid() is not null);

drop policy if exists "job_postings_admin_update" on public.job_postings;
create policy "job_postings_admin_update" on public.job_postings
  for update using (auth.uid() is not null);

drop policy if exists "job_postings_admin_delete" on public.job_postings;
create policy "job_postings_admin_delete" on public.job_postings
  for delete using (auth.uid() is not null);

create or replace function public.job_postings_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists job_postings_updated_at on public.job_postings;
create trigger job_postings_updated_at
  before update on public.job_postings
  for each row execute function public.job_postings_set_updated_at();

-- ============================================================
-- job_applications
-- ============================================================
create table if not exists public.job_applications (
  id              uuid primary key default gen_random_uuid(),
  job_posting_id  uuid references public.job_postings(id) on delete set null,
  name            text not null,
  email           text not null,
  phone           text,
  position        text not null,
  message         text not null,
  is_read         boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists job_applications_created_at_idx on public.job_applications(created_at desc);
create index if not exists job_applications_job_id_idx on public.job_applications(job_posting_id);

alter table public.job_applications enable row level security;

-- Public can submit applications
drop policy if exists "applications_public_insert" on public.job_applications;
create policy "applications_public_insert" on public.job_applications
  for insert with check (true);

-- Authenticated users (admin/employee with careers permission) can read and manage
drop policy if exists "applications_admin_select" on public.job_applications;
create policy "applications_admin_select" on public.job_applications
  for select using (auth.uid() is not null);

drop policy if exists "applications_admin_update" on public.job_applications;
create policy "applications_admin_update" on public.job_applications
  for update using (auth.uid() is not null);

drop policy if exists "applications_admin_delete" on public.job_applications;
create policy "applications_admin_delete" on public.job_applications
  for delete using (auth.uid() is not null);
