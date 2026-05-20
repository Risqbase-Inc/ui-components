# Chromatic acceptance discipline

**Status:** ACTIVE 2026-05-20
**Owner:** G5 (QA) — Sarah Mitchell
**Audience:** anyone reviewing a PR that has a Chromatic visual diff
**Companion:** [`docs/devops/chromatic.md`](../devops/chromatic.md) — wiring + day-to-day operation
**Origin:** finding **FU-4** in [`docs/reviews/v2-1-0-post-merge-audit/G5.md`](../reviews/v2-1-0-post-merge-audit/G5.md)

---

## §1 Why this exists

The v2.1.0 release sprint registered ~100+ new Chromatic baselines in a single train (12 ArcDecoration + 12 ImpactGraph + 4 MarketingImpactGraph + 10 HeroVideo + 10 CompliancePostureStrip + 12 ClientGrid + 8 CitationChip + several Header polish snapshots — multiplied by 3 theme modes for most). At this volume, Chromatic is the *de facto* test framework for `@risqbase-inc/ui-components`: there is no test-runner wired today (see [`docs/briefs/BRIEF-439-UI-COMPONENTS-TEST-RUNNER-WIRING.md`](../briefs/BRIEF-439-UI-COMPONENTS-TEST-RUNNER-WIRING.md) for the close-out plan), the Header play functions don't gate CI, and axe-core runs only when a developer opens a story locally with `addon-a11y`. Chromatic accept-or-reject is the gate.

"Click accept" without rationale collapses that gate. Every accepted baseline becomes the new "before" for the next PR; an unintentional accept turns a regression into the canon. The mutation-test mindset (`~/.claude/agents/sarah-mitchell-memory/patterns/`) applies: if the only thing standing between a bug and production is a human eyeballing a side-by-side diff, that human owes the project a paper trail.

This doc is the paper-trail contract.

> Mechanical scope: this doc governs **review and accept** behaviour. The Chromatic wiring, token rotation, snapshot configuration, and `parameters.chromatic.*` knobs are covered in [`docs/devops/chromatic.md`](../devops/chromatic.md). Read both.

---

## §2 The contract — every accepted baseline change

When you accept a baseline change in the Chromatic UI, the PR description **must** carry a one-line rationale per accepted snapshot group. "Per accepted snapshot group" means: if 12 ImpactGraph stories all changed because a token renamed, that is one rationale covering the 12. If 12 ImpactGraph stories changed for 3 different reasons, that is 3 rationales.

### Rationale format

Paste a block at the bottom of the PR description:

```markdown
## Chromatic accepted baselines

- **ImpactGraph (12 snapshots)** — expected. v4.4 elevation token rename `elevation.card` → `elevation.surface.card`; visual identical, internal class names changed.
- **HeroVideo (3 snapshots, idle state)** — expected. Spec 02 §3.4 — poster fade-in delay tightened from 300 ms to 200 ms; first-frame snapshot now shows poster fully opaque.
- **Header NavDropdown (1 snapshot)** — expected. Trigger chevron rotates 180° on open per Spec 07 §3.2.
```

Three things are non-negotiable:

1. **Component name + snapshot count** so reviewers can match the rationale to what Chromatic flagged.
2. **"expected" or "unexpected — accepted because <reason>"** — the latter must explain why the diff is acceptable despite being unintentional (e.g. "anti-aliasing on a 1px border, indistinguishable on retina, not worth chasing").
3. **Anchor to a source-of-truth** — Spec section, BRIEF number, ADR, or token-rename diff link. "Looks right" is not an anchor.

### What is *not* a valid rationale

- "LGTM"
- "approved by author"
- "minor visual change"
- "accepted, will reapprove next PR" — if you can't explain it now, deny and investigate
- "tokens changed" (without naming which token)
- An empty Chromatic-accept block — silence is denial

### Where to paste

The block goes at the **bottom** of the PR description so reviewers can find it deterministically. Don't sprinkle rationale across commit messages or PR comments — the description is the durable artefact that ships with the merge commit.

---

## §3 Two-reviewer accept on Marketing surfaces

Brand drift = product damage. Marketing-surface components (anything under `src/marketing/*`, currently `HeroVideo` and the marketing wrapper variants such as `MarketingImpactGraph`) require **two reviewer approvals on the Chromatic UI itself**, not just two GitHub approvals on the PR.

| Surface | Reviewer count | Required gates |
|---|---|---|
| `src/marketing/*` | **2** | G4 (Design — Elena) + G8 (Brand — Sophie) |
| `src/marketing/*` + landing/hero/CTA primitive | **2** | G4 + G8, and if claim-language changes per accessibility.md, also G3 (Legal — Amara) |
| `src/core/*`, `src/ai/*`, `src/data-viz/*`, `src/primitives/*` | **1** | G4 *or* G5 — single competent reviewer who is not the PR author |
| Decorative-only (e.g. ArcDecoration) | **1** | G4 *or* G5 |

Single-reviewer in-product accept is sufficient because in-product components are mechanically validated against tokens, spec sections, and accessibility contracts. Marketing surfaces additionally carry brand signal that no spec fully encodes.

If the second reviewer hasn't accepted, **do not merge**. Chromatic's "1 approved" badge is not the same as "ready" on Marketing PRs. The PR author should `@`-mention the second reviewer in the PR comment when the first approval lands.

---

## §4 0.1% pixel-diff investigation threshold

Chromatic's default `diffThreshold` (0.063, a colour-distance metric — see [`docs/devops/chromatic.md` §"What NOT to do"](../devops/chromatic.md)) governs *when Chromatic flags a snapshot at all*. **Do not change this knob.** Lowering it produces false positives; raising it suppresses real regressions.

The 0.1% number in this section is a **separate, process-level threshold** that governs reviewer behaviour *after* Chromatic has flagged a diff:

- **<0.1% pixel-changed area** — the diff is plausibly anti-aliasing, font-rendering jitter, or sub-pixel reflow. Still rationalise per §2, but a one-liner ("AA noise around 1px border") is acceptable.
- **0.1%–2% pixel-changed area** — the diff is real. Inspect side-by-side. Rationale must name the source-of-truth (Spec §, BRIEF, ADR).
- **>2% pixel-changed area on a story not named in the PR scope** — STOP. This is the "Reject + investigate" signal in §5. Don't accept without an explanation of *why* this unrelated story changed.

Chromatic shows the pixel-changed area in the diff UI under each snapshot. Use it.

---

## §5 Reject + investigate — the cross-component drift signal

If Chromatic flags a diff on a component whose source files, tokens, or dependencies were **not** touched by the current PR, **reject the diff in Chromatic and stop the merge**.

How to confirm "not touched":

```bash
git diff origin/main...HEAD --name-only | grep -E "src/(<component-path>|core/theme|tokens/)" || echo "not touched"
```

If the grep returns "not touched" and Chromatic still shows a diff on that component, possible causes (in decreasing likelihood):

1. **A shared token or theme primitive changed** — verify by inspecting `tokens/**/*.json` in the diff. If a primitive rippled into 14 components, the PR description should already list them per §2.
2. **A peer dependency reflow** — e.g. a new `@react-aria/*` patch version that affected focus-ring rendering. Run `git diff origin/main...HEAD -- package.json package-lock.json` and confirm. If yes, expand the rationale.
3. **A genuine cross-component side-effect bug** — e.g. a CSS specificity escalation that bled out of the changed component. This is the case the reject-and-investigate rule was written for. **Find the root cause before accepting.** Do not "accept and file follow-up" — the accepted baseline locks the bug in.
4. **Chromatic infrastructure flake** — last resort. Re-run the job. If the diff reappears with the same pixel pattern, it's #1, #2, or #3, not flake.

Document the investigation in the PR description under the same Chromatic-accept block, e.g.:

```markdown
- **CitationChip (4 snapshots)** — investigated; root cause was the `elevation.card` token rename in `tokens/semantic/elevation.json` which CitationChip consumes via `semantic.surface.card`. Expected ripple. Accepted.
```

---

## §6 Mobile + desktop baselines on responsive components

Any component that renders differently below the `md` breakpoint (typically 768px in our tokens — see `tokens/primitive/breakpoints.json`) **must** have baselines registered at both viewport sizes. This is enforced operationally via the per-story `parameters.chromatic.viewports` config (see [`docs/devops/chromatic.md`](../devops/chromatic.md) for the snippet).

A "responsive component" for this purpose is any component that:

- Uses Tailwind responsive prefixes (`md:`, `lg:`, etc.) in its className strings
- Has explicit `@media` queries in its CSS
- Conditionally renders a mobile-only layout (e.g. Header collapses to hamburger below `md`)
- Has a `tokens.md` entry referencing a viewport-conditional spacing or sizing token

If you add or modify a responsive component and the PR has *only* the desktop baseline diff, **reject the PR pre-merge** — the mobile baseline is missing, which is a coverage hole disguised as a passing check.

The current v2.1.0 responsive components with baselines at both viewports: Header (collapses), HeroVideo (16:9 reflows), ImpactGraph (SVG viewport scales but layout doesn't reflow — desktop-only baseline is acceptable per `accessibility.md` §3.1), CompliancePostureStrip (30-client wrap reflows below md). Reference any new responsive component against this list to confirm baseline parity.

---

## §7 v2.1.0 baseline-count snapshot (reference)

Captured 2026-05-20 from the Chromatic dashboard post-merge of the v2.1.0 train. Use this as the anchor for "did the snapshot count drop unexpectedly on the next release?" — a sudden drop is a story-disabled-by-accident signal.

| Component / surface | Stories | Theme modes | Snapshots |
|---|---:|---:|---:|
| ArcDecoration | 12 | 3 (L/D/HC) | 36 |
| ImpactGraph | 12 | 3 | 36 |
| MarketingImpactGraph | 4 | 3 | 12 |
| HeroVideo | 10 | 3 (+1 print) | 33 |
| CompliancePostureStrip | 10 | 3 | 30 |
| ClientGrid | 12 | 3 | 36 |
| CitationChip | 8 | 3 | 24 |
| Header (Spec 07 polish delta) | 17 | 3 | 51 |
| Pre-v2.1.0 carry-forward (5 core + tokens + charts gallery) | ~25 | ~3 | ~75 (audit-only count) |
| **Total registered v2.1.0** | | | **~333 (audit estimate)** |

Refresh this table at every major-version release (next: v3.0.0). The free-tier cost ceiling and the snapshot-drop alarm both depend on knowing the current count.

---

## §8 What to do when this doc and reality disagree

If you find a Chromatic workflow that this doc doesn't cover, or a case where the doc is wrong, **open a PR** that updates this file in the same change. Don't tribal-knowledge it. The doc is checked in for a reason: it loses its value the moment it diverges from practice.

If the disagreement is about a baseline-accept policy (not a wiring issue), tag G5 (Sarah Mitchell) for review. If it's about the wiring or Chromatic config, tag G6 (Jordan Park) and update [`docs/devops/chromatic.md`](../devops/chromatic.md) instead.

---

## §9 Cross-references

- [`docs/devops/chromatic.md`](../devops/chromatic.md) — wiring, token rotation, day-to-day operation, what-NOT-to-do on the Chromatic config knobs
- [`docs/reviews/v2-1-0-post-merge-audit/G5.md`](../reviews/v2-1-0-post-merge-audit/G5.md) — origin of this doc (FU-4); the post-merge G5 audit that established the discipline-gap finding
- [`docs/briefs/BRIEF-439-UI-COMPONENTS-TEST-RUNNER-WIRING.md`](../briefs/BRIEF-439-UI-COMPONENTS-TEST-RUNNER-WIRING.md) — the complementary brief for wiring `@storybook/test-runner` so behavioural play functions also gate CI (Chromatic alone is not enough)
- [`docs/devops/contrast-verification.md`](../devops/contrast-verification.md) — sibling contributing-domain governance doc

---

Sarah Mitchell, G5 QA Lead
2026-05-20
