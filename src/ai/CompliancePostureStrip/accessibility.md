# CompliancePostureStrip — accessibility

A horizontal strip of N client posture indicators — modelled as a **list of summary statistics**, NOT a chart.

## Markup

- The strip is a `<section>` with `aria-labelledby` pointing at the heading (`bare={false}`) or no landmark when `bare={true}`.
- The data lives in a `<ul role="list" aria-label="Client posture summary">`.
- Each cell content is wrapped in a `<div role="img" aria-label="…">` carrying a single structured statement per client (G4 REFINE 3.2). This avoids the "12 gauges + 12 names + 12 residuals + 12 pills" announcement explosion of a naïve inner-element a11y approach.
- Per-cell sentence: `"{name}: residual {N} out of 100, {band} band[, {count} {sev}-severity alert(s)]."`. Bands: `very-high` (≥70), `high` (≥40), `medium` (≥20), `low` (≥10), `very-low` otherwise.
- When `onClick` is supplied per-client, the cell is additionally wrapped in a `<button>` whose `aria-label` supersedes (the same sentence + `" Activate to open."`). The button is the SR's entry point; the nested `role="img"` becomes effectively redundant for AT walks.

## Sort affordance

- When `onSortChange` is wired, the sort affordance is a native `<select>` with `aria-label="Sort clients"`. Native selects inherit OS-level keyboard + AT support — no custom disclosure pattern needed. (v2.1.1 G4 FU-7 / CPS-1: the select carries `appearance-none` + `pr-3` + the same focus-visible chain as the cells, so Safari and the Chromium themes that would otherwise override our outline with the UA focus ring now render the canonical 2px `--color-action-primary` ring instead.)
- The component does **not** own the sort-change live region. Consumers should mount a `role="status" aria-live="polite"` element nearby and update it on `onSortChange`. See the `WithLiveSortAndAnnouncer` story for reference wiring.

## Colour-only contracts

- Alert pill text carries the band word (`3 high` / `1 med`) — colour is reinforcement, not the sole channel.
- The gauge fill colour reinforces the residual numeric beneath it — colour-blind users get the number.
- The cell's `aria-label` carries the band word explicitly — SR users never depend on the gauge fill.

## Focus

- Cells with `onClick` are focusable in DOM order.
- Focus ring: 2px `--color-action-primary` outline, 2px offset, `:focus-visible` only — matches the library-wide focus contract.
- The strip does not trap focus or implement roving tabindex; users tab from cell to cell as normal list items would. This is appropriate for ≤30 entries; if a consumer routinely renders 100+ clients, prefer a grid wrapper that opts into roving tabindex.

## Loading

- The skeleton state renders `<div role="presentation" aria-hidden="true">` cells; AT skips the loading block entirely.
- `motion-reduce:animate-none` honours `prefers-reduced-motion`.

## Don't

- Don't expose the strip as a chart (`role="figure"` / `role="img"` on the whole strip). It is a list of summary stats; AT users navigate it via list semantics.
- Don't add per-pill click handlers — pill clicks duplicate the cell-click target with a smaller hit area; the spec deliberately defers an `onAlertClick?` until product demand surfaces (§9 Q2).
- Don't substitute an icon for the band word in the pill — colour-only severity is the failure mode REFINE 3.1 corrects.

## Verified

- axe-core clean on Default, Interactive, Loading, Empty, SortedByRisk stories (manual run during implementation; Sarah G5 to re-baseline in Chromatic regression sweep).
- Nested `role="img"` inside `<button>` is intentional per spec §7.1; modern AT (NVDA 2024.1, VoiceOver macOS 14, JAWS 2024) report only the button's accessible name.
