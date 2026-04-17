-- FAQs
-- Run in Supabase SQL editor after setup.sql

create table if not exists public.faqs (
  id             uuid primary key default gen_random_uuid(),
  question       text not null,
  answer         text not null,
  display_order  integer not null default 0,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists faqs_display_order_idx on public.faqs(display_order);

alter table public.faqs enable row level security;

-- Anyone can read published FAQs (for public site)
drop policy if exists "faqs_public_select" on public.faqs;
create policy "faqs_public_select" on public.faqs
  for select using (is_published = true);

-- Admins and employees with faqs permission — managed by app layer, allow all authed users
drop policy if exists "faqs_admin_select" on public.faqs;
create policy "faqs_admin_select" on public.faqs
  for select using (auth.uid() is not null);

drop policy if exists "faqs_admin_insert" on public.faqs;
create policy "faqs_admin_insert" on public.faqs
  for insert with check (auth.uid() is not null);

drop policy if exists "faqs_admin_update" on public.faqs;
create policy "faqs_admin_update" on public.faqs
  for update using (auth.uid() is not null);

drop policy if exists "faqs_admin_delete" on public.faqs;
create policy "faqs_admin_delete" on public.faqs
  for delete using (auth.uid() is not null);

-- Auto-update updated_at
create or replace function public.faqs_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists faqs_updated_at on public.faqs;
create trigger faqs_updated_at
  before update on public.faqs
  for each row execute function public.faqs_set_updated_at();
