# Tokens — RisqBase Design System v4.2

Source of truth for every visual primitive. Edited as W3C Design Tokens
Format JSON; built into CSS, TS, Tailwind and Figma Variables payloads
by `npm run build:tokens` (see `tools/tokens-build/`).

## Layout

```
tokens/
├── primitive/        Raw values (hex, px, ms). No references.
├── semantic/         Contextual aliases. References primitives.
├── component/        Role tokens consumed by components. References semantics.
└── themes/
    ├── dark.json     Override layer — empty stub until S4.
    └── hc.json       Override layer — empty stub until S4.
```

Three-tier model per spec §15.2; light is the default; dark and HC are
overrides keyed off `<html data-theme="...">` (PR #3 of S1).

## Schema

Each leaf is a W3C token object:

```jsonc
{
  "$value": "#4F46E5",
  "$type": "color",
  "$description": "Primary brand indigo — CTAs, logo, links",
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
| `$value` | yes | Literal hex / dimension / duration, OR a reference `"{a.b.c}"` |
| `$type` | yes | `color` \| `dimension` \| `duration` \| `fontFamily` \| `fontWeight` \| `shadow` \| `border` \| `transition` |
| `$description` | yes | One-line prose; appears in docs site and Figma |
| `$extensions['com.risqbase.role']` | yes | `primitive` \| `semantic` \| `component` |
| `$extensions['com.risqbase.figma']` | yes | `{ collection, mode, variable }` — Figma Variables binding (§15.8.4) |
| `$extensions['com.risqbase.contrastPair']` | optional | Token reference; CI verifies WCAG ratio against the resolved pair |

The lint script (`npm run lint:tokens`) rejects any leaf missing
`$value`, `$type`, `$description`, `com.risqbase.role`, or
`com.risqbase.figma`. It also rejects unresolved `{token.path}`
references and theme keys that aren't in the light layer.

## Adding a new token

1. Decide the tier:
   - **Primitive** — a brand new raw value (rarely needed; usually a
     palette extension). Add to `tokens/primitive/<group>.json`.
   - **Semantic** — a new contextual role (e.g. `color.action.danger`).
     Add to `tokens/semantic/<group>.json` with `$value` referencing a
     primitive.
   - **Component** — a new role consumed by a single component
     (e.g. `color.toast.background.success`). Add to
     `tokens/component/<component>.json` with `$value` referencing a
     semantic.

2. Pick a Figma `variable` path that mirrors the JSON path (segments
   joined by `/`). Set `collection` to match the tier.

3. Add `$description` — one short sentence; this is what designers and
   contributors see in Figma and the docs site.

4. If the token's value carries a contrast guarantee against a surface
   colour, set `com.risqbase.contrastPair` to the surface's reference.

5. Run `npm run lint:tokens` and `npm run build:tokens` locally.
   Commit the JSON change. CI runs both on every PR.

## Theme overrides

Theme files (`tokens/themes/{dark,hc}.json`) only **override existing
keys** — they cannot introduce new ones. The lint rule enforces this.
Adding dark/HC values means re-stating the dotted path with a different
`$value`:

```jsonc
// tokens/themes/dark.json (S4 will fill these)
{
  "color": {
    "action": {
      "primary": { "$value": "#A5B4FC" }
    }
  }
}
```

Style Dictionary picks up the override and emits an extra
`[data-theme="dark"]` block in `dist/tokens.css`.

## Direction of sync (spec §15.8.2)

Code is canonical. JSON in this directory is the source. The `figma-publish`
script in S5 pushes via the Figma Variables REST API. Designers propose
new tokens by creating a Figma variable in a `99 _proposed` collection;
Elena reviews; on approval the token is added here in a JSON PR and the
proposed Figma variable is moved into the canonical collection by the
next sync.
