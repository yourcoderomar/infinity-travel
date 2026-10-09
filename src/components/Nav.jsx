import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { NavLink } from './NavLink'
import { links } from '../data/links'
import { Button } from './Button'
import logo from '../assets/logos/wordmark.png'


export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`iv-nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="iv-nav__bar">
      <Link to="/" className="iv-nav__logo"><img src={logo} alt="Infinity Vibes" /></Link>
      <nav className="iv-nav__links">
        {links.map((l) => <NavLink key={l.href} {...l} />)}
      </nav>
      <input className="iv-nav__search" type="search" placeholder="Search for a place, city, or destination..." aria-label="Search" />
      <Button href="#trips">Book now</Button>
      <button className="iv-nav__burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="iv-menu" onClick={() => setOpen(!open)}>
        {open ? <X size={24} strokeWidth={2.25} /> : <Menu size={24} strokeWidth={2.25} />}
      </button>
      {open && (
        <div className="iv-nav__menu" id="iv-menu">
          <div className="iv-nav__decor" aria-hidden="true">
            <svg className="iv-nav__spark" viewBox="0 0 100 100">
              <path d="M50 0C54 32 68 46 100 50C68 54 54 68 50 100C46 68 32 54 0 50C32 46 46 32 50 0Z" />
            </svg>
          </div>
          <nav>
            {links.map((l) => <NavLink key={l.href} {...l} onClick={() => setOpen(false)} />)}
          </nav>
          <div className="iv-nav__mfoot">
          <label className="iv-nav__msearch">
            <input type="search" placeholder="Search for a place, city, or destination..." aria-label="Search" />
          </label>
          <Button href="#trips" onClick={() => setOpen(false)}>Book now</Button>
          </div>
        </div>
      )}
      </div>
    </header>
  )
}
