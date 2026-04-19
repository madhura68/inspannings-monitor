alter table public.profiles
add column if not exists tagline text,
add column if not exists bio text,
add column if not exists avatar_path text;

alter table public.profiles
drop constraint if exists profiles_tagline_length_check;

alter table public.profiles
add constraint profiles_tagline_length_check
check (tagline is null or char_length(tagline) <= 160);

alter table public.profiles
drop constraint if exists profiles_bio_length_check;

alter table public.profiles
add constraint profiles_bio_length_check
check (bio is null or char_length(bio) <= 2000);

alter table public.profiles
drop constraint if exists profiles_avatar_path_length_check;

alter table public.profiles
add constraint profiles_avatar_path_length_check
check (avatar_path is null or char_length(avatar_path) <= 255);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'profile-avatars',
  'profile-avatars',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "profile_avatars_select_own" on storage.objects;
create policy "profile_avatars_select_own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile-avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "profile_avatars_insert_own" on storage.objects;
create policy "profile_avatars_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "profile_avatars_update_own" on storage.objects;
create policy "profile_avatars_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'profile-avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "profile_avatars_delete_own" on storage.objects;
create policy "profile_avatars_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);
