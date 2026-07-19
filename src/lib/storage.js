// src/lib/storage.js
// Honest persistence layer. Demo scope: localStorage.
// Swap these two functions for real API calls when a backend exists -
// the rest of the app does not care where data lives.

const KEY = 'leadflow.leads.v1'

export function loadLeads(fallback) {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return fallback
    return parsed
  } catch {
    // corrupted storage: start from seed rather than crash
    return fallback
  }
}

export function saveLeads(leads) {
  try {
    localStorage.setItem(KEY, JSON.stringify(leads))
    return true
  } catch {
    return false
  }
}
