# LeadFlow

Lead pipeline demo app for small teams. React 18 + Vite, zero runtime dependencies beyond React.

This repo is a **rescue case study**: it started as a typical AI-generated app with 12 documented problems (see `AUDIT.md`) and was systematically repaired. The original broken version is preserved as the first commit.

## What it actually does

- Lead CRUD with pipeline stages (new → contacted → qualified → proposal → won / lost)
- Data persists in localStorage (honest demo scope; the storage layer in `src/lib/storage.js` is a 2-function seam for a real backend)
- Rule-based fit scoring (`src/lib/score.js`) - deterministic, no API keys in the client
- CSV export that really exports
- Search, stage filter, sorting
- Responsive from 380px up; keyboard and screen-reader friendly basics

## What it deliberately does not do

- No real authentication - the login is a labeled demo gate
- No server - by design for this case study; see `DECISIONS.md`

## Run

```bash
npm install
npm run dev
```

## Case study

Before/after screenshots, the full 12-finding audit, and the fix log: see `AUDIT.md`, `DECISIONS.md`, and the commit history - each fix is one commit.
