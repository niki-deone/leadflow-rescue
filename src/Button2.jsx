// New improved button v2
import React from 'react'

export default function Button2({ label, handleClick, variant }) {
  let bg = 'linear-gradient(135deg, #8b5cf6, #6366f1)'
  if (variant === 'danger') {
    bg = 'linear-gradient(135deg, #ef4444, #dc2626)'
  }
  return (
    <button
      onClick={handleClick}
      style={{
        background: bg,
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      {label}
    </button>
  )
}
