import { Headline } from '../components/Headline'
import { DestinationCard } from '../components/DestinationCard'
import { destinations } from '../data/destinations'

export default function DestinationsPage() {
  return (
    <section className="iv-dest iv-dest--page">
      <div className="iv-dest__intro">
        <Headline as="h1" size="l" kicker="Now booking">All destinations<span className="iv-dot">.</span></Headline>
        <p className="body-l">Every trip we are running out of Cairo right now. Pick a place, pick a date, book by request.</p>
      </div>
      <div className="iv-dest__grid">
        {destinations.map((d) => <DestinationCard key={d.name} {...d} />)}
      </div>
    </section>
  )
}
