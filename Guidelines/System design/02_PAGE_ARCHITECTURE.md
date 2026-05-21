# SPEC 02 — PAGE ARCHITECTURE

## Active Page Pattern

Every active page follows this pattern:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
  <link rel="stylesheet" href="../css/global.css">
  <link rel="stylesheet" href="../css/navbar.css">
  <link rel="stylesheet" href="../css/footer.css">
  <link rel="stylesheet" href="../css/page-name.css">
  <script src="../js/effects.js" defer></script>
</head>
<body>
  <div id="navbar-container"></div>
  <main>Page content</main>
  <div id="footer-container"></div>
  <script src="../js/shared.js" defer></script>
  <script src="../js/animations.js" defer></script>
  <script src="../js/page-name.js" defer></script>
</body>
</html>
```

## Separation Rules

- No `<style>` blocks.
- No inline `<script>` blocks.
- No `style` attributes.
- No `onclick`, `onload`, `onerror`, or similar handler attributes.
- Use classes, data attributes, and JavaScript listeners.

## Content Rules

- Keep page copy accurate to the content guideline files.
- Reuse existing visual language before adding a new component pattern.
- Keep private financial and identity files local-only unless the owner explicitly approves linking them.
