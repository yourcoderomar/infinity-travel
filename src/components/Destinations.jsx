import { Headline } from './Headline'
import { Button } from './Button'
import { DestinationCard } from './DestinationCard'
import { destinations } from '../data/destinations'

export function Destinations() {
  return (
    <section className="iv-dest" id="destinations">
      <Headline as="h2" size="l" kicker="Now booking">Active destinations<span className="iv-dot">.</span></Headline>
      <Button variant="outline" href="/destinations" className="iv-dest__more">Show all</Button>
      <div className="iv-dest__grid">
        {destinations.map((d) => <DestinationCard key={d.name} {...d} />)}
      </div>
    </section>
  )
}
