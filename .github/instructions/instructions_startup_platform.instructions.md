---
applyTo: "**"
---

## Analyzing

- Every time doing analysis we use supabase MCP to check database existing functions, tables, constraints, RCP functions and everything thats needed.
- We do deep analysis when we are solving problems and issues
- We do not over-engineer

## General

- We do not over-engineer
- We use ShadCN extensively
- We do not re-write files, only with acceptance of me
- Always ask for my approval after preparing plan
- We always check database, thats our truth of information. NOT UI!

## Development Workflow

- We use Git branch workflow: `master` (production) and `develop` (testing)
- NEVER push directly to `master` - always test on `develop` first
- Work on `develop` → Test on Vercel preview URL → Merge to `master` for production
- For features, create `feature/*` branches from `develop`, then merge back to `develop`
- Both branches use the SAME Supabase production database (no separate dev DB)
- We use manual backups for safety (Pro plan includes this)

## Database Changes Safety Protocol

- ALWAYS take manual Supabase backup before any schema/migration changes
- Test migrations on `develop` branch first
- Apply to production during low-traffic hours when possible
- Check database state with MCP tools before and after changes
- Document any destructive operations before executing
- Supabase project id: ksoohvygoysofvtqdumz