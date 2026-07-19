# LeadFlow - Rescue Audit

Date: 2026-07-19. Auditor: Nikita. Method: automated scan (audit.sh) + manual pass of the critical flow (lead CRUD).

## Triage: 12 findings

### Blockers (critical flow broken)

1. **Fake persistence.** All leads live in `useState` only. "Synced to database" toast fires unconditionally; the axios POST goes to a dead Supabase URL with `.catch(() => {})`. Refresh = all data gone. The client's ONE flow (CRUD that persists) does not work.
2. **Race condition on add/move/delete.** Every mutation is wrapped in `setTimeout` capturing stale `leads`. Add two leads quickly - the second overwrites the first. Move a card then delete another - one change is lost. Duplicate IDs (`id: leads.length + 1`) make React keys collide after any delete.
3. **Add Lead accepts garbage.** No validation: empty name, `parseInt('')` = NaN value that renders as `$NaN` and breaks totals.

### Traps (work today, burn later)

4. **OpenAI API key hardcoded in client bundle** (`App.jsx`, also in committed `.env` together with a Supabase service_role key). Anyone can extract it from devtools and drain the account.
5. **`.env` committed to git, no `.gitignore`** - secrets are in history forever; rotation required, not just deletion.
6. **Fake auth.** Any non-empty username/password logs in; `admin123` hardcoded in the bundle grants "admin". Delete button is hidden in UI only - no server enforcement exists at all.
7. **Empty catch blocks + no loading states.** Every failure path is silent; user sees a frozen UI. AI re-score has no pending indicator and writes over state from a stale closure.
8. **README describes features that do not exist** (Supabase sync, CSV export, RBAC, mobile). Dangerous for handoff and embarrassing in due diligence.

### Cosmetic / debt

9. **Broken mobile.** Fixed `width: 1200px` container, 3-column grid with `minWidth: 340px` cards, `width: 320px` search. Horizontal scroll at 380px; unusable on phones.
10. **Dead buttons.** Export CSV, Bulk Email, Settings render but their handlers are empty.
11. **800-line single component.** All state, all views, both modals, data layer, and "AI" logic in one `App.jsx` with duplicated inline style objects; plus dead files `Button.jsx` / `Button2.jsx` used nowhere.
12. **342 KB bundle for a CRUD page.** moment + lodash + axios imported for one date format and two sums; console.log noise ships to production, including a partial API key log.

## Fix order

Blockers 1-3 first (client-visible), traps 4-8 second (the value-add), 9-12 last.
