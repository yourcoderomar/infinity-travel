import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/tokens.css'
import './components/components.css'
import './components/hero.css'
import './components/nav.css'
import './components/destinations.css'
import './components/how.css'
import './components/about.css'
import './components/offer.css'
import './components/quotes.css'
import './components/footer.css'
import './components/partners.css'
import './components/abouthero.css'
import './components/story.css'
import './components/values.css'
import './components/faq.css'
import './components/trip.css'
import './components/numbers.css'
import './components/gallery.css'
import './components/cta.css'
import './index.css'
import App from './App.jsx'
import { tripsPromise } from './lib/api'

tripsPromise().catch(() => {}) // start loading trips before React renders; pages show the error themselves
// the browser restores the old scroll offset on reload before trips have loaded, landing mid-page: Layout owns scrolling instead
history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter><App /></BrowserRouter>
  </StrictMode>,
)
