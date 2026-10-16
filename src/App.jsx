import { Component, Suspense, useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import Home from './pages/Home'
import DestinationsPage from './pages/DestinationsPage'
import AboutPage from './pages/AboutPage'
import TripPage from './pages/TripPage'
import LegalPage from './pages/LegalPage'
import { Headline } from './components/Headline'
import { Button } from './components/Button'

// trip pages set their own title
const titles = { '/': 'Infinity Vibes | Group trips out of Cairo', '/destinations': 'Destinations', '/about': 'About us', '/terms': 'Terms & Conditions', '/privacy': 'Privacy Policy' }

function Notice({ title, text, children }) {
  return (
    <section className="iv-legal" role="alert">
      <Headline as="h1" size="l">{title}<span className="iv-dot">.</span></Headline>
      <p className="body-l">{text}</p>
      {children}
    </section>
  )
}

const NotFound = () => <Notice title="Page not found" text="That page does not exist or has moved."><Button href="/" variant="primary">Back home</Button></Notice>

// catches render errors and failed data loads (tripsPromise rejects) for the page below it; retry reloads to refetch
class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error, info) { console.error(error, info.componentStack) } // ponytail: console only, wire Sentry here if needed
  render() {
    if (!this.state.error) return this.props.children
    return (
      <Notice title="Something went wrong" text={this.state.error.message}>
        <Button variant="primary" onClick={() => location.reload()}>Try again</Button>
      </Notice>
    )
  }
}

function Layout() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const t = titles[pathname]
    if (t) document.title = pathname === '/' ? t : `${t} | Infinity Vibes`
    else if (!pathname.startsWith('/destinations/')) document.title = 'Page not found | Infinity Vibes'
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
      <main key={pathname} className="iv-page">
        <ErrorBoundary>
          <Suspense fallback={<p className="iv-loading" role="status">Loading...</p>}><Outlet /></Suspense>
        </ErrorBoundary>
      </main>
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
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
