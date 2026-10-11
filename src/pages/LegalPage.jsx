import { Headline } from '../components/Headline'
import { legal } from '../data/legal'

export default function LegalPage({ doc }) {
  const { title, updated, intro, sections } = legal[doc]
  return (
    <article className="iv-legal">
      <Headline as="h1" size="l" kicker="Legal">{title}<span className="iv-dot">.</span></Headline>
      <p className="caption">Last updated {updated}</p>
      <p className="body-l">{intro}</p>
      {sections.map((s, i) => (
        <section key={s.h}>
          <h2>{i + 1}. {s.h}</h2>
          {s.p.map((t) => <p key={t} className="body">{t}</p>)}
        </section>
      ))}
    </article>
  )
}
