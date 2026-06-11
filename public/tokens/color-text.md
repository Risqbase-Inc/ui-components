---
group: color-text
count: 6
---

# Tokens — `color-text.*`

| Token | Tier | Type | Light | Dark | Description |
|---|---|---|---|---|---|
| `color.text.default` (`--color-text-default`) | semantic | color | `#292524` | `#e3e7e9` | Default body text |
| `color.text.subtle` (`--color-text-subtle`) | semantic | color | `#57534e` | `#a2a7ab` | Subtle / secondary text. AAA text tier (PR-B, 2026-06-11): stone-500 (≈4.8:1 on white) → stone-600 (≈7.6:1) per the AAA programme (AAA Compliance Catalogue, brand-mark v3 hand-off) |
| `color.text.subtle-on-muted` (`--color-text-subtle-on-muted`) | semantic | color | `#57534e` | `#a2a7ab` | Subtle text on muted surfaces — stone-500 on stone-100 computes to 4.39:1, just under the 4.5:1 floor (A11Y-FIX probe). Added per D-125b; use whenever subtle text sits on surface.muted. |
| `color.text.on-action` (`--color-text-on-action`) | semantic | color | `#ffffff` | `#ffffff` | Text on primary action surface |
| `color.text.on-inverse` (`--color-text-on-inverse`) | semantic | color | `#ffffff` | `#101214` | Text on inverse surface — footer headings, primary on dark |
| `color.text.on-inverse-subtle` (`--color-text-on-inverse-subtle`) | semantic | color | `#d6d3d1` | `#4c5054` | Subtle text on inverse surface — footer body, copyright. AAA text tier (PR-B, 2026-06-11): stone-400 (≈6.9:1 on stone-900) → stone-300 (≈11.7:1) per the AAA programme |
