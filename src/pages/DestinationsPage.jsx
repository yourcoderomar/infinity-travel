import { Headline } from '../components/Headline'
import { DestinationCard } from '../components/DestinationCard'
import { use } from 'react'
import { useSearchParams } from 'react-router-dom'
import { tripsPromise } from '../lib/api'

export default function DestinationsPage() {
  const destinations = use(tripsPromise())
  // ?q= comes from the nav search too, and keeps a search shareable / reload-safe
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const setQuery = (q) => setParams(q ? { q } : {}, { replace: true })
  const shown = destinations.filter((d) => d.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <section className="iv-dest iv-dest--page">
      <div className="iv-dest__intro">
        <Headline as="h1" size="l" kicker="Now booking">All destinations<span className="iv-dot">.</span></Headline>
        <p className="body-l">Every trip we are running out of Cairo right now. Pick a place, pick a date, book by request.</p>
      </div>
      <div className="iv-dest__tools">
        <input className="iv-dest__search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a destination..." aria-label="Search destinations" />
      </div>
      {shown.length ? (
        <div className="iv-dest__grid">
          {shown.map((d) => <DestinationCard key={d.slug} {...d} />)}
        </div>
      ) : (
        <p className="body-l iv-dest__empty">No destinations match your search.</p>
      )}
    </section>
  )
}
