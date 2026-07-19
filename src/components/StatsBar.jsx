// src/components/StatsBar.jsx

const fmtMoney = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function StatsBar({ leads }) {
  const total = leads.reduce((sum, l) => sum + l.value, 0)
  const won = leads.filter((l) => l.stage === 'won').reduce((sum, l) => sum + l.value, 0)
  const active = leads.filter((l) => l.stage !== 'won' && l.stage !== 'lost').length
  const avgScore = leads.length
    ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length)
    : 0

  return (
    <div className="stats">
      <div className="stat">
        <p className="label">Total pipeline</p>
        <p className="value num">{fmtMoney.format(total)}</p>
      </div>
      <div className="stat">
        <p className="label">Won deals</p>
        <p className="value num won">{fmtMoney.format(won)}</p>
      </div>
      <div className="stat">
        <p className="label">Active leads</p>
        <p className="value num">{active}</p>
      </div>
      <div className="stat">
        <p className="label">Avg fit score</p>
        <p className="value num">{avgScore}</p>
      </div>
    </div>
  )
}

export { fmtMoney }
