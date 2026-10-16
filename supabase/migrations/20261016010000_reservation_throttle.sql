-- Anti-spam: open reservations count against seats, so a bot could block a departure.
-- Cap open bookings per phone per day and per departure per hour; cancelled ones don't count.
-- ponytail: phone-based throttle only, add Cloudflare Turnstile in front of the RPC if bots rotate numbers

create function public.throttle_reservations() returns trigger
language plpgsql set search_path = '' as $$
begin
  if (select count(*) from public.reservations r
      where regexp_replace(r.phone, '\D', '', 'g') = regexp_replace(new.phone, '\D', '', 'g')
        and r.created_at > now() - interval '24 hours' and r.status <> 'cancelled') >= 3 then
    raise exception 'Too many bookings from this phone number today. Please contact us directly.';
  end if;
  if (select count(*) from public.reservations r
      where r.departure_id = new.departure_id and r.created_at > now() - interval '1 hour') >= 15 then
    raise exception 'This departure is getting a lot of bookings right now. Please try again in a few minutes.';
  end if;
  return new;
end $$;

create trigger throttle_reservations before insert on public.reservations
  for each row execute function public.throttle_reservations();
