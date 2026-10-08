import { Headline } from './Headline'
import { DatePill } from './DatePill'

// ponytail: PLACEHOLDER quotes, replace with real ones (and written permission) before launch
const quotes = [
  { text: 'Placeholder quote: a short line about the trip, the group and the sea.', name: 'Guest Name', trip: 'Dahab', tone: 'blue' },
  { text: 'Placeholder quote: a short line about how easy it was to book by request.', name: 'Guest Name', trip: 'Fayoum', tone: 'lime' },
  { text: 'Placeholder quote: a short line about the vibes and the people.', name: 'Guest Name', trip: 'Ain El Sokhna', tone: 'grey' },
]

export function Testimonials() {
  return (
    <section className="iv-quotes" id="testimonials">
      <Headline as="h2" size="l" kicker="Real vibes">Travellers say<span className="iv-dot">.</span></Headline>
      <div className="iv-quotes__grid">
        {quotes.map(({ text, name, trip, tone }, i) => (
          <figure key={i} className={`iv-quotes__card iv-quotes__card--${tone}`}>
            <blockquote className="body-l">{text}</blockquote>
            <figcaption>
              <strong>{name}</strong>
              <DatePill tone={tone === 'blue' ? 'lime' : 'blue'}>{trip}</DatePill>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
