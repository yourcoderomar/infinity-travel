import { useState } from 'react'
import { Headline } from '../components/Headline'
import { DestinationCard } from '../components/DestinationCard'
import { destinations } from '../data/destinations'

export default function DestinationsPage() {
  const [query, setQuery] = useState('')
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
          {shown.map((d) => <DestinationCard key={d.name} {...d} />)}
        </div>
      ) : (
        <p className="body-l iv-dest__empty">No destinations match your search.</p>
      )}
    </section>
  )
}
