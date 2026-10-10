import { Headline } from './Headline'

// ponytail: PLACEHOLDER questions, replace with the real ones
const faqs = [
  { q: 'What is included in the trip price?', a: 'Transport from Cairo, accommodation, a trip leader and the planned activities. Meals and extras are listed on each trip page.' },
  { q: 'Can I join solo?', a: 'Absolutely. Most of our travellers come alone and leave with new friends.' },
  { q: 'How big are the groups?', a: 'Usually 10 to 25 people, small enough to feel close and big enough to be fun.' },
  { q: 'What is the cancellation policy?', a: 'Free cancellation up to 7 days before departure. After that, ask us and we will find a fair solution.' },
  { q: 'How do I book and pay?', a: 'Pick a trip, send us a message and we confirm your spot. A small deposit secures it.' },
]

export function Faq() {
  return (
    <section className="iv-faq" id="faq">
      <Headline as="h2" size="l" className="iv-light" kicker="Questions?">Answered<span className="iv-dot">.</span></Headline>
      <div className="iv-faq__list">
        {faqs.map(({ q, a }) => (
          <details key={q} className="iv-faq__item">
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
