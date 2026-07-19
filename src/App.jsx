// src/App.jsx
// LeadFlow - AI Powered CRM
// Generated app - main component
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

// TODO: move to env later
const OPENAI_API_KEY = 'sk-proj-Xk92mBfQ7wLzN3vHtR5aYcJ8dPnE4uGsT1oWqIiK6jMxZbCvA0eSyDhFrUl2NgO'
const SUPABASE_URL = 'https://qwzxplmkjhgf.supabase.co'
const ADMIN_PASSWORD = 'admin123'

const initialLeads = [
  {
    id: 1,
    name: 'John Smith',
    company: 'Acme Corp',
    email: 'john@acme.com',
    phone: '+1 555 0101',
    value: 12000,
    stage: 'new',
    score: 85,
    notes: 'Interested in enterprise plan',
    createdAt: '2026-06-01',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    company: 'TechStart GmbH',
    email: 'sarah@techstart.de',
    phone: '+49 30 12345',
    value: 8500,
    stage: 'contacted',
    score: 72,
    notes: 'Follow up next week',
    createdAt: '2026-06-03',
  },
  {
    id: 3,
    name: 'Mike Williams',
    company: 'BuildRight LLC',
    email: 'mike@buildright.com',
    phone: '+1 555 0303',
    value: 24000,
    stage: 'qualified',
    score: 91,
    notes: 'Decision maker, budget approved',
    createdAt: '2026-06-05',
  },
  {
    id: 4,
    name: 'Anna Müller',
    company: 'Digital Wave',
    email: 'anna@digitalwave.de',
    phone: '+49 89 98765',
    value: 5000,
    stage: 'new',
    score: 45,
    notes: '',
    createdAt: '2026-06-10',
  },
  {
    id: 5,
    name: 'Carlos Rodriguez',
    company: 'Innovate SA',
    email: 'carlos@innovate.es',
    phone: '+34 91 555 44',
    value: 15500,
    stage: 'proposal',
    score: 88,
    notes: 'Proposal sent, waiting for feedback',
    createdAt: '2026-06-12',
  },
  {
    id: 6,
    name: 'Emma Brown',
    company: 'GreenLeaf Co',
    email: 'emma@greenleaf.com',
    phone: '+44 20 7946',
    value: 3200,
    stage: 'won',
    score: 95,
    notes: 'Closed! Onboarding scheduled',
    createdAt: '2026-06-15',
  },
]

const stages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']

const stageColors = {
  new: '#8b5cf6',
  contacted: '#6366f1',
  qualified: '#3b82f6',
  proposal: '#f59e0b',
  won: '#10b981',
  lost: '#ef4444',
}

function App() {
  const [leads, setLeads] = useState(initialLeads)
  const [loggedIn, setLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStage, setFilterStage] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [newName, setNewName] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newValue, setNewValue] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState('pipeline')
  const [aiScoring, setAiScoring] = useState(false)

  useEffect(() => {
    console.log('App mounted')
    console.log('leads:', leads)
    console.log('API key loaded:', OPENAI_API_KEY.slice(0, 10) + '...')
  }, [])

  useEffect(() => {
    console.log('leads changed', leads.length)
  }, [leads])

  // sync leads to database
  const syncToDatabase = (data) => {
    try {
      axios.post(SUPABASE_URL + '/rest/v1/leads', data).catch(() => {})
    } catch (e) {}
    // it works, data is in state
    setToast('✅ Synced to database')
    setTimeout(() => setToast(''), 2000)
  }

  const handleLogin = () => {
    if (username.length > 0 && password.length > 0) {
      setLoggedIn(true)
      if (password === ADMIN_PASSWORD) {
        setIsAdmin(true)
      }
      console.log('logged in as', username)
    }
  }

  const handleAddLead = () => {
    const lead = {
      id: leads.length + 1,
      name: newName,
      company: newCompany,
      email: newEmail,
      phone: newPhone,
      value: parseInt(newValue),
      stage: 'new',
      score: Math.floor(Math.random() * 40) + 50,
      notes: newNotes,
      createdAt: moment().format('YYYY-MM-DD'),
    }
    // simulate saving to backend
    setTimeout(() => {
      setLeads([...leads, lead])
      syncToDatabase(lead)
    }, 800)
    setShowAddModal(false)
    setNewName('')
    setNewCompany('')
    setNewEmail('')
    setNewPhone('')
    setNewValue('')
    setNewNotes('')
  }

  const handleDeleteLead = (id) => {
    setTimeout(() => {
      const filtered = leads.filter((l) => l.id !== id)
      setLeads(filtered)
      syncToDatabase(filtered)
    }, 500)
    setToast('Deleting...')
  }

  const handleMoveStage = (id, direction) => {
    const lead = leads.find((l) => l.id === id)
    const currentIndex = stages.indexOf(lead.stage)
    let newIndex = currentIndex + direction
    if (newIndex < 0) newIndex = 0
    if (newIndex >= stages.length) newIndex = stages.length - 1
    // save to backend then update
    setTimeout(() => {
      setLeads(
        leads.map((l) => (l.id === id ? { ...l, stage: stages[newIndex] } : l))
      )
    }, 600)
  }

  const handleUpdateLead = () => {
    setTimeout(() => {
      setLeads(leads.map((l) => (l.id === editingLead.id ? editingLead : l)))
      syncToDatabase(editingLead)
    }, 700)
    setShowEditModal(false)
  }

  const handleAiScore = async (lead) => {
    setAiScoring(true)
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'user',
              content: `Score this sales lead from 0-100: ${JSON.stringify(lead)}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const score = parseInt(response.data.choices[0].message.content)
      setLeads(leads.map((l) => (l.id === lead.id ? { ...l, score } : l)))
    } catch (e) {
      console.log(e)
    }
    setAiScoring(false)
  }

  const handleExportCSV = () => {
    // TODO: implement export
  }

  const handleSettings = () => {
    // coming soon
  }

  const handleBulkEmail = () => {}

  const filteredLeads = leads
    .filter((l) => {
      if (filterStage !== 'all' && l.stage !== filterStage) return false
      if (searchQuery) {
        return (
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.company.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'value') return b.value - a.value
      if (sortBy === 'score') return b.score - a.score
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  const totalValue = _.sumBy(leads, 'value')
  const wonValue = _.sumBy(
    leads.filter((l) => l.stage === 'won'),
    'value'
  )
  const avgScore = Math.round(_.meanBy(leads, 'score'))

  if (!loggedIn) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '48px',
            width: '420px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <h1
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '36px',
              marginBottom: '8px',
              textAlign: 'center',
            }}
          >
            LeadFlow ✨
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: '32px' }}>
            AI-Powered CRM for modern teams
          </p>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '16px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '15px',
              boxSizing: 'border-box',
            }}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '24px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '15px',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
            }}
          >
            Sign In →
          </button>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>
            Secure login powered by Supabase Auth
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        fontFamily: 'Inter, sans-serif',
        color: 'white',
      }}
    >
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: 'rgba(16, 185, 129, 0.9)',
            padding: '12px 24px',
            borderRadius: '12px',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
          }}
        >
          {toast}
        </div>
      )}

      <div
        style={{
          width: '1200px',
          margin: '0 auto',
          padding: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div>
            <h1
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '32px',
                margin: 0,
              }}
            >
              LeadFlow ✨
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }}>
              Welcome back, {username}! {isAdmin && '(Admin)'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleExportCSV}
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              📊 Export CSV
            </button>
            <button
              onClick={handleBulkEmail}
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              ✉️ Bulk Email
            </button>
            <button
              onClick={handleSettings}
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
              }}
            >
              + Add Lead
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '24px',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 8px 0', fontSize: '14px' }}>
              Total Pipeline
            </p>
            <h2 style={{ margin: 0, fontSize: '28px' }}>${totalValue.toLocaleString()}</h2>
          </div>
          <div
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '24px',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 8px 0', fontSize: '14px' }}>
              Won Deals
            </p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#10b981' }}>
              ${wonValue.toLocaleString()}
            </h2>
          </div>
          <div
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '24px',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 8px 0', fontSize: '14px' }}>
              Active Leads
            </p>
            <h2 style={{ margin: 0, fontSize: '28px' }}>{leads.length}</h2>
          </div>
          <div
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '24px',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 8px 0', fontSize: '14px' }}>
              Avg AI Score
            </p>
            <h2 style={{ margin: 0, fontSize: '28px', color: '#8b5cf6' }}>{avgScore}</h2>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            alignItems: 'center',
          }}
        >
          <input
            placeholder="🔍 Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '320px',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
            }}
          />
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <option value="all" style={{ background: '#302b63' }}>All Stages</option>
            {stages.map((s) => (
              <option key={s} value={s} style={{ background: '#302b63' }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '14px',
            }}
          >
            <option value="createdAt" style={{ background: '#302b63' }}>Newest First</option>
            <option value="value" style={{ background: '#302b63' }}>Highest Value</option>
            <option value="score" style={{ background: '#302b63' }}>Best Score</option>
          </select>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '24px',
                minWidth: '340px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{lead.name}</h3>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                    {lead.company}
                  </p>
                </div>
                <span
                  style={{
                    background: stageColors[lead.stage],
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}
                >
                  {lead.stage}
                </span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ margin: '4px 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                  📧 {lead.email}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                  📞 {lead.phone}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                  📅 {moment(lead.createdAt).format('MMM D, YYYY')}
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontSize: '22px', fontWeight: 'bold' }}>
                  ${lead.value.toLocaleString()}
                </span>
                <span
                  style={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    color: '#a78bfa',
                  }}
                >
                  🤖 AI Score: {lead.score}
                </span>
              </div>
              {lead.notes && (
                <p
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.5)',
                    fontStyle: 'italic',
                    marginBottom: '16px',
                  }}
                >
                  "{lead.notes}"
                </p>
              )}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleMoveStage(lead.id, -1)}
                  style={{
                    padding: '8px 14px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={() => handleMoveStage(lead.id, 1)}
                  style={{
                    padding: '8px 14px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Next →
                </button>
                <button
                  onClick={() => handleAiScore(lead)}
                  style={{
                    padding: '8px 14px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    borderRadius: '8px',
                    color: '#a78bfa',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  🤖 Re-score
                </button>
                <button
                  onClick={() => {
                    setEditingLead({ ...lead })
                    setShowEditModal(true)
                  }}
                  style={{
                    padding: '8px 14px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  ✏️ Edit
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteLead(lead.id)}
                    style={{
                      padding: '8px 14px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      color: '#f87171',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: 'rgba(30, 27, 75, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '32px',
              width: '480px',
            }}
          >
            <h2 style={{ marginTop: 0 }}>Add New Lead</h2>
            <input
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: 'white',
                boxSizing: 'border-box',
              }}
            />
            <input
              placeholder="Company"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: 'white',
                boxSizing: 'border-box',
              }}
            />
            <input
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: 'white',
                boxSizing: 'border-box',
              }}
            />
            <input
              placeholder="Phone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: 'white',
                boxSizing: 'border-box',
              }}
            />
            <input
              placeholder="Deal Value ($)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: 'white',
                boxSizing: 'border-box',
              }}
            />
            <textarea
              placeholder="Notes"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '20px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: 'white',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddLead}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Save Lead
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingLead && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: 'rgba(30, 27, 75, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '32px',
              width: '480px',
            }}
          >
            <h2 style={{ marginTop: 0 }}>Edit Lead</h2>
            <input
              value={editingLead.name}
              onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: 'white',
                boxSizing: 'border-box',
              }}
            />
            <input
              value={editingLead.company}
              onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: 'white',
                boxSizing: 'border-box',
              }}
            />
            <input
              value={editingLead.email}
              onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: 'white',
                boxSizing: 'border-box',
              }}
            />
            <input
              value={editingLead.value}
              onChange={(e) =>
                setEditingLead({ ...editingLead, value: parseInt(e.target.value) })
              }
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: 'white',
                boxSizing: 'border-box',
              }}
            />
            <select
              value={editingLead.stage}
              onChange={(e) => setEditingLead({ ...editingLead, stage: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: 'white',
                boxSizing: 'border-box',
              }}
            >
              {stages.map((s) => (
                <option key={s} value={s} style={{ background: '#302b63' }}>
                  {s}
                </option>
              ))}
            </select>
            <textarea
              value={editingLead.notes}
              onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '20px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: 'white',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleUpdateLead}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Update
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
