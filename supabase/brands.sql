-- Brands
-- Run in Supabase SQL editor after setup.sql

create table if not exists public.brands (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null unique,
  specialty      text not null default '',
  description    text not null default '',
  logo_url       text,
  website_url    text,
  display_order  integer not null default 0,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists brands_display_order_idx on public.brands(display_order);
create index if not exists brands_slug_idx on public.brands(slug);

alter table public.brands enable row level security;

drop policy if exists "brands_public_select" on public.brands;
create policy "brands_public_select" on public.brands
  for select using (is_published = true);

drop policy if exists "brands_admin_select" on public.brands;
create policy "brands_admin_select" on public.brands
  for select using (auth.uid() is not null);

drop policy if exists "brands_admin_insert" on public.brands;
create policy "brands_admin_insert" on public.brands
  for insert with check (auth.uid() is not null);

drop policy if exists "brands_admin_update" on public.brands;
create policy "brands_admin_update" on public.brands
  for update using (auth.uid() is not null);

drop policy if exists "brands_admin_delete" on public.brands;
create policy "brands_admin_delete" on public.brands
  for delete using (auth.uid() is not null);

-- Auto-update updated_at
create or replace function public.brands_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists brands_updated_at on public.brands;
create trigger brands_updated_at
  before update on public.brands
  for each row execute function public.brands_set_updated_at();

-- Storage bucket for brand logos (public)
insert into storage.buckets (id, name, public)
values ('brand-logos', 'brand-logos', true)
on conflict (id) do nothing;

drop policy if exists "brand_logos_public_read" on storage.objects;
create policy "brand_logos_public_read" on storage.objects
  for select using (bucket_id = 'brand-logos');

drop policy if exists "brand_logos_admin_insert" on storage.objects;
create policy "brand_logos_admin_insert" on storage.objects
  for insert with check (bucket_id = 'brand-logos' and auth.uid() is not null);

drop policy if exists "brand_logos_admin_update" on storage.objects;
create policy "brand_logos_admin_update" on storage.objects
  for update using (bucket_id = 'brand-logos' and auth.uid() is not null);

drop policy if exists "brand_logos_admin_delete" on storage.objects;
create policy "brand_logos_admin_delete" on storage.objects
  for delete using (bucket_id = 'brand-logos' and auth.uid() is not null);
