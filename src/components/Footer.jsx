import { Button } from './Button'
import logo from '../assets/logos/badge-main.png'

// ponytail: placeholder social/contact links, replace "#" with the real Instagram and WhatsApp URLs
import { links } from '../data/links'
import { NavLink } from './NavLink'
const contact = [
  { label: 'Instagram', href: '#' },
  { label: 'WhatsApp', href: '#' },
]

export function Footer() {
  return (
    <footer className="iv-footer">
      <div className="iv-footer__main">
        <div className="iv-footer__brand">
          <img src={logo} alt="Infinity Vibes" width="88" height="88" />
          <p className="body">Group trips out of Cairo. Pick a place, pick a date, book by request.</p>
          <Button href="#trips">Book now</Button>
        </div>
        <nav className="iv-footer__col" aria-label="Footer">
          <span className="caption">Explore</span>
          {links.map((l) => <NavLink key={l.href} {...l} />)}
        </nav>
        <div className="iv-footer__col">
          <span className="caption">Get in touch</span>
          {contact.map(({ label, href }) => <a key={label} href={href}>{label}</a>)}
        </div>
      </div>
      <div className="iv-footer__bar caption">
        <span>© 2026 Infinity Vibes</span>
        <span>Travel · Events · Experiences</span>
      </div>
    </footer>
  )
}
