# 04 · ClientGrid

> **Closes**: Demo C — the "Requires your attention · N clients" card grid below the posture strip in the Practice Cockpit hero.
> **Composes with**: existing `core/Card` (each grid cell is a Card variant); existing `Badge` (alert pills inherit from the band-badge family); `CompliancePostureStrip` (sits above on Practice surfaces).
> **Visual reference**: `Marketing Demo C - Practice Cockpit Hero.html` §2 (the `.cs-clients` block, 3-up grid).
> **Home**: `src/ai/ClientGrid/` — alongside `CompliancePostureStrip` and `ClientScopeBanner`.
> **Accessibility**: inline (§7 below).

---

## §1 What it is

A responsive grid of client cards, each carrying:

- A coloured avatar tile + client name + sub-line (industry / jurisdiction / role).
- An optional alert pill at top-right (count + severity).
- A footer row: residual + week-on-week delta + optional secondary stat (DPIA count, incident count, DPA expiry, etc).

Renders as 3-up on desktop, 2-up on tablet, 1-up on mobile. Modes (`'attention' | 'all'`) determine sorting + presentation density: attention mode shows only clients with active alerts and highlights them; all-mode shows the entire roster with neutral styling.

---

## §2 TypeScript API

```ts
// src/ai/ClientGrid/types.ts

export interface ClientCardData {
  id: string
  /** Display name, e.g. "Acme Health GmbH" */
  name: string
  /** Sub-line, e.g. "Healthcare · DE · 240 staff" or "Finance · HR · white-label" */
  subline: string
  /** Avatar glyph (single letter, default = name[0]) */
  avatarGlyph?: string
  /** Avatar palette key — maps to --color-chart-cat-{1..6} */
  avatarPalette?: 1 | 2 | 3 | 4 | 5 | 6
  /** Residual risk 0–100 */
  residual: number
  /** Week-on-week change (signed integer) */
  weeklyDelta?: number
  /** Active alert count + severity */
  alertCount?: number
  alertSeverity?: 'high' | 'medium'
  /** Optional secondary stat, e.g. "14 DPIAs", "3 incidents", "DPA 14d" */
  secondaryStat?: string
}

export type ClientGridMode = 'attention' | 'all'

export interface ClientGridProps {
  clients: ClientCardData[]
  mode?: ClientGridMode  // default 'all'
  /** Click handler per client; when present, each card becomes a button */
  onClientClick?: (client: ClientCardData) => void
  /** Click handler on the alert pill; when present, pill becomes a separate button.
   *  When omitted, the pill is purely visual (matches Demo C). */
  onAlertClick?: (client: ClientCardData) => void
  /** Heading rendered above the grid — defaults to mode-specific text */
  heading?: string
  /** Right-aligned heading affordance, e.g. "+ Add client" link */
  headingAction?: { label: string; onClick: () => void }
  /** Number of columns at desktop; defaults to 3 (Demo C) */
  desktopColumns?: 2 | 3 | 4
  /** When true, suppress the heading row entirely */
  bare?: boolean
  className?: string
}
```

---

## §3 Layout + visuals

### 3.1 Grid

| Viewport | Columns |
|---|---|
| ≥ 1024px | `desktopColumns` (default 3) |
| 640–1023px | 2 |
| < 640px | 1 |

Gap: 10px (consistent across breakpoints).

### 3.2 Card anatomy

```
┌──────────────────────────────────────┐
│  [AV]  Acme Health GmbH      [3]    │  ← head row: avatar 24×24, name 12px/600, alert pill top-right
│        Healthcare · DE · 240 staff   │  ← subline 10px / --color-text-subtle
│ ────────────────────────────────     │  ← 1px dotted --color-border-subtle
│  58    ↑20 wk           14 DPIAs    │  ← footer: residual mono 12px/600 default-text; delta mono very-high-bg; secondary-stat mono subtle
└──────────────────────────────────────┘
```

- Card consumes `core/Card variant="default" padding="md"` then overrides inner spacing for the cockpit-canon dimensions.
- Card background: `--color-surface-default`.
- Card border: 1px `--color-border-default`.
- Card radius: `--dimension-radius-md`.
- Card padding: 12px.
- Inner head row: `display: flex; align-items: center; gap: 8px`. Avatar fixed 24×24; name + subline stack on a `<div>`.
- Footer: 1px dotted top border, 8px top padding, 8px gap, `display: flex; align-items: center`.

### 3.3 Avatar

Per Demo C, avatars are palette-keyed solid tiles with a single letter glyph:

```
24×24, radius --dimension-radius-sm
background: var(--color-chart-cat-{palette})
color: #FFFFFF (white glyph for legibility against all cat tokens)
font: 11px / 600 / --font-sans
display: grid; place-items: center
```

If `avatarPalette` is unset, derive deterministically from `id`: `palette = (hash(id) % 6) + 1`. Document that consumers wanting stable colours should set `avatarPalette` explicitly.

### 3.4 Alert pill

Identical contract to `CompliancePostureStrip` §3.3. Position: `top: 8px; right: 8px;` absolute inside the card.

When `onAlertClick` is provided, the pill becomes a clickable button rather than a `<span>`. Use `event.stopPropagation()` so the inner pill click doesn't bubble to the card's `onClick`.

### 3.5 Footer stats

| Element | Style |
|---|---|
| Residual | `--font-mono` 12px 600 `--color-text-default`, font-feature-settings 'tnum' |
| Delta `↑/↓ N wk` | `--font-mono` 10px `--color-band-very-high-bg` for upward (worsening), `--color-palette-emerald-500` for downward (improving) |
| Secondary stat | `--font-mono` 10px `--color-text-subtle`, `margin-left: auto` |

The delta colour is **inverted by intent**: a *positive* `weeklyDelta` (risk went up) reads in alert colour; a *negative* `weeklyDelta` (risk went down) reads in emerald-positive. This is the opposite of stock-tickers but the right semantics for compliance.

### 3.6 Heading row

| Element | Style |
|---|---|
| Heading | 14px 600 `--color-text-default` |
| Right action (e.g. "+ Add client") | 11px 600 `--color-action-primary` |

Default heading text:

- `mode='attention'`: "Requires your attention · {N} clients"
- `mode='all'`: "Clients · {N} total"

---

## §4 Token chain

```
card bg              → var(--color-surface-default)
card border          → var(--color-border-default)
card radius          → var(--dimension-radius-md)
divider              → var(--color-border-subtle) dotted

avatar palette       → var(--color-chart-cat-{1..6})
avatar text          → #FFFFFF

name text            → var(--color-text-default)
subline text         → var(--color-text-subtle)
residual             → var(--color-text-default)
delta up (worse)     → var(--color-band-very-high-bg)
delta down (better)  → var(--color-palette-emerald-500)
secondary stat       → var(--color-text-subtle)

alert pill high bg   → var(--color-band-very-high-bg)
alert pill med bg    → var(--color-band-medium-bg)
alert pill med text  → var(--color-band-medium-text)

heading action       → var(--color-action-primary)
```

**Zero new tokens.**

---

## §5 States

| State | Visual |
|---|---|
| Default | as drawn |
| Hover (interactive card) | card border → `--color-action-primary-subtle`; subtle 0 1px 2px shadow |
| Focus | 2px `--color-action-primary` outline, 2px offset |
| Empty | "No clients" centred message + the optional heading action ("+ Add client"); 24px vertical padding |
| Loading | render N skeleton cards (default 3) |
| `mode='attention'` with no alert-carrying clients | render the empty state "No clients need attention this week" + a check glyph (`✓` in `--color-palette-emerald-500`) |

---

## §6 Storybook stories

```
ai/ClientGrid
├── DefaultAttentionMode         — Demo C 3-client attention-mode fixture
├── AllMode12Clients             — 12-client all-mode fixture; same data as PostureStrip
├── FourColumns                  — desktopColumns=4
├── TwoColumns                   — desktopColumns=2
├── WithHeadingAction            — heading "+ Add client" action wired
├── EmptyAttention               — attention mode, zero alerts → empty state with checkmark
├── EmptyAll                     — all mode, zero clients → empty state with action
├── Loading                      — skeleton state
├── InteractiveCards             — onClientClick wired
├── InteractivePill              — onAlertClick wired (pill becomes button)
├── BareNoChrome                 — bare=true
└── ResponsiveBreakpoints        — Chromatic viewports 1280 / 768 / 375
```

---

## §7 Accessibility (inline)

### 7.1 Markup

Cards are a list of related items. Mark up as such; promote to button only when interactive.

```html
<section aria-labelledby="cg-heading-{id}">
  <header>
    <h3 id="cg-heading-{id}">Requires your attention · 3 clients</h3>
    <button>+ Add client</button>
  </header>
  <ul role="list" class="client-grid">
    <li>
      <article aria-labelledby="cg-name-{id-1}" aria-describedby="cg-meta-{id-1}">
        <h4 id="cg-name-{id-1}">Acme Health GmbH</h4>
        <p id="cg-meta-{id-1}">
          Healthcare · DE · 240 staff. Residual 58, up 20 from last week. 14 DPIAs.
          <span class="sr-only">3 high-severity alerts.</span>
        </p>
        <!-- the visible meta + alert pill go here, all aria-hidden because the SR text above carries them -->
      </article>
    </li>
    <!-- ... -->
  </ul>
</section>
```

When `onClientClick` is provided, wrap the `<article>` in a `<button>` with `aria-label` matching the heading + meta combined. Don't double-nest interactive elements: if the card is a button, the alert pill cannot also be a button — use the card's click and inspect modifier keys / the pill's bounding box if pill-specific click is needed.

If `onAlertClick` is provided **and** `onClientClick` is also provided, that's an invalid configuration — engineering throws in dev mode, warns in prod, treats card-click as the only handler. Document this rule in the MDX doc-block.

### 7.2 Avatar

Avatar tile is `aria-hidden="true"` — the glyph is decorative; the name is already announced.

### 7.3 Delta direction

The delta arrow (`↑`/`↓`) is part of the SR-announced meta sentence: "up 20 from last week" or "down 4 from last week". Avoid relying on the arrow glyph alone.

### 7.4 Focus order

- Heading action (if present)
- Each card (in DOM order) — or the alert pill within each card if pills are independently focusable
- The grid does not loop or trap focus; tab continues to the next focusable element after the grid

### 7.5 Colour contrast

| Surface | Min | Notes |
|---|---|---|
| Name on card bg | 4.5:1 | text-default on surface-default — locked |
| Subline on card bg | 4.5:1 | text-subtle on surface-default — verified v4.3 |
| Avatar glyph (white) on chart-cat tokens | 4.5:1 | all 6 cat tokens have ≥ 4.5:1 with white per v4.3 contrast audit |
| Alert pill (high) | 4.5:1 | white on `--color-band-very-high-bg` — verified |
| Alert pill (med) | 4.5:1 | `--color-band-medium-text` on `--color-band-medium-bg` — verified |

---

## §8 Acceptance criteria

1. **Pixel match** — `DefaultAttentionMode` story renders within 4px of Demo C §2's `.cs-clients` block.
2. **Responsive** — 1280 / 768 / 375 Chromatic viewports all render correctly.
3. **Composition** — consumes `core/Card` (not re-implementing card chrome).
4. **Token compliance** — clean.
5. **A11y** — axe clean; SR walkthrough recorded.
6. **Storybook** — 12 stories present.

---

## §9 Open questions

- **Q1** — Avatar palette mapping. Demo C uses chart-cat-{1..6}, but a Practice consumer with 30 clients exhausts the 6-colour palette and gets repeats. Acceptable, or do we want a fallback palette extension? **Recommend**: cycle the 6 tokens; cosmetic repeat is preferable to a token chain extension.
- **Q2** — Delta colour-inversion (positive=alert, negative=improvement) is the right semantic for residual risk but might confuse engineers thinking in market-data conventions. Should we name the prop `weeklyDelta` (neutral) or `weeklyRiskChange` (explicit)? **Recommend**: keep `weeklyDelta` short; document the semantic in the type comment + the MDX doc-block.
- **Q3** — Card height stability. With variable subline lengths and optional secondary stats, cards in the same row can differ in height. Should the grid enforce min-height for visual rhythm? **Recommend**: yes, `min-height: 84px` on the card; subline truncates at 1 line. Update if Elena prefers ragged.
