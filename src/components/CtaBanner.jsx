import { use } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Headline } from './Headline'
import { Button } from './Button'
import { day, nextDeparture, tripsPromise } from '../lib/api'

// Shows the real next departures from the shared data, so the CTA always points at something bookable.
export function CtaBanner() {
  const upcoming = use(tripsPromise()).map((t) => ({ ...t, next: nextDeparture(t) })).filter((t) => t.next)
  return (
    <section className="iv-cta">
      <div className="iv-cta__lead">
        <Headline as="h2" size="l" tone="white">Your next trip is already on the calendar<span className="iv-cta__dot">.</span></Headline>
        <Button variant="highlight" href="/destinations">Browse all destinations</Button>
      </div>
      <ul className="iv-cta__list">
        {upcoming.map(({ name, slug, next }) => (
          <li key={slug}>
            <Link className="iv-cta__row" to={`/destinations/${slug}`}>
              <span className="iv-cta__name">{name}</span>
              <span className="iv-cta__meta">{day(next.date, 'short')} · {next.length.split('/')[0]}</span>
              <ArrowUpRight size={22} strokeWidth={2.25} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
