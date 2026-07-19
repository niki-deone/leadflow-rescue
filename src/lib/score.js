// src/lib/score.js
// Rule-based fit score, 0-100. Replaces the old client-side OpenAI call
// (which shipped an API key to every visitor). Deterministic, instant, free.

const STAGE_WEIGHT = { new: 5, contacted: 15, qualified: 30, proposal: 40, won: 50, lost: 0 }

export function scoreLead(lead) {
  let score = 0
  score += STAGE_WEIGHT[lead.stage] ?? 0
  if (lead.value >= 20000) score += 25
  else if (lead.value >= 10000) score += 18
  else if (lead.value >= 5000) score += 12
  else score += 5
  if (lead.notes && lead.notes.trim().length > 0) score += 10
  if (lead.email.includes('@')) score += 5
  if (lead.phone && lead.phone.trim().length > 0) score += 5
  return Math.min(100, score)
}
