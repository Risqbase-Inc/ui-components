# Security policy — @risqbase-inc/ui-components

**Maintained by:** RisqBase d.o.o.
**Registered office:** Zaostroška 3, 10000 Zagreb, Croatia

---

## Reporting a vulnerability

If you believe you have found a security vulnerability in `@risqbase-inc/ui-components`, **please do not file a public GitHub issue.** Instead, report it privately to:

- **Email:** `security@risqbase.com`
- **GitHub:** use [GitHub's private vulnerability reporting](https://github.com/Risqbase-Inc/ui-components/security/advisories/new) for this repository.

Please include, where possible:

- A description of the vulnerability and its potential impact.
- Steps to reproduce, ideally including a minimal failing example.
- The affected version(s) of `@risqbase-inc/ui-components`.
- Your suggested remediation if known.

We will acknowledge your report within **2 business days**, work with you to verify and reproduce the issue, and aim to ship a fix within **30 days** of confirmation for critical issues (90 days for low-severity issues). For high-impact issues, we will coordinate disclosure with you.

## Supported versions

| Version | Supported |
|---|---|
| `1.3.x` and later | ✅ |
| `1.2.x` | security fixes only, until 2026-12-31 |
| `< 1.2.0` | ❌ end of life |

## Scope

This security policy covers:

- The npm package `@risqbase-inc/ui-components` (all sub-path exports).
- The Style Dictionary build pipeline in `tools/tokens-build/`.
- The token JSON corpus in `tokens/**`.
- The CI / release workflows in `.github/workflows/`.

This policy does **not** cover:

- Consumer applications that consume the package (`ralia.io`, `risqbase.com`, internal Cortex). Those have their own security policies and dedicated bug-bounty pathways where applicable.
- Vulnerabilities in upstream dependencies (`style-dictionary`, `react`, `tsup`, etc.). Please report those directly to their maintainers; if a dependency CVE meaningfully affects this package's usage we will track it in our advisories.

## Out of scope

- Reports about the GitHub UI, GitHub Actions, npm registry, or other GitHub-managed surfaces.
- Reports based on theoretical vulnerabilities without a demonstrable exploit path.
- Reports targeting outdated versions (≤ 1.1.x).

## Public advisories

When we publish a fix, we will:

1. Create a GitHub Security Advisory in this repository.
2. Bump the package version and release via the standard release-please flow.
3. Credit the reporter (if they consent) in the advisory and CHANGELOG.

Thank you for helping keep the RisqBase Design System and its consumers safe.

---

RisqBase d.o.o. is registered in Croatia and acts as the GDPR data controller for end-user data processed by RALIA. Registered office: Zaostroška 3, 10000 Zagreb, Croatia.
