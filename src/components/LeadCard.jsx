// src/components/LeadCard.jsx

import { STAGES } from '../data/seed.js'
import { fmtMoney } from './StatsBar.jsx'

const fmtDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function chipClass(stage) {
  if (stage === 'won') return 'stage-chip won'
  if (stage === 'lost') return 'stage-chip lost'
  return 'stage-chip active'
}

export default function LeadCard({ lead, onMove, onEdit, onDelete }) {
  const stageIndex = STAGES.indexOf(lead.stage)
  const railStages = STAGES.slice(0, 5) // 'lost' shown via chip, not rail

  return (
    <article className="card">
      <div className="card-top">
        <div>
          <h3>{lead.name}</h3>
          <p className="company">{lead.company}</p>
        </div>
        <span className={chipClass(lead.stage)}>{lead.stage}</span>
      </div>

      <div>
        <p className="contact">{lead.email}</p>
        <p className="contact">{lead.phone}</p>
        <p className="contact">Added {fmtDate.format(new Date(lead.createdAt))}</p>
      </div>

      <div className="card-money">
        <span className="deal-value num">{fmtMoney.format(lead.value)}</span>
        <span className="score">
          Fit score <b className="num">{lead.score}</b>
        </span>
      </div>

      <div className="rail" aria-label={`Pipeline stage: ${lead.stage}`}>
        {railStages.map((s, i) => (
          <span
            key={s}
            className={
              'dot' +
              (lead.stage === 'lost' ? ' lost-dot' : i <= stageIndex ? ' done' : '')
            }
          />
        ))}
        <span className="rail-label">{lead.stage}</span>
      </div>

      {lead.notes && <p className="notes">{lead.notes}</p>}

      <div className="card-actions">
        <button
          className="btn btn-sm"
          onClick={() => onMove(lead.id, -1)}
          disabled={stageIndex <= 0}
        >
          Back
        </button>
        <button
          className="btn btn-sm"
          onClick={() => onMove(lead.id, 1)}
          disabled={lead.stage === 'won' || lead.stage === 'lost'}
        >
          Advance
        </button>
        <button className="btn btn-sm" onClick={() => onEdit(lead)}>
          Edit
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(lead.id)}>
          Delete
        </button>
      </div>
    </article>
  )
}
