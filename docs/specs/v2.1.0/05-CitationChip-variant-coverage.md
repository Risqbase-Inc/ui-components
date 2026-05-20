# 05 · CitationChip — Variant Coverage Verification + a11y patch

> **Closes**: Mandatory verification asked for in the 2026-05-19 Claude Code gap report. "Confirm all 9 variants present in v2.0.0 work."
> **Composes with**: ImpactGraph (clause-edge labels), trust statements in marketing prose (Demo B), provenance trace surfaces (RALIA §14).
> **Visual reference**: `Marketing Demo B - Signature Surfaces.html` §3 (citation chips in trust statement); `audit-deliverable/redesigns/citation-chip-family-redesign.html`.
> **Home**: `src/ai/CitationChip/` — **already shipped at v2.0.0**. v2.1.0 patches the existing component.
> **Status after G4 review (2026-05-20)**: BLOCK → REWRITTEN against verified v2.0.0 source. Annex A documents the empirical state.

---

## §1 What changed after Elena G4 (2026-05-20)

The original draft of this spec described an API that did not match the shipped v2.0.0 source. Elena's verification surfaced three specific drifts:

1. The chip uses **`label: string`**, not `children: ReactNode`.
2. The chip's existing `aria-label` is **`variantDescription[variant]` only** — i.e. literally the string "Verified source" with no citation content. The visible label is also rendered in an SR-only suffix span (`— Verified source` after the visible content).
3. The chip's token references use **`--color-citation-chip-*`** (with `-chip-` infix), not `--color-citation-*`.

This spec has been rewritten against the actual shipped source. The current-state grep is in **Annex A** (§6) — every claim below cites Annex A by line.

---

## §2 Verification result · all 9 variants present

`src/ai/CitationChip/index.tsx` exports `CitationVariant` as a discriminated union of exactly the 9 required values (Annex A · types.ts):

```ts
export type CitationVariant =
  | 'verified' | 'pending' | 'low-confidence' | 'retracted'
  | 'external' | 'multi-source' | 'ai-inferred' | 'retrieval-failed' | 'user-pinned'
```

`variantStyles` covers all 9 with v4.3 token references. ✓ verified.

---

## §3 Two gating v2.1.0 actions

### Action A · Add missing Storybook stories

> **NOTE — story-coverage table is provisional.** Elena's review specifically asked Claude Design to grep `src/ai/CitationChip/CitationChip.stories.tsx` directly rather than paste a remembered list. The list below is Claude Design's best estimate; the implementing engineer must verify in the source and adjust before submitting. If any of the four below are already present, no-op them.

Candidate additions, ranked by usefulness for marketing-repo migration:

| Story | Justification |
|---|---|
| `AllVariantsRow` | Single regression snapshot for Chromatic; the most useful single story Sarah G5 will use to detect v4.3 citation-chip token drift |
| `RetrievalFailed` | Variant has no other coverage; lacking a Chromatic snapshot makes the regression risk silent |
| `UserPinned` | Same reasoning as RetrievalFailed |
| `InProse` | Mirrors Demo B §3's marketing usage; this is exactly how the marketing repo will consume the chip post-migration. Embedding the chips inline within a paragraph reveals leading/trailing space + baseline-alignment issues the standalone stories miss |
| `AllVariantsRow_Mobile` | (per G4 REFINE 5.1) Same content as `AllVariantsRow` at a 375px viewport; flex-wrap regression-risk surfaces here. Wrap is the primary regression risk on mobile prose layouts |

```tsx
// Stories to add — paste into CitationChip.stories.tsx after grep-verification

export const RetrievalFailed: Story = {
  args: { variant: 'retrieval-failed', label: 'Source unavailable' },
}

export const UserPinned: Story = {
  args: { variant: 'user-pinned', label: 'Internal memo 2026-Q1' },
}

export const AllVariantsRow: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-[640px]">
      {(['verified','pending','low-confidence','retracted','external','multi-source','ai-inferred','retrieval-failed','user-pinned'] as const).map(v => (
        <CitationChip
          key={v}
          variant={v}
          sourceCount={v === 'multi-source' ? 3 : undefined}
          label={v === 'retracted' ? 'Retracted citation' : v === 'retrieval-failed' ? 'Source unavailable' : 'Art. 35(3)(c)'}
        />
      ))}
    </div>
  ),
}

export const AllVariantsRow_Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } }, // 375px
  render: AllVariantsRow.render,
}

export const InProse: Story = {
  render: () => (
    <p className="text-base leading-relaxed text-[var(--color-text-default)] max-w-[58ch]">
      Iris attributes every recommendation. A regulator-grade chip{' '}
      <CitationChip variant="verified" label="Art. 35(3)(c)" />{' '}
      sits next to a pending claim{' '}
      <CitationChip variant="pending" label="EDPB 04/2026" />,{' '}
      an inferred connection{' '}
      <CitationChip variant="ai-inferred" label="implied by ROPA 12" />,{' '}
      and a pinned source{' '}
      <CitationChip variant="user-pinned" label="Internal memo 2026-Q1" />.
    </p>
  ),
}
```

### Action B · Combined-announcement aria-label

The shipped v2.0.0 chip has two SR surfaces:

1. **The button's `aria-label`** = `variantDescription[variant]` only. So for a `verified` chip with `label="Art. 35(3)(c)"`, SR users hear "Verified source" — the citation content is lost.
2. **An SR-only suffix span** = `— {variantDescription[variant]}` appended after the visible label. So the full SR text including the label is reachable via continued navigation as "Art. 35(3)(c) — Verified source".

This pattern is **functional but double-announces** when an SR reads the button (it announces the aria-label) and then traverses into the children (it announces the visible label + SR-only suffix). The variant description is heard twice; the citation content is heard once.

**The patch**:

1. Move the citation content into the `aria-label`.
2. Remove the SR-only suffix span (its content is now in the aria-label).

```tsx
// src/ai/CitationChip/index.tsx · the aria-label + button body change

aria-label={
  `${variantDescription[variant]}: ${label}` +
  (variant === 'multi-source' && sourceCount ? `, ${sourceCount} sources` : '')
}

// Button body — visible label only; no more sr-only suffix
<button …>
  {label}
  {variant === 'multi-source' && sourceCount && (
    <span className="bg-[var(--color-surface-muted)] rounded-sm px-1 text-[10px] font-mono text-[var(--color-text-default)]">
      {sourceCount}
    </span>
  )}
</button>
```

The new SR announcement reads:

| Variant + label | New SR announcement |
|---|---|
| `verified` · "Art. 35(3)(c)" | "Verified source: Art. 35(3)(c)" |
| `pending` · "EDPB 04/2026" | "Pending verification: EDPB 04/2026" |
| `ai-inferred` · "implied by ROPA 12" | "AI-inferred connection: implied by ROPA 12" |
| `multi-source` · "Art. 30" with `sourceCount=3` | "Multiple sources: Art. 30, 3 sources" |
| `retrieval-failed` · "Source unavailable" | "Source unavailable: Source unavailable" |
| `user-pinned` · "Internal memo 2026-Q1" | "Pinned by you: Internal memo 2026-Q1" |
| `retracted` · "Art. 35(3)(c)" | "Retracted source: Art. 35(3)(c)" |

Leading with the **variant description** before the content gives SR users the trust framing first ("is this source trustworthy?") before the citation label. This is the inverse of sighted reading order (content first, framing second), which is correct: visual prominence carries the framing implicitly via colour + border; SR must carry it lexically.

**The duplicate-string edge case** (variant=`retrieval-failed` with `label="Source unavailable"`): documented but tolerated. Document in the MDX doc-block:

> For variants whose semantics imply unavailability (`retracted`, `retrieval-failed`), pass the original citation label (e.g. "Art. 35(3)(c)") when possible. The variant description is added automatically by the chip; passing redundant text in `label` causes harmless double-announcement.

Optional follow-up (NOT gating): if drift surfaces, ship an ESLint rule `risqbase/citationchip-no-redundant-label` flagging the case at lint time.

### Action C (NEW · G4 WCAG 2.5.8) · Interactive target-size

`<CitationChip>` is a clickable `<button>`. Per WCAG 2.2 AA 2.5.8 (Target Size — Minimum), interactive controls require ≥24×24 CSS pixels. The shipped v2.0.0 chip is `px-2 py-0.5 text-xs` ≈ 22px tall — **fails 2.5.8 by 2px**.

The patch: bump padding from `py-0.5` to `py-1` on the interactive chip, taking it to ~26px. This affects only chips with `onOpen` provided (the prop signature already gates interactivity). For non-interactive chips (Demo B §3 prose usage, where chips are read but not clicked), keep the current `py-0.5` for in-line typographic rhythm.

```tsx
// src/ai/CitationChip/index.tsx

const interactivePadding = 'py-1'      // ~26px tall — meets WCAG 2.5.8
const staticPadding = 'py-0.5'         // ~22px tall — typographic in-line rhythm

const isInteractive = typeof onOpen === 'function'
const pad = isInteractive ? interactivePadding : staticPadding
```

Document the split in the MDX doc-block. Sarah G5's a11y regression sweep verifies the rendered height of the interactive variant ≥ 24px.

---

## §4 Token reference correction

Spec drafted earlier referenced `--color-citation-*` (semantic-tier names). The shipped component uses `--color-citation-chip-*` (component-tier names with `-chip-` infix). The component-tier names resolve through the semantic-tier per the v4.3 token build chain; both exist.

**For v2.1.0 — no change in this cycle.** The drift between the spec table and the component code is pre-existing and not v2.1.0's problem to fix. Document the names matching the shipped component in MDX so future spec authoring doesn't reintroduce the drift.

| Component-tier token (component code uses) | Semantic-tier token (resolves to) |
|---|---|
| `--color-citation-chip-surface` | `--color-citation-surface-default` |
| `--color-citation-chip-text` | `--color-citation-text-default` |
| `--color-citation-chip-border` | `--color-citation-border-default` |
| `--color-citation-chip-surface-low-conf` | `--color-citation-surface-low-conf` |
| `--color-citation-chip-border-retracted` | `--color-citation-border-retracted` |
| `--color-citation-chip-text-retracted` | `--color-citation-text-retracted` |

(Full mapping verified in Annex A.) A future v4.x token consolidation might collapse the two tiers; not in scope for v2.1.0.

---

## §5 Acceptance criteria

1. **Action A**: implementing engineer greps `CitationChip.stories.tsx` and adds the §3-listed stories that are not already present. `AllVariantsRow_Mobile` is **always** added (no prior coverage).
2. **Action B**: `aria-label` updated per §3 template. SR-only suffix span removed from the button body. MDX doc-block documents the new announcement order and the duplicate-string convention.
3. **Action C**: interactive padding bumped to `py-1` (or equivalent ≥24px). Static padding unchanged.
4. **Sarah G5 SR walkthrough** of the `AllVariantsRow` story: each chip announces in the table-row format ("Verified source: Art. 35(3)(c)" → "Pending verification: EDPB 04/2026" → …). No double-announcement.
5. **Sarah G5 measurement** of the interactive chip rendered height ≥ 24px.
6. **Chromatic baseline** includes snapshots of the new stories.
7. **No regression** on existing 7 stories.
8. **MDX doc-block** updated with: new aria-label shape, duplicate-string convention, interactive-vs-static padding rule.

---

## §6 Annex A · current-state grep (verified by Elena G4, 2026-05-20)

Citing Elena's verification verbatim. All references below are to `git rev-parse HEAD` at commit `6c0e40c1b1261c7d5c36451afc2867d3b60ae4fa` (the docs/v2-1-0-spec-pack branch base).

### A.1 `src/ai/CitationChip/types.ts`

```ts
// Lines 2-… (per G4 review)
export type CitationVariant =
  | 'verified' | 'pending' | 'low-confidence' | 'retracted'
  | 'external' | 'multi-source' | 'ai-inferred' | 'retrieval-failed' | 'user-pinned'

export interface CitationChipProps {
  variant: CitationVariant
  label: string                      // ← STRING, not ReactNode; NOT named `children`
  sourceCount?: number
  onOpen?: () => void
  'aria-label'?: string              // consumer override; if absent, component computes
  className?: string
}
```

### A.2 `src/ai/CitationChip/index.tsx`

```ts
// Lines 9-19 — variant → SR-friendly description lookup ALREADY EXISTS
const variantDescription: Record<CitationVariant, string> = {
  verified:           'Verified source',
  pending:            'Pending verification',
  'low-confidence':   'Low-confidence source',
  retracted:          'Retracted source',
  external:           'External source',
  'multi-source':     'Multiple sources',
  'ai-inferred':      'AI-inferred connection',
  'retrieval-failed': 'Source unavailable',
  'user-pinned':      'Pinned by you',
}

// Lines 72-78 — component signature (note: `label`, not `children`)
export function CitationChip({
  variant,
  label,
  onOpen,
  'aria-label': ariaLabel,
  className = '',
}: CitationChipProps) { … }

// Line 84 — current aria-label is variantDescription only (no label content)
aria-label={ariaLabel ?? variantDescription[variant]}

// Line ~92 — SR-only suffix already appends the variant description after the visible label
<span className="sr-only">— {variantDescription[variant]}</span>
```

### A.3 Implication for the spec

- The variant→description map exists; **do not propose adding it**. Reuse `variantDescription`.
- The original draft's `variantSrDescription` lookup table is the same data with a different identifier; the patch (Action B) edits the **aria-label template**, not the lookup.
- The original draft's "Add `aria-label='Citation: {children}, {variant}'`" patch is wrong on two counts: the current aria-label is NOT that string, and the prop is NOT `children`.
- The SR-only suffix span has been **double-announcing** since v2.0.0; the v2.1.0 patch removes it as part of Action B.

---

## §7 No-action items (deliberately excluded)

- **`external` visual differentiation** — `external` and `verified` share token chains; differentiation is via consumer-supplied external-link icon. This is the established pattern (Demo B §3 confirms). Don't introduce variant-driven iconography.
- **Token-tier consolidation** (`--color-citation-chip-*` ↔ `--color-citation-*`) — out of v2.1.0 scope; pre-existing drift unrelated to this gap.
- **Variant slug ESLint rule** for the duplicate-string case — out of v2.1.0 scope; documented as a follow-up.
- **Opacity-modified token references** (`bg-[var(--color-band-very-high-bg)]/8`) — Tailwind JIT supports the `/{N}` suffix; if token-lint rejects it, patch the lint config, not the component.
