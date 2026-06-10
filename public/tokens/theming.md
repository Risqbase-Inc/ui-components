# Theming — RisqBase Design System v4.4

The `@risqbase-inc/ui-components` package ships two token themes —
`light` (default) and `dark` (full coverage since v4.4) — driven by a
single `data-theme` attribute on `<html>`. Components consume CSS custom
properties; the variable values switch synchronously when the attribute
changes, so swapping themes is as cheap as setting an attribute.

High contrast is **not a token theme** (v4.4 D-107): the package meets
Windows High Contrast / `forced-colors: active` and `prefers-contrast`
as a compliance contract instead — see "High contrast" below. The
`'hc'` member of the `Theme` type remains accepted for backward
compatibility but maps to no CSS overrides; it is deprecated and slated
for removal in v5.0.

This document is for **consumer apps**. The design-token authoring
workflow lives in `tokens/README.md`.

---

## How it works

`dist/tokens.css` (emitted by `npm run build:tokens`) defines:

```css
:root, [data-theme="light"] {
  --color-action-primary: #4f46e5;   /* sRGB fallback */
  --color-text-default: #292524;
  /* …317 tokens */
}
@supports (color: oklch(0% 0 0)) {
  :root, [data-theme="light"] {
    --color-action-primary: oklch(48.7282% 0.225072 273.0935);
    /* …OKLCH source values (v4.4 §A3) */
  }
}

[data-theme="dark"] {
  /* full dark set — every semantic + component color token resolves
     to a derived dark value (v4.4 §B1; lint-enforced completeness) */
}
```

Components reference the variables directly via Tailwind arbitrary
values: `<button className="bg-[var(--color-action-primary)] …">`.
Setting `<html data-theme="dark">` swaps every variable atomically;
no React re-render is required.

---

## Consumer setup (Next.js)

### 1. Import the token CSS in your root layout

```tsx
// app/layout.tsx
import '@risqbase-inc/ui-components/dist/tokens.css'
```

### 2. Inline the SSR-safe init script in `<head>`

The script reads `localStorage` and `prefers-color-scheme` and applies
the active mode synchronously **before first paint**. This avoids a
one-frame flash of the wrong theme on reload.

```tsx
// app/layout.tsx
import { themeInitScript } from '@risqbase-inc/ui-components'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

The script is ~280 bytes; place it as the **first** `<script>` in
`<head>`.

### 3. Expose a settings UI

```tsx
'use client'

import { setTheme, getTheme, type Theme } from '@risqbase-inc/ui-components'

function ThemePicker() {
  return (
    <select defaultValue={getTheme()} onChange={(e) => setTheme(e.target.value as Theme)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  )
}
```

`setTheme` persists to `localStorage` under the key `risqbase-ds-theme`
(exported as `THEME_STORAGE_KEY`) and updates the attribute on
`<html>`. The next page load picks it up via the init script.

To clear a user's preference (e.g. a "use system default" toggle),
call `clearTheme()`:

```tsx
import { clearTheme, setTheme, getTheme } from '@risqbase-inc/ui-components'

clearTheme()                  // wipe localStorage entry
setTheme(getTheme())          // re-resolve from prefers-color-scheme
```

`clearTheme()` is SSR-safe and silently swallows storage errors
(private mode / quota), matching `setTheme`'s behaviour.

---

## Consumer setup (static HTML / non-Next.js)

Inline the script literally in the document `<head>`, or paste the
exported string at build time:

```html
<!doctype html>
<html lang="en-GB">
<head>
  <script>
    (function(){try{var k='risqbase-ds-theme';var s=localStorage.getItem(k);var t=s||(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t!=='light'&&t!=='dark'&&t!=='hc')t='light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();
  </script>
  <link rel="stylesheet" href="/path/to/dist/tokens.css">
</head>
…
</html>
```

Identical contract — `data-theme` attribute drives all token values.

---

## Migration for the three consumer apps (S6)

| App | Path to update | Estimated lines changed |
|---|---|---|
| RisqBase (marketing) | `app/layout.tsx`, `tailwind.config.js` | ~10 |
| RALIA (`ralia.io`) | `app/layout.tsx`, `tailwind.config.js`, optional settings UI | ~20 |
| Cortex (internal admin) | `app/layout.tsx`, settings UI | ~15 |

Each migration is one PR; they merge independently. CEO migration
brief sets the 14-day window from npm publish (per implementation-plan
§6 R1).

---

## Status of dark values

Complete since v4.4 (GOV-DS-2026-03 Workstream B). Every semantic and
component color token carries a derived dark value — hue preserved,
lightness lifted per the §B1 group rules, every value
contrast-verified per theme (`npm run verify:contrast`). The
completeness is lint-enforced: a PR adding a semantic/component color
without a dark value (or an explicit `themeInvariant` reason) fails
`lint:tokens`.

## High contrast (forced-colors compliance — v4.4 B3)

Instead of an `hc` token theme, the package audits every Layer 1 / 2
component under `forced-colors: active` and `prefers-contrast: more`:

- System colour overrides are accepted by default — backgrounds strip
  to `Canvas`, text to `CanvasText`, and no component encodes meaning
  in colour alone (band chips carry their label text; charts carry a
  visually-hidden data-table fallback, v4.4 §F3).
- Where stripped colours WOULD break meaning, components mark SVG
  geometry with `data-fc` roles and `dist/tokens.css` maps them to
  system colours under `@media (forced-colors: active)`: gauge tracks
  → `GrayText`, value arcs → `Highlight`, secondary arcs and chart
  marks → `CanvasText`, heatmap cells → `CanvasText` edges. See
  `tools/tokens-build/static.css` §3.
- Focus indicators rely on `outline` / `ring` styles, which
  forced-colors maps to `Highlight` natively — they survive.

---

## Why `data-theme` and not the `dark` class

Tailwind's default `dark:` variant uses a `class="dark"` selector.
Three reasons we don't:

1. We have **three** modes (light / dark / hc), not two. A class
   approach forces `class="dark"` vs `class="hc"` mutual exclusion
   that's awkward to manage.
2. CSS custom properties cascade better off attribute selectors —
   `[data-theme="dark"]` is a single source of truth that scopes the
   variable redefinitions cleanly.
3. The pattern is what GitHub Primer, Adobe Spectrum, and Shopify
   Polaris use — well-trodden ground.

The `data-theme` attribute is fully accessible-mode-compatible:
Windows High Contrast Mode forces colours via the OS regardless,
overriding any `[data-theme="hc"]` we define. The HC tokens we ship
in S4 are for users who want a high-contrast appearance without
turning on the OS setting.

---

## `THEME_STORAGE_KEY` — rotation contract

The package persists the active theme to `localStorage` under the key
exported as `THEME_STORAGE_KEY`. Today that constant resolves to
`'risqbase-ds-theme'`. The key is part of the public API: changing
its value is a **breaking change for consumers' users**, not just
their code.

**What rotating the key looks like at runtime.** If a future minor
release ships a new `THEME_STORAGE_KEY` value (say `'rb-theme'`), every
user with an existing entry under the old key will appear stuck on the
default-resolved theme: the init script reads the new key, finds
nothing, and falls back to `prefers-color-scheme`. Their old setting
is still in `localStorage` but inert.

**Migration pattern (one PR, ~5 lines).** Read both keys; if the new
one is empty and the old one has a valid value, copy it over and
delete the old. Run once per session, before the first paint:

```ts
const OLD_KEY = 'risqbase-ds-theme'
const NEW_KEY = 'rb-theme'  // example
const old = localStorage.getItem(OLD_KEY)
if (old && !localStorage.getItem(NEW_KEY)) {
  localStorage.setItem(NEW_KEY, old)
  localStorage.removeItem(OLD_KEY)
}
```

`clearTheme()` (exported alongside `setTheme` / `getTheme`) handles
the *current* key; the snippet above is for *bridging* across a
rotation. We commit to flagging any `THEME_STORAGE_KEY` rotation in
the package CHANGELOG with a code-snippet identical to the above so
consumer apps can adopt it in a single PR.
