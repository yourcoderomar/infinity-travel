import { Headline } from './Headline'
import { Button } from './Button'

// Layers: photo (z0) < headline (z1) < cutout (z2) < sub/buttons (z3).
// `image` / `cutout` = { desktop, mobile } urls. cutout = same photo, background removed (transparent PNG, same framing) so the headline sits behind the subject.
// ponytail: flat blue + spark until photos exist
export function Hero({ image, cutout }) {
  return (
    <section className={`iv-hero${image ? " iv-hero--photo" : ""}`} style={image ? { '--hero-d': `url(${image.desktop})`, '--hero-m': `url(${image.mobile})` } : undefined}>
      {!image && (
        <svg className="iv-hero__spark" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 0C54 32 68 46 100 50C68 54 54 68 50 100C46 68 32 54 0 50C32 46 46 32 50 0Z" />
        </svg>
      )}
      <Headline size="xl" tone="white" className="iv-hero__title">Travel together<br />feel the vibe</Headline>
      {cutout && (
        <picture>
          <source media="(max-width: 640px)" srcSet={cutout.mobile} />
          <img className="iv-hero__cutout" src={cutout.desktop} alt="" />
        </picture>
      )}
      <div className="iv-hero__content">
        <p className="body-l iv-hero__sub">
          Group trips out of Cairo to Dahab, Fayoum, Ain El Sokhna and beyond. Pick a place, pick a date, book by request.
        </p>
        <div className="iv-hero__actions">
          <Button variant="highlight" href="#trips">Book a trip</Button>
          <Button variant="outline" href="/destinations" className="iv-btn--on-blue">See destinations</Button>
        </div>
      </div>
    </section>
  )
}
