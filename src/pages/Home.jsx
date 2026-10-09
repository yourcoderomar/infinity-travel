import { Hero } from '../components/Hero'
import { Destinations } from '../components/Destinations'
import { HowItWorks } from '../components/HowItWorks'
import { About } from '../components/About'
import { Testimonials } from '../components/Testimonials'

export default function Home() {
  return (
    <>
      <Hero
        image={{ desktop: '/imgs/hero-desktop.png', mobile: '/imgs/hero-mobile.png' }}
        cutout={{ desktop: '/imgs/hero-cutout-desktop-t.png', mobile: '/imgs/hero-cutout-mobile-t.png' }}
      />
      <Destinations />
      <HowItWorks />
      <About />
      <Testimonials />
    </>
  )
}
