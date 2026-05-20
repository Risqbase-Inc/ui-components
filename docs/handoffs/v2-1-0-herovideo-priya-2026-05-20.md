# Handoff — v2.1.0 HeroVideo (Spec 02) + VideoEmbed token swap (Spec 08) + v4.4 token extension (Spec 00b)

> **Author**: Priya Sharma (Senior Full-Stack Developer, Contract)
> **Date**: 2026-05-20
> **Branch**: `feat/v2-1-0-hero-video`
> **Reviewers**: Elena Vasquez (G4 design sign-off), Sarah Mitchell (G5 Storybook + Chromatic), Alex Chen (G1 architecture)
> **Spec pack**: `docs/specs/v2.1.0/` (on branch `docs/v2-1-0-spec-pack`, PR #57)

---

## 1. Scope shipped in this PR

### Part A — HeroVideo component
- `src/marketing/HeroVideo/index.tsx` — client-island wrapper with IntersectionObserver-gated lazy-play, 2×2 reduced-motion fallback grid, VTT captions, iris-surface placeholder, autoplay-denial retry + "Tap to play" affordance, loop-restart callback for sibling-animation handshakes
- `src/marketing/HeroVideo/types.ts` — full `HeroVideoProps` TypeScript API per Spec 02 §2 (4-tuple `beats`, required `captions`, lifecycle `HeroVideoState`)
- `src/marketing/HeroVideo/accessibility.md` — implementation-side mirror of Spec 02 a11y companion (captions contract, autoplay rules, 2×2 SR announcement order, focus management, reduced-motion media-query gating, contrast table, test plan)
- `src/marketing/HeroVideo/HeroVideo.stories.tsx` — all 11 stories per Spec 02 §6: Default, PosterOnly, LoadingPulse, PlayingFrame, Paused, ErroredFallback, ReducedMotionFallback, CaptionsOff, WithoutLoop, ShortBeats, MobileViewport

### Part B — New namespace plumbing
- `src/marketing/index.ts` — new barrel; exports `HeroVideo` + all 4 types
- `tsup.config.ts` — new `marketing/index` entry
- `package.json` — new `./marketing` subpath in `exports` (mirrors the `./core` / `./ai` / `./data-viz` shape)
- `src/index.ts` — root barrel re-exports `./marketing` (back-compat for v1.x-style root imports; root barrel remains soft-deprecated per DS v4.3 §9.2)

### Part C — v4.4 token extension (coordination Path A — bundled in this PR)
- `tokens/semantic/elevation.json` — NEW FILE; 3 shadow tokens (`shadow.raised`, `shadow.floating`, `shadow.overlay`) per Spec 00b §1.1
- `tokens/semantic/loading.json` — NEW FILE; 1 token (`color.skeleton.shimmer`) per Spec 00b §1.2

### Part D — VideoEmbed token swap (Spec 08)
- **NO-OP.** `src/core/VideoEmbed/` does not exist in the repo (verified via `find` + `grep`); the patch target is absent. Per Spec 08 §2's "if there are no current references that match … flag this finding back to Elena G4 as 'no patch needed'", this is a stronger version of that finding — there is nothing to patch. See §5 below.

---

## 2. Coordination with Liam's v4.4 token PR

The brief offered two paths:

- **(a) Include v4.4 tokens in this PR** — duplicate work but isolated.
- **(b) Wait for Liam's PR to merge first, then rebase** — cleaner.

**Path taken: (a).** Reason: at the time work started (2026-05-20), Liam's v4.4 token branch did not exist in the remote (`git branch -a | grep -i 'v4-4\|elevation\|loading'` returned no matches, only the `claude-design/brief-401-print-tokens` branch which is unrelated). `gh pr list` showed only PR #57 (the spec-pack PR) and PR #59 (release-please). Blocking on a non-existent branch would have stalled HeroVideo.

If Liam's PR lands before this one is merged: the rebase is mechanical — drop `tokens/semantic/elevation.json` + `tokens/semantic/loading.json` if his copies are identical, or 3-way merge if his values differ. Per Spec 00b §1.1 the values are "identical to the audit-pack demo CSS — no design change" so divergence is unlikely.

`npm run build:tokens` confirmed the JSON entries emit cleanly into `dist/tokens.css`:
```
--color-skeleton-shimmer: linear-gradient(90deg, var(--color-surface-muted) 0%, var(--color-surface-subtle) 50%, var(--color-surface-muted) 100%);
--shadow-raised: 0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 1px -1px rgb(0 0 0 / 0.02);
--shadow-floating: 0 4px 12px -2px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04);
--shadow-overlay: 0 16px 40px -10px rgb(0 0 0 / 0.16), 0 6px 16px -6px rgb(0 0 0 / 0.08);
```
Token count: 108 → 112 semantic tokens; `npm run lint:tokens` passes (316 tokens, no violations).

---

## 3. Decisions taken (worth ratifying)

1. **`color.skeleton.shimmer` uses inline `var(--color-surface-muted)` rather than a `{color.surface.muted}` alias reference.** Reason: `tools/tokens-build/index.js`'s `refToVar` helper only resolves a value that is *entirely* a single reference (`{foo.bar}` → `var(--foo-bar)`); embedded references inside a longer expression (e.g. `linear-gradient(…, {color.surface.muted}, …)`) pass through untouched and would emit broken CSS. The resolved CSS is identical either way — this is a build-pipeline limitation, not a token-format choice. Documented in the JSON's `$description`. If Liam's variant of the same file uses the alias form, this is the place to verify before merging.

2. **Shimmer keyframe CSS block is NOT shipped in this PR.** Spec 00b §1.2 describes a standard `@keyframes risqbase-skeleton-shimmer` block that lives in `dist/tokens.css` after the `:root` variable declarations. Injecting it requires a `tools/tokens-build/index.js` patch (out of scope for this PR, and the keyframe's first consumer is ImpactGraph in a sibling PR — not HeroVideo). Defer to the ImpactGraph PR or to Liam's v4.4 token PR if he writes the keyframe injection there.

3. **HeroVideo's loop-boundary detection.** The native `<video loop>` does not emit `ended` events when looping; the canonical pattern (used here) is to watch `timeupdate`, detect a backward jump in `currentTime` past ~90% of the duration, and fire `onLoopRestart` from there. This is accurate to within one render frame, which is sufficient for the BRIEF-429 V2 §5 close-frame → Beat-1 substrate handshake.

4. **`PausedStory` decorator uses a `setTimeout(1000)` to call `video.pause()` after autoplay resolves.** This is the standard Storybook pattern for capturing a derived state; it works at the price of slight Chromatic non-determinism if the test video is unusually slow to start. If Chromatic flakes on the `Paused` story specifically, the recommended fix is to swap in a smaller dummy video asset and shorten the timeout.

5. **`core/VideoEmbed` does not exist.** Spec 02 §1 says HeroVideo "subsumes the basic `core/VideoEmbed` (which stays in main as a lower-level primitive for non-hero embeds)". `find src -iname '*video*'` returned 0 hits; `grep -r 'VideoEmbed' src` returned 0 hits; `git log --all` does not contain a VideoEmbed commit. The component the spec subsumes was never built. Two implications: (a) Spec 08's VideoEmbed token swap is a no-op (handled above); (b) the spec language "stays in main as a lower-level primitive" is aspirational — if marketing needs an uncaptioned video embed for non-hero positions, that's a separate, follow-up brief, not an in-scope deliverable here.

6. **Type-safe MediaQueryList listener binding.** Older Safari (<14) exposes `addListener` / `removeListener` instead of the modern `addEventListener` / `removeEventListener` API. I feature-detect once at bind time inside a `bindMediaQuery` helper rather than typing the fallback as `any` — keeps `@typescript-eslint/no-explicit-any` clean.

---

## 4. Open questions for Elena G4 / Sarah G5

- **Q1 (Elena)**: Spec 02 §8 Q3 mentioned a contradiction between "captions size 16px on mobile and 14px on desktop" and the fallback-grid sizing (14px desktop). I documented the rationale in the Stories MDX `parameters.docs.description.component` block (the two surfaces have different substrates: dark scrim under motion vs teal-50 substrate under static frames). Please confirm the MDX wording matches your intent — happy to tighten.
- **Q2 (Sarah)**: `ReducedMotionFallback` story snapshot relies on Chromatic's `parameters.chromatic.reducedMotion: 'reduce'`. If your Chromatic plan does not include the reduced-motion media-query override, the snapshot will fall back to the regular video frame. Confirm before baseline.
- **Q3 (Elena)**: Spec 02 §8 Q1 said "ship without HLS support in v2.1.0; add `hls?` in v2.2 if Mux is chosen". I did not add `hls?` to the props. Confirm Mux is still TBD.
- **Q4 (Sarah)**: Spec 02 §7 (3) says SR announcement must include "title + description + all 4 captions" in `reduced-motion` state. My implementation reads: `<h3>title</h3>` (sr-only), then 4 sr-only `<p>` lines per beat, then `<figcaption>description</figcaption>` (sr-only). Reading order: title → 4 beats → description. Spec a11y §3 explicitly orders title → beats → description (figcaption is the "closing summary"); the implementation matches. Sarah to verify with VoiceOver during G5.
- **Q5 (Alex G1)**: New top-level namespace `src/marketing/`. I followed the `src/data-viz/` pattern (tsup entry + package.json `exports` + root barrel re-export). The root barrel still emits the soft-deprecation warning per v2.0 (DS v4.3 §9.2). Confirm namespace shape is what you expect.

---

## 5. Rejected / out-of-scope (for the record)

- **Don't create `core/VideoEmbed` in this PR.** Even though Spec 02 references it, the brief is explicit: Parts A/B/C only. Creating a new primitive would widen the v2.1.0 surface beyond what Elena ratified.
- **Don't ship the shimmer keyframe CSS block.** HeroVideo doesn't consume `--color-skeleton-shimmer`. Deferring to the first actual consumer (ImpactGraph PR) keeps this PR tight.
- **Don't add an `hls?` prop.** Spec 02 §8 Q1 recommended deferral to v2.2 pending Mux/Cloudflare Stream choice.
- **Don't add an `autoplayRetryDelayMs` prop.** Spec 02 §8 Q2 recommended deferral until Sophie has a tuning requirement.

---

## 6. Test + verification trail (local, pre-push)

| Check | Command | Result |
|---|---|---|
| Token lint | `npm run lint:tokens` | PASS — 316 tokens validated, no violations |
| Token build | `npm run build:tokens` | PASS — 316 tokens (110 primitive, 112 semantic, 94 component) |
| ESLint | `npm run lint` | (run before push — see PR description) |
| Type build | `npm run build` | (run before push) |
| Storybook build | `npm run build:storybook` | (run before push) |
| Contrast verify | `npm run verify:contrast` | (run before push — no contrast-affecting tokens added) |

---

## 7. Files added / modified

```
A  docs/handoffs/v2-1-0-herovideo-priya-2026-05-20.md   (this file)
A  src/marketing/HeroVideo/HeroVideo.stories.tsx
A  src/marketing/HeroVideo/accessibility.md
A  src/marketing/HeroVideo/index.tsx
A  src/marketing/HeroVideo/types.ts
A  src/marketing/index.ts
A  tokens/semantic/elevation.json
A  tokens/semantic/loading.json
M  package.json                     (+ "./marketing" exports entry)
M  src/index.ts                     (+ export * from './marketing')
M  tsup.config.ts                   (+ 'marketing/index' entry)
```

8 new files, 3 modifications. Zero deletions. Zero breaking changes.
