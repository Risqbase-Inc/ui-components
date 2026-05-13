# BRIEF-401 — RisqBase Design System: implementation audit + value-selection pass

**Document ID:** GOV-DS-2026-02-IMPL-AUDIT-001
**Date:** 2026-05-13
**Author:** G4 (Design)
**Implementer (Phase 1 + Phase 2):** Claude Design (Figma-enabled Claude instance — design tool with code access; produces artefacts, does **not** push to GitHub)
**Implementer (Phase 3):** Claude Code (CLI agent with shell + `gh` + git push, runs in a clone of `Risqbase-Inc/ui-components`)
**Scope:** Audit what v4.1.1 + v4.2 + v4.2.1 have shipped against the spec; produce the artefacts that complete the deferred value-selection work; hand off cleanly to Claude Code for PR landing.
**Out of scope:** New components, new patterns, new chart types, new glossary terms, IRIS-specific anything (see §7.2).
**Time box:** 5 working days. P0 substrate (palette generation) is the long pole; everything else parallelises.

---

## 0. The two-agent split

This brief commissions work across two Claude instances with different capabilities. Understanding the split is critical to the brief's structure.

| | Claude Design | Claude Code |
|---|---|---|
| **Read repo** | ✅ public ui-components, file-import into project | ✅ full clone, all branches |
| **Read spec + token JSON** | ✅ | ✅ |
| **Run shell, build, lint** | ❌ | ✅ |
| **Author HTML / CSS / SVG / JS / JSX** | ✅ (specialty) | ✅ |
| **Author Markdown reports + JSON token fragments** | ✅ | ✅ |
| **Build React + JSX prototypes with tweak panels** | ✅ (specialty) | ❌ in this environment |
| **Export PPTX / PDF / standalone HTML** | ✅ (specialty) | ❌ |
| **Multi-option design-canvas exploration** | ✅ (specialty) | ❌ |
| **Compute AA contrast in-line (via CSS / JS in a prototype)** | ✅ | ✅ |
| **Reach into Figma directly** | ❌ (no Figma connector here) | ❌ (file-system only) |
| **Push to GitHub / open PRs / run `npm publish`** | ❌ | ✅ (specialty) |

**Implication:** Claude Design produces **artefacts**. Claude Code reads those artefacts and runs the git plumbing. The handoff is a small set of files Claude Design emits, plus a paste-ready prompt that tells Claude Code exactly which files to drop where.

---

## 1. Reading order (60 seconds)

1. `docs/design-system/v4.2/spec.md` — the contract. ~2,400 lines after v4.2.1.
2. `docs/design-system/v4.2.1/v4.2.1-COMPLETE.md` — supplementary spec amendments + outstanding handoffs. Contains the explicit list of 38 TBD primitives and the dark/HC/print value-selection scope.
3. This brief in full.
4. Each section below specifies *what to check*, *where to look*, *how to fix*, *how to verify*. Follow the order; later sections depend on earlier ones.

The audit is **read everything first, write nothing until you've finished reading**. Premature edits create churn.

---

## 2. State-of-play — what's already shipped

### 2.1 Code

| Domain | Path | State |
|---|---|---|
| Core components | `src/core/{Button, Header, Footer, Badge, SectionEyebrow}/` | 5 components, light mode |
| Theming | `src/core/theme/` | `setTheme(mode)`, SSR-safe `themeInitScript`, `THEME_STORAGE_KEY`, `Theme` type alias |
| Tokens | `tokens/{primitive,semantic,component,themes}/` | 241 entries enumerated; 56 with values; 38 marked `TBD — Claude Design 2026-05-11`; 40+ v4.3 reserved names |
| Build | `tools/tokens-build/index.js`, `tsup.config.ts` | Style Dictionary → 4 artefacts; tsup → CJS + ESM + DTS |
| Theme overrides | `tokens/themes/{dark,hc}.json` | Empty stubs; no `print.json` yet |

### 2.2 Spec

- v4.2 (7 May 2026): the contract. Colour, typography, spacing, motion, IRIS visual identity, components (§7), data-viz (§8), voice & content (§10), tokens (§15), governance (§18), patterns (§20).
- v4.2.1 (11 May 2026): 14 amendments across §8 (chart taxonomy 28 types + decision matrix + library pin + print variants + composite recipes), §10 (number formatting + glossary 84 terms), §15 (token enumeration 241 + Figma `$extensions` key), §16, §17, §18, §20, §23.

### 2.3 Outstanding work this brief closes

| Gap | Owner before | Owner now |
|---|---|---|
| Hex values for 38 TBD chart-domain primitives | Deferred to Claude Design (per impl-plan §5.2) | **Claude Design (Phase 2.1)** |
| Dark mode override values across ~30 role tokens | G4 in S4 per impl-plan | **Claude Design (Phase 2.2)** |
| HC (forced-colors) mode override values | G4 in S4 | **Claude Design (Phase 2.3)** |
| `tokens/themes/print.json` value population | Deferred to v4.3 originally; now in scope | **Claude Design (Phase 2.4)** |
| Component implementation drift (no `gray-*`, no bare hex, no `blue-*`) | Standing rule; ad-hoc enforcement | **Claude Design audit (Phase 1.3); Claude Code remediation (Phase 3)** |
| Existing semantic + component tokens missing `scopes[]` per v4.2.1 A7 | New contract just landed | **Claude Design (Phase 2.5)** |
| Figma library publish / sync | S5 of impl-plan | **Audit-only this brief; sync deferred** |

---

## 3. Phase 1 — Audit (Claude Design, ~1.5 days)

The audit produces a single deliverable: **`artefacts/2026-05-13-implementation-audit.md`** — a structured Markdown report graded against the spec. **Author this file before any value-selection.** The audit drives Phase 2 priorities.

Format the audit as plain Markdown with structured tables — Claude Code will land it verbatim in Phase 3.

### 3.1 Token tree audit

For each token in `tokens/**/*.json` verify:

- ☐ `$value` is present and not `TBD` (or, if `TBD`, the entry is in your Phase 2.1 backlog)
- ☐ `$type` matches the W3C type
- ☐ `$description` exists, ≤ 60 chars, sentence case, no trailing period
- ☐ `$extensions.com.risqbase.role` is one of `primitive` / `semantic` / `component`
- ☐ Semantic tokens use the `{...}` alias syntax (no bare hex)
- ☐ Component tokens alias semantic tokens (flag direct-primitive aliases as exceptions)
- ☐ `$extensions.com.risqbase.figma` carries `{ collection, mode, variable }` *(current shape)* — flag if `scopes[]` is missing per v4.2.1 A7's spec change at §15.1

**Output format:** table with one row per token, columns: `path | $value | $type | $description | role | figma.scopes | verdict | note`.

### 3.2 AA-contrast verification

For each `color.*` semantic token resolving to foreground / surface / border:

- Compute WCAG 2.2 contrast against the declared `contrastPair` (or inferred from §15.4)
- Required: body text **≥ 4.5:1**; large text **≥ 3:1**; non-text **≥ 3:1**; risk-band + label combinations **≥ 4.5:1**

**Method (Claude Design's strength):** build a small React prototype with each semantic-foreground × surface pair rendered as a swatch + computed ratio. Embed contrast computation via `chroma-js` or a hand-rolled WCAG formula in JS. Output the prototype as a standalone HTML file (`artefacts/contrast-verification.html`) alongside the audit table.

**Output table:** `token | pair | ratio | required | PASS/FAIL | suggested fix`.

### 3.3 Component audit against spec §7

For each shipped component (`Button`, `Header`, `Footer`, `Badge`, `SectionEyebrow`):

- ☐ `grep -nE '#[0-9A-Fa-f]{3,6}' src/core/<Component>/*.tsx` returns zero (no bare hex)
- ☐ `grep -nE 'blue-(500|600)|gray-' src/core/<Component>/*.tsx` returns zero (prohibited tokens)
- ☐ Component reads role tokens via Tailwind arbitrary values (`bg-[var(--color-action-primary)]`)
- ☐ Colocated `<Component>.accessibility.md` exists and is non-empty
- ☐ Colocated `<Component>.tokens.md` exists and names every token consumed
- ☐ Component exported from both `src/core/index.ts` and root `src/index.ts`
- ☐ React types: no `any`, no implicit `unknown`
- ☐ Renders correctly under `data-theme="light"` (per current Storybook / Sandpack)
- ☐ Honours density tokens where applicable

**Claude Design can't `grep` directly in a shell**, but can:
- Read the file content via import-from-public-repo
- Run the regex check in a JS snippet in a prototype
- Or report the file contents and let Claude Code run the actual grep in Phase 3

For each component: produce a per-row PASS / FLAG table with specific spec lines violated.

### 3.4 Figma library audit (read-only)

Claude Design **cannot reach into Figma directly** (no Figma connector in this environment). Two options:

**Option A — user provides Figma export.** Ask the user to export the Figma library state as a JSON snapshot (Figma Variables REST API supports `GET /v1/files/:fileKey/variables/local`). Claude Design reads the snapshot and diffs it against `tokens/**/*.json`.

**Option B — defer the Figma audit to Phase 3.** Claude Code runs the Figma REST API call against the live library, produces the diff report, and Claude Design's audit document carries a placeholder section that Phase 3 fills in.

**Choose Option A if the user can export within the audit window; Option B otherwise.** In either case the audit document has a "Figma library audit" section with the bi-directional diff: `variable path | exists in JSON? | exists in Figma? | mode coverage | scope correctness | action`.

### 3.5 Cross-consumer audit (RALIA, marketing, Cortex)

Claude Design has read access to public GitHub repos. The three consumers:

- `Risqbase-Inc/Ralia` — may be private; if Claude Design cannot read it, defer to Phase 3
- `Risqbase-Inc/RisqBase` — marketing site
- `Risqbase-Inc/internal-tools` (Cortex) — private; defer to Phase 3

For each accessible consumer:

- Grep for component-name shadowing (a local `<Header>` / `<Footer>` / `<Button>` / `<Badge>` / `<SectionEyebrow>` that bypasses the package)
- Check `package.json` for the consumed version of `@risqbase-inc/ui-components`
- Flag drift against the latest published version

**Output:** consumer × component matrix.

Where Claude Design can't read a private consumer, the row is flagged "DEFERRED to Phase 3" — Claude Code completes that section.

### 3.6 Visual-regression baseline audit

Claude Design cannot reach Chromatic directly. Defer to Phase 3 — Claude Code queries Chromatic's API and reports baseline freshness. Audit document carries the section as a placeholder.

---

## 4. Phase 2 — Value-selection + design canvas (Claude Design, ~2.5 days)

Each sub-task produces **artefacts** in well-defined file shapes. Claude Code will land them verbatim. The artefact filenames + paths in this section are the canonical handoff contract.

### 4.1 Hex value selection for 38 TBD primitive chart-domain ramps

**Artefacts:**

1. **`artefacts/tokens-primitive-color-chart.json`** — full replacement JSON file ready to drop into `tokens/primitive/color-chart.json`. Same shape as the current TBD file but every `$value` populated with a real hex.
2. **`artefacts/palette-rationale.md`** — Markdown document explaining each of the 5 ramps' hue family, OKLCH coordinates per stop, AA verification per stop, and rejected alternative palettes (at least 2 rejects per ramp).
3. **`artefacts/palette-swatches.html`** — standalone HTML page rendering all 38 hex values as labelled swatches with contrast checkers built in. This is Claude Design's home-turf deliverable; iterate in the design-canvas as much as needed before locking.
4. **(Optional, recommended) `artefacts/palette-explorations.html`** — multi-option side-by-side canvas showing 2–3 candidate directions per ramp **before** locking. User picks; Claude Design ships the locked picks into (1) and (2).

**Token paths to populate (all 38 currently TBD):**

- `color.palette.risk.{50, 100, 200, 300, 400, 500, 600, 700, 800, 900}` — 10
- `color.palette.financial.{50..900}` — 10
- `color.palette.operational.{50..900}` — 10
- `color.palette.diverging-warm.{n4, n3, p3, p4}` — 4
- `color.palette.diverging-cool.{n4, n3, p3, p4}` — 4

**Selection constraints:**

- **Perceptually equal-stepped in OKLCH** (or equivalent perceptual space). Not sRGB equal steps.
- **Lightness anchors:** L*≈ 97 (stop 50) → L*≈ 18 (stop 900). Chroma starts low, peaks ~stop 500–600, drops at darkest.
- **Hue family per ramp** (so each ramp is visually distinct at a glance):
  - **Risk:** cool-to-warm progression — teal-blue (low) → neutral (mid) → deep red (high). Maps to "low risk → high risk".
  - **Financial:** monochromatic emerald → forest → deep evergreen. Maps to "value increases".
  - **Operational:** monochromatic indigo → midnight. Maps to "throughput / capacity" — neutral, no risk-band overload.
  - **Diverging-warm extensions:** n4 / p4 must have ≥ 7:1 contrast against `color.surface.default`.
  - **Diverging-cool extensions:** same constraint.
- **Brand discipline:** the risk ramp's mid-tones must not collide with the existing `color.palette.amber.500` / `orange.500` (those are reserved for the band semantic). Stay within the perceptually distinct hue family.

**Per-stop verification (all 38):**

| Stop | Used as | Required contrast (against `color.neutral.white`) |
|---|---|---|
| 50–200 | Background fill | 3:1 (mark differentiation) |
| 300–500 | Mid-tone fill / text on light fill | 4.5:1 if used as text; 3:1 if mark fill only |
| 600–700 | Canonical "main" stop / text-on-light | **4.5:1 minimum** |
| 800–900 | Darkest fill / text-on-light at large sizes | **7:1 (AAA preferred for compliance product)** |

**Artefact format:** `tokens-primitive-color-chart.json` must be byte-for-byte droppable in place of the current TBD file. Validate it parses as JSON before emitting.

### 4.2 Dark mode override values

**Artefacts:**

1. **`artefacts/tokens-themes-dark.json`** — full replacement for `tokens/themes/dark.json`. Currently the file is an empty stub with a comment header; the replacement has the comment header preserved + ~30 override entries.
2. **`artefacts/dark-mode-rationale.md`** — design rationale for the surface anchors, text anchors, action-brand brightening, and risk-band re-mapping.
3. **`artefacts/dark-mode-canvas.html`** — side-by-side light vs dark rendering of each shipped component + every band / risk / chart-state combination, with the same AA contrast checker built in.

**Tokens to override (~30 canonical entries):**

```
color.surface.{default, subtle, muted, inverse}                          # 4
color.text.{default, subtle, on-action, on-inverse, on-inverse-subtle}   # 5
color.border.{default, subtle, inverse, focus}                           # 4
color.action.{primary, primary-hover, primary-subtle}                    # 3
color.chart.{axis, gridline, plot-area-bg, legend-bg, tooltip-surface, tooltip-border, tooltip-text}  # 7
color.band.{very-low, low, medium, high, very-high}.{bg, border, text, icon}   # 20 (full grid)
color.gauge.{track, arc-teal, arc-indigo, arc-stone}                     # 4 (extend per §15.6.4 grid if shipping the full 16)
```

**Selection constraints:**

- **Surfaces:** `oklch(L*≈18..22)` — never pure black `#000` (causes halation).
- **Text:** stone-100 to stone-300 range — never pure white `#fff` for body text. Reserve `#fff` for high-emphasis headlines only.
- **Action / brand:** indigo brightens to indigo-400 / indigo-500 in dark mode; indigo-600 (light-mode primary) reads as too saturated against dark surfaces.
- **Risk-band & chart palettes:** same hue family as light, adjusted lightness so the band semantic still reads. A high-risk red shifts from `#DC2626` (light) to `#F87171` (dark) — same semantic, different lightness.
- **Contrast pairs swap:** every `contrastPair` declaration that points to `color.surface.default` resolves to the dark surface in this mode. Re-verify AA against the dark `color.surface.default`.

**Honour the existing JSON shape:** the empty stub at `tokens/themes/dark.json` shows the override-only rule + comment header. Preserve the comment header in the output.

### 4.3 HC (forced-colors) mode override values

**Artefacts:**

1. **`artefacts/tokens-themes-hc.json`** — full replacement for `tokens/themes/hc.json`.
2. **`artefacts/hc-mode-rationale.md`** — short doc explaining the CSS system-colour mapping per token.

**Selection constraints:**

HC mode honours the OS-supplied forced-colors palette. Overrides ensure mark differentiation when the OS overrides everything to system colours.

- Surfaces: `CanvasText` (foreground) / `Canvas` (background) / `Highlight` (selection / focus) / `LinkText` (links) / `ButtonFace` + `ButtonText` (actions)
- Marks differentiate via **shape / dash / pattern only** (per §8.5.4 + §8.16.2–4) — colour is unreliable
- Borders: `CanvasText` at 1–2px
- Focus rings: `Highlight` at 2–3px outset

Use **CSS system colour keywords as string values** — not hex. Example entry:

```json
"surface": {
  "default": {
    "$value": "Canvas",
    "$type": "color",
    "$description": "Forced-colors surface (OS-supplied background)",
    "$extensions": { "com.risqbase.role": "semantic" }
  }
}
```

Many tokens collapse to the same system keyword — this file is shorter than `dark.json`.

### 4.4 Print mode override values + pattern-fill assets

**Artefacts:**

1. **`artefacts/tokens-themes-print.json`** — new file (does not exist on disk yet).
2. **`artefacts/tokens-component-print-patterns.json`** — new file for the 4 SVG pattern-fill assets per §8.16.2.
3. **`artefacts/print-rationale.md`** — design rationale.

**Print constraints (per §8.16):**

- Surfaces: pure white `#FFFFFF`. No off-whites.
- Text: 80% black `#333333` (body), 100% black (headlines), 60% black `#999999` (subtle).
- Borders: 30% black `#B3B3B3` (default), 80% black (emphasised).
- Chart fills: greyscale luminance fallback; pattern fills take over via the 4 new pattern-fill tokens.

**New pattern-fill tokens** (in `tokens-component-print-patterns.json`):

- `pattern.print.1` — solid 80% black `<rect>` SVG data-URI
- `pattern.print.2` — cross-hatch 45° pattern (3px stroke, 6px spacing)
- `pattern.print.3` — dotted pattern (2px dot, 4px spacing)
- `pattern.print.4` — diagonal hatch 30° pattern (2px stroke, 8px spacing)

Each as a `$type: "asset"` token with the SVG data-URI as `$value`. Document the role binding in `$extensions.com.risqbase.role`.

### 4.5 `scopes[]` audit + patch for existing semantic + component tokens

Per v4.2.1 A7 (§15.1), every semantic-tier and component-tier token must carry `scopes[]` in its `com.risqbase.figma` extension. Existing tokens (authored before A7) have the shape `{ collection, mode, variable }` — missing scopes.

**Artefact:** `artefacts/tokens-scopes-patch.json` — a JSON patch (RFC 6902 format) or a side-car file with `path → { scopes: [...] }` entries. Claude Code applies the patch in Phase 3.

**Inferred-scopes table** (use these defaults; flag exceptions in the rationale):

| `$type` | Role pattern | Default scopes |
|---|---|---|
| `color` | text role | `["TEXT_FILL"]` |
| `color` | surface role | `["ALL_FILLS", "FRAME_FILL", "SHAPE_FILL"]` |
| `color` | border role | `["STROKE_COLOR"]` |
| `color` | icon / glyph | `["TEXT_FILL", "SHAPE_FILL"]` |
| `color` | chart mark | `["SHAPE_FILL"]` |
| `dimension` | spacing | `["GAP", "PARAGRAPH_SPACING"]` |
| `dimension` | size | `["WIDTH_HEIGHT"]` |
| `dimension` | radius | `["EFFECT_FLOAT"]` (Figma corner-radius scope) |
| `dimension` | stroke | `["STROKE_FLOAT"]` |
| `dimension` | font-size | `["FONT_SIZE"]` |
| `duration` | — | omit (not picker-eligible in Figma) |

Where a token applies in multiple scopes (e.g., `color.brand.indigo.600` is action surface AND logo fill AND text-on-light), use the union — but err toward fewer scopes. Over-broad scoping defeats the constraint.

### 4.6 (Recommended) Design rationale deck

**Artefact (optional but high-leverage):** `artefacts/BRIEF-401-design-rationale.pptx` — 15–25 slides covering:

- 1 cover slide
- 1 "state of the system" slide (what shipped in v4.1.1 / v4.2 / v4.2.1)
- 5 slides — one per chart-domain ramp (risk, financial, operational, diverging-warm, diverging-cool) with the OKLCH curve, the rejected alternatives, and the AA verification matrix
- 5 slides — dark mode (surface anchors, text anchors, action brightening, risk-band re-mapping, chart container)
- 2 slides — HC mode (mapping logic + sample renders)
- 3 slides — print mode (greyscale + pattern fills + per-chart-type encoding samples)
- 1 slide — `scopes[]` patch summary
- 1 closing slide — "what's still owed after this brief" (links to outstanding handoffs in v4.2.1-COMPLETE.md)

Use Claude Design's PPTX export. This deck is the artefact reviewers (CEO, G1, G4 internal) will read before approving the value pass.

---

## 5. Phase 3 — Handoff to Claude Code (~0.5 day)

After Claude Design emits all the artefacts above, the user opens **Claude Code in a clone of `Risqbase-Inc/ui-components`** and pastes the prompt below. Claude Code does the git plumbing.

### 5.1 Paste-ready Claude Code prompt

```
You are working in a clone of Risqbase-Inc/ui-components on main. Artefacts
from BRIEF-401 (Claude Design value-selection pass) are in ./artefacts/.

Land each as its own PR per the conventional commit shape:

1. Move ./artefacts/tokens-primitive-color-chart.json to
   tokens/primitive/color-chart.json (replace). Commit:
     "feat(tokens): populate 38 chart-domain primitive hex values (BRIEF-401)"
   PR body cites palette-rationale.md from artefacts and the AA verification
   table. Branch: claude-design/brief-401-chart-primitives.

2. Move ./artefacts/tokens-themes-dark.json to tokens/themes/dark.json (replace).
   Commit:
     "feat(tokens): populate dark-mode override values (BRIEF-401)"
   Branch: claude-design/brief-401-dark-overrides.

3. Move ./artefacts/tokens-themes-hc.json to tokens/themes/hc.json (replace).
   Commit:
     "feat(tokens): populate HC forced-colors override values (BRIEF-401)"
   Branch: claude-design/brief-401-hc-overrides.

4. Move ./artefacts/tokens-themes-print.json to tokens/themes/print.json
   (new file). Move ./artefacts/tokens-component-print-patterns.json to
   tokens/component/print-patterns.json (new file). Commit:
     "feat(tokens): populate print theme + add print pattern-fill assets (BRIEF-401)"
   Branch: claude-design/brief-401-print-tokens.

5. Apply ./artefacts/tokens-scopes-patch.json to every semantic + component
   token file: add the scopes[] field to each entry's com.risqbase.figma
   extension per the patch. Commit:
     "feat(tokens): add scopes[] to semantic + component figma extensions (BRIEF-401)"
   Branch: claude-design/brief-401-scopes-patch.

6. Move ./artefacts/2026-05-13-implementation-audit.md to
   docs/audits/2026-05-13-implementation-audit.md. Commit:
     "docs(audits): land BRIEF-401 implementation audit (Claude Design)"
   Branch: claude-design/brief-401-audit-doc.

For each PR:
- Run `npm run lint:tokens && npm run build:tokens` before commit. If lint or
  build fails, surface the error and stop — do not push a broken token tree.
- PR body includes the relevant rationale (palette-rationale.md / dark-mode-
  rationale.md / hc-mode-rationale.md / print-rationale.md) inline.
- After all 6 PRs land, open a 7th summary PR titled
  "chore(design-system): close BRIEF-401 implementation audit + value pass"
  that updates docs/design-system/v4.2.1/v4.2.1-COMPLETE.md "Outstanding
  handoffs" section: tick off "Claude Design value-selection", "dark + HC
  overrides", "print theme values", "scopes[] migration".

Branch from main. Report back with the 7 PR URLs.
```

### 5.2 What Claude Code does NOT do in Phase 3

- Does not re-design any values. If a value looks wrong, it asks the user, not Claude Design.
- Does not run `npm publish`. The package version bump is a separate decision.
- Does not push to Figma. That's S5 of the impl programme.
- Does not regenerate Chromatic baselines. That's S5.
- Does not migrate consumers. That's S6.

---

## 6. Acceptance criteria — verifiable

The brief is **complete** when every line below is verifiable:

- [ ] `docs/audits/2026-05-13-implementation-audit.md` exists with per-section findings (PASS / FLAG / FAIL with notes for: token tree, AA contrast verification, components, Figma diff or deferral note, consumers, visual regression)
- [ ] All 38 TBD entries in `tokens/primitive/color-chart.json` carry real hex values; no `TBD` string remains anywhere in `tokens/**/*.json`
- [ ] `tokens/themes/dark.json` populated with ~30 override entries; `npm run build:tokens` emits a non-empty `[data-theme="dark"]` block in `dist/tokens.css`
- [ ] `tokens/themes/hc.json` populated; uses CSS system colour keywords
- [ ] `tokens/themes/print.json` exists and is populated
- [ ] `tokens/component/print-patterns.json` exists with 4 pattern-fill SVG data-URI tokens
- [ ] Every entry in `tokens/{semantic,component}/**/*.json` carries `scopes[]` in `com.risqbase.figma`
- [ ] AA contrast verification table in the audit shows zero FAILs against `contrastPair` declarations + inferred pairs
- [ ] `npm run build:tokens && npm run build` pass clean
- [ ] 6 (or 7 with summary) PRs opened against `Risqbase-Inc/ui-components` `main`
- [ ] `docs/design-system/v4.2.1/v4.2.1-COMPLETE.md` "Outstanding handoffs" section updated to reflect the closed items

---

## 7. Constraints (read these twice)

### 7.1 Brand

- **Primary:** `#4F46E5` (indigo-600). Logos, CTAs, primary buttons, links. Never violate.
- **Prohibited Tailwind tokens:** `blue-500`, `blue-600`, `gray-*`. CI-failable.
- **Typography:** Geist Sans + system fallback. No new fonts in this brief.
- **Discipline:** if you're tempted to pick a "more interesting" hex than the existing palette dictates, you're outside scope. Surface the proposal to G4 as a follow-up brief.

### 7.2 IRIS-specific is RALIA-private — **not in scope here**

The system catalogues generic AI pattern primitives (`ai/Citation Chip`, `ai/StreamingText`, `ai/PromptChip`). These are public. The IRIS character — the "I" lettermark, the IRIS gradient, the conversation-memory shape, `<IrisFab>`, `<IrisPanel>`, IRIS-specific thinking-state animation curves, IRIS personality colours — lives in `Risqbase-Inc/Ralia` and is **out of scope for this brief**.

If you encounter a token whose name implies IRIS specificity (e.g., a hypothetical `color.iris.lettermark-gradient-stop-1`), flag it in the audit as "scope error — should not exist in this repo" and do **not** create or value-fill it.

### 7.3 Sources only

Every colour, dash style, pattern fill, contrast threshold in this brief is from a public source. Cite them in your rationale documents:

- WCAG 2.2 — contrast minima
- Datawrapper — single-hue sequential ramp guidance
- ColorBrewer — diverging ramp stop counts + luminance equal-stepping
- IBM Carbon — chart categorical 8-colour set, dark palette inspiration
- Apple HIG, Polaris, Carbon — UI noun vocabulary (already absorbed into §10.6)
- NIST AI RMF — observability / telemetry colour role vocabulary
- IEEE diagram conventions — shape and dash series cycling

If you reach for a source not on this list, document the reach in the rationale doc. World-class systems are honest about their sources.

### 7.4 No new components, no new patterns

Audit + value-pass only. If during the audit you identify a missing component or pattern, append it to `artefacts/BRIEF-401-follow-ups.md` rather than implementing it. Discipline keeps this brief tractable.

---

## 8. Sources of truth (file paths)

| What | Where |
|---|---|
| The contract | `docs/design-system/v4.2/spec.md` (~2,400 lines after v4.2.1) |
| v4.2.1 closure + resolution log + outstanding-handoffs | `docs/design-system/v4.2.1/v4.2.1-COMPLETE.md` |
| Implementation plan | `docs/design-system/v4.2/implementation-plan.md` |
| Token JSON | `tokens/**/*.json` (14 files, 241 entries) |
| Component source | `src/core/<Component>/{index.tsx, types.ts, tokens.md, accessibility.md}` |
| Theming primitives | `src/core/theme/index.ts` |
| Token-build pipeline | `tools/tokens-build/{index.js, lint.js}` |

---

## 9. Deliverable handoff manifest

Claude Design emits these files (or marks them as deferred to Phase 3):

```
artefacts/
├── 2026-05-13-implementation-audit.md          # Phase 1 deliverable
├── contrast-verification.html                  # Phase 1.2 prototype
├── tokens-primitive-color-chart.json           # Phase 2.1
├── palette-rationale.md                        # Phase 2.1
├── palette-swatches.html                       # Phase 2.1
├── palette-explorations.html                   # Phase 2.1 (optional, recommended)
├── tokens-themes-dark.json                     # Phase 2.2
├── dark-mode-rationale.md                      # Phase 2.2
├── dark-mode-canvas.html                       # Phase 2.2
├── tokens-themes-hc.json                       # Phase 2.3
├── hc-mode-rationale.md                        # Phase 2.3
├── tokens-themes-print.json                    # Phase 2.4
├── tokens-component-print-patterns.json        # Phase 2.4
├── print-rationale.md                          # Phase 2.4
├── tokens-scopes-patch.json                    # Phase 2.5
├── BRIEF-401-design-rationale.pptx             # Phase 2.6 (recommended)
└── BRIEF-401-follow-ups.md                     # if any new scope surfaced
```

User downloads the artefacts bundle (e.g., as a ZIP), drops into `~/Code/ui-components/artefacts/`, opens Claude Code, pastes the prompt from §5.1.

---

## 10. Definition of done — "world-class"

This brief is complete when a reviewer who reads `spec.md` cold and then opens:

- the Figma library
- the JSON token tree
- the rendered components in Storybook at all three modes
- the print preview of an exported dashboard

…sees **the same system from every angle**. No surface contradicts another. No token is unbacked by a source citation. No component reaches past the token system to invent a colour. Every claim in the spec is verifiable in the artefact.

That's the bar.

---

**Open the spec. Read this brief twice. Run the audit before touching a value.**

— G4 (Design), 2026-05-13
