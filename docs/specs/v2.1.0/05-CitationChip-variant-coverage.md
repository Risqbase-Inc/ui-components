# 05 · CitationChip — Variant Coverage Verification

> **Closes**: Mandatory verification asked for in the 2026-05-19 Claude Code gap report. "Confirm all 9 variants present in v2.0.0 work."
> **Composes with**: ImpactGraph (clause-edge labels), trust statements in marketing prose (Demo B), provenance trace surfaces (RALIA §14).
> **Visual reference**: `Marketing Demo B - Signature Surfaces.html` §3 (citation chips in trust statement); `audit-deliverable/redesigns/citation-chip-family-redesign.html`.
> **Home**: `src/ai/CitationChip/index.tsx` — **already shipped at v2.0.0**.
> **Outcome**: ✓ variants verified. All 9 present. **Two gating actions for v2.1.0**: (a) add 4 missing Storybook stories, (b) replace technical variant slugs in `aria-label` with human-readable phrasings. Both are tiny; both ship together.

---

## §1 Verification result

`src/ai/CitationChip/index.tsx` exports `CitationVariant` as a discriminated union of exactly the 9 required values:

```ts
export type CitationVariant =
  | 'verified' | 'pending' | 'low-confidence' | 'retracted'
  | 'external' | 'multi-source' | 'ai-inferred' | 'retrieval-failed' | 'user-pinned'
```

`variantStyles` covers all 9 with v4.3 token references. Spot-check against Demo B's rendered chips confirms the visual contract.

| Variant | Visual posture | Source-of-truth token chain |
|---|---|---|
| `verified` | solid bg, solid border, default text | `citation-surface-default` / `citation-border-default` / `citation-text-default` |
| `pending` | solid bg, solid border, subtle text, italic | `citation-surface-default` / `citation-border-default` / `text-subtle` + `font-style: italic` |
| `low-confidence` | low-conf surface, dashed border, default text | `citation-surface-low-conf` / `citation-border-default` (dashed) |
| `retracted` | solid bg, retracted border, retracted text, strikethrough | `citation-surface-default` / `citation-border-retracted` / `citation-text-retracted` + `text-decoration: line-through` |
| `external` | identical to `verified` visually; differs by icon | (consumer supplies external-link icon as child) |
| `multi-source` | identical surface to `verified`; renders `sourceCount` chip | requires `sourceCount` prop |
| `ai-inferred` | low-conf surface, iris-accent dashed border, iris hover text | `citation-surface-low-conf` / `iris-accent` (dashed) / `iris-accent-hover` |
| `retrieval-failed` | very-high band tint, very-high border, very-high text | `band-very-high-bg/8` / `band-very-high-bg` / `band-very-high-bg` |
| `user-pinned` | action-primary subtle bg, action-primary border, action-primary text | `action-primary-subtle` / `action-primary` / `action-primary` |

### 1.1 Verified API surface

```ts
export interface CitationChipProps {
  variant?: CitationVariant     // defaults to 'verified'
  children: ReactNode            // the citation label, e.g. "Art. 35(3)(c)"
  sourceCount?: number           // required when variant='multi-source'
  onOpen?: () => void            // opens §14 provenance trace
  className?: string
}
```

Accessibility: existing implementation emits `aria-label="Citation: {children}, {variant}"`. This satisfies the baseline; see §3 for one small improvement we recommend layering in.

---

## §2 Action A · Story coverage delta

Story file `src/ai/CitationChip/CitationChip.stories.tsx` audit (against `git main` at v2.0.0):

| Story | Present? | Notes |
|---|---|---|
| Default (`verified`) | ✓ | Canonical example |
| Pending | ✓ | |
| LowConfidence | ✓ | |
| Retracted | ✓ | |
| External | ✓ | |
| MultiSource | ✓ | Renders `sourceCount=3` |
| AiInferred | ✓ | |
| RetrievalFailed | **MISSING** | Add in v2.1.0 |
| UserPinned | **MISSING** | Add in v2.1.0 |
| AllVariantsRow | **MISSING** | Useful for Chromatic regression diffs — recommend adding |
| InProse | **MISSING** | Renders chips inline within a paragraph, matching Demo B §3 usage |
| WithIcon | ✓ | (passed as `children`) |

**Action**: add 4 stories. Total story file diff is ~30 lines. Effort: under an hour.

```tsx
// Stories to add — paste into CitationChip.stories.tsx

export const RetrievalFailed: Story = {
  args: { variant: 'retrieval-failed', children: 'Source unavailable' },
}

export const UserPinned: Story = {
  args: { variant: 'user-pinned', children: 'Pinned: Art. 30 ROPA' },
}

export const AllVariantsRow: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-[640px]">
      {(['verified','pending','low-confidence','retracted','external','multi-source','ai-inferred','retrieval-failed','user-pinned'] as const).map(v => (
        <CitationChip key={v} variant={v} sourceCount={v === 'multi-source' ? 3 : undefined}>
          {v === 'retracted' ? 'Retracted source' : v === 'retrieval-failed' ? 'Unavailable' : 'Art. 35(3)(c)'}
        </CitationChip>
      ))}
    </div>
  ),
}

export const InProse: Story = {
  render: () => (
    <p className="text-base leading-relaxed text-[var(--color-text-default)] max-w-[58ch]">
      Iris attributes every recommendation. A regulator-grade chip{' '}
      <CitationChip variant="verified">Art. 35(3)(c)</CitationChip> sits next to a pending claim{' '}
      <CitationChip variant="pending">EDPB 04/2026</CitationChip>, an inferred connection{' '}
      <CitationChip variant="ai-inferred">implied by ROPA 12</CitationChip>, and a pinned source{' '}
      <CitationChip variant="user-pinned">Internal memo 2026-Q1</CitationChip>.
    </p>
  ),
}
```

---

## §3 Action B · SR-friendly variant labels (GATING)

Current `aria-label` reads `"Citation: {children}, {variant}"` — the variant slug (`low-confidence`, `ai-inferred`, `retrieval-failed`) is implementation jargon that does not land for screen-reader users. Replace the slug with a human-readable phrasing.

**This is gating for v2.1.0.** Cost is one lookup table and one string template; cost-of-omission compounds across every CitationChip consumer (every prose paragraph, every clause-edge label inside ImpactGraph, every provenance trace). Do it right once.

### 3.1 The lookup

```ts
// src/ai/CitationChip/srDescriptions.ts
export const variantSrDescription: Record<CitationVariant, string> = {
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
```

Export it. RALIA's provenance-trace surface (§14) is the next consumer and will reuse the same map.

### 3.2 The chip change

```tsx
// src/ai/CitationChip/index.tsx — aria-label line

import { variantSrDescription } from './srDescriptions'

aria-label={
  `${variantSrDescription[variant]}: ${typeof children === 'string' ? children : 'source'}` +
  (variant === 'multi-source' && sourceCount ? `, ${sourceCount} sources` : '')
}
```

The new SR announcement reads:

| Variant + content | Announces as |
|---|---|
| `verified` · "Art. 35(3)(c)" | "Verified source: Art. 35(3)(c)" |
| `pending` · "EDPB 04/2026" | "Pending verification: EDPB 04/2026" |
| `ai-inferred` · "implied by ROPA 12" | "AI-inferred connection: implied by ROPA 12" |
| `multi-source` · "Art. 30" with `sourceCount=3` | "Multiple sources: Art. 30, 3 sources" |
| `retrieval-failed` · "Source unavailable" | "Source unavailable: Source unavailable" (consumer should pass empty `children` for this variant — see §3.3) |
| `user-pinned` · "Internal memo 2026-Q1" | "Pinned by you: Internal memo 2026-Q1" |
| `retracted` · "Retracted source" | "Retracted source: Retracted source" (same shape as `retrieval-failed`) |

Leading with the **variant description**, not the content, gives the SR user the most important framing first ("is this source trustworthy?") before the citation label itself. Reverses the current order, which leads with the content — correct prioritisation for sighted scanning, wrong for SR.

### 3.3 Edge case · variant-as-content

For `retracted` and `retrieval-failed`, consumers sometimes pass `children` that duplicates the variant description ("Retracted source", "Source unavailable"). The label then double-announces. Two options, in preference order:

1. **Document the convention** in the MDX doc-block: "for `retracted` and `retrieval-failed`, pass the actual citation label as `children` (e.g. 'Art. 35(3)(c)') — the variant description is added automatically." Migration: existing call sites that pass "Retracted source" as children update to pass the original citation label. ESLint codemod can flag the duplicate-string case.
2. **De-duplicate at runtime**: if `children === variantSrDescription[variant]`, render only one. Cheap but masks the real problem (consumers reasoning about SR text incorrectly).

**Recommend** option 1. Bake the convention into the type comment + MDX example, ship an ESLint rule in a follow-up if drift surfaces.

---

## §4 Acceptance criteria

1. Story file contains the 4 new stories listed in §2.
2. `variantSrDescription` lookup table added at `src/ai/CitationChip/srDescriptions.ts` and exported from the component's `index.ts` barrel.
3. `aria-label` in `CitationChip/index.tsx` updated per §3.2; SR announcement leads with the variant description, then the content.
4. MDX doc-block updated with the §3.3 convention for `retracted` and `retrieval-failed`.
5. Sarah G5 records a VoiceOver walkthrough of the `AllVariantsRow` story; the announcement order matches the §3.2 table.
6. Chromatic baseline includes snapshots of the 4 new stories.
7. No code regression on the existing 7 stories.
8. The `AllVariantsRow` story is used by Sarah as the single regression snapshot to detect drift in v4.3 citation-* tokens.

---

## §5 No-action items (deliberately excluded)

- The `external` variant has no distinguishing visual treatment — both `verified` and `external` use the same token chain. Demo B's external chip differentiates by an inline external-link icon passed as a child. **This is the established pattern**; don't introduce variant-driven iconography in v2.1.0.
- The `retrieval-failed` variant uses `bg-[var(--color-band-very-high-bg)]/8` — an opacity-modified token reference. Tailwind JIT handles this correctly; token-lint should be configured to accept the `/{N}` suffix on `--color-*` references. If the lint currently rejects it, **patch the lint config, not the component**.
- The `pending` italic + the `retracted` strikethrough together are sufficient to disambiguate without colour — colourblind-safe by construction.
