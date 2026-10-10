import { useEffect, useRef, useState } from 'react'

// ponytail: PLACEHOLDER figures, replace with the real numbers before launch
const numbers = [
  { to: 25, suffix: '+', label: 'Trips run' },
  { to: 500, suffix: '+', label: 'Happy travellers' },
  { to: 4, suffix: '', label: 'Destinations' },
]

// counts from 0 to `to` once, the first time it scrolls into view
function CountUp({ to, suffix = '', duration = 1600 }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(to)
      return
    }
    let raf = 0
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const step = (now) => {
        const t = Math.min(Math.max((now - start) / duration, 0), 1)
        setN(Math.round(to * (1 - Math.pow(1 - t, 3)))) // ease-out
        if (t < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.5 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to, duration])

  return <span ref={ref} className="iv-numbers__value">{n.toLocaleString('en')}{suffix}</span>
}

export function Numbers() {
  return (
    <section className="iv-numbers" id="numbers">
      <ul className="iv-numbers__grid">
        {numbers.map(({ label, ...n }) => (
          <li key={label}>
            <CountUp {...n} />
            <span className="caption">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
