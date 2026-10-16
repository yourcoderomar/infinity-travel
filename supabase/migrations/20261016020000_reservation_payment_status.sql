-- Payment-aware booking status, set by admins in the dashboard (enum = dropdown in the Table editor).
-- new -> confirmed -> deposit_paid (50%) -> paid (full amount); cancelled frees the seats.
do $$ begin
  create type public.reservation_status as enum ('new', 'confirmed', 'deposit_paid', 'paid', 'cancelled');
exception when duplicate_object then null; -- safe to re-run after a failed paste
end $$;

-- the partial index compares status as text, so it has to be rebuilt around the type change
drop index if exists public.reservations_departure_id_idx;
alter table public.reservations drop constraint if exists reservations_status_check;
alter table public.reservations alter column status drop default;
alter table public.reservations alter column status type public.reservation_status using status::public.reservation_status;
alter table public.reservations alter column status set default 'new';
create index reservations_departure_id_idx on public.reservations (departure_id) where status <> 'cancelled';
