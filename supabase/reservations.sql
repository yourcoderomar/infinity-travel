-- Run once in the Supabase SQL editor. Anyone may insert a reservation; nobody can read them with the public key.
create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  trip text not null,
  date text not null,
  name text not null,
  phone text not null,
  email text,
  travellers int not null check (travellers between 1 and 20),
  notes text,
  status text not null default 'new'
);
alter table public.reservations enable row level security;
create policy "public can reserve" on public.reservations for insert to anon with check (true);
