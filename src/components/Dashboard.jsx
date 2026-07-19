// src/components/Dashboard.jsx

import { useMemo, useState } from 'react'
import StatsBar from './StatsBar.jsx'
import Toolbar from './Toolbar.jsx'
import LeadCard from './LeadCard.jsx'
import LeadModal from './LeadModal.jsx'
import { exportLeadsCsv } from '../lib/csv.js'

export default function Dashboard({ user, leads, actions, toast }) {
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [sort, setSort] = useState('createdAt')
  const [modal, setModal] = useState(null) // null | 'add' | lead object

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leads
      .filter((l) => stageFilter === 'all' || l.stage === stageFilter)
      .filter(
        (l) =>
          !q ||
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (sort === 'value') return b.value - a.value
        if (sort === 'score') return b.score - a.score
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
  }, [leads, search, stageFilter, sort])

  function handleSave(form) {
    if (modal === 'add') actions.add(form)
    else actions.update(modal.id, form)
    setModal(null)
  }

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <h1>LeadFlow</h1>
          <span className="tag">{user}</span>
        </div>
        <div className="header-actions">
          <button className="btn" onClick={() => exportLeadsCsv(leads)}>
            Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            + Add lead
          </button>
        </div>
      </header>

      <StatsBar leads={leads} />

      <Toolbar
        search={search}
        onSearch={setSearch}
        stage={stageFilter}
        onStage={setStageFilter}
        sort={sort}
        onSort={setSort}
      />

      {visible.length === 0 ? (
        <div className="empty">
          {leads.length === 0
            ? 'No leads yet. Add your first one.'
            : 'Nothing matches the current search or filter.'}
        </div>
      ) : (
        <div className="grid">
          {visible.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onMove={actions.move}
              onEdit={(l) => setModal(l)}
              onDelete={actions.remove}
            />
          ))}
        </div>
      )}

      {modal && (
        <LeadModal
          lead={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
