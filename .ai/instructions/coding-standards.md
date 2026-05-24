# Coding Standards

Standards for handbook HTML, shared UI, and repo support files.

## Baseline Standards

- Use lowercase-kebab-case for new handbook file names unless an existing convention already exists.
- Keep each handbook page self-contained and easy to scan.
- Reuse the shared back button, theme toggle, and theme-aware styles instead of inventing a page-specific variant.
- Keep SVG icons visible and accessible in both light and dark themes.

## Required Standards

- Update `index.html` whenever a handbook card is added, renamed, or moved.
- Keep the handbook count in `index.html` aligned with the visible card total.
- Keep the root `README.md` and `.ai/` context in sync with repo changes.
- Prefer small, targeted edits over broad rewrites.
- Preserve the established visual language of each handbook family.

## Editing Rules

- Put shared behavior in `styles/shared-ui.css` and `scripts/handbook-ui.js` when possible.
- Keep inline JavaScript minimal and local to the page when a page truly needs custom behavior.
- Avoid changing unrelated handbook families when working on a single page.

## Review Checklist

- Does the handbook still open from `index.html`?
- Does the back button return to the index?
- Does the theme toggle still work and keep the icons visible?
- Did the README and `.ai` context stay current?
