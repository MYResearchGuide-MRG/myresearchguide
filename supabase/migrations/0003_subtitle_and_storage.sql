-- ============================================================================
-- MRG website — article subtitle + image storage buckets
--
--   subtitle: Substack-style "Add a subtitle…" line under article titles.
--   buckets:  avatars (profile photos) + article-covers, public read,
--             per-user folders (avatars/<user_id>/…, article-covers/<user_id>/…)
--             so authenticated users can only touch their own files.
-- ============================================================================

alter table public.articles
  add column if not exists subtitle text not null default '';

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('article-covers', 'article-covers', true)
on conflict (id) do nothing;

create policy "mrg_images_public_read"
  on storage.objects for select to anon, authenticated
  using (bucket_id in ('avatars', 'article-covers'));

create policy "mrg_images_owner_upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('avatars', 'article-covers')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "mrg_images_owner_update"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('avatars', 'article-covers')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "mrg_images_owner_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('avatars', 'article-covers')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
