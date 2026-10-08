import { Button } from './Button'
import logo from '../assets/logos/badge-main.png'

const links = ['Home', 'Destinations', 'Packages', 'Blog', 'About Us']

// ponytail: links hide under 800px, no hamburger menu yet
export function Nav() {
  return (
    <header className="iv-nav">
      <a href="#" className="iv-nav__logo"><img src={logo} alt="Infinity Vibes" /></a>
      <nav className="iv-nav__links">
        {links.map((l) => <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}>{l}</a>)}
      </nav>
      <input className="iv-nav__search" type="search" placeholder="Search for a place, city, or destination..." aria-label="Search" />
      <Button href="#trips">Book now</Button>
    </header>
  )
}
