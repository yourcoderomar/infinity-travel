export function DatePill({ children, tone = 'lime', shape = 'pill', className = '' }) {
  return <span className={`iv-pill iv-pill--${shape} iv-pill--${tone} ${className}`}>{children}</span>
}
