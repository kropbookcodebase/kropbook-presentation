# SPEC 04 — JAVASCRIPT RULES

## JavaScript Scope

JavaScript is used only for local browser behavior:
- Navigation and footer injection
- Modals
- Animations and scroll reveals
- Local charts or visualizations
- Local document viewer controls
- Small page interactions

## Coding Rules

- Use plain JavaScript files in `js/`.
- Use `defer` on page scripts.
- Use `addEventListener()` instead of inline handlers.
- Prefer data attributes for wiring repeated elements.
- Keep shared helpers in `js/shared.js` when used across pages.
- Keep page-only logic in the matching page script.

## Forbidden Patterns

- No account/session logic.
- No remote data fetching.
- No hosted storage access.
- No analytics beacons.
- No package-based imports.
- No generated bundle output.

## Safety Rules

- When injecting text, use `textContent`.
- When templating local trusted markup, keep it in small, reviewed functions.
- Avoid logging private financial or identity values to the console.
