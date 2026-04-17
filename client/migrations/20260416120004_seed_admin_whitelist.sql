-- ============================================================================
-- Migration 5/5: seed admin_whitelist
-- ============================================================================
-- TODO: Uncomment and fill in the initial admin email(s) before running this
-- migration. Each email will be auto-promoted to role='admin' on first
-- sign-in. Safe to run multiple times — conflicts are ignored.
--
-- After Phase 5 (admin dashboard) ships, further admin emails should be added
-- through the UI instead of via SQL migrations.
-- ============================================================================

insert into public.admin_whitelist (email, note) values
  ('myseroziotechz@gmail.com', 'Initial admin')
on conflict (email) do nothing;
