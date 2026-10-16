-- Trip photos live in the public "trips" Storage bucket. Admins upload in the dashboard (Storage -> trips),
-- e.g. dahab/cover.webp, then put that path in trips.cover_image (cards) or trips.images (trip page, first one shown).
-- Full https:// URLs and site paths like /imgs/x.jpg work too.
-- Public bucket = anyone can view by URL; only the dashboard/service role can upload or delete (no storage policies for anon).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('trips', 'trips', true, 2097152, array['image/webp', 'image/jpeg', 'image/png', 'image/avif'])
on conflict (id) do nothing;
