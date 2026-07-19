// src/components/Toolbar.jsx

import { STAGES } from '../data/seed.js'

export default function Toolbar({ search, onSearch, stage, onStage, sort, onSort }) {
  return (
    <div className="toolbar">
      <input
        className="input search"
        type="search"
        placeholder="Search by name or company"
        aria-label="Search leads"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <select
        className="select"
        aria-label="Filter by stage"
        value={stage}
        onChange={(e) => onStage(e.target.value)}
      >
        <option value="all">All stages</option>
        {STAGES.map((s) => (
          <option key={s} value={s}>
            {s[0].toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      <select
        className="select"
        aria-label="Sort leads"
        value={sort}
        onChange={(e) => onSort(e.target.value)}
      >
        <option value="createdAt">Newest first</option>
        <option value="value">Highest value</option>
        <option value="score">Best score</option>
      </select>
    </div>
  )
}
