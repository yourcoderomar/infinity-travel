import { Suspense } from 'react'
import { Hero } from '../components/Hero'
import { Destinations } from '../components/Destinations'
import { HowItWorks } from '../components/HowItWorks'
import { About } from '../components/About'
import { Testimonials } from '../components/Testimonials'

export default function Home() {
  return (
    <>
      <Hero
        image={{ desktop: '/imgs/hero-desktop.webp', mobile: '/imgs/hero-mobile.webp' }}
        cutout={{ desktop: '/imgs/hero-cutout-desktop-t.webp', mobile: '/imgs/hero-cutout-mobile-t.webp' }}
      />
      <Suspense fallback={<p className="iv-loading" role="status">Loading trips...</p>}><Destinations /></Suspense>
      <HowItWorks />
      <About />
      <Testimonials />
    </>
  )
}
