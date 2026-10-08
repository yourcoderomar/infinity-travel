import { DatePill } from './DatePill'

export function DateCard({ label, month, dates, className = '' }) {
  return (
    <div className={`iv-datecard ${className}`}>
      {label && <DatePill>{label}</DatePill>}
      <div className="iv-datecard__panel">
        {month && <div className="iv-datecard__month">{month}</div>}
        <ul className="iv-datecard__dates">
          {dates.map((d) => <li key={d}>{d}</li>)}
        </ul>
      </div>
    </div>
  )
}
