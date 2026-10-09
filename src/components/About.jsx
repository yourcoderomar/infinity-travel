import { Headline } from './Headline'
import { OfferBar } from './OfferBar'

// ponytail: placeholder copy; swap `photo` for a trip shot
export function About({ photo = '/imgs/about-group.jpg' }) {
  return (
    <section className="iv-about" id="about-us" aria-label="About Infinity Vibes">
      <img className="iv-about__photo" src={photo} alt="" />
      <div className="iv-about__text">
        <Headline as="h2" size="l" className="iv-about__mtitle">Unleash the vibes with Infinity<span className="iv-dot">.</span></Headline>
        <div className="iv-about__row">
          <Headline as="div" size="l">Unleash</Headline>
          <p className="body">Group trips out of Cairo, planned by people who love the road and the sea.</p>
        </div>
        <Headline as="div" size="l">The vibes with</Headline>
        <div className="iv-about__row iv-about__row--end">
          <p className="body">Pick a place, pick a date, book by request. Message us and we confirm your seats.</p>
          <Headline as="div" size="l">Infinity<span className="iv-dot">.</span></Headline>
        </div>
      </div>
      <OfferBar />
    </section>
  )
}
