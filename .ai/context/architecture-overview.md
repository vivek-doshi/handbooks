# Architecture Overview

## Site Architecture

This repo is a static handbook site.
The site is organized around a central catalog page and many standalone topic handbooks.

## Main Layers

### 1. Catalog Layer

- `index.html` is the primary navigation surface.
- Handbook cards are grouped by topic and link into the corresponding folder pages.
- The handbook total on the index should match the visible cards.

### 2. Handbook Page Layer

- Each handbook is a standalone HTML document under a topic folder.
- Handbook pages should include the shared back button and theme toggle.
- SVG icons in those controls must remain visible in both themes.

### 3. Shared UI Layer

- `styles/shared-ui.css` holds the floating controls and theme-aware shared styles.
- `scripts/handbook-ui.js` owns theme persistence, back-button injection, and shared behavior.
- `script.js` handles catalog page interactions such as the preloader and handbook navigation audio.

### 4. Content Layer

- `python/`, `devops/`, `cloud/`, `ai-frameworks/`, `ai-governance/`, `architecture/`, and related folders hold the handbook content.
- The repo favors concise, skimmable handbook pages over long narrative docs.

## Required Update Flow

1. Add or update the handbook page.
2. Add or update the matching index card.
3. Update the count and cross-links in `index.html` and `README.md`.
4. Update the `.ai/` guidance if the repo shape or page behavior changed.

## Canonical Sources

- `README.md` for human-readable repo overview.
- `.ai/context/` for current repository context.
- `.ai/instructions/` for editing rules and content conventions.
