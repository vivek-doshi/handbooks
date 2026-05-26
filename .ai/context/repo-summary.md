# Repository Summary

This repository is a static handbook library published through GitHub Pages.
It contains concise, topic-focused HTML handbooks with a shared index, shared UI assets, and lightweight repository guidance for Copilot-assisted edits.

## Core Shape

- `index.html` is the catalog entry point.
- Topic handbooks live in folders such as `python/`, `devops/`, `cloud/`, `ai-frameworks/`, and `ai-governance/`.
- Shared presentation and behavior live in `styles/shared-ui.css`, `scripts/handbook-ui.js`, and `script.js`.
- Handbook pages use floating back/theme controls and should keep SVG icons visible in both light and dark themes.
- Handbook review freshness is tracked in `handbook-tracking/handbook-registry.csv` with automation in `scripts/handbook_review_audit.py` and `.github/workflows/handbook-review-check.yml`.

## Current Editing Flow

1. Add or update a handbook page.
2. Add the new handbook card to `index.html`.
3. Update `README.md` and `.ai/` context files.
4. Run handbook tracking sync/audit and keep registry data current.
5. Keep shared controls, titles, and links consistent.

## Current Handbook Additions

- `python/jupyter-handbook.html` — Jupyter Notebook Field Handbook
- `devops/devops-playbook-handbook.html` — DevOps Playbook Handbook
- `devops/platform-engineering-concepts-handbook.html` — Platform Engineering Concepts Handbook
