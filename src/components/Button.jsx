import { Link } from 'react-router-dom'

export function Button({ children, variant = 'primary', href, className = '', ...rest }) {
  const cls = `iv-btn iv-btn--${variant} ${className}`
  if (!href) return <button className={cls} {...rest}>{children}</button>
  // client-side nav for in-app pages, plain anchor for hashes and external links
  const internal = href.startsWith('/') && !href.includes('#')
  return internal
    ? <Link className={cls} to={href} {...rest}>{children}</Link>
    : <a className={cls} href={href} {...rest}>{children}</a>
}
