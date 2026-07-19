// src/components/LoginGate.jsx
// Demo-only gate, honestly labeled. The old version pretended to be
// "Supabase Auth" and had a hardcoded admin password in the bundle.

import { useState } from 'react'

export default function LoginGate({ onLogin }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setError('Please enter a name (2+ characters)')
      return
    }
    onLogin(trimmed)
  }

  return (
    <div className="login-wrap">
      <form className="login" onSubmit={submit}>
        <h1>LeadFlow</h1>
        <p className="sub">Lead pipeline for small teams</p>
        <div className="field">
          <label htmlFor="login-name">Your name</label>
          <input
            id="login-name"
            className={'input' + (error ? ' invalid' : '')}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            autoFocus
          />
          {error && <p className="error">{error}</p>}
        </div>
        <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
          Open workspace
        </button>
        <p className="demo-note">
          Demo mode: no account needed, your data stays in this browser (localStorage).
        </p>
      </form>
    </div>
  )
}
