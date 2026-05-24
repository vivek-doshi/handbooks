# Engineering Principles

## Core Principles

- Prefer clarity over abstraction.
- Keep the site simple, fast, and easy to browse.
- Reuse shared assets instead of duplicating page behavior.
- Treat handbook updates as content + navigation changes, not only file edits.
- Keep the repo current by removing stale guidance when it no longer matches the site.

## How To Apply These Principles

- Use the existing index/card layout as the default navigation model.
- Keep handbook pages concise, scannable, and visually consistent.
- Preserve the back button and theme toggle behavior across all handbook families.
- Update the root README and `.ai` files when the repo shape changes.
- Prefer minimal, targeted file updates over broad page rewrites.

## Decision Filter

Before merging a change, confirm:

- Can a new reader understand the page in one pass?
- Does the change fit the current handbook/site pattern?
- Are the shared controls and theme behavior still intact?
- Are the index, README, and `.ai` guidance aligned with the current repo?
- Did we avoid introducing unnecessary files or duplicate behavior?
