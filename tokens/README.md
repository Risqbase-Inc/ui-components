# Tokens — RisqBase Design System v4.4

Source of truth for every visual primitive. Authored as **DTCG 2025.10**
design-tokens JSON (`*.tokens.json`, media type
`application/design-tokens+json`); built into CSS, TS, Tailwind and Figma
Variables payloads by `npm run build:tokens` (see `tools/tokens-build/`).

## Layout

```
tokens/
├── resolver.tokens.json   DTCG resolver — declares the base sets and
│                          the theme contexts (light default, dark).
├── primitive/             Raw values (OKLCH colors, px, ms). No references.
├── semantic/              Contextual aliases. References primitives.
├── component/             Role tokens consumed by components. References semantics.
└── themes/
    └── dark.tokens.json   Dark theme set — full coverage since v4.4.
```

Three-tier model per spec §15.2; light is the default; dark is a theme
context keyed off `<html data-theme="dark">`. High contrast is **not a
token theme** (v4.4 D-107): it is a forced-colors / `prefers-contrast`
compliance contract — see `docs/theming.md`.

## Schema

Each leaf is a DTCG token object:

```jsonc
{
  "$value": "oklch(48.7282% 0.225072 273.0935)",
  "$type": "color",
  "$description": "Primary brand indigo — CTAs, logo, links",
  "$deprecated": false,                       // optional: boolean or string reason
  "$extensions": {
    "com.risqbase.role": "primitive",
    "com.risqbase.figma": {
      "collection": "primitive",
      "mode": "light",
      "variable": "color/brand/indigo/600"
    },
    "com.risqbase.contrastPair": "{color.surface.default}"
  }
}
```

| Field | Required | Notes |
|---|:---:|---|
| `$value` | yes | Literal OKLCH / dimension / duration, OR a reference `"{a.b.c}"` |
| `$type` | yes | `color` \| `dimension` \| `duration` \| `fontFamily` \| `fontWeight` \| `shadow` \| `border` \| `transition` |
| `$description` | yes | One-line prose; appears in docs site and Figma |
| `$deprecated` | no | DTCG 2025.10: `true` or a string reason; surfaced in build logs and the agent registry |
| `$extensions['com.risqbase.role']` | yes | `primitive` \| `semantic` \| `component` |
| `$extensions['com.risqbase.figma']` | yes | `{ collection, mode, variable }` — Figma Variables binding (§15.8.4) |
| `$extensions['com.risqbase.contrastPair']` | optional | Token reference; CI verifies WCAG ratio against the resolved pair **in every theme** |
| `$extensions['com.risqbase.contrastLevel']` | optional | `aa-large` lowers the pair's floor to 3:1 for documented exceptions (v4.3 §4.2) |
| `$extensions['com.risqbase.legacyHex']` | optional | Original sRGB hex for any color whose OKLCH conversion could not round-trip exactly (v4.4 §A3 — currently none) |
| `$extensions['com.risqbase.themeInvariant']` | optional | String reason; declares a semantic/component color intentionally identical across themes (satisfies the dark-completeness lint) |

Token references use the curly-brace house style (spec-legal); JSON
Pointer syntax is not mixed in.

### Colors are OKLCH (v4.4 §A3)

Every color `$value` is `oklch(L% C H)`; raw hex is rejected by
`lint:tokens` (scanner rule R12). The conversion from the v4.3 hex source
is **round-trip exact** — `dist/tokens.css` emits the identical sRGB hex
as the base declaration plus the `oklch()` value inside an
`@supports (color: oklch(0% 0 0))` block; derived outputs (TS / Tailwind /
Figma) keep emitting hex. Zero visual drift. Round-trip evidence:
`docs/design-system/v4.4/reports/oklch-roundtrip.md`.

## Theming (v4.4 §A4 — resolver-based)

`tokens/resolver.tokens.json` declares the base set (the three tiers) and
the `theme` modifier (`light` default, `dark`). The build reads the
resolver — there is no hardcoded theme list. A theme set:

- may only **override tokens the base defines** (never introduce new ones);
- must give every semantic/component **color** token a value that resolves
  differently than light — or the base leaf declares
  `com.risqbase.themeInvariant` with a reason. `lint:tokens` enforces both
  (full dark coverage is a v4.4 guarantee, §B5).

Emitted CSS keeps the v4.2-era consumer contract:

```css
:root, [data-theme="light"] { /* base */ }
[data-theme="dark"]         { /* overrides */ }
```

Dark values are **derived, not improvised** — hue preserved, lightness
lifted per group rules, every value contrast-verified
(`tools/tokens-build/derive-dark.mjs`, `npm run verify:contrast`).

## Adding a new token

1. Decide the tier (primitive / semantic / component) and add it to the
   matching `tokens/<tier>/<group>.tokens.json`. New files must also be
   declared in `resolver.tokens.json`.
2. Color values are OKLCH (`tools/tokens-build/lib/oklch.js` converts).
3. Pick a Figma `variable` path mirroring the JSON path; set `collection`
   to the tier. Add a one-line `$description`.
4. If the token carries a contrast guarantee, set
   `com.risqbase.contrastPair`.
5. Semantic/component colors need a dark value in
   `tokens/themes/dark.tokens.json` (or a `themeInvariant` reason).
6. Run `npm run lint:tokens`, `npm run build:tokens`,
   `npm run verify:contrast` locally. CI runs all three on every PR, plus
   the agent-surface freshness check (R14) — run
   `npm run build:agent-surface` so `public/agent/` matches.

## Direction of sync (spec §15.8.2)

Code is canonical. JSON in this directory is the source. The `figma-publish`
script pushes via the Figma Variables REST API (dark mode values included
since v4.4). Designers propose new tokens by creating a Figma variable in a
`99 _proposed` collection; G4 reviews; on approval the token is added here
in a JSON PR and the proposed Figma variable is moved into the canonical
collection by the next sync.
