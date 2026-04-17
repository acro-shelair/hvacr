-- HVACR Admin — site_settings table
-- Run in Supabase SQL editor.

create table if not exists public.site_settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh
drop trigger if exists site_settings_touch on public.site_settings;
create trigger site_settings_touch
before update on public.site_settings
for each row execute function public.touch_updated_at();

alter table public.site_settings enable row level security;

-- Public can read settings (needed for site to display contact info, etc.)
drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings
  for select using (true);

-- Only admins can write
drop policy if exists "settings_admin_write" on public.site_settings;
create policy "settings_admin_write" on public.site_settings
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

-- Seed default rows (safe to re-run)
insert into public.site_settings (key, value) values
  ('site_name',        'HVACR Group'),
  ('site_tagline',     ''),
  ('contact_email',    ''),
  ('contact_phone',    ''),
  ('contact_address',  ''),
  ('social_facebook',  ''),
  ('social_instagram', ''),
  ('social_linkedin',  '')
on conflict (key) do nothing;
