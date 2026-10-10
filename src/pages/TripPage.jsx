import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Headline } from '../components/Headline'
import { Button } from '../components/Button'
import { Faq } from '../components/Faq'
import { destinations, slugOf } from '../data/destinations'

// ponytail: placeholder list, move into data/destinations.js per trip when real
const included = ['Round-trip transport from Cairo', 'Accommodation', 'A trip leader', 'The planned activities']

// ponytail: shared placeholder photos until a destination sets `images: [...]` in data/destinations.js (first = hero, rest = mosaic)
const photos = ['/imgs/about-sunset.jpg', '/imgs/gallery-snorkel-tall.jpg', '/imgs/about-group.jpg', '/imgs/gallery-snorkel-wide.jpg']

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// plain REST call to Supabase, no client lib. Table: supabase/reservations.sql
async function reserve(row) {
  if (!url || !key) throw new Error('Reservations are not set up yet.')
  const res = await fetch(`${url}/rest/v1/reservations`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(row),
  })
  if (!res.ok) throw new Error('Something went wrong, please try again.')
}

export default function TripPage() {
  const { slug } = useParams()
  const trip = destinations.find((d) => slugOf(d.name) === slug)
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')
  if (!trip) return <Navigate to="/destinations" replace />

  async function onSubmit(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setStatus('sending')
    try {
      await reserve({
        trip: trip.name,
        date: f.get('date'),
        name: f.get('name'),
        phone: f.get('phone'),
        email: f.get('email') || null,
        travellers: Number(f.get('travellers')),
        notes: f.get('notes') || null,
      })
      setStatus('done')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  const [hero, ...mosaic] = trip.images ?? photos

  return (
    <>
      <section className="iv-trip-hero" style={{ '--trip-img': `url(${hero})` }}>
        <div className="iv-trip-hero__bg" aria-hidden="true" />
        <div className="iv-trip-hero__content">
          <Headline as="h1" size="xl" tone="white" kicker="Trip to">{trip.name}<span className="iv-dot">.</span></Headline>
          <ul className="iv-trip-hero__meta">
            <li>{trip.length}</li>
            <li>{trip.dates.length} departures</li>
            <li>From Cairo</li>
          </ul>
        </div>
      </section>

      <section className="iv-trip">
        <div className="iv-trip__info">
          <h2 className="iv-trip__sub">What is included</h2>
          <ol className="iv-trip__list">
            {included.map((x, i) => <li key={x} style={{ '--i': i }}><span>{String(i + 1).padStart(2, '0')}</span>{x}</li>)}
          </ol>
          <div className="iv-trip__mosaic">
            {mosaic.map((src, i) => <img key={i} src={src} alt="" loading="lazy" />)}
          </div>
        </div>

        {status === 'done' ? (
          <div className="iv-trip__form iv-trip__done" role="status">
            <span className="iv-trip__tick" aria-hidden="true" />
            <h2>Request received<span className="iv-dot">.</span></h2>
            <p>Thanks! We will contact you shortly to confirm your spot on the {trip.name} trip.</p>
            <Button href="/destinations" variant="outline">See more destinations</Button>
          </div>
        ) : (
          <form className="iv-trip__form" onSubmit={onSubmit}>
            <h2 className="iv-trip__sub">Reserve your spot</h2>
            <fieldset>
              <legend>Choose a date</legend>
              <div className="iv-trip__dates">
                {trip.dates.map((d, i) => (
                  <label key={d}><input type="radio" name="date" value={d} defaultChecked={i === 0} required /><span>{d}</span></label>
                ))}
              </div>
            </fieldset>
            <label>Full name<input name="name" required autoComplete="name" /></label>
            <div className="iv-trip__row">
              <label>Phone<input name="phone" type="tel" required autoComplete="tel" /></label>
              <label>Travellers<input name="travellers" type="number" min="1" max="20" defaultValue="1" required /></label>
            </div>
            <label>Email (optional)<input name="email" type="email" autoComplete="email" /></label>
            <label>Notes (optional)<textarea name="notes" rows="3" /></label>
            {status === 'error' && <p className="iv-trip__error" role="alert">{error}</p>}
            <Button type="submit" variant="primary" disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : 'Reserve'}</Button>
          </form>
        )}
      </section>
      <Faq />
    </>
  )
}
