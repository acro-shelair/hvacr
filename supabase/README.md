# Supabase setup

## First-time bootstrap

1. **Run `setup.sql`** in the Supabase SQL editor (Dashboard → SQL Editor → New query → paste → Run). Creates `user_profiles` and `activity_logs` with RLS.

2. **Create the first admin user.**
   - Dashboard → Authentication → Users → Add user → Create new user.
   - Enter email + password, tick "Auto Confirm User".
   - Copy the new user's **UUID**.

3. **Grant admin role** — run in the SQL editor (replace the UUID):

   ```sql
   insert into public.user_profiles (user_id, role, permissions)
   values ('PASTE-USER-UUID-HERE', 'admin', '{}')
   on conflict (user_id) do update set role = 'admin';
   ```

   Admins bypass the `permissions` check, so an empty array is fine.

4. **Test** — visit `/admin/login`, sign in with those credentials. You should land on `/admin/home` with the full sidebar.

## Adding employees later

Employees get a trimmed sidebar based on their `permissions` array. Valid keys (from `lib/rbac.ts`):

`home` · `brands` · `industries` · `messages` · `faqs` · `careers` · `settings` · `logs`

Example — a content editor with access to home/brands/industries/faqs:

```sql
insert into public.user_profiles (user_id, role, permissions)
values ('UUID', 'employee', '{home,brands,industries,faqs}');
```

A Users admin page for managing this is coming in Phase 3.
