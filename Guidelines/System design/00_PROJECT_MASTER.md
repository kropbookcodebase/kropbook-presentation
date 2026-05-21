# KROPBOOK LOCAL STATIC SITE — MASTER SPEC

## Purpose

This project is a local-first investor presentation and document briefing built with only browser-native files. It must remain simple to open, review, maintain, and hand to another agent without introducing a framework, account system, cloud service, package workflow, or build step.

## Product Shape

The active experience is one unified static site:
- Root `index.html` is only an entry redirect.
- All active pages live in `html/`.
- All styles live in `css/`.
- All behavior lives in `js/`.
- All media and reference files stay local in asset folders.

There is no separate management area, no user management area, no file-management console, and no online document gate. Sensitive material remains local-only and is not presented as a public deployment feature.

## Non-Negotiable Build Rules

- Use plain HTML, CSS, and JavaScript only.
- Do not add a package manager, build process, framework route system, cloud account flow, analytics, remote database, hosted file store, or external service dependency.
- Do not use inline CSS or inline JavaScript in active HTML.
- Do not place event handlers in HTML attributes.
- Do not load external runtime scripts, stylesheets, fonts, or media.

## Guideline Ownership

- `Guidelines/01_...15_...md` are content and business-data references.
- `Guidelines/System design/` is the active implementation rulebook.
- Archived external-service plans live in `ARCHIVE/Guidelines-System-design-external-document hub/` and are not active instructions.

## Definition Of Done

- The site opens locally from `index.html`.
- Navigation works across all `html/*.html` pages.
- Active pages render without internet access.
- HTML pages contain structure only.
- CSS and JavaScript are separated into their folders.
- Sensitive local folders are documented as non-deployable.
