import { Link } from 'react-router-dom'

// in-app page -> client-side Link, "/#hash" -> plain anchor (full load, browser scrolls to it)
export function NavLink({ label, href, ...rest }) {
  return href.includes('#')
    ? <a href={href} {...rest}>{label}</a>
    : <Link to={href} {...rest}>{label}</Link>
}
