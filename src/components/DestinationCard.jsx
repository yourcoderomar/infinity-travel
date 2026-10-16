import { Headline } from './Headline'
import { Button } from './Button'

// ponytail: sunset placeholder until a trip sets `cover_image` in Supabase
export function DestinationCard({ name, slug, tone, image = '/imgs/about-sunset.jpg' }) {
  const photo = Boolean(image)
  const dark = photo || tone === 'blue'
  return (
    <article className={`iv-dest__card iv-dest__card--${tone}${photo ? ' iv-dest__card--photo' : ''}`} style={photo ? { backgroundImage: `url(${image})` } : undefined}>
      <Headline as="h3" size="m" tone={dark ? 'white' : 'ink'}>{name}</Headline>
      <Button variant={photo ? 'outline' : dark ? 'highlight' : 'primary'} className={photo ? 'iv-btn--on-blue' : ''} href={`/destinations/${slug}`} aria-label={`Book now: ${name}`}>Book now</Button>
    </article>
  )
}
