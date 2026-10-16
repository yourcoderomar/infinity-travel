# Infinity Vibes

Group trips out of Cairo. React + Vite front end, Supabase (Postgres) back end, deployed as a static SPA.

## Run locally

```bash
cp .env.example .env   # fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

## Database

Schema lives in `supabase/migrations`, starter catalogue in `supabase/seed.sql`.

- `trips` → `trip_options` (durations) → `departures` (dates, optional seat cap), plus `packages` (hotel/board + price per person).
- `reservations` has RLS on and no policies, so the public key can't read or write it directly. Guests book through
  the `create_reservation` RPC, which checks the departure is upcoming, the package belongs to the trip, seats are left,
  and computes the total server side. A trigger caps bookings at 3 per phone per day and 15 per departure per hour.
- Trip photos: upload to Storage → `trips` bucket (webp/jpg/png, max 2 MB, e.g. `dahab/cover.webp`), then put that path in
  `trips.cover_image` (destination cards) and/or `trips.images` (trip page, first one shown). Full URLs also work.
- Edit trips and read reservations in the Supabase dashboard (Table editor). Admins set `status` from the dropdown:
  `new` → `confirmed` → `deposit_paid` (50% paid) → `paid` (full amount), or `cancelled`, which frees the seats.

First deploy of the database:

```bash
supabase link --project-ref <ref>
supabase db push
psql "<connection string>" -f supabase/seed.sql   # or paste it into the SQL editor, once
```

Check the live security rules and booking flow (leaves one `TEST check.mjs` reservation to delete):

```bash
node --env-file=.env supabase/check.mjs
```

Want an email on every booking? Dashboard → Database → Webhooks on `reservations` insert.

## Deploy

`vercel.json` adds the SPA fallback, security headers (incl. CSP allowing `*.supabase.co`) and long caching for hashed assets.
Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the host's environment, then `npm run build`.
