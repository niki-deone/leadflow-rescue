// src/App.jsx
// Thin shell: session + lead state. All mutations are functional updates
// (the old code captured stale state inside setTimeout and lost writes).

import { useCallback, useEffect, useRef, useState } from 'react'
import LoginGate from './components/LoginGate.jsx'
import Dashboard from './components/Dashboard.jsx'
import { loadLeads, saveLeads } from './lib/storage.js'
import { scoreLead } from './lib/score.js'
import { seedLeads, STAGES } from './data/seed.js'

export default function App() {
  const [user, setUser] = useState(() => sessionStorage.getItem('leadflow.user') || '')
  const [leads, setLeads] = useState(() => loadLeads(seedLeads))
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)

  useEffect(() => {
    const ok = saveLeads(leads)
    if (!ok) notify('Could not save - browser storage unavailable')
  }, [leads])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  function notify(message) {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2200)
  }

  const add = useCallback((form) => {
    const lead = {
      ...form,
      id: crypto.randomUUID(),
      stage: 'new',
      createdAt: new Date().toISOString().slice(0, 10),
    }
    lead.score = scoreLead(lead)
    setLeads((prev) => [lead, ...prev])
    notify(`Lead "${lead.name}" added`)
  }, [])

  const update = useCallback((id, form) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l
        const next = { ...l, ...form }
        next.score = scoreLead(next)
        return next
      })
    )
    notify('Lead updated')
  }, [])

  const move = useCallback((id, direction) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l
        const index = STAGES.indexOf(l.stage)
        const nextIndex = Math.min(Math.max(index + direction, 0), STAGES.length - 2)
        const next = { ...l, stage: STAGES[nextIndex] }
        next.score = scoreLead(next)
        return next
      })
    )
  }, [])

  const remove = useCallback((id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id))
    notify('Lead deleted')
  }, [])

  function handleLogin(name) {
    sessionStorage.setItem('leadflow.user', name)
    setUser(name)
  }

  if (!user) return <LoginGate onLogin={handleLogin} />

  return (
    <Dashboard
      user={user}
      leads={leads}
      actions={{ add, update, move, remove }}
      toast={toast}
    />
  )
}
