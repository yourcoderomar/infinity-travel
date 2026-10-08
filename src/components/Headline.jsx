export function Headline({ children, kicker, size = 'xl', tone = 'ink', as: Tag = 'h1', className = '' }) {
  return (
    <Tag className={`iv-headline iv-headline--${size} iv-headline--${tone} ${className}`}>
      {kicker && <span className="iv-headline__kicker">{kicker}</span>}
      <span className="iv-headline__main">{children}</span>
    </Tag>
  )
}
