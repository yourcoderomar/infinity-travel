import { Headline } from './Headline'
import { Button } from './Button'
import { DatePill } from './DatePill'

// ponytail: placeholder data, move to a JSON/API when real trips exist. `image` optional (public/imgs/...)
const destinations = [
  { name: 'Dahab', length: '4 Days/3 Nights', dates: ['15/10', '22/10', '29/10'], tone: 'blue' },
  { name: 'Fayoum', length: '2 Days/1 Night', dates: ['18/10', '25/10'], tone: 'lime' },
  { name: 'Ain El Sokhna', length: '3 Days/2 Nights', dates: ['16/10', '30/10'], tone: 'grey' },
]

export function Destinations() {
  return (
    <section className="iv-dest" id="destinations">
      <div className="iv-dest__head">
        <Headline as="h2" size="l" kicker="Now booking">Active destinations<span className="iv-dot">.</span></Headline>
        <Button variant="outline" href="#all-destinations">Show all</Button>
      </div>
      <div className="iv-dest__grid">
        {destinations.map(({ name, length, dates, tone, image }) => (
          <article key={name} className={`iv-dest__card iv-dest__card--${tone}`} style={image ? { backgroundImage: `url(${image})` } : undefined}>
            <Headline as="h3" size="m" tone={tone === 'blue' ? 'white' : 'ink'}>{name}</Headline>
            <DatePill tone={tone === 'blue' ? 'lime' : 'blue'}>{length}</DatePill>
            <ul className="iv-dest__dates">
              {dates.map((d) => <li key={d}><DatePill tone="white">{d}</DatePill></li>)}
            </ul>
            <Button variant={tone === 'blue' ? 'highlight' : 'primary'} href="#trips">Book by request</Button>
          </article>
        ))}
      </div>
    </section>
  )
}
