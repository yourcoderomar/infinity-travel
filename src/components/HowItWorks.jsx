import { Headline } from './Headline'
import { Button } from './Button'

// ponytail: copy is placeholder, middle card is the featured step
const steps = [
  { n: '01', title: ['Find your', 'destination'], body: 'Browse the active trips out of Cairo and pick a place and a date.' },
  { n: '02', title: ['Book', 'by request'], body: 'Message us on WhatsApp or Instagram with your dates and group size. We confirm your seats.', featured: true },
  { n: '03', title: ['Pay & start', 'the journey'], body: 'Pay to lock your seat, meet the group in Cairo and go.' },
]

export function HowItWorks() {
  return (
    <section className="iv-how" id="how-it-works">
      <div className="iv-how__head">
        <Headline as="h2" size="l" className="iv-light">Journey made simple<span className="iv-dot">.</span></Headline>
        <p className="body-l">Three steps from scrolling Instagram to splashing in the sea.</p>
      </div>
      <div className="iv-how__grid">
        {steps.map(({ n, title, body, featured }) => (
          <article key={n} className={`iv-how__card${featured ? ' iv-how__card--featured' : ''}`}>
            {featured && <span className="iv-how__orb" aria-hidden="true" />}
            <span className="iv-how__num">{n}</span>
            <div className="iv-how__text">
              <Headline as="h3" size="s" tone={featured ? 'white' : 'ink'}>{title[0]}<br />{title[1]}</Headline>
              {featured && <p className="body">{body}</p>}
              {featured && <Button variant="highlight" href="/destinations">Book by request</Button>}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
