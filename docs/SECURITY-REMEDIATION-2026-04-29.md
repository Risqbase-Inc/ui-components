# Security Remediation — ui-components — 2026-04-29

**Brief**: BRIEF-326 (`Risqbase-Inc/Ralia` repo, `docs/briefs/BRIEF-326-UI-COMPONENTS-VULN-REMEDIATION-AND-PUBLIC-RESTORE.md`)
**Branch**: `fix/brief-326-vulns`
**Implementer**: Marcus Chen (G2 — Security Architect)
**Reviewers required**: G6 (Jordan) + G1 (Alex) — G2 self-review forbidden per BRIEF-329 §5b
**CI window**: feature-branch push only, no PR until 2026-05-01 reset

---

## Outcome

**All vulnerabilities resolved. `npm audit` reports `found 0 vulnerabilities`.**

| State          | Total | High | Moderate | Low |
| -------------- | ----- | ---- | -------- | --- |
| Before         | 8     | 5    | 3        | 0   |
| After          | 0     | 0    | 0        | 0   |
| Resolved       | 8     | 5    | 3        | 0   |

> **Note on the BRIEF-326 alert count.** The brief reads "20 alerts" because it counts the GHSA advisories aggregated across multiple vulnerable transitive packages (e.g. Next.js alone accounts for 9 distinct GHSA advisories on a single installed package). At the package level, `npm audit` reports 8 vulnerable packages. All 8 are now fixed; all underlying GHSA advisories are resolved.

Before-state evidence:
- `docs/SECURITY-BEFORE-2026-04-29.txt` (human-readable `npm audit` output)
- `docs/SECURITY-BEFORE-2026-04-29.json` (machine-readable form)

After-state evidence:
- `docs/SECURITY-AFTER-2026-04-29.txt` (human-readable `npm audit` output → `found 0 vulnerabilities`)
- `docs/SECURITY-AFTER-2026-04-29.json` (machine-readable form)

---

## Per-vulnerability resolution

### Auto-fixed by `npm audit fix` (7 packages)

| Package | Before | After | Severity | GHSA(s) |
|---------|--------|-------|----------|---------|
| `ajv` | <6.14.0 | 6.15.0 | moderate | GHSA-2g4f-4pwh-qvx6 (ReDoS via `$data`) |
| `brace-expansion` | <1.1.13 | (transitive bumped) | moderate | GHSA-f886-m6hf-6m8v (process hang) |
| `flatted` | <=3.4.1 | 3.4.2 | high | GHSA-25h7-pfq9-p65f (DoS), GHSA-rf6f-7fwh-wjgh (Prototype Pollution) |
| `minimatch` | <=3.1.3 | 3.1.5 | high | GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj, GHSA-23c5-xmqv-rm74 (3× ReDoS) |
| `picomatch` | 4.0.0–4.0.3 | 4.0.4 | high | GHSA-3v7f-55p6-f55p (Method Injection), GHSA-c2c7-rcm5-vvqj (ReDoS) |
| `rollup` | 4.0.0–4.58.0 | 4.60.2 | high | GHSA-mw96-cpmx-2vgc (Path Traversal Arbitrary File Write) |
| `next` | 16.2.x (vulnerable) | 16.2.4 | high (+1 moderate) | 9× GHSAs incl. CSRF bypass, DoS variants, HTTP smuggling, image cache exhaustion |

All resolved by a vanilla `npm audit fix` — no breaking changes, no `--force` needed.

### Resolved via npm overrides (1 package)

| Package | Before | After | Mechanism |
|---------|--------|-------|-----------|
| `postcss` | 8.4.31 (bundled inside next & tsup) | 8.5.12 | `overrides.postcss: ^8.5.10` in `package.json` |

`npm audit fix` flagged this as requiring `npm audit fix --force` because it would have downgraded Next.js to `9.3.3` to match a stale advisory tree — clearly the wrong move (catastrophic regression for a package on 16.2.4). Instead I added an `overrides` block forcing all transitive `postcss` instances to `^8.5.10`, which contains the fix for **GHSA-qx2v-qp2m-jg93** (XSS via unescaped `</style>` in CSS stringify output). Verified post-install: every `postcss` resolution is `8.5.12`.

`postcss` 8.5.x is a backward-compatible minor bump from 8.4.x — same major API, no breaking changes per upstream changelog. Safe override.

### No major-version bumps needed

The brief's risk section anticipated a major Next.js bump might be required. **It was not** — `next@16.2.4` is the latest version, and all 9 Next.js advisories are addressed in the patch chain that `npm audit fix` already had access to. `peerDependencies.next` remains `>=13.0.0` (unchanged); `devDependencies.next` bumped from `^16.1.3` to `^16.2.4` to match RALIA's pinned version per BRIEF-326 §Phase 2.

---

## package.json changes

```diff
   "devDependencies": {
     ...
-    "next": "^16.1.3",
+    "next": "^16.2.4",
     ...
   },
+  "overrides": {
+    "postcss": "^8.5.10"
+  },
```

Plus `version`: `1.2.0` → `1.3.0` (minor bump per BRIEF-326 §Phase 3 — vuln fixes are bug-class, but security overrides + dep modernisation justify a minor).

---

## Verification steps run

| Check | Command | Result |
|-------|---------|--------|
| Vulnerability count | `npm audit` | `found 0 vulnerabilities` |
| Build still succeeds | `npm run build` | tsup emits CJS (16.21 KB) + ESM (11.75 KB) + DTS, all green |
| Smoke import (CJS) | `node -e "const m = require('./dist/index.js'); console.log(Object.keys(m))"` | All 12 components export: `Badge, Button, ComingSoonBadge, Footer, GhostButton, Header, MostPopularBadge, NewBadge, PrimaryButton, SecondaryButton, SectionEyebrow, StandaloneProductBadge` |
| Resolved postcss tree | `npm ls postcss` | `8.5.12 overridden` everywhere |
| Resolved vuln packages | `npm ls next picomatch rollup minimatch flatted ajv` | All on patched versions |

ESM smoke import via raw `node` fails on `next/link` subpath (pre-existing — Next subpath imports require a Next bundler; this is how the package has always been published and is unaffected by the version bumps). CJS path validates the build, and consuming Next.js apps resolve subpaths natively.

---

## Outstanding

**None.** All 8 vulnerable packages resolved. All GHSA advisories closed. 0 vulnerabilities in the dep tree.

---

## What this PR does NOT do (deferred to 1 May)

Per CEO directive (CI-minute exhaustion window 2026-04-29 → 2026-05-01):

- **No `npm publish`** — registry push deferred to 1 May after PR review + merge.
- **No `gh pr create`** — PR opens 1 May after RALIA's CI minutes reset.
- **No consumer-project bumps** — RALIA / Cortex / RisqBase consumer PRs follow once the new package ships.

---

## 1 May execution checklist (for the maintainer)

1. Open PR against `Risqbase-Inc/ui-components` `main`. Required reviewers: **G6 Jordan + G1 Alex** (per BRIEF-329 §5b — G2 self-review forbidden).
2. After merge:
   ```
   git checkout main
   git pull
   npm ci
   npm run build
   npm publish
   npm view @risqbase-inc/ui-components versions   # verify 1.3.0 listed
   ```
3. Open consumer-bump PRs in RALIA / Cortex / RisqBase: `npm install @risqbase-inc/ui-components@^1.3.0`.
4. Verify the **Dependabot dashboard** for `Risqbase-Inc/ui-components` now shows 0 active alerts. (BRIEF-326 §Phase 5 — repo is already public per CEO action 2026-04-28; nothing to flip, only verify.)
5. Notify Jordan G6 that **BRIEF-331** (pre-push dependency-integrity guard re-introduction) can resume — its blocker (this brief) is now closed.

---

## Audit trail

- 2026-04-29 02:24 UTC — branch `fix/brief-326-vulns` created off `main` (commit `6e701d5`)
- 2026-04-29 02:24 UTC — `npm install` on clean tree → 8 vulns reported
- 2026-04-29 02:25 UTC — before-state captured to `docs/SECURITY-BEFORE-2026-04-29.{txt,json}`
- 2026-04-29 02:26 UTC — `npm audit fix` → 6 vulns auto-resolved, 2 (postcss + next-via-postcss) flagged for `--force`
- 2026-04-29 02:27 UTC — `overrides.postcss: ^8.5.10` added to `package.json`; `next` devDep bumped to `^16.2.4` to align with RALIA
- 2026-04-29 02:28 UTC — `npm install` → `found 0 vulnerabilities`
- 2026-04-29 02:28 UTC — `npm run build` → green (CJS+ESM+DTS)
- 2026-04-29 02:29 UTC — CJS smoke import → all 12 exports load
- 2026-04-29 02:30 UTC — `npm version minor` → 1.2.0 → 1.3.0 (no git tag, per CEO directive)
- 2026-04-29 02:30 UTC — after-state captured to `docs/SECURITY-AFTER-2026-04-29.{txt,json}`

---

**Status**: ready for G6 + G1 peer review. Push to `origin/fix/brief-326-vulns` on completion. PR opens 2026-05-01.
