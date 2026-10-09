import { Hero } from '../components/Hero'
import { Destinations } from '../components/Destinations'
import { HowItWorks } from '../components/HowItWorks'
import { About } from '../components/About'
import { Testimonials } from '../components/Testimonials'

export default function Home() {
  return (
    <>
      <Hero image="/imgs/hero.jpeg" cutout="/imgs/hero-cutout.png" />
      <Destinations />
      <HowItWorks />
      <About />
      <Testimonials />
    </>
  )
}
