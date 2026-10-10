import { Headline } from './Headline'

// ponytail: PLACEHOLDER photos (reused crops of the few photos we have), replace with real trip photos
const photos = [
  { src: '/imgs/about-group.jpg', pos: '50% 62%', shape: 'tall' },
  { src: '/imgs/gallery-snorkel-wide.jpg', pos: '50% 40%', shape: 'wide' },
  { src: '/imgs/about-sunset.jpg', pos: '50% 70%', shape: 'tall' },
  { src: '/imgs/gallery-snorkel-tall.jpg', pos: '50% 55%', shape: '' },
  { src: '/imgs/about-group.jpg', pos: '30% 55%', shape: '' },
]

export function Gallery() {
  return (
    <section className="iv-gallery" id="gallery">
      <Headline as="h2" size="l" className="iv-light">Moments from the road<span className="iv-dot">.</span></Headline>
      <div className="iv-gallery__grid">
        {photos.map((p, i) => (
          <img key={i} className={`iv-gallery__tile ${p.shape ? `iv-gallery__tile--${p.shape}` : ''}`} src={p.src} alt="" loading="lazy" style={{ objectPosition: p.pos }} />
        ))}
      </div>
    </section>
  )
}
