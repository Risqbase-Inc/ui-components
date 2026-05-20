# BRIEF-439 — `ui-components` test-runner wiring

**Status:** FILED 2026-05-20 — pending implementation
**Author:** Sarah Mitchell (G5 QA Lead)
**Implementer:** Sarah Mitchell (G5) — own QA gate + acceptance verification
**Reviewers:** Jordan Park (G6 — CI workflow integration), Alex Chen (G1 — architecture sanity), Marcus Chen (G2 — security on the new dev-dependencies)
**Origin:** finding **FU-3** in [`docs/reviews/v2-1-0-post-merge-audit/G5.md`](../reviews/v2-1-0-post-merge-audit/G5.md)
**Companion policy:** [`docs/contributing/chromatic-acceptance.md`](../contributing/chromatic-acceptance.md) (visual-regression accept discipline)
**Deadline:** **pre-1-July 2026** — before the first v4.5+ component lands
**Effort:** ~6h (mostly CI integration + flake discipline)

---

## §1 Problem

`@risqbase-inc/ui-components` has 5 behavioural play functions on `Header.stories.tsx` (NavDropdown open/close, ESC, outside-click, single-open invariant, item-click-closes). They use `@storybook/test`'s `expect`, `userEvent`, `within`, and `waitFor` APIs at story-render time. They fire when a developer opens the story in a local Storybook session or when Chromatic renders the story for snapshot — but **nothing in CI runs `test-storybook` to fail a build when a play assertion throws**.

The G5 post-merge audit of v2.1.0 (2026-05-20) graded this a perception-vs-reality gap. We ship release notes that say "behavioural test coverage on Header" — true at the story level; false at the CI-gate level. The 5 play functions are documentation + manual-QA scaffolding today, not regression gates.

Concrete consequence: a future PR could break "ESC closes the dropdown and restores focus to the trigger", `Header.stories.tsx` would still build green, Chromatic would NOT catch it (focus ring visual is identical whether focus is actually restored or not), and the regression ships to consumers (RALIA, RisqBase marketing site, internal tools).

This brief closes that gap.

---

## §2 Goal

Wire `@storybook/test-runner` into the CI pipeline so that **any `play:` function whose `expect(...)` fails causes CI red** on the PR.

Acceptance metric: a deliberately-failing play function added on a test branch (e.g. an `expect(...).toBe(false)` that we know is `true`) **must** cause the `Test Stories` CI job to fail. Without this empirical proof, the wiring is theatre.

---

## §3 Scope

| # | Item | Path |
|---|---|---|
| 1 | Add `@storybook/test-runner` to devDependencies | `package.json` |
| 1a | Confirm `@storybook/test` is in devDependencies (already used by `Header.stories.tsx`) | `package.json` |
| 1b | Add `http-server` to devDependencies (or `serve` — see §5.2) | `package.json` |
| 2 | Add `test:stories` npm script | `package.json` |
| 2a | Add `test:stories:ci` variant that bundles the build + serve + test cycle | `package.json` |
| 3 | Add CI job `Test Stories` (runs after `build-storybook`) | `.github/workflows/ci.yml` (extend existing) |
| 4 | Add a brief `test-runner` config if needed (timeouts, retry policy) | `test-runner.json` at repo root, or `playwright.config.ts` if test-runner v0.20+ |
| 5 | README pointer + reviewer-facing note in the test-runner section | `README.md` ("Testing" subsection) + this brief cross-link |
| 6 | Empirical-failure verification commit on a throw-away branch (described in §4) | (verification artefact only — not merged) |

---

## §4 Acceptance gates

- [ ] `npm i` after merge installs `@storybook/test-runner` + `http-server` (or equivalent) successfully on a clean clone.
- [ ] `npm run test:stories` PASSES locally on `main` HEAD after the wiring lands.
- [ ] CI job `Test Stories` appears in PR checks and PASSES on a PR that doesn't introduce play-function regressions.
- [ ] **Empirical-failure proof**: on a throw-away test branch, add `await expect(trigger).toHaveAttribute('aria-expanded', 'pineapple')` to a Header play function, push the branch, observe `Test Stories` CI job fail with a clear error message pointing at the offending assertion. Branch is closed without merge; record the CI run URL in the implementation PR description as proof.
- [ ] Job wall-clock budget: <90s on a standard GitHub-hosted runner (build-storybook is ~30s today; serving + test-storybook on the 5 Header play functions + a parallel axe sweep should fit in 60s comfortably).
- [ ] No flake on 3 consecutive empty re-runs of the PR after merge (flake-prevention check per [`~/.claude/skills/e2e-testing-standard.md`](../../) — see §6 for the playbook).

---

## §5 Implementation notes

### §5.1 The serve-while-test pattern

`test-storybook` needs a running Storybook instance. The canonical pattern in the Storybook docs is:

```bash
npx concurrently -k -s first \
  "http-server storybook-static --port 6006 --silent" \
  "wait-on tcp:6006 && test-storybook"
```

The `-k` kills siblings on first exit; `-s first` exits with the first process's status. `wait-on` is used (vs `sleep N`) to avoid race + arbitrary delay.

For CI we'll bake this into a single `test:stories:ci` script. Local-dev keeps `test:stories` as the version that assumes Storybook is already running on `:6006`, so it's quick to iterate.

### §5.2 Why http-server and not Storybook dev-server

Running `storybook dev` in CI has two failure modes: (1) hot-reload watcher leaks file handles, (2) some addons mis-behave under headless CI. The recommended pattern is `npm run build-storybook` then serve the static output with any static file server. `http-server` is 350KB and zero-config; `serve` (vercel/serve) is also fine. Either works; pick whichever lands cleaner in the dep tree.

### §5.3 Playwright transitive dependency

`@storybook/test-runner` depends on `playwright`. The `npm i` will pull `playwright` and one browser. **Chromium-only initially** — Firefox + WebKit can be added in a v0.x follow-up if cross-browser play coverage becomes valuable. This is a deliberate scope cut to keep CI time + Docker layer cache small.

In CI, add a Playwright-browser-install step before `test-storybook`:

```yaml
- run: npx playwright install --with-deps chromium
```

If we already have a Playwright cache action elsewhere, reuse it. If not, the install is ~30s on cold cache, ~2s on warm.

### §5.4 Test discovery

`test-storybook` discovers tests from the same `stories` glob as `main.ts` declares. No separate test glob to maintain. Every `*.stories.tsx` with a `play:` function gets tested automatically — adding new play functions is now a real test-authoring action, not just an opt-in to manual QA.

### §5.5 axe-core static-DOM bonus

`test-storybook` can also run axe-core against each story's rendered DOM via `--a11y` flag (requires `@storybook/addon-a11y` which we already have). Out of scope for this brief's hard acceptance, but optional add-on once the basic runner is green:

```bash
test-storybook --a11y
```

This converts the existing "axe-on-local-Storybook-open" coverage into a CI gate, closing the gap noted in the G5 audit's WCAG 2.2 AA spot-check (PARTIAL today).

### §5.6 `package.json` script shape (illustrative)

```json
{
  "scripts": {
    "test:stories": "test-storybook --url http://127.0.0.1:6006",
    "test:stories:ci": "concurrently -k -s first \"http-server storybook-static --port 6006 --silent\" \"wait-on tcp:6006 && test-storybook --url http://127.0.0.1:6006\""
  },
  "devDependencies": {
    "@storybook/test-runner": "^0.20.0",
    "http-server": "^14.1.1",
    "concurrently": "^9.1.0",
    "wait-on": "^7.2.0"
  }
}
```

(Pin major versions; the implementer should verify latest stables at PR time.)

---

## §6 Risks + mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Flaky tests on slow GitHub-hosted CI runners** | M | M | Set per-step timeout in `test-runner.json`; use `await waitFor(..., { timeout: 5000 })` not arbitrary `setTimeout`; **never** add `test.retry(N)` to mask flakes per [`~/.claude/skills/e2e-testing-standard.md`](../../). If a test flakes, root-cause it. |
| **Port :6006 already in use on a runner** (rare on GitHub-hosted; possible on self-hosted) | L | L | `http-server` with `--port 0` finds a random free port; or override via `STORYBOOK_PORT` env var. |
| **Playwright browser-install slow on cold cache** | M | L | Cache `~/.cache/ms-playwright` with `actions/cache`; warm-cache install drops to ~2s. |
| **`@storybook/test-runner` major-version jumps break the wiring** | L | M | Pin in `package.json` to minor; the Dependabot major-bump PR goes through G5 review per OEF v4.2 §4.4 (major-dep update protocol). |
| **A play function that calls real network or relies on global state** | L | H | Stories should be pure; if a story depends on network, mock at the story level (MSW addon) — out of scope for this brief, but document in `chromatic-acceptance.md` follow-up if it ever surfaces. |
| **Job becomes the long-pole and slows merge velocity** | L | M | Run `Test Stories` in parallel with `Chromatic` job, not serial. Wall-clock = max(Chromatic, Test Stories), not sum. |

---

## §7 Out of scope

| Out-of-scope concern | Owner / how it's already handled |
|---|---|
| Visual regression | Chromatic owns. See [`docs/devops/chromatic.md`](../devops/chromatic.md) + [`docs/contributing/chromatic-acceptance.md`](../contributing/chromatic-acceptance.md). |
| Static-DOM accessibility | `@storybook/addon-a11y` already wired; this brief unlocks CI-gating it via `test-storybook --a11y` as an optional add-on (§5.5). |
| Cross-browser play coverage | Chromium-only initially (§5.3). Firefox / WebKit deferred. |
| Real-DOM browser e2e of full pages | Out of repo. `@risqbase-inc/ui-components` is a primitive library; full-page e2e lives in the consuming apps (RALIA `e2e/`, marketing site, internal tools). |
| Unit tests for non-rendered helper functions (`src/data-viz/ImpactGraph/layout.ts`, `src/core/Header/lib/isCurrent.ts`) | Out of scope this brief; if the function isn't exercised through a story, it's a separate "add Vitest for pure-utility helpers" brief. **NOT** combined with this brief — different runner, different flake profile, separate concerns. |
| Mutation testing | CEO directive: pattern not tool (see `~/.claude/agents/sarah-mitchell-memory/` — mutation mindset baked into review, no Stryker install). Stays as-is. |

---

## §8 Why this is the enduring fix

Header's 5 play functions are the gold standard the v2.1.0 audit wants to apply to ImpactGraph (Interactive), CompliancePostureStrip (Interactive), ClientGrid (InteractivePill + mutex warn), and HeroVideo (5-state machine). Without a runner, that gold standard can't be enforced — adding more play functions just expands the documentation-shaped surface that nothing tests.

Wiring the runner is the lever. Once the runner is green, follow-up tasks FU-5 (interactive-path play coverage) and FU-6 (HeroVideo state-machine coverage) become possible with real CI signal, not aspirational hope. The Chromatic-acceptance discipline doc (FU-4) handles the visual side; this brief handles the behavioural side. Together they give v4.5+ component development the same quality-gate substrate that RALIA expects from its dependencies.

---

## §9 Unblocks

This brief unblocks:

- **Task #124 / FU-5** — behavioural play-function coverage backfill on ImpactGraph Interactive, CompliancePostureStrip Interactive, ClientGrid InteractivePill, ClientGrid mutex-warn-path, HeroVideo state-machine (idle→playing→paused→errored, reduced-motion gate, autoplay-retry timer)
- **Task #126** (future) — `test-storybook --a11y` flag to make axe-core a hard CI gate per WCAG 2.2 AA
- v4.5+ component additions where "play function present" becomes a structural-review checklist item

---

## §10 Rejected alternatives

| Approach | Why rejected |
|---|---|
| Add Vitest + `@testing-library/react` instead of `test-storybook` | Duplicates the story-as-spec contract; we already author behaviour as stories, parallel Vitest would diverge from the stories over time. Plus loses the Chromatic-co-located story-rendering parity. |
| `cypress-storybook` | Heavier dep tree, Cypress browser-runtime adds 250MB+ to CI cache. `playwright` is already needed by `test-storybook`, so we get it transitively without paying twice. |
| Mock the browser entirely with jsdom-based execution of play functions | Header play functions use `userEvent.click()` + real focus management; jsdom's focus model is incomplete (`activeElement` is unreliable in nested-shadow scenarios). Real-browser execution is the point. |
| Defer to "when 2nd component author asks for a runner" | Reverses the "ship platform standards immediately" CEO directive (2026-05-19, `feedback_ship_platform_standards_immediately.md`). The pattern is set by Header; the standard ships now, not when the 2nd asker arrives. |

---

## §11 Effort + scheduling

Estimated **6h** total, split:

- 1h — local wiring (dep install, scripts, local green-pass)
- 2h — CI job authoring + first run + cache wiring (Jordan G6 collab)
- 1h — empirical-failure verification on throw-away branch + recording proof
- 1h — README + brief cross-links + close-out PR description
- 1h — buffer for flake discipline + reviewer-feedback absorption

Deadline: **pre-1-July 2026**. The v4.5+ component sprint expects this gate to exist; landing it late means v4.5+ ships with the same perception-vs-reality gap that prompted this brief.

---

## §12 Cross-references

- Origin finding: [`docs/reviews/v2-1-0-post-merge-audit/G5.md`](../reviews/v2-1-0-post-merge-audit/G5.md) §2 NIT-3 + §5 FU-3
- Companion discipline doc: [`docs/contributing/chromatic-acceptance.md`](../contributing/chromatic-acceptance.md)
- Existing Chromatic wiring: [`docs/devops/chromatic.md`](../devops/chromatic.md)
- Existing audit-driven brief shape: [`docs/briefs/BRIEF-436-DOCS-SITE-GENERATOR.md`](./BRIEF-436-DOCS-SITE-GENERATOR.md)
- Flake-discipline reference: `~/.claude/skills/e2e-testing-standard.md` + `~/.claude/agents/sarah-mitchell-memory/patterns/`

---

Sarah Mitchell, G5 QA Lead
2026-05-20
