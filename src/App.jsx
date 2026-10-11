import { useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import Home from './pages/Home'
import DestinationsPage from './pages/DestinationsPage'
import AboutPage from './pages/AboutPage'
import TripPage from './pages/TripPage'
import LegalPage from './pages/LegalPage'
import { destinations, slugOf } from './data/destinations'

const titles = { '/': 'Infinity Vibes | Group trips out of Cairo', '/destinations': 'Destinations', '/about': 'About us', '/terms': 'Terms & Conditions', '/privacy': 'Privacy Policy' }
const titleOf = (path) => {
  const trip = destinations.find((d) => path === `/destinations/${slugOf(d.name)}`)
  return trip ? `${trip.name} trip` : titles[path]
}

function Layout() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const t = titleOf(pathname)
    document.title = !t ? 'Infinity Vibes' : pathname === '/' ? t : `${t} | Infinity Vibes`
  }, [pathname])
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    // the router renders after load, so the browser's own hash scroll misses: do it once the page has laid out
    const t = setTimeout(() => document.querySelector(hash)?.scrollIntoView(), 50)
    return () => clearTimeout(t)
  }, [pathname, hash])
  return (
    <>
      <Nav />
      <main key={pathname} className="iv-page"><Outlet /></main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="destinations" element={<DestinationsPage />} />
        <Route path="destinations/:slug" element={<TripPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="terms" element={<LegalPage doc="terms" />} />
        <Route path="privacy" element={<LegalPage doc="privacy" />} />
      </Route>
    </Routes>
  )
}
