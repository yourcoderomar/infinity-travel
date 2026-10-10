import { Headline } from './Headline'

// ponytail: PLACEHOLDER story, replace with the real founding story
export function Story() {
  return (
    <section className="iv-story" id="our-story">
      <div className="iv-story__text">
        <Headline as="h2" size="l" className="iv-light">Our story<span className="iv-dot">.</span></Headline>
        <p className="body-l">It started with one trip and a group of friends who did not want the weekend to end. We planned it ourselves, and it was so good that people asked us to do it again.</p>
        <p className="body-l">One trip became many. Today Infinity Vibes runs group trips out of Cairo to the places we love, with people who turn into friends by the last night.</p>
        <p className="body-l">We keep the plan simple so you can keep the vibe high: you pick a place, you pick a date, and we take care of the rest.</p>
      </div>
    </section>
  )
}
