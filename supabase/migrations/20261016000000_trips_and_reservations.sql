-- Trips catalogue (public read) + reservations (write-only through create_reservation, never readable with the anon key).
-- Manage trips and read reservations from the Supabase dashboard (Table editor), which uses the service role.

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  tone text not null default 'grey' check (tone in ('blue', 'lime', 'grey')),
  cover_image text,
  images text[] not null default '{}',
  inclusions text[] not null default '{}',
  meeting_point text,
  published boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- a trip comes in one or more durations, each with its own departure dates
create table public.trip_options (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips on delete cascade,
  label text not null, -- '4 Days / 3 Nights'
  sort int not null default 0
);

create table public.departures (
  id uuid primary key default gen_random_uuid(),
  option_id uuid not null references public.trip_options on delete cascade,
  departs_on date not null,
  seats int check (seats > 0), -- null = no limit
  unique (option_id, departs_on)
);

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips on delete cascade,
  name text not null,
  board text not null default 'As described',
  price_egp int check (price_egp >= 0), -- null = price on request
  sort int not null default 0
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  departure_id uuid not null references public.departures on delete restrict,
  package_id uuid not null references public.packages on delete restrict,
  travellers int not null check (travellers between 1 and 20),
  total_egp int, -- snapshot of price_egp * travellers at booking time
  name text not null check (char_length(name) between 2 and 120),
  phone text not null check (phone ~ '^\+?[0-9 ()-]{7,20}$'),
  email text check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  notes text check (char_length(notes) <= 1000),
  status text not null default 'new' check (status in ('new', 'confirmed', 'cancelled'))
);

create index on public.trip_options (trip_id);
create index on public.departures (option_id, departs_on);
create index on public.packages (trip_id);
create index on public.reservations (departure_id) where status <> 'cancelled';

alter table public.trips enable row level security;
alter table public.trip_options enable row level security;
alter table public.departures enable row level security;
alter table public.packages enable row level security;
alter table public.reservations enable row level security; -- no policies: anon/authenticated can't touch it directly

create policy "public reads published trips" on public.trips for select using (published);
create policy "public reads options of published trips" on public.trip_options for select
  using (exists (select 1 from public.trips t where t.id = trip_id and t.published));
create policy "public reads upcoming departures" on public.departures for select
  using (departs_on >= current_date and exists (
    select 1 from public.trip_options o join public.trips t on t.id = o.trip_id where o.id = option_id and t.published));
create policy "public reads packages of published trips" on public.packages for select
  using (exists (select 1 from public.trips t where t.id = trip_id and t.published));

-- The only way in for the public. Checks the departure is bookable, the package belongs to the same trip,
-- seats are left, and computes the price server side so the client can't set it.
create function public.create_reservation(
  departure_id uuid, package_id uuid, travellers int,
  name text, phone text, email text default null, notes text default null
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_trip uuid;
  v_seats int;
  v_price int;
  v_taken int;
  v_id uuid;
begin
  -- lock the departure row so two bookings can't both take the last seats
  select o.trip_id, d.seats into v_trip, v_seats
  from public.departures d
  join public.trip_options o on o.id = d.option_id
  join public.trips t on t.id = o.trip_id
  where d.id = create_reservation.departure_id and t.published and d.departs_on >= current_date
  for update of d;
  if not found then raise exception 'This departure is no longer available.'; end if;

  select p.price_egp into v_price from public.packages p
  where p.id = create_reservation.package_id and p.trip_id = v_trip;
  if not found then raise exception 'This package is not available for this trip.'; end if;

  if v_seats is not null then
    select coalesce(sum(r.travellers), 0) into v_taken from public.reservations r
    where r.departure_id = create_reservation.departure_id and r.status <> 'cancelled';
    if v_taken + travellers > v_seats then
      raise exception 'Only % seat(s) left on this departure.', greatest(v_seats - v_taken, 0);
    end if;
  end if;

  insert into public.reservations (departure_id, package_id, travellers, total_egp, name, phone, email, notes)
  values (create_reservation.departure_id, create_reservation.package_id, travellers, v_price * travellers,
          trim(name), trim(phone), nullif(trim(email), ''), nullif(trim(notes), ''))
  returning id into v_id;
  return v_id;
exception
  when check_violation then raise exception 'Please check your name, phone and email.';
end $$;

revoke all on function public.create_reservation from public;
grant execute on function public.create_reservation to anon, authenticated;
