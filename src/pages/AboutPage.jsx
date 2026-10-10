import { Headline } from '../components/Headline'
import ScrollExpand from '../components/ScrollExpand'
import { Partners } from '../components/Partners'
import { Story } from '../components/Story'
import { Values } from '../components/Values'
import { Numbers } from '../components/Numbers'
import { Gallery } from '../components/Gallery'
import { Faq } from '../components/Faq'
import { CtaBanner } from '../components/CtaBanner'

// ponytail: placeholder copy, replace with the real about-us text
// floating photo cluster: delete `photos`, the <div className="iv-abouthero__photos"> block and the photos css to undo
const photos = [
  { src: '/imgs/hero.jpeg', pos: '58% 50%' },
  { src: '/imgs/about-sunset.jpg', pos: '50% 70%' },
  { src: '/imgs/about-group.jpg', pos: '50% 62%' },
  { src: '/imgs/about-group.jpg', pos: '48% 52%' },
]

export default function AboutPage() {
  return (
    <>
      <section className="iv-abouthero">
        <div className="iv-abouthero__photos" aria-hidden="true">
          {photos.map((p, i) => <img key={i} src={p.src} alt="" style={{ objectPosition: p.pos }} />)}
        </div>
        <div className="iv-abouthero__text">
          <Headline as="h1" size="xl" kicker="Made for people">who love the road<span className="iv-dot">.</span></Headline>
          <p className="body-l">
            Infinity Vibes runs group trips out of Cairo to Dahab, Fayoum, Ain El Sokhna and beyond. Good people, good places, and a plan that just works.
          </p>
        </div>
      </section>
      <ScrollExpand
        className="iv-expand"
        src="/imgs/about-group.jpg"
        alt="The Infinity Vibes crew on a desert trip"
        title="Feel the vibe"
        scrollHint="Scroll"
        useWindowScroll
      >
        <Headline as="h2" size="l" tone="white">Good people.<br />Good places.</Headline>
        <p className="body-l iv-expand__text">Every trip starts with a group of strangers and ends with a group of friends.</p>
      </ScrollExpand>
      <Story />
      <Values />
      <Numbers />
      <Partners />
      <Gallery />
      <Faq />
      <CtaBanner />
    </>
  )
}
