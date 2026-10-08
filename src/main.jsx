import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
