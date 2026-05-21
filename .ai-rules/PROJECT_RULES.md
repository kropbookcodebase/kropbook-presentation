# Kropbook Project Rules

## Core Technology Rule

This repository is a static browser project. All implementation work must stay in plain HTML, CSS, and JavaScript.

Do not add or convert this project to:
- Next.js
- React
- TypeScript
- TSX or JSX
- Vite, Webpack, Babel, or another build step
- npm, yarn, pnpm, or package-based dependency management
- server-side code or backend framework code

All source code must run directly in the browser from `.html`, `.css`, and `.js` files.

## Allowed File Types For Implementation

Use these implementation file types:
- `.html` for page structure
- `.css` for styling
- `.js` for browser behavior

Documentation, reference material, PDFs, images, and other static assets may remain in their existing formats.

## Current Project Shape

The existing public presentation is organized as:
- Root-level HTML pages such as `overview.html`, `finance.html`, `funding.html`, and related section pages
- Page-specific styles in `css/*.css`
- Shared and page-specific scripts in `js/*.js`
- Static assets in `images/`, `icons/`, `documents/`, and customer logo folders

Keep new public presentation work consistent with that structure. Prefer:
- Shared reusable behavior in `js/shared.js` or another clearly named plain JavaScript file
- Shared reusable styles in `css/global.css`, `css/navbar.css`, `css/footer.css`, or another clearly named CSS file
- Page-specific code in matching page files, for example `funding.html`, `css/funding.css`, and `js/funding.js`

## Reference Prompt Rule

The `additional prompts/` folder contains reference ideas that may mention React, TypeScript, TSX, Tailwind, package installs, or framework components. Treat those files as inspiration only.

Before using any idea from those files, convert it to plain HTML, CSS, and JavaScript. Never copy React, TypeScript, TSX, JSX, package install commands, or build-tool instructions into the implementation.

## Maintenance Rules

- Keep edits scoped to the requested page, stylesheet, and script unless shared behavior is truly needed.
- Reuse existing design variables, typography, navbar, footer, animation, and component patterns before adding new ones.
- Do not introduce a `package.json` or dependency lockfile.
- Do not create `src/`, `app/`, `pages/`, `components/`, or other framework-style folders unless the user explicitly changes the project architecture.
- If a new page is added, create a matching `.html` page, page CSS file, and optional page JS file using the existing naming style.
- Do not use external browser libraries, remote fonts, hosted scripts, hosted styles, analytics, remote databases, cloud storage, or account services unless the owner explicitly changes the project direction.

## Folder Discipline

The active site uses this structure:
- Root `index.html` is only the entry redirect.
- Active pages live in `html/`.
- Stylesheets live in `css/`.
- Scripts live in `js/`.
- Local assets remain in folders such as `images/`, `icons/`, `documents/`, and customer logo folders.

From `html/*.html`, use `../css/`, `../js/`, `../images/`, `../icons/`, and `../documents/` paths.

## No Inline Code

Active HTML must contain structure and content only.

Do not use:
- `<style>` blocks
- Inline `<script>` blocks
- `style` attributes
- Inline event handlers such as `onclick`, `onload`, `onerror`, `onchange`, or `onsubmit`

Put styling in CSS files and behavior in JavaScript files using classes, data attributes, and `addEventListener()`.

## Local Privacy Rule

Sensitive folders such as `documents/`, `memory/`, master credit-file folders, and `ARCHIVE/` are local-only unless the owner explicitly approves them for sharing. A static browser site cannot enforce private access after deployment; privacy is controlled by which files are included in the shared/exported folder.

## Non-Negotiable Summary

No Next.js. No TypeScript. No React. No build tools. No package manager workflow. No external runtime services. No inline CSS or JavaScript.

HTML, CSS, and JavaScript only.
