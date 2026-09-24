-- ============================================================================
-- MRG website — initial schema
-- Stack: Supabase (Postgres 15+). Apply via `supabase db push` or the SQL editor.
--
-- Design notes
--   * Identity: auth.users is Supabase's managed table (email + password).
--     `profiles.username` is the user-facing login handle; login resolves
--     username -> auth.users.email and calls signInWithPassword.
--     Password reset goes through auth.users' native email flow.
--   * profiles.id = auth.users.id (1:1, no separate identity table).
--   * A person may be a researcher AND/OR a team member (the 4 professors are
--     both) — researcher_profiles / team_profiles are independent 1:1 rows.
--   * RLS everywhere: public reads researcher/team/article content; profile
--     writes are owner-or-admin; email/username stay out of anon queries via
--     the public_profiles view.
-- ============================================================================

create extension if not exists citext;

-- ---------------------------------------------------------------------------
-- profiles — identity + role
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                   uuid primary key references auth.users (id) on delete cascade,
  username             citext not null unique,        -- login handle, case-insensitive
  email                text not null unique,          -- mirrors auth.users.email (sync trigger below)
  role                 text not null default 'researcher'
                       check (role in ('admin', 'researcher', 'team')),
  name                 text not null,
  must_change_password boolean not null default true, -- temp-password accounts must set their own
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- is_admin() — security definer so RLS policies can call it without recursion.
-- MUST be defined before the policies below reference it.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Authenticated users may read profiles (needed for admin views, author joins);
-- the public site never reads this table directly, only public_profiles (below).
create policy "profiles_select_authenticated"
  on public.profiles for select to authenticated using (true);

-- Users edit their own profile; admins edit everything.
create policy "profiles_update_owner_or_admin"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_delete_admin"
  on public.profiles for delete to authenticated
  using (public.is_admin());

-- No insert policy: accounts are created via the service-role admin API /
-- the auth.users trigger below. (Service role bypasses RLS.)

-- Public view: only what the anonymous site needs. email/username stay private
-- to authenticated users (username IS public by design — it's the login handle).
create view public.public_profiles
with (security_invoker = false) as
  select id, name, role, username
  from public.profiles;
grant select on public.public_profiles to anon, authenticated;

-- ---------------------------------------------------------------------------
-- researcher_profiles — mirrors the schema of src/data/researchers.js
-- ---------------------------------------------------------------------------
create table public.researcher_profiles (
  profile_id   uuid primary key references public.profiles (id) on delete cascade,
  tagline      text not null default '',
  universities text[] not null default '{}',
  field        text[] not null default '{}',
  level        text check (level in ('Undergrad', 'Masters', 'PhD', 'Postdoc', 'Industry')),
  research     text not null default '',
  image        text not null default '',
  linkedin     text not null default '',
  scholar      text not null default '',
  website      text not null default '',
  twitter      text not null default '',
  github       text not null default '',
  interview    text not null default '',
  updated_at   timestamptz not null default now()
);

alter table public.researcher_profiles enable row level security;

-- Public site renders the directory from this table.
create policy "researcher_select_public"
  on public.researcher_profiles for select to anon, authenticated using (true);

-- Owner edits their own row; admins edit all.
create policy "researcher_write_owner_or_admin"
  on public.researcher_profiles for all to authenticated
  using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- team_profiles — mirrors the schema of src/app/team/organisation-data.js
-- ---------------------------------------------------------------------------
create table public.team_profiles (
  profile_id   uuid primary key references public.profiles (id) on delete cascade,
  title        text not null default '',
  tier         text not null default '',
  departments  text[] not null default '{}',
  image        text not null default '',
  links        jsonb not null default '[]'::jsonb
               check (jsonb_typeof(links) = 'array'),
  updated_at   timestamptz not null default now()
);

alter table public.team_profiles enable row level security;

create policy "team_select_public"
  on public.team_profiles for select to anon, authenticated using (true);

create policy "team_write_owner_or_admin"
  on public.team_profiles for all to authenticated
  using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- articles
-- ---------------------------------------------------------------------------
create table public.articles (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text not null default '',
  body_md      text not null default '',
  cover_image  text not null default '',
  tags         text[] not null default '{}',
  status       text not null default 'draft'
               check (status in ('draft', 'published')),
  author_id    uuid references public.profiles (id) on delete set null,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.articles enable row level security;

-- Public: published articles only. Author/admin: everything.
create policy "articles_select_published"
  on public.articles for select to anon
  using (status = 'published');

create policy "articles_select_author_or_admin"
  on public.articles for select to authenticated
  using (author_id = auth.uid() or public.is_admin() or status = 'published');

create policy "articles_write_author_or_admin"
  on public.articles for all to authenticated
  using (author_id = auth.uid() or public.is_admin())
  with check (author_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

-- Create the profiles row when an auth user is created (admin API / invite).
-- Username comes from user_metadata.username set by the invite action.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, role, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', ''),
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'role', 'researcher'),
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep profiles.email in sync when Supabase updates auth.users.email
-- (e.g. email change via admin API).
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set email = lower(new.email), updated_at = now()
  where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_update
  after update of email on auth.users
  for each row execute function public.sync_profile_email();

-- updated_at maintenance for all content tables.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger researcher_profiles_set_updated_at
  before update on public.researcher_profiles
  for each row execute function public.set_updated_at();

create trigger team_profiles_set_updated_at
  before update on public.team_profiles
  for each row execute function public.set_updated_at();

create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();
