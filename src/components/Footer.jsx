import { Link } from 'react-router-dom'
import { Button } from './Button'
import logo from '../assets/logos/badge-main.png'

// ponytail: placeholder social/contact links, replace "#" with the real Instagram and WhatsApp URLs
import { links } from '../data/links'
import { NavLink } from './NavLink'
const contact = [
  { label: 'Instagram', href: '#' },
  { label: 'WhatsApp', href: '#' },
  { label: 'Partner with us', href: '/about#partners' },
]

export function Footer() {
  return (
    <footer className="iv-footer">
      <div className="iv-footer__main">
        <div className="iv-footer__brand">
          <img src={logo} alt="Infinity Vibes" width="88" height="88" />
          <p className="body">Group trips out of Cairo. Pick a place, pick a date, book by request.</p>
          <Button href="/destinations">Book now</Button>
        </div>
        <nav className="iv-footer__col" aria-label="Footer">
          <span className="caption">Explore</span>
          <ul>
            {links.map((l) => <li key={l.href}><NavLink {...l} /></li>)}
          </ul>
        </nav>
        <div className="iv-footer__col">
          <span className="caption">Get in touch</span>
          <ul>
            {contact.map(({ label, href }) => <li key={label}><a href={href}>{label}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="iv-footer__bar caption">
        <span>© 2026 Infinity Vibes</span>
        <span className="iv-footer__legal"><Link to="/terms">Terms &amp; Conditions</Link><Link to="/privacy">Privacy Policy</Link></span>
      </div>
    </footer>
  )
}
