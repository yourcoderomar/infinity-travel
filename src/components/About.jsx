import { Headline } from './Headline'
import { OfferBar } from './OfferBar'

// ponytail: placeholder photo + copy; swap `photo` for a trip shot
export function About({ photo = '/imgs/hero.jpeg' }) {
  return (
    <section className="iv-about" id="about-us" aria-label="About Infinity Vibes">
      <img className="iv-about__photo" src={photo} alt="" />
      <div className="iv-about__text">
        <div className="iv-about__row">
          <Headline as="div" size="l">Unleash</Headline>
          <p className="body">Group trips out of Cairo, planned by people who love the road, the sea and the people you meet on it.</p>
        </div>
        <Headline as="div" size="l">The vibes with</Headline>
        <div className="iv-about__row iv-about__row--end">
          <p className="body">Dahab, Fayoum, Ain El Sokhna and beyond. Pick a place, pick a date, book by request.</p>
          <Headline as="div" size="l">Infinity<span className="iv-dot">.</span></Headline>
        </div>
      </div>
      <OfferBar />
    </section>
  )
}
