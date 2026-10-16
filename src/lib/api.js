// Plain PostgREST calls to Supabase, no client lib. Schema: supabase/migrations
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

async function rest(path, init = {}) {
  if (!url || !key) throw new Error('The site is not connected to its database yet.')
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...init.headers },
  })
  const body = await res.json().catch(() => null)
  // raise exception messages from create_reservation are written for guests, show them as is
  if (!res.ok) throw new Error(res.status < 500 && body?.code === 'P0001' ? body.message : 'Something went wrong, please try again.')
  return body
}

const tripQuery = 'trips?published=eq.true&order=sort&select=slug,name,tone,cover_image,images,inclusions,meeting_point,'
  + 'trip_options(label,departures(id,departs_on,seats)),packages(id,name,board,price_egp)'
  + '&trip_options.order=sort&trip_options.departures.order=departs_on&packages.order=sort'

const toTrip = (t) => ({
  slug: t.slug,
  name: t.name,
  tone: t.tone,
  image: t.cover_image ?? undefined,
  images: t.images.length ? t.images : undefined,
  inclusions: t.inclusions,
  meeting: t.meeting_point,
  options: t.trip_options.map((o) => ({ length: o.label, departures: o.departures })),
  packages: t.packages.map((p) => ({ id: p.id, name: p.name, board: p.board, price: p.price_egp })),
})

// one fetch per page load, shared by every component. A failure stays cached (React's use() needs a stable promise), retry = reload
let trips
export const tripsPromise = () => (trips ??= rest(tripQuery).then((rows) => rows.map(toTrip)))

// -> reservation id
export const createReservation = (args) => rest('rpc/create_reservation', { method: 'POST', body: JSON.stringify(args) })

// '2026-11-05' -> '5 November' (date only, so no timezone shift)
export const day = (iso, month = 'long') => new Date(`${iso}T00:00`).toLocaleDateString('en-GB', { day: 'numeric', month })
export const nextDeparture = (trip) => trip.options
  .flatMap((o) => o.departures.map((d) => ({ date: d.departs_on, length: o.length })))
  .sort((a, b) => a.date.localeCompare(b.date))[0]
