# SPEC 03 — LOCAL DESIGN SYSTEM

## Visual Direction

The site should feel premium, calm, and institutional while remaining fully local. Use polished typography, spacing, motion, glass surfaces, data cards, and document-style layouts without relying on external libraries.

## Styling Rules

- Use `css/global.css` for base variables, typography, layout helpers, and shared components.
- Use page CSS files for page-specific sections.
- Use system font stacks or local font files only.
- Do not import remote fonts.
- Do not use utility-class frameworks or generated class systems.

## Motion Rules

- Use CSS keyframes, transitions, and local scroll triggers.
- Keep animation lightweight and respectful of reduced-motion preferences.
- Decorative effects must not block content, clicks, form fields, or scrolling.

## Asset Rules

- Use local images, icons, GIFs, PDFs, and generated assets.
- Do not load media from remote URLs.
- Keep asset paths stable and readable.
