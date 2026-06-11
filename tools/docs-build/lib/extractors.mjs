// Extractors: read sources of truth → return primitive values / HTML fragments.
//
// Pure functions. No I/O at module-load time. Caller passes paths so the
// generator + tests can both exercise these without coupling to cwd.
//
// BRIEF-436 §3 — keep these small + obvious; staleness audits start here.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import path from 'node:path'

/* ─────────────────────────── package.json ────────────────────────────── */

export function readPackageVersion(pkgJsonPath) {
  const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'))
  if (!pkg.version || typeof pkg.version !== 'string') {
    throw new Error(`package.json at ${pkgJsonPath} has no string version`)
  }
  return pkg.version
}

/* ─────────────────────────── spec version ────────────────────────────── */

// Reads the latest `docs/design-system/v*/RisqBase-DS-v*.md` filename and
// returns the version (e.g. "4.3"). Falls back to "4.2.1" if dir absent.
export function readSpecVersion(designSystemDir) {
  if (!existsSync(designSystemDir)) return '4.2.1'
  const versions = readdirSync(designSystemDir)
    .filter((f) => /^v\d/.test(f) && statSync(path.join(designSystemDir, f)).isDirectory())
    .map((f) => f.replace(/^v/, ''))
    .sort(compareSemverDesc)
  return versions[0] || '4.2.1'
}

function compareSemverDesc(a, b) {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0)
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pb[i] || 0) - (pa[i] || 0)
    if (diff !== 0) return diff
  }
  return 0
}

/* ─────────────────────────── components ──────────────────────────────── */

// Components are folders directly under src/{core,ai,data-viz,marketing}/
// that contain an index file. We exclude `theme` only — it's runtime helpers
// (setTheme/getTheme/themeInitScript), not a UI primitive. Everything else
// in those folders, including `TelemetryBeacon` (no-op stub, still part of
// the public API + still counted as a primitive per DS v4.3 §7.3), is in.
//
// Returns: { core: [...names], ai: [...], 'data-viz': [...], marketing: [...] }

const EXCLUDED_FOLDERS = new Set(['theme'])

export function scanComponents(srcDir) {
  const domains = ['core', 'ai', 'data-viz', 'marketing']
  const out = {}
  for (const domain of domains) {
    const domainDir = path.join(srcDir, domain)
    if (!existsSync(domainDir)) {
      out[domain] = []
      continue
    }
    out[domain] = readdirSync(domainDir)
      .filter((f) => {
        const full = path.join(domainDir, f)
        if (!statSync(full).isDirectory()) return false
        if (EXCLUDED_FOLDERS.has(f)) return false
        // Must have an index.tsx or index.ts
        return (
          existsSync(path.join(full, 'index.tsx')) ||
          existsSync(path.join(full, 'index.ts'))
        )
      })
      .sort()
  }
  return out
}

export function countComponents(componentsByDomain) {
  return Object.values(componentsByDomain).reduce((sum, arr) => sum + arr.length, 0)
}

/* ─────────────────────────── tokens ──────────────────────────────────── */

// Counts leaf entries in the tokens/**/*.json source of truth — deterministic
// regardless of build state. We count JSON *first* (it is always present in the
// repo) rather than the built dist/tokens.css: the CSS only exists after
// `build:tokens`, so preferring it made the number depend on build state — CI
// (which builds dist first) and a bare-node regen could disagree, producing
// perpetual docs:check drift. CSS stays as a fallback for the unlikely case the
// JSON source is missing. Same JSON basis as tools/readme-build, so the README
// and the docs site report the same token count.

export function countTokens({ tokensCssPath, tokensSrcDir }) {
  if (existsSync(tokensSrcDir)) {
    return countTokensFromJson(tokensSrcDir)
  }
  if (tokensCssPath && existsSync(tokensCssPath)) {
    return countTokensFromCss(tokensCssPath)
  }
  throw new Error(
    `Cannot count tokens: neither ${tokensSrcDir} (JSON) nor ${tokensCssPath} (CSS) exists.`,
  )
}

function countTokensFromCss(cssPath) {
  const css = readFileSync(cssPath, 'utf8')
  // Match `--token-name:` declarations. Dedupe by name so theme overrides
  // (same name in [data-theme="dark"]) count once.
  const matches = css.matchAll(/--([\w-]+)\s*:/g)
  const names = new Set()
  for (const m of matches) names.add(m[1])
  return names.size
}

function countTokensFromJson(tokensSrcDir) {
  // Count only the three tier directories: theme sets (tokens/themes/) are
  // overrides of existing tokens, not additional tokens — counting them
  // double-reported once the v4.4 dark set reached full coverage.
  let count = 0
  for (const tier of ['primitive', 'semantic', 'component']) {
    const dir = path.join(tokensSrcDir, tier)
    if (!existsSync(dir)) continue
    walkJson(dir, (json) => {
      count += countLeavesInToken(json)
    })
  }
  return count
}

function walkJson(dir, fn) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      walkJson(full, fn)
    } else if (entry.endsWith('.json')) {
      fn(JSON.parse(readFileSync(full, 'utf8')))
    }
  }
}

function countLeavesInToken(obj) {
  if (obj === null || typeof obj !== 'object') return 0
  // W3C Design Tokens leaf: object with `$value` key.
  if (Object.prototype.hasOwnProperty.call(obj, '$value')) return 1
  let n = 0
  for (const k of Object.keys(obj)) {
    if (k.startsWith('$')) continue // metadata, skip
    n += countLeavesInToken(obj[k])
  }
  return n
}

/* ─────────────────────────── chart types ─────────────────────────────── */

// Reads src/data-viz/ChartContainer/types.ts and pulls the ChartType union.
// Returns array of type names. v4.3 ships line/bar/sparkline; v4.4 adds 4 more.

export function readChartTypes(chartTypesPath) {
  if (!existsSync(chartTypesPath)) return []
  const src = readFileSync(chartTypesPath, 'utf8')
  // Match `export type ChartType = 'a' | 'b' | 'c'`
  const m = src.match(/export\s+type\s+ChartType\s*=\s*([^\n;]+)/)
  if (!m) return []
  const literals = [...m[1].matchAll(/'([\w-]+)'/g)].map((mm) => mm[1])
  return literals
}

/* ─────────────────────────── themes ──────────────────────────────────── */

// Reads src/core/theme/index.ts and pulls the Theme union. ALWAYS 3 today:
// light/dark/hc. Print is a media query, NOT a `data-theme` value — a
// historical doc-site bug claimed "4 themes (light · dark · HC · print)".

export function readThemes(themeIndexPath) {
  const src = readFileSync(themeIndexPath, 'utf8')
  const m = src.match(/export\s+type\s+Theme\s*=\s*([^\n;]+)/)
  if (!m) throw new Error(`Cannot find Theme type in ${themeIndexPath}`)
  return [...m[1].matchAll(/'([\w-]+)'/g)].map((mm) => mm[1])
}

/* ─────────────────────────── changelog parsing ───────────────────────── */

// CHANGELOG.md is a hybrid: release-please appends `## [x.y.z] (date)` for
// every cut release; humans append narrative `### ` headings under
// `## Unreleased`. We parse both styles and emit a uniform entry list.
//
// Each entry has:
//   { id, title, date, version, kind: 'released'|'unreleased', html }

export function parseChangelog(changelogPath) {
  const md = readFileSync(changelogPath, 'utf8')
  const lines = md.split('\n')
  const entries = []
  let current = null
  let inUnreleased = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Top-level h1 → skip
    if (line.startsWith('# ') && !line.startsWith('## ')) continue

    // Released version heading. Three forms in our CHANGELOG:
    //   `## [2.0.0](https://…/compare/v1.4.0...v2.0.0) (2026-05-20)`  ← release-please
    //   `## 1.2.0 — 2026-02-03`                                      ← hand-written
    //   `## 1.3.0 (pending tag) — Design System v4.2`                ← pending
    //
    // Strategy: capture version greedily, then scan the line for the LAST
    // `(YYYY-MM-DD)` date if present. Cheaper + more forgiving than one
    // ever-growing regex.
    const headingVersionMatch = line.match(/^##\s+\[?(\d+\.\d+\.\d+(?:[.\w-]*))\]?/)
    let releasedMatch = null
    let releasedAltMatch = null
    if (headingVersionMatch) {
      const dateMatches = [...line.matchAll(/\((\d{4}-\d{2}-\d{2})\)/g)]
      const dashDateMatch = line.match(/—\s*(\d{4}-\d{2}-\d{2})/)
      if (dateMatches.length > 0) {
        releasedMatch = [line, headingVersionMatch[1], dateMatches[dateMatches.length - 1][1]]
      } else if (dashDateMatch) {
        releasedAltMatch = [line, headingVersionMatch[1]]
      } else {
        // Version present but no date — still treat as a released line
        // (e.g. `## 1.3.0 (pending tag) — Design System v4.2`).
        releasedAltMatch = [line, headingVersionMatch[1]]
      }
    }
    if (releasedMatch || releasedAltMatch) {
      if (current) entries.push(finaliseEntry(current))
      const version = (releasedMatch || releasedAltMatch)[1].trim()
      const date = releasedMatch ? releasedMatch[2] : extractDateFromHeading(line) || ''
      current = {
        id: `v${version.replace(/\./g, '-')}`,
        title: `v${version}${date ? ` — ${date}` : ''}`,
        date,
        version,
        kind: 'released',
        bodyLines: [],
      }
      inUnreleased = false
      continue
    }

    // Unreleased section start
    if (line.match(/^##\s+Unreleased\b/i)) {
      if (current) entries.push(finaliseEntry(current))
      current = null
      inUnreleased = true
      continue
    }

    // Narrative entry inside Unreleased: `### Title`
    if (inUnreleased && line.startsWith('### ')) {
      if (current) entries.push(finaliseEntry(current))
      const title = line.replace(/^###\s+/, '').trim()
      current = {
        id: slugify(title),
        title,
        date: 'Unreleased',
        version: 'Unreleased',
        kind: 'unreleased',
        bodyLines: [],
      }
      continue
    }

    // Body content
    if (current) current.bodyLines.push(line)
  }
  if (current) entries.push(finaliseEntry(current))

  // Dedupe IDs (CHANGELOG sometimes has repeated `### Documentation`).
  const seen = new Map()
  for (const e of entries) {
    const n = (seen.get(e.id) || 0) + 1
    seen.set(e.id, n)
    if (n > 1) e.id = `${e.id}-${n}`
  }

  return entries
}

function extractDateFromHeading(line) {
  const m = line.match(/(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : ''
}

function finaliseEntry(e) {
  const body = e.bodyLines.join('\n').trim()
  return {
    id: e.id,
    title: e.title,
    date: e.date,
    version: e.version,
    kind: e.kind,
    html: renderMarkdownFragment(body),
  }
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64)
}

/* ─────────────────────────── markdown → HTML ─────────────────────────── */

// Tiny, deliberately-limited markdown renderer covering the subset our
// CHANGELOG actually uses: paragraphs, bullet lists, **bold**, `code`,
// [link](url), inline-italic *via underscores* (rare), and `#### ` /
// `### ` headings under an entry (rendered as h4/h5 to nest correctly).
//
// We deliberately don't pull in a dependency — the changelog format is
// stable + narrow, and the design site is a public artefact where a 100-line
// renderer is auditable in ten seconds.

export function renderMarkdownFragment(md) {
  const lines = md.split('\n')
  const out = []
  let inList = false
  let inCode = false
  let para = []

  const flushPara = () => {
    if (para.length === 0) return
    out.push(`<p>${inline(para.join(' '))}</p>`)
    para = []
  }
  const closeList = () => {
    if (inList) {
      out.push('</ul>')
      inList = false
    }
  }

  for (const raw of lines) {
    // Fenced code (rare in our changelog but supported defensively)
    if (raw.startsWith('```')) {
      flushPara()
      closeList()
      if (inCode) {
        out.push('</code></pre>')
        inCode = false
      } else {
        out.push('<pre><code>')
        inCode = true
      }
      continue
    }
    if (inCode) {
      out.push(escapeHtml(raw))
      continue
    }

    // Sub-headings inside an entry
    if (raw.startsWith('#### ')) {
      flushPara()
      closeList()
      out.push(`<h4>${inline(raw.slice(5))}</h4>`)
      continue
    }
    if (raw.startsWith('### ')) {
      flushPara()
      closeList()
      out.push(`<h5>${inline(raw.slice(4))}</h5>`)
      continue
    }

    // Bullet list
    if (raw.match(/^\s*-\s+/)) {
      flushPara()
      if (!inList) {
        out.push('<ul>')
        inList = true
      }
      out.push(`<li>${inline(raw.replace(/^\s*-\s+/, ''))}</li>`)
      continue
    }

    // Blank line — close paragraph + list
    if (raw.trim() === '') {
      flushPara()
      closeList()
      continue
    }

    // Default: accumulate as paragraph
    para.push(raw.trim())
  }

  flushPara()
  closeList()
  if (inCode) out.push('</code></pre>')

  return out.join('\n')
}

function inline(s) {
  // Escape-first approach: pre-escape the whole string so prose `<` and
  // `&` become entities, then apply tag-emitting substitutions whose
  // captures are already entity-safe. This avoids the double-escape bug
  // that arises when we escape capture-contents AND escape gaps afterwards.

  let out = escapeHtml(s)

  // [text](url) — `[`/`]`/`(`/`)` survive escapeHtml unchanged, so the
  // markdown still matches. Strip backslashes the entity-converter would
  // have left untouched.
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${attrFromEscaped(u)}">${t}</a>`)

  // `code` — backticks survive escapeHtml unchanged.
  out = out.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`)

  // **bold**
  out = out.replace(/\*\*([^*]+)\*\*/g, (_, b) => `<strong>${b}</strong>`)

  // *italic* / _italic_ (require word-boundary on the left so we don't
  // greedily eat `**bold**` patterns).
  out = out.replace(/(^|[\s(])\*([^*]+)\*/g, (_, p, i) => `${p}<em>${i}</em>`)
  out = out.replace(/(^|[\s(])_([^_]+)_/g, (_, p, i) => `${p}<em>${i}</em>`)

  return out
}

// URL inside an already-escaped string: spaces → %20, leave entities alone.
function attrFromEscaped(s) {
  return s.replace(/\s/g, '%20')
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function attr(s) {
  return escapeHtml(s).replace(/\s/g, '%20')
}
