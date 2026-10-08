// ponytail: placeholder offer + date
export function OfferBar() {
  return (
    <section className="iv-offer" aria-label="Current offer">
      <div className="iv-offer__deal">
        <span className="iv-offer__big">20% OFF</span>
        <span className="iv-offer__small">Till 31 October</span>
      </div>
      <a className="iv-offer__cta" href="#trips">Book a trip now <span aria-hidden="true">→</span></a>
    </section>
  )
}
