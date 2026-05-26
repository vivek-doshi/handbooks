# Handbook Tracking

This folder tracks handbook review ownership and freshness.

## Files

- handbook-registry.csv: Source of truth for review ownership and due dates.
- handbook-update-log-template.md: Template for documenting handbook updates.

## Registry Columns

- handbook_path: Relative path to the handbook HTML file.
- owner: Responsible reviewer (GitHub handle/team). Use unassigned until owned.
- last_reviewed: Date this handbook was last reviewed (YYYY-MM-DD).
- next_review_due: Next mandatory review date (YYYY-MM-DD).
- update_status: active, review-needed, or archived.
- source_links: Optional comma-separated source references.
- handbook_version: Current value from meta name="handbook-version".
- last_updated_meta: Current value from meta name="last-updated".

## Commands

Run from repository root:

- python scripts/handbook_review_audit.py --sync
- python scripts/handbook_review_audit.py --audit
- python scripts/handbook_review_audit.py --sync --audit

## Review Cadence

Default cadence is assigned by top-level folder:

- 30 days: ai-frameworks, ai-governance, cloud, security, tooling
- 90 days: architecture, data-engineering, devops, gen-ai, mlops, networking, observability, platform
- 180 days: backend, databases, fine-tuning, frontend, machine-learning, python

Adjust due dates in handbook-registry.csv when a handbook needs a custom cycle.
