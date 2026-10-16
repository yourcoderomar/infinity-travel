import { useEffect, useId, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { day, matches, nextDeparture, tripsPromise } from '../lib/api'

// Live trip results under the search box. `className` styles the form (bar vs mobile menu), `onDone` closes the menu.
export function NavSearch({ className, inputClassName, onDone }) {
  const [q, setQ] = useState('')
  const [trips, setTrips] = useState(null)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const id = useId()

  // Nav sits outside Suspense, so read the shared trips promise instead of use()
  useEffect(() => {
    if (q && !trips) tripsPromise().then(setTrips, () => setTrips([]))
  }, [q, trips])

  const results = q.trim() && trips ? trips.filter((t) => matches(t, q)) : []
  const show = open && q.trim() !== ''

  function reset() {
    setQ('')
    setOpen(false)
    onDone?.()
  }

  function go(to) {
    reset()
    navigate(to)
  }

  function onSubmit(e) {
    e.preventDefault()
    if (!q.trim()) return
    go(results.length === 1 ? `/destinations/${results[0].slug}` : `/destinations?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <form
      role="search" className={className} onSubmit={onSubmit}
      onFocus={() => setOpen(true)}
      // close when focus leaves the box and its results, not when moving between them
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false) }}
      onKeyDown={(e) => { if (e.key === 'Escape' && show) { e.stopPropagation(); setOpen(false) } }}
    >
      <input
        className={inputClassName} name="q" type="search" value={q} onChange={(e) => { setQ(e.target.value); setOpen(true) }}
        placeholder="Search for a place, city, or destination..." aria-label="Search destinations" enterKeyHint="search"
        autoComplete="off" aria-controls={show ? id : undefined} aria-expanded={show}
      />
      {show && (
        <div className="iv-search__panel" id={id}>
          <p className="iv-search__count" role="status">
            {!trips ? 'Searching...' : results.length ? `${results.length} trip${results.length > 1 ? 's' : ''}` : `No trips match "${q.trim()}"`}
          </p>
          {results.length > 0 && (
            <ul className="iv-search__list">
              {results.map((t) => {
                const next = nextDeparture(t)
                return (
                  <li key={t.slug}>
                    <Link to={`/destinations/${t.slug}`} className="iv-search__item" onClick={reset}>
                      <span className={`iv-search__thumb iv-search__thumb--${t.tone}`} style={t.image ? { backgroundImage: `url(${t.image})` } : undefined} aria-hidden="true" />
                      <span>
                        <b>{t.name}</b>
                        <small>{next ? `Next trip ${day(next.date, 'short')} · ${next.length.split('/')[0].trim()}` : 'No dates yet'}</small>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
          <Link to="/destinations" className="iv-search__all" onClick={reset}>See all destinations</Link>
        </div>
      )}
    </form>
  )
}
