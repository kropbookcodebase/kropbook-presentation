# SPEC 01 — LOCAL FOLDER STRUCTURE

## Required Layout

```text
project-root/
  index.html
  html/
    overview.html
    founder.html
    team.html
    governance.html
    kropbook.html
    business-operations.html
    systems.html
    clients.html
    finance.html
    funding.html
    strategic-qa.html
    financial-statements.html
    corporate-profile.html
    troporganic.html
  css/
    global.css
    navbar.css
    footer.css
    page-name.css
  js/
    shared.js
    animations.js
    effects.js
    page-name.js
  images/
  icons/
  documents/
  memory/
  Guidelines/
  ARCHIVE/
  .ai-rules/
```

## Path Rules

- From `html/*.html`, reference shared assets with `../css/`, `../js/`, `../images/`, `../icons/`, and `../documents/`.
- Internal page links from one HTML page to another use same-folder links such as `finance.html`.
- Root `index.html` redirects to `html/overview.html`.
- Do not create framework-style folders for active implementation.

## File Rules

- Page HTML: structure and content only.
- Page CSS: page-specific layout, visual treatment, and responsive rules.
- Page JS: page-specific behavior and event listeners.
- Shared CSS and JS: navigation, footer, common effects, reusable utilities.

## Non-Deployable Local Folders

The following folders may exist locally but must not be treated as public deployment content:
- `documents/`
- `memory/`
- `KROPBOOK_AGRITECH_PRIVATE_LIMITED — Master Credit File/`
- `ARCHIVE/`
