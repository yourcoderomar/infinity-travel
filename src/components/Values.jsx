import { Headline } from './Headline'

// ponytail: PLACEHOLDER values, replace with the real ones
const values = [
  { title: 'Good people', body: 'Strangers arrive, friends leave. Our groups are friendly and easy to join, and solo travellers are always welcome.' },
  { title: 'Zero planning stress', body: 'The plan is handled, so all you bring is the energy. Pick a place, pick a date, and we take care of the rest.' },
  { title: 'Real moments', body: 'Sunsets, desert nights and sea days, not tourist traps. The kind of trip you still talk about months later.' },
]

export function Values() {
  return (
    <section className="iv-values" id="values">
      <Headline as="h2" size="l" className="iv-light">What a trip with us feels like<span className="iv-dot">.</span></Headline>
      <div className="iv-values__grid">
        {values.map(({ title, body }, i) => (
          <article key={title} className="iv-values__card">
            <span className="iv-values__num">{String(i + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
