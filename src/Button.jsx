// Old button component - not used anymore I think
import React from 'react'

export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}
