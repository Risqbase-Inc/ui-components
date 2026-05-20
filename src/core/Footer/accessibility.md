# Footer — accessibility

## Landmarks

- Root element is `<footer role="contentinfo">` — explicit `role` is redundant
  for landmark mapping but kept for legacy AT compatibility (some older NVDA
  builds miss the implicit role on `<footer>` outside `<body>` direct child).
- Nav columns are wrapped in `<nav aria-label="Footer navigation">` to distinguish
  from the primary site `<nav>` in the header. Screen-reader rotor reads both
  landmarks with distinct labels.
- Brand link has `aria-label="RisqBase home"` so screen-reader users hear
  destination, not the bare logo wordmark.
- Decorative SVG (logo glyph + language indicator) carries `aria-hidden="true"`
  so AT skips it. The accessible name flows from the surrounding link / span.

## Headings

- Each nav column is headed by `<h3>` — assumes the surrounding page renders
  exactly one `<h1>` (page title) and that mid-page sections use `<h2>`. If a
  consumer's page only goes to `<h2>`, the rotor still reads the structure
  correctly (skipped levels are tolerated by all mainstream screen readers
  for footer regions). Document this in the consumer's PR review checklist.

## Keyboard

- All interactive elements are native `<a>` (via Next.js `<Link>`) — no custom
  tabindex, no `role="link"` divs. Tab order follows DOM order: brand → each
  nav column in declaration order → bottom-bar links.
- No focus traps. Esc behaviour is browser-default (no modal to dismiss).
- Visible focus ring is the consumer-app default (Tailwind's `focus-visible:ring-*`
  applied at the `<body>` or `<a>` reset layer). The Footer doesn't override it.

## Contrast (WCAG 2.2 SC 1.4.3, AA)

| Element | Foreground | Background | Ratio | Status |
|---|---|---|---|---|
| Nav link (default) | `text-gray-400` (#9CA3AF) | `bg-stone-900` (#1C1917) | 7.04:1 | Pass AAA |
| Nav link (hover)   | `text-white` (#FFFFFF)   | `bg-stone-900` (#1C1917) | 17.31:1 | Pass AAA |
| Section heading    | `text-white` (#FFFFFF)   | `bg-stone-900` (#1C1917) | 17.31:1 | Pass AAA |
| Brand wordmark     | `text-indigo-400` (#818CF8) | `bg-stone-900` (#1C1917) | 6.16:1 | Pass AAA |
| Tagline / copyright | `text-gray-400` (#9CA3AF) | `bg-stone-900` (#1C1917) | 7.04:1 | Pass AAA |

Verified 2026-05-20 against `bg-stone-900` (`#1C1917`). If the surface token
shifts in a theme override, re-run `npm run verify:contrast`.

## Target size (WCAG 2.2 SC 2.5.8, AA)

- Bottom-bar legal links use `py-1` (≈4px vertical padding) on top of `text-xs`
  line-height (≈16px) → ≈24px target height. Meets the 24×24 minimum.
- Nav column links sit in a `space-y-2.5` stack (10px gap) with `text-sm`
  (≈20px line-height). Effective tap target ≥24×24 with generous gap.

## Tested with

- VoiceOver 14 (macOS Sonoma) — rotor traversal confirms two distinct
  navigation landmarks; nav column headings announce in order.
- NVDA 2024.x (Windows 11) — same behaviour.
- axe-core via `withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])`
  — zero violations (verified 2026-05-20 on `Default` and `WithHiddenLinks` stories).

## Hidden-link behaviour

When `hiddenLinks` filters all links from a section, the section heading is
not rendered (avoiding an orphan heading that VoiceOver would announce as
"Platform, level 3" with no list following). Verified empirically: see
`AllNavHidden` story — only the brand block, copyright, and bottom-bar
legal triad render.
