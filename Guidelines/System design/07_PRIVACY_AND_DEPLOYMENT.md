# SPEC 07 — LOCAL PRIVACY AND DEPLOYMENT RULES

## Local-Only Assumption

This repository may contain private financial, identity, tax, and diligence material. Treat it as a private local workspace unless the owner explicitly prepares a public-safe export.

## Non-Deployable Material

Do not deploy:
- `documents/`
- `memory/`
- master credit-file folders
- `ARCHIVE/`
- raw source notes
- private diligence PDFs

## Public-Safe Export Rule

A public-safe export must contain only:
- Root `index.html`
- `html/`
- `css/`
- `js/`
- approved public images and icons
- approved public PDFs, if any

## Security Reality

A local static site cannot enforce private access after it is published. Privacy comes from controlling what files are included in the shared folder, not from browser-side code.
