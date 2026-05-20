# 03 · CompliancePostureStrip

> **Closes**: Demo C — /practice Cockpit hero rebuild. The "12 client posture at a glance" strip below the cockpit stats row.
> **Composes with**: existing `core/Gauge` (consumed at `size="sm" variant="single" palette="teal"`); `ClientScopeBanner` (sits above on the Practice surface); `ClientGrid` (sits below).
> **Visual reference**: `Marketing Demo C - Practice Cockpit Hero.html` §2 (the `.cs-posture` block, 12 mini-gauges in a 12-column strip).
> **Home**: `src/ai/CompliancePostureStrip/` — alongside ClientScopeBanner (Practice-domain components).
> **Accessibility**: inline (§7 below).

---

## §1 What it is

A single-row horizontal strip rendering N client posture indicators side-by-side: each is a 32×32 mini-gauge with a client name above and the numeric residual below. Optional alert pills sit at the bottom of any client with active findings. The strip is sortable (by risk, by name, by alerts) and emits a sort change so consumers can co-ordinate with related surfaces (e.g. ClientGrid below).

This is the "Practice Cockpit at a glance" device. It scales from 6 to 30+ clients without composition change. The Cockpit hero pins it to exactly 12; the in-product surface pins to the user's actual client count.

---

## §2 TypeScript API

```ts
// src/ai/CompliancePostureStrip/types.ts

export interface ClientPosture {
  id: string
  /** Display name; truncates at 10ch in the strip */
  name: string
  /** Residual risk 0–100; drives gauge fill + band derivation */
  residual: number
  /** Optional active-alert count; renders the pill */
  alertCount?: number
  /** Alert severity for the pill colour (driven from highest open finding) */
  alertSeverity?: 'high' | 'medium'
  /** Optional click handler; when present, each gauge cell becomes a button */
  onClick?: () => void
}

export type PostureSort = 'risk' | 'name' | 'alerts'

export interface CompliancePostureStripProps {
  /** Clients to render. Order respected unless a sort is applied. */
  clients: ClientPosture[]
  /** Active sort. Defaults to undefined — respect the order passed in. */
  sort?: PostureSort
  /** Fire when the user changes sort via the inline sort affordance */
  onSortChange?: (next: PostureSort) => void
  /** Heading rendered above the strip; defaults to "Posture across clients · N total" */
  heading?: string
  /** When true, hide the heading + sort affordance (use inside a section that
   *  already provides them). Defaults to false. */
  bare?: boolean
  /** Override the gauge palette across all cells; defaults to 'teal' to match
   *  the Practice cockpit visual canon. */
  gaugePalette?: 'teal' | 'indigo'
  className?: string
}
```

---

## §3 Layout + visuals

### 3.1 Grid

```
[ heading row ......................................................... [sort: by risk ▾] ]
[ gauge ][ gauge ][ gauge ][ gauge ][ gauge ][ gauge ][ gauge ][ gauge ][ gauge ][ gauge ][ gauge ][ gauge ]
   ↑ each cell auto-sizes; 12 cells fits 1280px page comfortably; on smaller widths
     the grid wraps to a second row maintaining cell width
```

CSS:
```
display: grid;
grid-template-columns: repeat(auto-fit, minmax(72px, 1fr));
gap: 6px;
```

Heading row:
- Heading text: 14px medium `--color-text-default`.
- Sort affordance: right-aligned mono 10px `--color-text-subtle`, letter-spacing 0.04em. Renders as `Sort: by risk` with a small chevron when interactive.

### 3.2 Cell anatomy

```
┌───────────────────────┐
│   Acme Health         │  ← name, 9px, line-height 1.2, max 2 lines, ellipsis
│                       │
│        ◯              │  ← Gauge size="sm" (32×32)
│                       │
│        58             │  ← residual numeric, mono 10px medium
│      ┌────┐           │
│      │ 3  │           │  ← alert pill (optional)
│      └────┘           │
└───────────────────────┘
```

- Cell padding: 8px 4px.
- Cell background: `--color-surface-subtle`.
- Cell border: 1px `--color-border-subtle`.
- Cell radius: `--dimension-radius-md`.
- Hover (when `onClick` present): background → `--color-surface-default`; ring 1px `--color-action-primary-subtle`.

### 3.3 Alert pill

| `alertSeverity` | bg | text |
|---|---|---|
| `high` | `--color-band-very-high-bg` | white |
| `medium` | `--color-band-medium-bg` | `--color-band-medium-text` |

Pill is inline-block, 1px × 5px padding, `--font-mono` 8px font-weight 700, letter-spacing 0.04em, radius 9999px, margin-top 2px. Renders `{alertCount}` only when `alertCount > 0`.

### 3.4 The gauge

Consumes `core/Gauge`:

```tsx
<Gauge
  value={residual}
  variant="single"
  size="sm"
  palette={gaugePalette}
  aria-label={`${name}: residual ${residual}`}
/>
```

The mini-gauge is decorative-with-data; full semantics live on the cell button.

---

## §4 Token chain

```
heading text            → var(--color-text-default)
sort affordance         → var(--color-text-subtle), font-mono 10px
cell bg (default)       → var(--color-surface-subtle)
cell bg (hover)         → var(--color-surface-default)
cell border             → var(--color-border-subtle)
cell ring (hover)       → var(--color-action-primary-subtle)
name                    → var(--color-text-subtle), 9px
residual                → var(--color-text-default), font-mono 10px medium
gauge track             → var(--color-gauge-track)
gauge arc               → var(--color-gauge-arc-teal) | var(--color-gauge-arc-indigo)
alert pill high bg      → var(--color-band-very-high-bg)
alert pill med bg       → var(--color-band-medium-bg)
alert pill med text     → var(--color-band-medium-text)
```

**Zero new tokens.**

---

## §5 States

| State | Visual |
|---|---|
| Default | as drawn |
| Empty (`clients.length === 0`) | render heading + the empty-state row "No clients in scope" centred, 12px `--color-text-subtle` |
| Loading | render heading + 12 skeleton cells (no Gauge, just radius-md surface-subtle blocks with `--color-skeleton-shimmer`) |
| Sortable (sort + onSortChange both present) | sort affordance becomes a dropdown trigger — patterns inherit `core/Header`'s dropdown polish (see 07-Header-polish.md) |
| Interactive cell | hover ring; cursor pointer; focus ring 2px `--color-action-primary` offset 2px |

---

## §6 Storybook stories

```
ai/CompliancePostureStrip
├── Default                      — Demo C 12-client fixture (Practice Cockpit)
├── SortedByRisk                 — same data, sort='risk'
├── SortedByAlerts               — same data, sort='alerts'
├── ManyClients                  — 30 clients; grid wraps to 3 rows
├── FewClients                   — 4 clients
├── Empty                        — empty state
├── Loading                      — skeleton state
├── Interactive                  — onClick wired on every cell
├── BareNoChrome                 — bare=true, just the strip without heading
└── IndigoPalette                — gaugePalette='indigo'
```

---

## §7 Accessibility (inline — no separate a11y.md)

The strip is a **list of summary statistics**, not a chart. Mark it up as such.

### 7.1 Markup

```html
<section aria-labelledby="cps-heading-{id}">
  <header>
    <h3 id="cps-heading-{id}">Posture across clients · 12 total</h3>
    <div>
      <button aria-haspopup="listbox" aria-expanded="false">Sort: by risk</button>
    </div>
  </header>
  <ul role="list" aria-label="Client posture summary">
    <li>
      <button aria-label="Acme Health: residual 58 out of 100, high band, 3 alerts. Activate to open.">
        <span class="sr-only">Acme Health</span>
        <span aria-hidden="true">Acme Health</span>
        <svg aria-hidden="true" /* gauge */ />
        <span aria-hidden="true">58</span>
        <span aria-hidden="true">3</span>
      </button>
    </li>
    <!-- ...11 more -->
  </ul>
</section>
```

Cells are `<button>` only when `onClick` is provided; otherwise plain `<li>` with the same `aria-label` on the `<li>` itself.

### 7.2 Sort affordance

The sort dropdown follows the same disclosure pattern as the Header polish (see 07-Header-polish.accessibility.md §1). Inheriting that contract keeps Sarah G5's keyboard-test sequence identical between surfaces.

### 7.3 Sort change announcement

When `onSortChange` fires, the parent surface should announce the new sort via a live region. Pattern (consumer responsibility):

```html
<div role="status" aria-live="polite" class="sr-only">Sorted by risk, descending.</div>
```

The component does not own the live region — it can't know what other surfaces (e.g. ClientGrid) re-sort in response. Document this in the MDX doc-block.

### 7.4 Colour-only severity

The alert pill conveys severity (`high` vs `medium`) via colour. The textual `aria-label` of the cell carries the same information; this is sufficient. The pill text itself is the count, not the severity word — a sighted user reads "3" + colour; an SR user gets "3 alerts" plus the band word in the aria-label.

### 7.5 Focus ring

Same contract as other ui-components: 2px `--color-action-primary` outline, 2px offset, `:focus-visible` only.

---

## §8 Acceptance criteria

1. **Pixel match** — Default story renders within 4px of Demo C §2's `.cs-posture` block.
2. **Configurability** — `ManyClients` story (30 entries) wraps to multiple rows without re-implementing layout.
3. **Token compliance** — token-lint clean.
4. **A11y** — axe-core clean across all stories; SR walkthrough recorded.
5. **Storybook** — 10 stories present.
6. **Composes with Gauge** — consumes `core/Gauge` without internal Gauge implementation.

---

## §9 Open questions

- **Q1** — When the sort affordance is hidden (`onSortChange` not provided), should the heading become a plain `<h3>` or stay flanked by an empty right column for layout consistency? **Recommend**: collapse the heading row to just the heading; layout looks deliberate.
- **Q2** — Cell click target: the whole cell, or just the gauge body? Whole-cell is more discoverable; the alert pill nested inside complicates `e.stopPropagation()` semantics. **Recommend**: whole-cell button; alert pill is purely visual, no separate click handler. If product needs pill-specific clicks later, add `onAlertClick?` then.
- **Q3** — Mobile (≤ 480px). The 72px-min cell width breaks below 480px — strip becomes 4 cells visible + horizontal scroll. Is horizontal scroll acceptable or should we collapse to a vertical list? **Recommend**: horizontal-scroll the strip on mobile (deliberate — it's a "scan across" device, not a primary input). Add `scroll-snap-type: x mandatory` so each cell snaps. ClientGrid handles the primary-input role on mobile.
