# SPEC 06 — NO-INLINE CLEANUP

## Required Standard

Active HTML must contain no inline styling or inline behavior.

## Remove From HTML

- `<style>` blocks
- Inline `<script>` blocks
- `style` attributes
- Handler attributes such as `onclick`, `onload`, `onerror`, `onchange`, and `onsubmit`

## Replacement Pattern

- Move visual rules into the matching CSS file.
- Move behavior into the matching JS file.
- Replace one-off inline values with semantic classes.
- Replace event attributes with data attributes plus `addEventListener()`.

## Accepted HTML Attributes

Use structural, accessibility, and data attributes:
- `class`
- `id`
- `data-*`
- `aria-*`
- `role`
- `href`
- `src`
- `alt`
- `width`
- `height`
- `loading`
- `decoding`
