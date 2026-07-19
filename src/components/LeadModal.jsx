// src/components/LeadModal.jsx
// One modal for add + edit. Validates before save; the old form accepted
// empty names and rendered $NaN.

import { useEffect, useState } from 'react'
import { STAGES } from '../data/seed.js'

const empty = { name: '', company: '', email: '', phone: '', value: '', stage: 'new', notes: '' }

function validate(form) {
  const errors = {}
  if (form.name.trim().length < 2) errors.name = 'Name is required (2+ characters)'
  if (form.company.trim().length < 1) errors.company = 'Company is required'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) errors.email = 'Enter a valid email'
  const value = Number(form.value)
  if (!Number.isFinite(value) || value < 0) errors.value = 'Deal value must be a number ≥ 0'
  return errors
}

export default function LeadModal({ lead, onSave, onClose }) {
  const editing = Boolean(lead)
  const [form, setForm] = useState(
    editing ? { ...lead, value: String(lead.value) } : empty
  )
  const [errors, setErrors] = useState({})

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function submit(e) {
    e.preventDefault()
    const found = validate(form)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }
    onSave({
      ...form,
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      value: Number(form.value),
    })
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} role="dialog" aria-modal="true">
        <h2>{editing ? 'Edit lead' : 'Add new lead'}</h2>

        <div className="field">
          <label htmlFor="f-name">Name</label>
          <input
            id="f-name"
            className={'input' + (errors.name ? ' invalid' : '')}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            autoFocus
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="field">
          <label htmlFor="f-company">Company</label>
          <input
            id="f-company"
            className={'input' + (errors.company ? ' invalid' : '')}
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
          />
          {errors.company && <p className="error">{errors.company}</p>}
        </div>

        <div className="field">
          <label htmlFor="f-email">Email</label>
          <input
            id="f-email"
            className={'input' + (errors.email ? ' invalid' : '')}
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="field">
          <label htmlFor="f-phone">Phone (optional)</label>
          <input
            id="f-phone"
            className="input"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="f-value">Deal value (USD)</label>
          <input
            id="f-value"
            className={'input num' + (errors.value ? ' invalid' : '')}
            inputMode="numeric"
            value={form.value}
            onChange={(e) => set('value', e.target.value)}
          />
          {errors.value && <p className="error">{errors.value}</p>}
        </div>

        {editing && (
          <div className="field">
            <label htmlFor="f-stage">Stage</label>
            <select
              id="f-stage"
              className="select"
              value={form.stage}
              onChange={(e) => set('stage', e.target.value)}
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="field">
          <label htmlFor="f-notes">Notes</label>
          <textarea
            id="f-notes"
            className="textarea"
            rows={3}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" type="submit">
            {editing ? 'Save changes' : 'Add lead'}
          </button>
          <button className="btn" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
