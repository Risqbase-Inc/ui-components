# RisqBase Design System v4.2 — Implementation Plan

**Status:** CEO-approved, sprint-ready
**Date:** 2026-05-08
**Authors (sections):** PM, G1 (Architecture), G4 (Design), Frontend (reports to G1), G6 (DevOps)
**Synthesis:** Multi-agent orchestration
**Depends on:** [PR #2](https://github.com/Risqbase-Inc/ui-components/pull/2) (v4.2 spec / plan / audit / README) merging to land the audit row IDs this plan references.

---

## 1. Executive summary

v4.2 is a documentation release. The audit identifies 22 implementation rows that are spec'd-but-not-built; this programme ships **20** of them across **6 two-week sprints (~12 weeks)**, exiting through gates G1 → G4 → G2 → G5 → G6 → G7. Outputs: `@risqbase-inc/ui-components` v1.3.0 with new `data-viz/` and `ai/` domains in **light + dark + HC modes**, public doc site at `design.risqbase.com`, Figma library synced from JSON, and three consumer apps (RALIA, RisqBase, Cortex) on the new package.

**Out of v4.2 scope:** telemetry rows U4.1, U4.2, U4.3 — deferred to post-launch when the in-house Plausible-spec tag → Cortex integration is built.

---

## 2. Decisions locked

| # | Decision | Choice |
|---|---|---|
| D1 | Repo strategy | **Co-locate** doc site in `ui-components`. Spec §22.1 separate-repo recommendation flagged for v4.2.1 reconciliation. Dual-licence per path: `docs/**` CC BY-NC, rest MIT. |
| D2 | Token direction | **JSON canonical, Figma downstream** (per spec §15.8.2). |
| D3 | Token format | W3C Design Tokens Format JSON in `/tokens/**/*.json`. |
| D4 | Package boundaries | **Restructure `src/` to domain folders** (`core/ ai/ data-viz/ content/ tokens/ primitives/`). Additive via root re-export — v1.x consumers unaffected. |
| D5 | Token pipeline | **Style Dictionary + Figma Variables REST API.** Token Studio rejected. |
| D6 | Doc-site stack | **Astro + MDX** (per spec §22.5). |
| D7 | Live preview | **Sandpack.** Framework-agnostic; real package resolution. |
| D8 | Search | **Pagefind.** Static, build-time, zero infra. |
| D9 | Chart library | **Visx 3.x** (audit U1.9 fill). |
| D10 | Telemetry | **Out of scope for v4.2.** Post-launch integration via in-house Plausible-spec tag → Cortex. Audit rows U4.1, U4.2, U4.3 deferred. |
| D11 | Modes shipped in v4.2 | **Light + dark + HC.** No mode deferral. |
| D12 | npm publish trigger | **Tag-driven** (`v*.*.*`). |
| D13 | Branch protection | `main` requires CI + visual-regression + preview-deploy; 1 reviewer; CODEOWNERS for `tokens/**`, `data-viz/**`, `ai/**`. Signed commits deferred to v4.3. |
| D14 | Implementation version | **`1.3.0`**. |
| D15 | Doc-site launch posture | **Public from day one** (per spec §18.1). All three modes ship at launch — no "visibly incomplete" risk. |

---

## 3. Sprint plan (6 sprints × 2 weeks, weeks 1–12)

| Sprint | Weeks | Audit rows / work | Primary owner | Exit gate |
|---|:---:|---|---|---|
| **S1 — Foundations** | 1–2 | U5.2, U5.6, U6.2; theming infrastructure (`data-theme` swap); `src/` domain restructure | G1 (Architecture) | G1 |
| **S2 — Data-viz domain** | 3–4 | U1.14, U1.13, U1.8, U2.1, U2.2 | Frontend (reports to G1) | G1 + G4 |
| **S3 — AI domain + LongOperation** | 5–6 | U2.3, U2.4, U2.5, U2.6, U2.7, U2.10 | Frontend (reports to G1) | G1 + G4 |
| **S4 — Content + dark/HC values** | 7–8 | U3.2, U3.4, U3.7, U5.5 (all three modes), U4.4 | G8 / G4 | G4 |
| **S5 — Figma library + visual regression** | 9–10 | U5.3 sync pipeline, dark/HC Figma variants per component, three-mode Chromatic baseline | G4 / G5 | G5 |
| **S6 — Adoption + go-live** | 11–12 | Doc-site cutover, three-consumer migration, U6.6 publish, doc-site theme toggle, G7 sign-off | G6 (DevOps) | G6 → G7 |

**Order rationale:** tokens (S1) unblock everything. `data-viz/` (S2) unblocks `<Gauge>` for both RALIA (S2) and the AI primitives that wrap chart shells (S3). Dark/HC value design (S4) parallels content work; Figma library variants land in S5 so visual-regression baselines capture all three modes before consumer migration. Consumer migration (S6) depends on a published, stable, three-mode-verified package.

---

## 4. Owner-by-row matrix (20 audit `[~]` rows in v4.2 scope)

| Row | Description | Primary | Reviewer |
|---|---|---|---|
| U1.8 | Print variants per chart type (spec patch) | G4 | Frontend |
| U1.13 | 3 composite chart-pattern recipe bodies | G4 | Frontend |
| U1.14 | `data-viz/` domain shipped | Frontend | G1 |
| U2.1 | Generic `<Gauge>` primitive | Frontend | G1 |
| U2.2 | RALIA Risk Gauge wraps primitive | Frontend | G1 |
| U2.3 | New `ai/` domain | G1 | G4 |
| U2.4 | Citation Chip → `ai/` | Frontend | G1 |
| U2.5 | StreamingText → `ai/` | Frontend | G1 |
| U2.6 | PromptChip → `ai/` | Frontend | G1 |
| U2.7 | LongOperation → `core/` | Frontend | G1 |
| U2.10 | RALIA outcome patterns reference shared | Frontend | G4 |
| U3.2 | Canonical glossary entries (~80 terms) | G8 | G4 |
| U3.4 | §10.4 number-formatting expansion (spec) | G8 | G4 |
| U3.7 | `voice_examples` schema + lint rule | G4 | G1 |
| U4.4 | Deprecation warning system (`console.warn` only — not telemetry) | G1 | Frontend |
| U5.2 | Figma `$extensions` metadata reconciliation | G1 | G4 |
| U5.3 | Figma Variables sync pipeline | G1 | G4 |
| U5.5 | **Light + dark + HC override token files** (all three modes) | G1 | G4 |
| U5.6 | Token validation lint | G1 | Frontend |
| U6.2 | §15.6 token enumeration (~30 net-new) | G1 | G4 |

**Out of v4.2 scope:** U4.1, U4.2, U4.3 (telemetry — deferred to post-launch).

---

## 5. Section briefs

### 5.1 Architecture (G1 (Architecture), G1)
- `src/{core,ai,data-viz,content,tokens,primitives}/`; `tokens/*.json` source of truth; `tools/{tokens-build,figma-publish,figma-diff,codemods}/`; `docs/{app,content}/` co-located.
- Token pipeline: W3C JSON → Style Dictionary → CSS vars + TS exports + Tailwind preset values + Figma JSON. Figma is downstream; round-trip via REST API.
- **Theming infrastructure:** `data-theme` attribute swap on `<html>` (`light` | `dark` | `hc`); CSS custom properties cascade per mode; SSR-safe initial-mode resolution.

### 5.2 Design / Figma / Tokens (G4 (Design), G4)
- One Figma library, paged 00–99, mirroring package domains.
- Three Figma Variable collections: `primitive`, `semantic`, `component` — locked alias chain (primitive → semantic → component → consumed by `<Button>`).
- **Per role token, three values** (light + dark + HC). ~30 role tokens × 3 = ~90 values to design + verify against AA contrast.
- Designer flow: propose in `99 _proposed` → G4 reviews in Figma comments → JSON PR → CI publishes via `figma-publish` REST API.
- Figma library: dark + HC variant frames per component.
- Spec gap to fill in v4.2.1: motion tokens enumeration.

### 5.3 Doc-site implementation (Frontend (reports to G1))
- Astro + MDX. Component page = one MDX per component at `apps/docs/content/components/<name>.mdx` rendered by `<ComponentLayout>`.
- Sections: frontmatter → Overview → Anatomy SVG (using only §7.0 nouns) → auto-generated Props (`react-docgen-typescript` from `src/types.ts`) → Sandpack live previews → A11y from colocated `*.accessibility.md` → Do/Don't → Tokens from colocated `*.tokens.md` → SourceLink → Changelog filtered by tag.
- Theme toggle in chrome (`light`/`dark`/`hc`); persisted to `localStorage`.
- Pagefind static index. Source links branch-aware via `process.env.VERCEL_GIT_COMMIT_REF` (preview) or release tag (production).
- Estimate: **~25 person-days** (23 Next.js baseline + 2 for Astro learning curve and theme toggle).
- Parity-gate CI (§18.1): PR fails if `src/**` changes without `apps/docs/content/**` changes.

### 5.4 DevOps / CI (G6 (DevOps), G6)
- Single Vercel project `risqbase-ds-docs`. Hobby tier initially; Pro before public launch.
- 4 GitHub Actions workflows: `ci.yml`, `preview-deploy.yml`, `publish.yml` (revised tag-driven), `visual-regression.yml` (Chromatic). No `continue-on-error: true` anywhere.
- Visual-regression baselines for **all three modes** — pixel diff > 0 fails CI.
- Branch protection on `main`: required checks + 1 reviewer + CODEOWNERS for `tokens/**`, `data-viz/**`, `ai/**`. Signed commits deferred to v4.3.
- Rollback: doc site → Vercel "Promote to Production" (≤30s); npm → `npm deprecate` + ship-forward patch (GitHub Packages blocks unpublish after 72h).

---

## 6. Risks (severity-ordered)

- **R1 Three-consumer migration drift** — RALIA, RisqBase, Cortex absorb on independent timelines; v1.3.0 sits unused for weeks. **Mitigation:** CEO migration brief with a 14-day window from npm publish; PM holds daily standup until all three are on the new version.
- **R2 Token-pipeline regression breaks consumers silently** — W3C-format migration produces subtly different output values. **Mitigation:** G1 ships token-output diff as CI artefact; G5 (G5) gates S1 exit on visual-regression green across all three consumers.
- **R3 Three-mode contrast verification overruns S5** — designing dark + HC for ~30 role tokens to AA contrast is heavier than the audit estimated. **Mitigation:** G4 starts dark/HC value design in S4 (parallel with content work), not S5; visual-regression budget extended.
- **R4 RALIA Risk Gauge visual regression** (U2.2) — wrapper-of-primitive refactor changes pixel output mid-flight. **Mitigation:** Chromatic baseline before S2; pixel-diff > 0 fails CI; G4 gates the merge.
- **R5 Sonification scope creep** — sonification was in `plan.md` but NOT in `spec.md` (audit U1.7 flag); if it re-surfaces during S2, S2 budget overruns. **Mitigation:** PM holds the line — sonification is a v4.2.1 spec patch first, then v4.3 implementation if it makes the spec.

---

## 7. Definition of done — "v4.2 implementation has shipped"

- [ ] `@risqbase-inc/ui-components` `1.3.0` published to GitHub Packages; install verified from a clean machine.
- [ ] All 20 audit `[~]` rows in scope flipped to `[x]` in a v4.2.1 audit pass authored by G4.
- [ ] `design.risqbase.com` live and indexed; v4.2 changelog post (U6.6) and three composite chart-pattern recipe bodies (U1.13) accessible.
- [ ] All three modes (light + dark + HC) verified across all three consumers — Chromatic green.
- [ ] `Risqbase-Inc/Ralia`, `Risqbase-Inc/RisqBase`, `internal admin repo` on `1.3.0` with green CI.
- [ ] Figma library published; sync verified end-to-end (change a token, observe Figma update <5min).
- [ ] CEO sign-off (G7) recorded against the v4.2 implementation closing brief.

---

## 8. Open spec gaps (v4.2.1 patch backlog)

1. §22.1 separate-repo recommendation → "co-locate" (per D1).
2. §22.5 stack pick — Astro confirmed; Next.js variant ruled out (per D6).
3. **Motion tokens** enumerated: `duration.motion.{instant,reactive,considered,celebratory}`, `easing.{standard,emphasised,decelerated}` (G4's flag).
4. U1.9 chart library — Visx 3.x decision recorded (per D9).
5. **Sonification** (audit U1.7 flag) — referenced in `plan.md` but missing from `spec.md`; reconcile or formally defer to v4.3.
6. U1.13 recipe scopes — three recipe IDs need one-paragraph scope each (G4 owes).
7. U3.2 glossary term list — authoritative source list (G8 owes).
8. U4.3 telemetry-dashboard "consumer" disambiguation — moot for v4.2 (deferred); may resurface when telemetry is built.

---

## 9. Source artefacts

The agent sections that fed this synthesis are at `/tmp/risqbase-ds-plan/` on the orchestrating machine:
- `pm-david.md` — sprint plan, owner matrix, risks, DoD, version
- `arch-alex.md` — repo, stack, package, token pipeline, versioning
- `design-elena.md` — Figma library, token architecture, sync workflow, doc-site IA
- `frontend-priya.md` — doc-site implementation, page templates, search, deep-link, estimate
- `devops-jordan.md` — Vercel, GitHub Actions, branch protection, telemetry (deprecated by D10), rollback
