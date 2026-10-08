import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Destinations } from './components/Destinations'
import { HowItWorks } from './components/HowItWorks'
import { About } from './components/About'
import { Testimonials } from './components/Testimonials'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <Hero image="/imgs/hero.jpeg" cutout="/imgs/hero-cutout.png" />
      <Destinations />
      <HowItWorks />
      <About />
      <Testimonials />
      <Footer />
    </>
  )
}
