# 01 · ImpactGraph — Accessibility

> Companion to [01-ImpactGraph.md](../../../docs/specs/v2.1.0/01-ImpactGraph.md).
> Audience: implementing engineer; Sarah G5 (QA) SR review.
> Patterns: SVG composition with focusable nodes; structured summary; keyboard navigation.

The Impact Graph is the most accessibility-sensitive component in v2.1.0. It encodes information in three layers (centre alert, surrounding entities, labelled edges) that a sighted user parses spatially. Screen-reader users need an equivalent traversal model — not "alt text on the SVG" but a navigable representation of the graph itself.

---

## §1 Static-render path (used by MarketingImpactGraph)

When the graph is rendered without interaction (`onEntityClick` and `onAlertClick` both omitted), it is **a single image with a structured caption**. This is the marketing-frozen path and is the simplest to support.

### 1.1 Markup

```html
<figure role="figure">
  <svg
    role="img"
    aria-labelledby="ig-title-{id}"
    aria-describedby="ig-desc-{id}"
    focusable="false"
  >
    <title id="ig-title-{id}">EDPB Guidelines 04/2026 — Article 35(3)(c) narrowing</title>
    <desc id="ig-desc-{id}">
      Impact graph. Central alert: EDPB Guidelines 04/2026, very-high severity.
      14 affected entities radiate from the centre across four categories:
      5 DPIAs (very-high to medium severity), 2 ROPAs (high to medium),
      4 Vendors (high to low), 2 Training items (medium to low).
      One cascade connects vendor SecuCorp BV to the Footfall-Retail DPIA.
    </desc>
    <!-- decorative geometry follows; everything has aria-hidden="true" -->
  </svg>
  <figcaption class="sr-only" id="ig-caption-{id}">
    <!-- Visible-on-focus expanded entity list — see §1.2 -->
  </figcaption>
</figure>
```

### 1.2 Expanded entity list (visually hidden, focusable)

A `.sr-only` ordered list inside the `<figcaption>` enumerates every entity. Screen-reader users tabbing through receive the equivalent of a sighted scan around the radial layout. List ordering: clockwise from 12 o'clock, by category, then by severity descending within category.

```html
<figcaption id="ig-caption-{id}" class="sr-only">
  <p>Affected entities, clockwise from top:</p>
  <ol>
    <li>DPIA · CCTV-Acme-Lobby, residual 88, up 34 from baseline. Clause: Article 35(3)(c). Severity: very-high.</li>
    <li>DPIA · Footfall-Retail. Clause: Article 35(3)(c). Severity: very-high.</li>
    <!-- ...12 more -->
    <li>Cascade: SecuCorp BV (vendor) triggers Footfall-Retail (DPIA).</li>
  </ol>
</figcaption>
```

The list is reachable via the existing focus order but `display: contents` + class `sr-only` (clip-path zero) keeps it off-screen for sighted users. **Do not use `display: none`** — that would hide it from SR too.

---

## §2 Interactive path (used by RALIA app post-1-July)

When click handlers are provided, the graph becomes a keyboard-navigable structure. Each node becomes a focusable element with its own `aria-label`. The edges are decorative (no focus surface) but their clause label travels with the entity in the SR announcement.

### 2.1 Node markup

```html
<g role="group" aria-label="DPIA category, 5 entities">
  <a
    role="button"
    tabindex="0"
    aria-label="DPIA: CCTV-Acme-Lobby. Severity very-high. Clause: Article 35(3)(c). Residual 88, up 34. Activate to open."
    onclick="..."
    onkeydown="(Enter, Space) → activate"
  >
    <circle ...halo... aria-hidden="true" />
    <circle ...node body... aria-hidden="true" />
    <text aria-hidden="true">DPIA</text>
  </a>
  <!-- ...4 more -->
</g>
```

### 2.2 Keyboard navigation

| Key | Action |
|---|---|
| `Tab` | Enter the graph; first stop is the centre alert node |
| `Tab` (continued) | Visit category sectors in clockwise order; within a sector, entities ordered by severity descending |
| `Shift+Tab` | Reverse traversal |
| `Enter` / `Space` | Activate focused node — fires `onEntityClick(entity)` or `onAlertClick()` |
| `Esc` | If focus is inside the graph, blur to the focusable element preceding the graph |
| `ArrowRight` / `ArrowLeft` | Move within the current category sector (one node per arrow) |
| `ArrowUp` / `ArrowDown` | Move between sectors (next-clockwise / next-counter-clockwise) |

Arrow-key navigation is **a progressive enhancement** — Tab/Shift+Tab cover the baseline contract; arrow keys are nice-to-have. If implementation timeline tightens, ship Tab-only first and Sarah G5 adds arrow-key as a follow-up.

### 2.3 Focus ring

- `outline: 2px solid var(--color-action-primary)`
- `outline-offset: 4px`
- Applied to the SVG `<a>` element; transforms with the node so SVG scaling doesn't break the ring.
- Visible on `:focus-visible` only — pointer-clicking a node should not draw the ring.

### 2.4 Announcement order on focus

Order matters: severity should land before clause to match a sighted user's prioritisation.

```
"{Category}: {Name}. Severity {severity}. Clause {clauseLabel}. {annotation if present}. Activate to {open|navigate}."
```

For the centre alert:

```
"Alert: {source}. {title joined}. Severity {severity}. {N} affected entities across {M} categories. Activate to open."
```

---

## §3 Reduced-motion

The hover-pulse animation on the centre alert (interactive path only) **must respect `prefers-reduced-motion: reduce`**. Wrap in:

```css
@media (prefers-reduced-motion: no-preference) {
  .impact-graph__centre-ring--interactive { animation: pulse 1.4s ease-in-out infinite; }
}
```

No other motion in the component.

---

## §4 Colour contrast

| Surface | Min ratio | Notes |
|---|---|---|
| Centre alert text on `--color-surface-inverse` | 7:1 (AAA) | Meets v4.3 dark-substrate contract |
| Entity name on `--color-surface-default` | 4.5:1 (AA) | 10px font requires ≥4.5:1 since under 14px |
| Clause label `--color-text-subtle` on `--color-surface-default` | 4.5:1 | Verified at v4.3 token build |
| Iris badge text `--color-iris-accent-hover` on `--color-iris-surface` | 4.5:1 | Locked in v4.3 §iris-accent-on rule (PR #55) |

Edge colours (very-high through low) do **not** need to meet text contrast — they are decorative carriers of severity. The legend strip below the graph names each band in text against `--color-surface-subtle` at full contrast.

---

## §5 Test plan

1. **axe-core** — zero violations on every Storybook story.
2. **SR walkthrough (VoiceOver, NVDA)** — Sarah G5 records both. Pass criterion: a user without sight gets the same five facts a sighted user gets in the first 4 seconds (alert source, alert title, affected count, category breakdown, presence of cascade).
3. **Keyboard-only navigation** — Sarah completes the interactive story using only Tab/Shift+Tab/Enter/Esc.
4. **Reduced-motion** — system toggle on; pulse animation absent.
5. **Zoom 200%** — no horizontal scroll inside the graph card; labels remain legible (no collision regressions).
6. **Forced-colours mode** (Windows High Contrast) — graph degrades to system-colour palette; node and edge geometry remain readable. Acceptable to lose the colour-coded severity in this mode; the legend strip still names each band.
