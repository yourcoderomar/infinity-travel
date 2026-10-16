-- Starter catalogue (was src/data/destinations.js). Dates and Fayoum/Sokhna packages are placeholders: edit in the dashboard.
with t as (
  insert into public.trips (slug, name, tone, inclusions, meeting_point, sort) values
    ('dahab', 'Dahab', 'blue', array[
      'Round-trip Cairo/Sinai luxury AC bus transfers',
      'Hotel stay according to selected package & board type',
      'Blue Hole & Three Pools snorkeling guided expedition',
      'Wadi Qunai hiking & Bedouin mountain dinner gathering',
      'Infinity Vibes group coordinator on-site 24/7'
    ], 'Abbaseya / Heliopolis / Alexandria pickup', 1),
    ('fayoum', 'Fayoum', 'lime', array['Round-trip transport from Cairo', 'Accommodation', 'A trip leader', 'The planned activities'], 'Cairo pickup, details sent after booking', 2),
    ('ain-el-sokhna', 'Ain El Sokhna', 'grey', array['Round-trip transport from Cairo', 'Accommodation', 'A trip leader', 'The planned activities'], 'Cairo pickup, details sent after booking', 3)
  returning id, slug
),
o as (
  insert into public.trip_options (trip_id, label, sort)
  select t.id, x.label, x.sort from t join (values
    ('dahab', '4 Days / 3 Nights', 1), ('dahab', '5 Days / 4 Nights', 2),
    ('fayoum', '2 Days / 1 Night', 1), ('ain-el-sokhna', '3 Days / 2 Nights', 1)
  ) as x(slug, label, sort) on x.slug = t.slug
  returning id, trip_id, label
),
d as (
  insert into public.departures (option_id, departs_on, seats)
  select o.id, x.day::date, 40 from o join (values
    ('4 Days / 3 Nights', '2026-11-05'), ('4 Days / 3 Nights', '2026-11-12'), ('4 Days / 3 Nights', '2026-11-19'),
    ('5 Days / 4 Nights', '2026-11-08'), ('5 Days / 4 Nights', '2026-11-22'),
    ('2 Days / 1 Night', '2026-11-07'), ('2 Days / 1 Night', '2026-11-21'),
    ('3 Days / 2 Nights', '2026-11-13'), ('3 Days / 2 Nights', '2026-11-27')
  ) as x(label, day) on x.label = o.label
  returning id
)
insert into public.packages (trip_id, name, board, price_egp, sort)
select t.id, x.name, x.board, x.price, x.sort from t join (values
  ('dahab', 'SEAHORSE Hotel', 'Room Only', 4700, 1),
  ('dahab', 'NUBIA Hotel (Half Board)', 'Half Board (Breakfast & Dinner)', 6750, 2),
  ('dahab', 'CANYON Hotel', 'Breakfast Only', 6700, 3),
  ('fayoum', 'Standard package', 'As described', null, 1),
  ('ain-el-sokhna', 'Standard package', 'As described', null, 1)
) as x(slug, name, board, price, sort) on x.slug = t.slug;
