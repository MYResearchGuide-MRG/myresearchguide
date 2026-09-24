-- ============================================================================
-- MRG website — protect profile identity fields from self-promotion
--
-- profiles_update_owner_or_admin allows any authenticated user to update
-- their OWN profiles row (required for self-editing), but RLS `with check`
-- cannot compare against the OLD row, so `role`, `id`, `username`, `email`
-- are also writable by the owner. An attacker could self-promote to admin:
--   supabase.from('profiles').update({ role: 'admin' }).eq('id', <mine>)
--
-- This trigger blocks identity/privilege changes unless the caller is an
-- admin session or the service role (server-side invite/reset flows).
-- ============================================================================

create or replace function public.protect_profile_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (
    new.role is distinct from old.role
    or new.id is distinct from old.id
    or new.username is distinct from old.username
    or new.email is distinct from old.email
  ) and not (public.is_admin() or auth.role() = 'service_role') then
    raise exception 'Changing role or identity fields (role/id/username/email) requires admin privileges';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_identity
  before update on public.profiles
  for each row execute function public.protect_profile_identity();

-- Sanity: ordinary self-edits (name, must_change_password) stay allowed —
-- only the four identity fields are guarded.
