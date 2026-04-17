-- Industries
-- Run in Supabase SQL editor after setup.sql

create table if not exists public.industries (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null unique,
  description    text not null default '',
  image_url      text,
  display_order  integer not null default 0,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists industries_display_order_idx on public.industries(display_order);
create index if not exists industries_slug_idx on public.industries(slug);

alter table public.industries enable row level security;

drop policy if exists "industries_public_select" on public.industries;
create policy "industries_public_select" on public.industries
  for select using (is_published = true);

drop policy if exists "industries_admin_select" on public.industries;
create policy "industries_admin_select" on public.industries
  for select using (auth.uid() is not null);

drop policy if exists "industries_admin_insert" on public.industries;
create policy "industries_admin_insert" on public.industries
  for insert with check (auth.uid() is not null);

drop policy if exists "industries_admin_update" on public.industries;
create policy "industries_admin_update" on public.industries
  for update using (auth.uid() is not null);

drop policy if exists "industries_admin_delete" on public.industries;
create policy "industries_admin_delete" on public.industries
  for delete using (auth.uid() is not null);

-- Auto-update updated_at
create or replace function public.industries_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists industries_updated_at on public.industries;
create trigger industries_updated_at
  before update on public.industries
  for each row execute function public.industries_set_updated_at();

-- Storage bucket for industry images (public)
insert into storage.buckets (id, name, public)
values ('industry-images', 'industry-images', true)
on conflict (id) do nothing;

drop policy if exists "industry_images_public_read" on storage.objects;
create policy "industry_images_public_read" on storage.objects
  for select using (bucket_id = 'industry-images');

drop policy if exists "industry_images_admin_insert" on storage.objects;
create policy "industry_images_admin_insert" on storage.objects
  for insert with check (bucket_id = 'industry-images' and auth.uid() is not null);

drop policy if exists "industry_images_admin_update" on storage.objects;
create policy "industry_images_admin_update" on storage.objects
  for update using (bucket_id = 'industry-images' and auth.uid() is not null);

drop policy if exists "industry_images_admin_delete" on storage.objects;
create policy "industry_images_admin_delete" on storage.objects
  for delete using (bucket_id = 'industry-images' and auth.uid() is not null);
