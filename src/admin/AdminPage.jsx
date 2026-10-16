import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { Button } from '../components/Button'
import { day, photo } from '../lib/api'
import './admin.css'

// Admin only. The public site talks to PostgREST with plain fetch; here supabase-js handles the login session,
// token refresh and photo uploads. Access is enforced by RLS (public.is_admin()), not by this page.
const db = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

const statuses = [
  ['new', 'New'], ['confirmed', 'Confirmed'], ['deposit_paid', '50% paid'], ['paid', 'Paid in full'], ['cancelled', 'Cancelled'],
]
const statusLabel = Object.fromEntries(statuses)
const tones = ['blue', 'lime', 'grey']
const egp = (n) => (n == null ? 'On request' : `${n.toLocaleString('en-US')} EGP`)
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const isBucketPath = (v) => v && !/^(https?:)?\/|^data:/.test(v)

// supabase-js returns { data, error }; throw so callers can use try/catch
async function q(promise) {
  const { data, error } = await promise
  if (error) throw error
  return data
}

export default function AdminPage() {
  const [session, setSession] = useState(undefined) // undefined = still checking
  const [isAdmin, setIsAdmin] = useState(null)
  const [tab, setTab] = useState('reservations')
  const [flash, setFlash] = useState(null) // { text, error }
  const userId = session?.user.id

  useEffect(() => {
    document.title = 'Admin | Infinity Vibes'
    const robots = Object.assign(document.createElement('meta'), { name: 'robots', content: 'noindex' })
    document.head.append(robots)
    return () => robots.remove()
  }, [])
  useEffect(() => {
    db.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = db.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])
  useEffect(() => {
    setIsAdmin(null)
    if (userId) db.from('admins').select('user_id').eq('user_id', userId).maybeSingle().then(({ data }) => setIsAdmin(Boolean(data)))
  }, [userId])
  useEffect(() => {
    if (!flash) return
    const t = setTimeout(() => setFlash(null), flash.error ? 6000 : 2000)
    return () => clearTimeout(t)
  }, [flash])

  // every write goes through here so success and failure are always shown
  const act = useCallback(async (fn, done = 'Saved') => {
    try {
      const result = await fn()
      if (done) setFlash({ text: done }) // loads pass null: errors only
      return result
    } catch (e) {
      // 23503 = foreign key: something still points at the row (bookings on a date/package/trip)
      const text = e.code === '23503' ? 'Can\'t delete: it still has reservations. Hide the trip or cancel the bookings instead.' : (e.message ?? String(e))
      setFlash({ text, error: true })
    }
  }, [])

  if (session === undefined) return <p className="ad-center">Loading...</p>
  if (!session) return <Login />
  if (isAdmin === null) return <p className="ad-center">Checking access...</p>
  if (!isAdmin) {
    return (
      <div className="ad-center">
        <p>{session.user.email} is not an admin.</p>
        <Button variant="outline" onClick={() => db.auth.signOut()}>Sign out</Button>
      </div>
    )
  }

  return (
    <div className="ad">
      <header className="ad__top">
        <Link to="/" className="ad__brand">Infinity Vibes <span>admin</span></Link>
        <nav className="ad__tabs" aria-label="Admin sections">
          {[['reservations', 'Reservations'], ['trips', 'Trips']].map(([k, label]) => (
            <button key={k} type="button" aria-current={tab === k ? 'page' : undefined} onClick={() => setTab(k)}>{label}</button>
          ))}
        </nav>
        <span className="ad__who">{session.user.email}</span>
        <button type="button" className="ad__link" onClick={() => db.auth.signOut()}>Sign out</button>
      </header>
      {flash && <p className={`ad__flash${flash.error ? ' is-error' : ''}`} role={flash.error ? 'alert' : 'status'}>{flash.text}</p>}
      <main className="ad__main">
        {tab === 'reservations' ? <Reservations act={act} /> : <Trips act={act} />}
      </main>
    </div>
  )
}

function Login() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function onSubmit(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true)
    const { error } = await db.auth.signInWithPassword({ email: f.get('email'), password: f.get('password') })
    setBusy(false)
    setError(error ? error.message : '')
  }
  return (
    <form className="ad-login" onSubmit={onSubmit}>
      <h1>Admin sign in</h1>
      <label>Email<input name="email" type="email" required autoComplete="username" /></label>
      <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
      {error && <p className="ad__error" role="alert">{error}</p>}
      <Button type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</Button>
    </form>
  )
}

/* ---------- reservations ---------- */

function Reservations({ act }) {
  const [rows, setRows] = useState(null)
  const [filter, setFilter] = useState('open')
  const [search, setSearch] = useState('')

  const load = useCallback(() => act(async () => {
    // ponytail: newest 1000 only, add paging when bookings outgrow it
    setRows(await q(db.from('reservations')
      .select('*, departure:departures(departs_on, option:trip_options(label, trip:trips(name))), package:packages(name)')
      .order('created_at', { ascending: false }).limit(1000)))
  }, null), [act])
  useEffect(() => { load() }, [load])

  if (!rows) return <p>Loading reservations...</p>

  const counts = Object.fromEntries(statuses.map(([k]) => [k, rows.filter((r) => r.status === k).length]))
  const needle = search.trim().toLowerCase()
  const shown = rows.filter((r) =>
    (filter === 'all' || (filter === 'open' ? r.status !== 'cancelled' : r.status === filter))
    && (!needle || [r.name, r.phone, r.email, r.departure?.option?.trip?.name].some((v) => v?.toLowerCase().includes(needle))))

  const setStatus = (r, status) => act(async () => {
    await q(db.from('reservations').update({ status }).eq('id', r.id))
    setRows((all) => all.map((x) => (x.id === r.id ? { ...x, status } : x)))
  }, `${r.name}: ${statusLabel[status]}`)

  const remove = (r) => confirm(`Delete ${r.name}'s reservation? This can't be undone. (Cancelling keeps a record.)`) && act(async () => {
    await q(db.from('reservations').delete().eq('id', r.id))
    setRows((all) => all.filter((x) => x.id !== r.id))
  }, 'Reservation deleted')

  return (
    <section>
      <div className="ad__bar">
        <h1>Reservations</h1>
        <Button variant="outline" onClick={load}>Refresh</Button>
      </div>
      <div className="ad__chips" role="group" aria-label="Filter by status">
        {[['open', 'All open', rows.length - counts.cancelled], ...statuses.map(([k, l]) => [k, l, counts[k]]), ['all', 'Everything', rows.length]].map(([k, l, n]) => (
          <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>{l} <b>{n}</b></button>
        ))}
      </div>
      <input className="ad__search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, phone, email or trip..." aria-label="Search reservations" />

      {shown.length === 0 ? <p className="ad__muted">No reservations here.</p> : (
        <div className="ad__tablewrap">
          <table className="ad__table">
            <thead>
              <tr><th>Booked</th><th>Guest</th><th>Trip</th><th>Package</th><th>Pax</th><th>Total</th><th>Status</th><th><span className="ad__sr">Actions</span></th></tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className={`is-${r.status}`}>
                  <td>{new Date(r.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}<small>#{r.id.slice(0, 8).toUpperCase()}</small></td>
                  <td>
                    <b>{r.name}</b>
                    <a href={`tel:${r.phone.replace(/[^\d+]/g, '')}`}>{r.phone}</a>
                    {r.email && <a href={`mailto:${r.email}`}>{r.email}</a>}
                    {r.notes && <small className="ad__note">{r.notes}</small>}
                  </td>
                  <td>
                    <b>{r.departure?.option?.trip?.name ?? '?'}</b>
                    {r.departure && <small>{day(r.departure.departs_on, 'short')} · {r.departure.option.label}</small>}
                  </td>
                  <td>{r.package?.name}</td>
                  <td>{r.travellers}</td>
                  <td>{egp(r.total_egp)}</td>
                  <td>
                    <select value={r.status} onChange={(e) => setStatus(r, e.target.value)} aria-label={`Status for ${r.name}`}>
                      {statuses.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                    </select>
                  </td>
                  <td><button type="button" className="ad__danger" onClick={() => remove(r)} aria-label={`Delete ${r.name}'s reservation`}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

/* ---------- trips ---------- */

function Trips({ act }) {
  const [trips, setTrips] = useState(null)
  const [booked, setBooked] = useState({}) // departure id -> seats taken
  const [selected, setSelected] = useState(null)

  const load = useCallback(async () => {
    const [t, r] = await Promise.all([
      q(db.from('trips').select('*, trip_options(*, departures(*)), packages(*)').order('sort').order('sort', { referencedTable: 'trip_options' }).order('departs_on', { referencedTable: 'trip_options.departures' }).order('sort', { referencedTable: 'packages' })),
      q(db.from('reservations').select('departure_id, travellers').neq('status', 'cancelled')),
    ])
    setTrips(t)
    setBooked(r.reduce((m, x) => ({ ...m, [x.departure_id]: (m[x.departure_id] ?? 0) + x.travellers }), {}))
    setSelected((s) => s ?? t[0]?.id ?? null)
  }, [])
  useEffect(() => { act(load, null) }, [act, load])

  const addTrip = () => {
    const name = prompt('Trip name (e.g. Siwa)')?.trim()
    if (!name) return
    act(async () => {
      const [row] = await q(db.from('trips').insert({ name, slug: slugify(name), published: false, sort: (trips?.length ?? 0) + 1 }).select())
      await load()
      setSelected(row.id)
    }, `${name} created (hidden until you publish it)`)
  }

  if (!trips) return <p>Loading trips...</p>
  const trip = trips.find((t) => t.id === selected)

  return (
    <section className="ad-trips">
      <aside className="ad-trips__list">
        <div className="ad__bar"><h1>Trips</h1><Button onClick={addTrip}>+ New</Button></div>
        <ul>
          {trips.map((t) => (
            <li key={t.id}>
              <button type="button" aria-current={t.id === selected ? 'true' : undefined} onClick={() => setSelected(t.id)}>
                <span className={`ad__dot ad__dot--${t.tone}`} aria-hidden="true" />{t.name}
                {!t.published && <small>hidden</small>}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {trip ? <TripEditor key={trip.id} trip={trip} booked={booked} act={act} reload={load} onDeleted={() => setSelected(null)} /> : <p className="ad__muted">Pick a trip or create one.</p>}
    </section>
  )
}

// fields save on blur / change, so there is no "save" button to forget
function TripEditor({ trip, booked, act, reload, onDeleted }) {
  const save = (table, id, patch, label) => act(async () => { await q(db.from(table).update(patch).eq('id', id)); await reload() }, label)
  const saveTrip = (patch) => save('trips', trip.id, patch)
  const onBlurSave = (field, parse = (v) => v) => (e) => {
    const v = parse(e.target.value)
    if (v !== trip[field]) saveTrip({ [field]: v })
  }
  const insert = (table, row, label) => act(async () => { await q(db.from(table).insert(row)); await reload() }, label)
  const del = (table, id, what) => confirm(`Delete ${what}?`) && act(async () => { await q(db.from(table).delete().eq('id', id)); await reload() }, `Deleted ${what}`)

  async function upload(file) {
    const path = `${trip.slug}/${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')}`
    await q(db.storage.from('trips').upload(path, file, { cacheControl: '31536000', upsert: false }))
    return path
  }
  const removeFile = (path) => isBucketPath(path) && db.storage.from('trips').remove([path]) // best effort, the DB row is what matters

  const setCover = (file) => file && act(async () => {
    const path = await upload(file)
    await q(db.from('trips').update({ cover_image: path }).eq('id', trip.id))
    removeFile(trip.cover_image)
    await reload()
  }, 'Cover photo updated')
  const addPhotos = (files) => files.length && act(async () => {
    const paths = []
    for (const f of files) paths.push(await upload(f))
    await q(db.from('trips').update({ images: [...trip.images, ...paths] }).eq('id', trip.id))
    await reload()
  }, `${files.length} photo(s) added`)
  const removePhoto = (path) => confirm('Remove this photo?') && act(async () => {
    await q(db.from('trips').update({ images: trip.images.filter((p) => p !== path) }).eq('id', trip.id))
    removeFile(path)
    await reload()
  }, 'Photo removed')
  const movePhoto = (i) => saveTrip({ images: [trip.images[i], ...trip.images.filter((_, j) => j !== i)] })

  const deleteTrip = () => confirm(`Delete ${trip.name} with all its dates and packages? Trips with bookings can't be deleted, hide them instead.`) && act(async () => {
    await q(db.from('trips').delete().eq('id', trip.id))
    const files = [trip.cover_image, ...trip.images].filter(isBucketPath)
    if (files.length) db.storage.from('trips').remove(files) // only after the row is gone, so a refused delete keeps its photos
    onDeleted()
    await reload()
  }, `${trip.name} deleted`)

  return (
    <div className="ad-edit">
      <div className="ad__bar">
        <h2>{trip.name}</h2>
        <label className="ad__toggle">
          <input type="checkbox" checked={trip.published} onChange={(e) => saveTrip({ published: e.target.checked })} />
          {trip.published ? 'Published' : 'Hidden'}
        </label>
        {trip.published && <a className="ad__link" href={`/destinations/${trip.slug}`} target="_blank" rel="noreferrer">View on site ↗</a>}
      </div>

      <fieldset className="ad__grid">
        <legend>Details</legend>
        <label>Name<input defaultValue={trip.name} required onBlur={onBlurSave('name', (v) => v.trim())} /></label>
        <label>URL slug<input defaultValue={trip.slug} pattern="[a-z0-9-]+" title="lowercase letters, numbers and dashes" onBlur={onBlurSave('slug', slugify)} /><small>/destinations/{trip.slug}</small></label>
        <label>Card colour
          <select value={trip.tone} onChange={(e) => saveTrip({ tone: e.target.value })}>{tones.map((t) => <option key={t}>{t}</option>)}</select>
        </label>
        <label>Order on site<input type="number" defaultValue={trip.sort} onBlur={onBlurSave('sort', Number)} /></label>
        <label className="ad__wide">Meeting point<input defaultValue={trip.meeting_point ?? ''} onBlur={onBlurSave('meeting_point', (v) => v.trim() || null)} /></label>
        <label className="ad__wide">What's included <small>one per line</small>
          <textarea rows="5" defaultValue={trip.inclusions.join('\n')} onBlur={(e) => {
            const v = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
            if (v.join('\n') !== trip.inclusions.join('\n')) saveTrip({ inclusions: v })
          }} />
        </label>
      </fieldset>

      <fieldset>
        <legend>Photos <small>webp/jpg/png, max 2 MB each</small></legend>
        <div className="ad-photos">
          <figure>
            {trip.cover_image ? <img src={photo(trip.cover_image)} alt="" /> : <div className="ad-photos__empty">No cover</div>}
            <figcaption>Card cover <label className="ad__file">Replace<input type="file" accept="image/webp,image/jpeg,image/png,image/avif" onChange={(e) => { setCover(e.target.files[0]); e.target.value = '' }} /></label></figcaption>
          </figure>
          {trip.images.map((p, i) => (
            <figure key={p}>
              <img src={photo(p)} alt="" />
              <figcaption>
                {i === 0 ? 'Trip page main' : <button type="button" className="ad__link" onClick={() => movePhoto(i)}>Make main</button>}
                <button type="button" className="ad__danger" onClick={() => removePhoto(p)}>Remove</button>
              </figcaption>
            </figure>
          ))}
          <label className="ad-photos__add">+ Add trip page photos<input type="file" multiple accept="image/webp,image/jpeg,image/png,image/avif" onChange={(e) => { addPhotos([...e.target.files]); e.target.value = '' }} /></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Durations &amp; departure dates</legend>
        {trip.trip_options.map((o) => (
          <div key={o.id} className="ad-option">
            <div className="ad-row">
              <input aria-label="Duration" defaultValue={o.label} onBlur={(e) => e.target.value.trim() !== o.label && save('trip_options', o.id, { label: e.target.value.trim() })} />
              <button type="button" className="ad__danger" onClick={() => del('trip_options', o.id, `${o.label} and its dates`)}>Delete duration</button>
            </div>
            <table className="ad__table ad__table--compact">
              <thead><tr><th>Date</th><th>Seats</th><th>Booked</th><th><span className="ad__sr">Actions</span></th></tr></thead>
              <tbody>
                {o.departures.map((d) => {
                  const taken = booked[d.id] ?? 0
                  const past = d.departs_on < new Date().toISOString().slice(0, 10)
                  return (
                    <tr key={d.id} className={past ? 'is-past' : ''}>
                      <td><input type="date" aria-label="Departure date" defaultValue={d.departs_on} onBlur={(e) => e.target.value && e.target.value !== d.departs_on && save('departures', d.id, { departs_on: e.target.value })} />{past && <small>past</small>}</td>
                      <td><input type="number" min="1" aria-label="Seats" placeholder="no limit" defaultValue={d.seats ?? ''} onBlur={(e) => {
                        const v = e.target.value ? Number(e.target.value) : null
                        if (v !== d.seats) save('departures', d.id, { seats: v })
                      }} /></td>
                      <td className={d.seats && taken >= d.seats ? 'is-full' : ''}>{taken}{d.seats ? ` / ${d.seats}` : ''}</td>
                      <td><button type="button" className="ad__danger" onClick={() => del('departures', d.id, `the ${day(d.departs_on)} departure`)}>Delete</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <form className="ad-row" onSubmit={(e) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget)
              insert('departures', { option_id: o.id, departs_on: f.get('date'), seats: f.get('seats') ? Number(f.get('seats')) : null }, 'Date added')
              e.currentTarget.reset()
            }}>
              <input name="date" type="date" required aria-label="New departure date" />
              <input name="seats" type="number" min="1" placeholder="seats (optional)" aria-label="Seats for new date" />
              <Button type="submit" variant="outline">Add date</Button>
            </form>
          </div>
        ))}
        <form className="ad-row" onSubmit={(e) => {
          e.preventDefault()
          insert('trip_options', { trip_id: trip.id, label: new FormData(e.currentTarget).get('label').trim(), sort: trip.trip_options.length + 1 }, 'Duration added')
          e.currentTarget.reset()
        }}>
          <input name="label" required placeholder="e.g. 3 Days / 2 Nights" aria-label="New duration" />
          <Button type="submit" variant="outline">Add duration</Button>
        </form>
      </fieldset>

      <fieldset>
        <legend>Packages <small>price per person, empty = on request</small></legend>
        <table className="ad__table ad__table--compact">
          <thead><tr><th>Name</th><th>Board</th><th>Price (EGP)</th><th><span className="ad__sr">Actions</span></th></tr></thead>
          <tbody>
            {trip.packages.map((p) => (
              <tr key={p.id}>
                <td><input aria-label="Package name" defaultValue={p.name} onBlur={(e) => e.target.value.trim() !== p.name && save('packages', p.id, { name: e.target.value.trim() })} /></td>
                <td><input aria-label="Board" defaultValue={p.board} onBlur={(e) => e.target.value.trim() !== p.board && save('packages', p.id, { board: e.target.value.trim() })} /></td>
                <td><input type="number" min="0" aria-label="Price per person" placeholder="on request" defaultValue={p.price_egp ?? ''} onBlur={(e) => {
                  const v = e.target.value ? Number(e.target.value) : null
                  if (v !== p.price_egp) save('packages', p.id, { price_egp: v })
                }} /></td>
                <td><button type="button" className="ad__danger" onClick={() => del('packages', p.id, p.name)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <form className="ad-row" onSubmit={(e) => {
          e.preventDefault()
          const f = new FormData(e.currentTarget)
          insert('packages', { trip_id: trip.id, name: f.get('name').trim(), board: f.get('board').trim() || 'As described', price_egp: f.get('price') ? Number(f.get('price')) : null, sort: trip.packages.length + 1 }, 'Package added')
          e.currentTarget.reset()
        }}>
          <input name="name" required placeholder="Package name" aria-label="New package name" />
          <input name="board" placeholder="Board (e.g. Half Board)" aria-label="New package board" />
          <input name="price" type="number" min="0" placeholder="Price" aria-label="New package price" />
          <Button type="submit" variant="outline">Add package</Button>
        </form>
      </fieldset>

      <div className="ad__dangerzone">
        <button type="button" className="ad__danger" onClick={deleteTrip}>Delete trip</button>
      </div>
    </div>
  )
}
