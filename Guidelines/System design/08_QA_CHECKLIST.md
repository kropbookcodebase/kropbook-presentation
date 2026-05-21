# SPEC 08 — LOCAL QA CHECKLIST

## Structure Checks

- Root contains only `index.html` as the active HTML entry.
- Active pages live in `html/`.
- CSS lives in `css/`.
- JavaScript lives in `js/`.
- No active implementation uses package or framework files.

## Inline Checks

Search active HTML for:
- `<style`
- `<script` without `src`
- `style=`
- `onclick=`
- `onload=`
- `onerror=`
- `onchange=`
- `onsubmit=`

All must return no matches.

## Offline Checks

- Open `index.html` locally.
- Confirm redirect reaches `html/overview.html`.
- Navigate every page from navbar and footer.
- Confirm images, icons, CSS, and JavaScript load without internet.
- Confirm no remote runtime resource is required.

## Privacy Checks

- Confirm sensitive folders are treated as local-only.
- Confirm active public pages do not expose raw memory markdown links.
- Confirm document links are intentional and owner-approved.
