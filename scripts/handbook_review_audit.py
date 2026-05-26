#!/usr/bin/env python3
"""Sync and audit handbook review metadata.

Usage:
  python scripts/handbook_review_audit.py --sync
  python scripts/handbook_review_audit.py --audit
  python scripts/handbook_review_audit.py --sync --audit
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple

ROOT = Path(__file__).resolve().parents[1]
TRACKING_DIR = ROOT / "handbook-tracking"
REGISTRY_PATH = TRACKING_DIR / "handbook-registry.csv"

REGISTRY_COLUMNS = [
    "handbook_path",
    "owner",
    "last_reviewed",
    "next_review_due",
    "update_status",
    "source_links",
    "handbook_version",
    "last_updated_meta",
]

EXCLUDED_TOP_LEVEL = {".git", ".github", ".ai", "styles", "scripts"}

# Folder-based review cadence in days.
CADENCE_DAYS = {
    "ai-frameworks": 30,
    "ai-governance": 30,
    "cloud": 30,
    "security": 30,
    "tooling": 30,
    "architecture": 90,
    "data-engineering": 90,
    "devops": 90,
    "gen-ai": 90,
    "mlops": 90,
    "networking": 90,
    "observability": 90,
    "platform": 90,
    "backend": 180,
    "databases": 180,
    "fine-tuning": 180,
    "frontend": 180,
    "machine-learning": 180,
    "python": 180,
}

VERSION_RE = re.compile(r'<meta\s+name="handbook-version"\s+content="([^"]+)"', re.IGNORECASE)
UPDATED_RE = re.compile(r'<meta\s+name="last-updated"\s+content="([^"]+)"', re.IGNORECASE)


def discover_handbooks() -> List[Path]:
    found: List[Path] = []
    for path in ROOT.glob("**/*handbook*.html"):
        if not path.is_file():
            continue
        rel = path.relative_to(ROOT)
        if rel.parts and rel.parts[0] in EXCLUDED_TOP_LEVEL:
            continue
        found.append(path)
    return sorted(found, key=lambda p: p.relative_to(ROOT).as_posix())


def parse_meta(path: Path) -> Tuple[str, str]:
    text = path.read_text(encoding="utf-8", errors="ignore")
    version_match = VERSION_RE.search(text)
    updated_match = UPDATED_RE.search(text)
    version = version_match.group(1).strip() if version_match else ""
    last_updated = updated_match.group(1).strip() if updated_match else ""
    return version, last_updated


def folder_cadence_days(rel_path: Path) -> int:
    top = rel_path.parts[0] if rel_path.parts else ""
    return CADENCE_DAYS.get(top, 90)


def read_registry() -> Dict[str, Dict[str, str]]:
    rows: Dict[str, Dict[str, str]] = {}
    if not REGISTRY_PATH.exists():
        return rows

    with REGISTRY_PATH.open("r", encoding="utf-8", newline="") as fh:
        reader = csv.DictReader(fh)
        for raw in reader:
            normalized = {col: (raw.get(col, "") or "").strip() for col in REGISTRY_COLUMNS}
            key = normalized["handbook_path"]
            if key:
                rows[key] = normalized
    return rows


def write_registry(rows: List[Dict[str, str]]) -> None:
    TRACKING_DIR.mkdir(parents=True, exist_ok=True)
    with REGISTRY_PATH.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=REGISTRY_COLUMNS)
        writer.writeheader()
        writer.writerows(rows)


def sync_registry() -> int:
    today = dt.date.today()
    existing = read_registry()
    handbooks = discover_handbooks()

    output_rows: List[Dict[str, str]] = []
    added = 0

    for abs_path in handbooks:
        rel = abs_path.relative_to(ROOT)
        rel_str = rel.as_posix()
        version, last_updated_meta = parse_meta(abs_path)

        if rel_str in existing:
            row = existing[rel_str]
            row["handbook_version"] = version
            row["last_updated_meta"] = last_updated_meta
        else:
            cadence = folder_cadence_days(rel)
            row = {
                "handbook_path": rel_str,
                "owner": "unassigned",
                "last_reviewed": today.isoformat(),
                "next_review_due": (today + dt.timedelta(days=cadence)).isoformat(),
                "update_status": "active",
                "source_links": "",
                "handbook_version": version,
                "last_updated_meta": last_updated_meta,
            }
            added += 1

        output_rows.append({col: row.get(col, "") for col in REGISTRY_COLUMNS})

    output_rows.sort(key=lambda r: r["handbook_path"])
    write_registry(output_rows)

    discovered_set = {p.relative_to(ROOT).as_posix() for p in handbooks}
    removed = len([k for k in existing if k not in discovered_set])

    print(f"Synced registry: {len(output_rows)} handbook entries ({added} added, {removed} removed).")
    return 0


def parse_date(value: str) -> dt.date | None:
    if not value:
        return None
    try:
        return dt.date.fromisoformat(value)
    except ValueError:
        return None


def audit_registry() -> int:
    if not REGISTRY_PATH.exists():
        print("Registry file missing: handbook-tracking/handbook-registry.csv")
        return 1

    rows = list(read_registry().values())
    today = dt.date.today()
    overdue: List[Tuple[int, str, str, str]] = []
    due_soon: List[Tuple[int, str, str, str]] = []
    invalid_dates: List[str] = []

    for row in rows:
        due_raw = row.get("next_review_due", "")
        due = parse_date(due_raw)
        if due is None:
            invalid_dates.append(row["handbook_path"])
            continue

        delta_days = (due - today).days
        owner = row.get("owner", "") or "unassigned"
        if delta_days < 0:
            overdue.append((abs(delta_days), row["handbook_path"], due_raw, owner))
        elif delta_days <= 14:
            due_soon.append((delta_days, row["handbook_path"], due_raw, owner))

    overdue.sort(key=lambda i: (-i[0], i[1]))
    due_soon.sort(key=lambda i: (i[0], i[1]))

    print(f"Audit summary: {len(rows)} total, {len(overdue)} overdue, {len(due_soon)} due within 14 days.")

    if invalid_dates:
        print("Invalid next_review_due dates found for:")
        for path in sorted(invalid_dates):
            print(f" - {path}")

    if overdue:
        print("\nOverdue handbooks:")
        for days, path, due_raw, owner in overdue:
            print(f" - {path} | owner={owner} | due={due_raw} | overdue_by={days}d")

    if due_soon:
        print("\nDue soon (<=14 days):")
        for days, path, due_raw, owner in due_soon:
            print(f" - {path} | owner={owner} | due={due_raw} | due_in={days}d")

    return 1 if overdue or invalid_dates else 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Sync and audit handbook review metadata.")
    parser.add_argument("--sync", action="store_true", help="Sync registry with handbook files.")
    parser.add_argument("--audit", action="store_true", help="Audit registry for overdue reviews.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if not args.sync and not args.audit:
        print("Nothing to do. Use --sync, --audit, or both.")
        return 1

    if args.sync:
        rc = sync_registry()
        if rc != 0:
            return rc

    if args.audit:
        return audit_registry()

    return 0


if __name__ == "__main__":
    sys.exit(main())
