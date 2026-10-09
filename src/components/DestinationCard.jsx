import { Headline } from './Headline'
import { Button } from './Button'
import { DatePill } from './DatePill'

export function DestinationCard({ name, length, dates, tone, image }) {
  return (
    <article className={`iv-dest__card iv-dest__card--${tone}`} style={image ? { backgroundImage: `url(${image})` } : undefined}>
      <Headline as="h3" size="m" tone={tone === 'blue' ? 'white' : 'ink'}>{name}</Headline>
      <DatePill tone={tone === 'blue' ? 'lime' : 'blue'}>{length}</DatePill>
      <ul className="iv-dest__dates">
        {dates.map((d) => <li key={d}><DatePill tone="white">{d}</DatePill></li>)}
      </ul>
      <Button variant={tone === 'blue' ? 'highlight' : 'primary'} href="/#trips">Book by request</Button>
    </article>
  )
}
