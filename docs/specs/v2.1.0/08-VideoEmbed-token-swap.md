# 08 · VideoEmbed placeholder token swap

> **Closes**: BRIEF-429 V2 finding M-07. Existing `core/VideoEmbed` placeholder is specified as `indigo-100`. The audit-pack v4.3 substrate is IRIS-teal. The lazy-load placeholder should match the embed's substrate.
> **Visual reference**: BRIEF-429-VIDEO-V2-CONCEPT.md §1 + V2 mockup Demo I.
> **Home**: `src/core/VideoEmbed/` — patch existing.
> **Type**: internal patch — no API change, no breaking surface, no new tokens.

---

## §1 What changes

Find every reference to `indigo-100` (or `--color-action-primary-subtle` if the base implementation tokenised it that way) inside the VideoEmbed placeholder rendering, and swap to `--color-iris-surface` (teal-50).

That's the entire scope. The component's API, behaviour, and shape are unchanged.

---

## §2 Where to look

Likely sites (engineering verify):

```
src/core/VideoEmbed/index.tsx
  - placeholder background colour
  - poster overlay bg (if scrim used)
src/core/VideoEmbed/VideoEmbed.stories.tsx
  - any background hardcoded for visual contrast in stories
```

Tailwind class references:

| Before | After |
|---|---|
| `bg-indigo-100` | `bg-[var(--color-iris-surface)]` |
| `bg-[var(--color-action-primary-subtle)]` | `bg-[var(--color-iris-surface)]` |

Inline-style references:

| Before | After |
|---|---|
| `style={{ background: 'rgb(224 231 255)' }}` (indigo-100 raw) | `style={{ background: 'var(--color-iris-surface)' }}` |

If there are no current references that match — i.e. the VideoEmbed inherited the indigo-100 indirectly through a generic surface token — flag this finding back to Elena G4 as "no patch needed; BRIEF-429 V2 M-07 was a spec-side observation only."

---

## §3 Acceptance criteria

1. `git diff` shows only `indigo-100` → `iris-surface` swaps (or equivalent token refs).
2. Chromatic shows a single visual diff on the VideoEmbed default story: the placeholder bg shifts from indigo-100 to teal-50.
3. The placeholder still meets ≥ 3:1 contrast against any visible play-affordance overlay.
4. No new tokens introduced.
5. No API change. No type change.

---

## §4 Why this is its own line item

BRIEF-429 V2 §6 Q7 resolved the marketing substrate as teal-primary with indigo-CTA-only. The VideoEmbed placeholder is the lazy-load surface that's visible for ~200ms while the video loads. If it renders indigo while the rest of the marketing substrate is teal, the load looks like a cross-product handshake the user didn't ask for. This patch is the single half-day of work that lets HeroVideo lazy-load cleanly into its parent substrate.

It is intentionally separated from `02-HeroVideo.md` because HeroVideo could ship without this patch (the wrapper sets its own `--color-iris-surface` bg on the outer container — the VideoEmbed bg only flashes during the brief load transition). Shipping the patch makes the transition invisible, which is the point.

If Priya prefers to defer this patch and accept the brief flash for v2.1.0, that's defensible — flag back to Elena.
