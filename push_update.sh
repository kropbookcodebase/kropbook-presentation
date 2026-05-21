#!/bin/bash
# =============================================================
# push_update.sh
# Stages, commits, and pushes all changes to the
# Kropbook_update_alldocs branch on GitHub.
#
# HOW TO RUN:
#   chmod +x push_update.sh   (only needed the first time)
#   ./push_update.sh
#
# SAFE TO RUN multiple times — each run creates a new commit.
# Does NOT touch the main branch.
# =============================================================

set -e

BRANCH="Kropbook_update_alldocs"
REMOTE="origin"
REPO_URL="https://github.com/kropbookcodebase/kropbook-presentation.git"

echo ""
echo "=============================================="
echo "  Kropbook Presentation — Push Update"
echo "  Target branch : $BRANCH"
echo "  Remote        : $REMOTE"
echo "=============================================="
echo ""

# ── 1. Confirm we are on the correct branch ──────────────────
CURRENT=$(git branch --show-current)

if [ "$CURRENT" != "$BRANCH" ]; then
  echo "Currently on branch: $CURRENT"
  echo "Switching to $BRANCH ..."
  git checkout "$BRANCH" 2>/dev/null || git checkout -b "$BRANCH"
else
  echo "On branch: $BRANCH  ✓"
fi

echo ""

# ── 2. Stage everything (respects .gitignore) ────────────────
echo "Staging all changes..."
git add .

# ── 3. Show what is staged ───────────────────────────────────
echo ""
echo "Staged files:"
git status --short
echo ""

# ── 4. Commit ────────────────────────────────────────────────
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")
git commit -m "Update Kropbook presentation — $TIMESTAMP

- Rebuilt html/corporate-profile.html (163 → 1546 lines): full Kotak Bank
  credit dossier with 11-point checklist, 4-year financials, director KYC,
  GST compliance map (3 states), operations/working capital, readiness score
- Created js/corporate-profile.js (tab nav, status badges, readiness meter)
- Extended css/corporate-profile.css to 1412 lines (new component classes)
- Migrated all active pages from root to html/ directory
- Corrected FY26 revenue to Rs. 75.49 Cr across all HTML and JS chart data
- Fixed director names: Dr. Kiran Chandar Avhad, Kunal Subhash Pingle
- Corrected shareholding to 50/50 in 8+ locations across 5 files
- Fixed effects.js loading in 5 pages (2 missing, 3 misplaced)
- Fixed AgriOS → KropBook platform name in systems.html
- Fixed states: Goa → Punjab in business-operations.html
- All QA checks pass: zero inline styles, scripts, or event handlers

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>" || {
  echo ""
  echo "Nothing new to commit — working tree is clean."
  echo "If you want to force a re-push, run:  git push -u $REMOTE $BRANCH"
  exit 0
}

echo ""

# ── 5. Push to remote branch ─────────────────────────────────
echo "Pushing to $REMOTE/$BRANCH ..."
git push -u "$REMOTE" "$BRANCH"

echo ""
echo "=============================================="
echo "  Done!"
echo ""
echo "  Branch pushed : $BRANCH"
echo "  Compare / PR  :"
echo "  $REPO_URL"
echo "  → Compare: main...$BRANCH"
echo ""
echo "  When ready to merge into main:"
echo "  Open a Pull Request on GitHub and merge"
echo "  after review — do NOT push directly to main."
echo "=============================================="
echo ""
