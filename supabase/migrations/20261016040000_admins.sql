-- Admin access for the /admin page. An admin = a Supabase Auth user listed in public.admins.
-- Add one: Dashboard -> Authentication -> Add user, then
--   insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
create table public.admins (
  user_id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
create policy "admins can see their own row" on public.admins for select to authenticated using (user_id = (select auth.uid()));

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()))
$$;
revoke all on function public.is_admin from public;
revoke execute on function public.is_admin from anon; -- Supabase grants anon by default
grant execute on function public.is_admin to authenticated;

-- full access for admins, on top of the public read policies
create policy "admins manage trips" on public.trips for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins manage trip options" on public.trip_options for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins manage departures" on public.departures for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins manage packages" on public.packages for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins manage reservations" on public.reservations for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- trip photos: anyone can view (public bucket), only admins can list/upload/replace/delete
create policy "admins read trip photos" on storage.objects for select to authenticated using (bucket_id = 'trips' and (select public.is_admin()));
create policy "admins upload trip photos" on storage.objects for insert to authenticated with check (bucket_id = 'trips' and (select public.is_admin()));
create policy "admins update trip photos" on storage.objects for update to authenticated using (bucket_id = 'trips' and (select public.is_admin()));
create policy "admins delete trip photos" on storage.objects for delete to authenticated using (bucket_id = 'trips' and (select public.is_admin()));
