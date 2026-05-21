# SPEC 05 — LOCAL DOCUMENT HANDLING

## Purpose

Documents are local reference files, not online gated assets. The site may display approved local documents when opened on the owner's machine, but the project must not imply a secure web document system.

## Folder Policy

- Keep local PDFs in `documents/`.
- Keep raw markdown memory files in `memory/`.
- Keep master credit-file folders local and non-deployable.
- Keep archived external-service plans in `ARCHIVE/`.

## Linking Policy

- Public-facing pages should avoid direct links to sensitive markdown or PDF files unless the owner explicitly wants a private local viewing flow.
- If a local document is linked, label it as local/private material.
- Do not create online access, file editing, sign-in, or permission features.

## Viewer Policy

- Use local iframe or modal viewers only when needed.
- Viewer behavior belongs in page JavaScript.
- Viewer styling belongs in CSS.
- Do not hard-code sensitive document paths in reusable shared components.
