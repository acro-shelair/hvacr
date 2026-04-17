-- Messages — contact form submissions
-- Run in Supabase SQL editor after setup.sql

create table if not exists public.messages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  phone         text,
  enquiry_type  text not null default 'General Enquiry',
  message       text not null,
  is_read       boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists messages_created_at_idx on public.messages(created_at desc);
create index if not exists messages_is_read_idx    on public.messages(is_read);

alter table public.messages enable row level security;

-- Public contact form can insert
drop policy if exists "messages_public_insert" on public.messages;
create policy "messages_public_insert" on public.messages
  for insert with check (true);

-- Admins (and employees with messages permission checked by app layer) read all
drop policy if exists "messages_admin_select" on public.messages;
create policy "messages_admin_select" on public.messages
  for select using (
    exists (
      select 1 from public.user_profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "messages_admin_update" on public.messages;
create policy "messages_admin_update" on public.messages
  for update using (
    exists (
      select 1 from public.user_profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "messages_admin_delete" on public.messages;
create policy "messages_admin_delete" on public.messages
  for delete using (
    exists (
      select 1 from public.user_profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    )
  );
