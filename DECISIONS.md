# Decision log

**2026-07-19 - localStorage instead of restoring Supabase.**
Decided: honest local persistence behind a 2-function storage seam.
Why: demo scope, no real backend exists; a fake "Synced to database" toast is worse than a truthful local save.
Rejected: wiring a real Supabase project (out of scope for the case; the seam makes it a 1-file change later).

**2026-07-19 - rule-based scoring instead of client-side OpenAI.**
Decided: deterministic fit score from stage, value, and contact completeness.
Why: the old version shipped an OpenAI key to every visitor; any client-side key is a leak by definition.
Rejected: proxying OpenAI through a serverless function (needs a paid key and adds nothing to a CRUD demo).

**2026-07-19 - drop Bulk Email and Settings buttons instead of stubbing.**
Decided: remove dead UI; keep only working controls.
Why: a button that does nothing is a broken promise; scope-cut beats fake depth.
Rejected: "coming soon" modals (noise).

**2026-07-19 - drop moment, lodash, axios, uuid.**
Decided: native Intl, reduce(), fetch-free storage, crypto.randomUUID.
Why: 4 dependencies served one date format and two sums; bundle fell from 343 KB to 155 KB (gzip: 114 KB to 50 KB); what remains is React itself.
Rejected: keeping them "for later" (later never comes).

**2026-07-19 - keys committed to git require rotation, not deletion.**
Decided: .env removed from tracking and documented that both keys must be rotated by the owner.
Why: git history keeps every committed secret forever; deleting the file changes nothing.
Rejected: history rewrite (pointless in a public case study; rotation is the only real fix).
