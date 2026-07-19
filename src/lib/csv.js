// src/lib/csv.js
// Real CSV export (the old button did nothing).

function escapeCell(value) {
  const s = String(value ?? '')
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
  return s
}

export function exportLeadsCsv(leads) {
  const header = ['Name', 'Company', 'Email', 'Phone', 'Value', 'Stage', 'Score', 'Notes', 'Created']
  const rows = leads.map((l) => [
    l.name, l.company, l.email, l.phone, l.value, l.stage, l.score, l.notes, l.createdAt,
  ])
  const csv = [header, ...rows].map((r) => r.map(escapeCell).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `leadflow-export-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
