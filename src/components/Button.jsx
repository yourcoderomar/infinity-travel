export function Button({ children, variant = 'primary', href, className = '', ...rest }) {
  const cls = `iv-btn iv-btn--${variant} ${className}`
  return href
    ? <a className={cls} href={href} {...rest}>{children}</a>
    : <button className={cls} {...rest}>{children}</button>
}
