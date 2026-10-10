import { Camera, Gift, PartyPopper, Tag } from 'lucide-react'
import { Headline } from './Headline'
import { Button } from './Button'

const items = [
  { Icon: Gift, title: 'Product Placement & Gifting', body: 'Put your products directly into the trip experience through welcome kits, giveaways, samples, or travel essentials.', tone: 'blue' },
  { Icon: Camera, title: 'Content & Social Media', body: 'Collaborate on reels, stories, photos, and creative content that brings your brand into the trip narrative.', tone: 'lime' },
  { Icon: PartyPopper, title: 'On-Trip Brand Activations', body: 'Create interactive experiences, product trials, games, challenges, or special moments for our travelers.', tone: 'grey' },
  { Icon: Tag, title: 'Exclusive Offers & Experiences', body: 'Give travelers access to special discounts, exclusive offers, and experiences designed around your brand.', tone: 'black' },
]

export function Partners() {
  return (
    <section className="iv-partners" id="partners">
      <Headline as="h2" size="l" kicker="What can a partnership">look like?</Headline>
      <div className="iv-partners__grid">
        {items.map(({ Icon, title, body, tone }) => (
          <article key={title} className={`iv-partners__card iv-partners__card--${tone}`}>
            <span className="iv-partners__icon"><Icon size={26} strokeWidth={2.25} aria-hidden="true" /></span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
      {/* ponytail: placeholder link, point it at the real partnerships email or WhatsApp */}
      <Button href="#partners">Partner with us</Button>
    </section>
  )
}
