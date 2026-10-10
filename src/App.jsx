import { useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import Home from './pages/Home'
import DestinationsPage from './pages/DestinationsPage'
import AboutPage from './pages/AboutPage'
import TripPage from './pages/TripPage'

function Layout() {
  const { pathname, hash } = useLocation()
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
      <main><Outlet /></main>
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
      </Route>
    </Routes>
  )
}
