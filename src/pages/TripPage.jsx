import { use, useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Headline } from '../components/Headline'
import { Button } from '../components/Button'
import { Faq } from '../components/Faq'
import { createReservation, day, tripsPromise } from '../lib/api'

// ponytail: shared placeholder photo until a trip sets `images` in Supabase
const photos = ['/imgs/about-sunset.jpg']

const steps = ['Choose Package', 'Guest Details', 'Reservation Ticket']
const egp = (n) => `${n.toLocaleString('en-US')} EGP`
const months = (deps) => [...new Set(deps.map((d) => day(d.departs_on, 'long').split(' ')[1]))].join(' & ')

export default function TripPage() {
  const { slug } = useParams()
  const trip = use(tripsPromise()).find((d) => d.slug === slug)
  const [step, setStep] = useState(0)
  const [opt, setOpt] = useState(0)
  const [date, setDate] = useState(null) // null = first date of the chosen duration
  const [pkg, setPkg] = useState(0)
  const [count, setCount] = useState(1)
  const [guest, setGuest] = useState(null)
  const [ref, setRef] = useState(null)
  const pane = useRef(null)
  const prevStep = useRef(step)
  // move focus to the new step so keyboard and screen reader users land on it (not on first render)
  useEffect(() => {
    if (prevStep.current !== step) pane.current?.focus()
    prevStep.current = step
  }, [step])
  const sent = step === 2 // ponytail: ticket is final, earlier steps lock so a reservation can't be sent twice
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [error, setError] = useState('')
  useEffect(() => { if (trip) document.title = `${trip.name} trip | Infinity Vibes` }, [trip])
  if (!trip) return <Navigate to="/destinations" replace />

  const { options, packages } = trip
  const o = options[opt]
  const chosen = o?.departures.find((d) => d.id === date) ?? o?.departures[0]
  const p = packages[pkg]
  const total = p?.price == null ? null : p.price * count
  const bookable = Boolean(chosen && p)

  const paneProps = { ref: pane, tabIndex: -1, 'aria-label': steps[step] }

  async function onSubmit(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const g = { name: f.get('name'), phone: f.get('phone'), email: f.get('email') || null, notes: f.get('notes') || null }
    setStatus('sending')
    try {
      setRef(await createReservation({ departure_id: chosen.id, package_id: p.id, travellers: count, ...g }))
      setGuest(g)
      setStatus('idle')
      setStep(2)
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <>
      <section className="iv-trip">
        <aside className="iv-trip__info">
          <div className="iv-trip__poster">
            <img src={(trip.images ?? photos)[0]} alt="" />
            <Headline as="h1" size="xl" tone="white" kicker="Trip to">{trip.name}<span className="iv-dot">.</span></Headline>
          </div>
          <h2 className="iv-trip__sub">Program Inclusions</h2>
          <ul className="iv-trip__list">
            {trip.inclusions.map((x) => <li key={x}>{x}</li>)}
          </ul>
          <div className="iv-trip__meet">
            <b>Meeting Point:</b>
            <span>{trip.meeting ?? 'Cairo pickup, details sent after booking'}</span>
          </div>
        </aside>

        <div className="iv-trip__wizard">
          <ol className="iv-trip__steps">
            {steps.map((s, i) => (
              <li key={s} aria-current={i === step ? 'step' : undefined} data-done={i < step}>
                <button type="button" disabled={sent ? i < 2 : i === 2} onClick={() => setStep(i)}><span>{i + 1}</span>{s}</button>
              </li>
            ))}
          </ol>

          {step === 0 && (
            <div className="iv-trip__pane" role="group" {...paneProps}>
              <h3 id="trip-duration">1. Select duration</h3>
              <div className="iv-trip__opts" role="group" aria-labelledby="trip-duration">
                {options.map((x, i) => (
                  <button key={x.length} type="button" className="iv-trip__opt" aria-pressed={i === opt} onClick={() => setOpt(i)}>
                    <b>{x.length}</b><small>{x.departures.length ? `Available in ${months(x.departures)}` : 'No dates yet'}</small>
                  </button>
                ))}
              </div>

              <h3 id="trip-date">2. Select departure date</h3>
              <div className="iv-trip__dates" role="group" aria-labelledby="trip-date">
                {o?.departures.map((d) => (
                  <button key={d.id} type="button" aria-pressed={d.id === chosen.id} onClick={() => setDate(d.id)}>{day(d.departs_on)}</button>
                ))}
              </div>
              {!chosen && <p className="iv-trip__error">No upcoming departures right now, check back soon.</p>}

              <h3 id="trip-package">Select hotel / camp package</h3>
              <div className="iv-trip__pkgs" role="group" aria-labelledby="trip-package">
                {packages.map((x, i) => (
                  <button key={x.name} type="button" className="iv-trip__opt" aria-pressed={i === pkg} onClick={() => setPkg(i)}>
                    <span><b>{x.name}</b><small>{x.board}</small></span>
                    {x.price != null && <span className="iv-trip__price">{egp(x.price)}<small>per person</small></span>}
                  </button>
                ))}
              </div>

              <h3 id="trip-count">Number of travelers</h3>
              <div className="iv-trip__count" role="group" aria-labelledby="trip-count">
                <button type="button" aria-label="Fewer travelers" onClick={() => setCount((c) => Math.max(1, c - 1))}>-</button>
                <output>{count}</output>
                <button type="button" aria-label="More travelers" onClick={() => setCount((c) => Math.min(20, c + 1))}>+</button>
              </div>

              <div className="iv-trip__foot">
                <div><small>Total price</small><strong>{total != null ? egp(total) : 'On request'}</strong></div>
                <Button variant="primary" disabled={!bookable} onClick={() => setStep(1)}>Continue</Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <form className="iv-trip__pane iv-trip__form" onSubmit={onSubmit} {...paneProps}>
              {/* limits mirror the reservations table checks */}
              <label>Full name<input name="name" required minLength={2} maxLength={120} autoComplete="name" defaultValue={guest?.name} /></label>
              <label>Phone<input name="phone" type="tel" required pattern="\+?[0-9 \(\)\-]{7,20}" title="7 to 20 digits, optionally starting with +" autoComplete="tel" defaultValue={guest?.phone} /></label>
              <label>Email (optional)<input name="email" type="email" maxLength={254} autoComplete="email" defaultValue={guest?.email ?? ''} /></label>
              <label>Notes (optional)<textarea name="notes" rows="3" maxLength={1000} defaultValue={guest?.notes ?? ''} /></label>
              {status === 'error' && <p className="iv-trip__error" role="alert">{error}</p>}
              <div className="iv-trip__foot">
                <Button type="button" variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button type="submit" variant="primary" disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : 'Reserve'}</Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="iv-trip__pane iv-trip__done" role="status" {...paneProps}>
              <span className="iv-trip__tick" aria-hidden="true" />
              <h2>Request received<span className="iv-dot">.</span></h2>
              <dl className="iv-trip__ticket">
                <dt>Reference</dt><dd>{ref.slice(0, 8).toUpperCase()}</dd>
                <dt>Trip</dt><dd>{trip.name}, {o.length}</dd>
                <dt>Departure</dt><dd>{day(chosen.departs_on)}</dd>
                <dt>Package</dt><dd>{p.name}</dd>
                <dt>Travelers</dt><dd>{count}</dd>
                <dt>Guest</dt><dd>{guest.name}, {guest.phone}</dd>
                {total != null && <><dt>Total</dt><dd>{egp(total)}</dd></>}
              </dl>
              <p>Thanks! We will contact you shortly to confirm your spot.</p>
              <Button href="/destinations" variant="outline">See more destinations</Button>
            </div>
          )}
        </div>
      </section>
      <Faq />
    </>
  )
}
