#!/usr/bin/env node
// tools/readme-build/index.mjs — README auto-generator (marker-delimited).
//
// The README drifts because releases change the *facts* (version, exports,
// component inventory, CHANGELOG) but nothing regenerates the prose. This tool
// regenerates the factual sections from the SAME sources of truth the
// design.risqbase.com site uses (BRIEF-436 `tools/docs-build` extractors), so
// the package, the docs site, and the README can never disagree again.
//
//   npm run readme:build   — fill the <!-- AUTOGEN --> blocks in README.md
//   npm run readme:check   — fail (exit 1) if README.md drifts from output
//
// Only the marked blocks are generated; all hand-written prose is preserved.
// Runs on bare node — no dependencies, no build step required (token count is
// read from the tokens/ JSON source, not the built dist/tokens.css, so the
// result is identical in a fresh checkout and in CI).

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  readPackageVersion,
  readSpecVersion,
  scanComponents,
  countComponents,
  countTokens,
  parseChangelog,
} from '../docs-build/lib/extractors.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '..', '..')
const PKG = '@risqbase-inc/ui-components'

const PATHS = {
  pkgJson: path.join(REPO_ROOT, 'package.json'),
  changelog: path.join(REPO_ROOT, 'CHANGELOG.md'),
  srcDir: path.join(REPO_ROOT, 'src'),
  tokensSrcDir: path.join(REPO_ROOT, 'tokens'),
  designSystemDir: path.join(REPO_ROOT, 'docs', 'design-system'),
  readme: path.join(REPO_ROOT, 'README.md'),
}

const AUTOGEN_KEYS = ['status', 'imports', 'components', 'changelog']

const DOMAIN_BLURB = {
  core: 'Foundational UI + layout',
  ai: 'AI / IRIS surfaces',
  'data-viz': 'Charts, gauges + impact graphs',
  marketing: 'Marketing-site surfaces',
  primitives: 'Low-level building blocks',
}

/* ─────────────────────────── source of truth ─────────────────────────── */

// Read the public subpath exports (excluding the root + package.json meta).
function readExportSubpaths(pkgJsonPath) {
  const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'))
  return Object.keys(pkg.exports || {})
    .filter((k) => k !== '.' && k !== './package.json')
    .map((k) => k.replace(/^\.\//, ''))
}

// Folder scan for a single domain, mirroring extractors.scanComponents'
// predicate. scanComponents covers core/ai/data-viz/marketing; we use this
// for `primitives`, which is also a published export.
function listDomain(srcDir, domain) {
  const dir = path.join(srcDir, domain)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => {
      const full = path.join(dir, f)
      return (
        statSync(full).isDirectory() &&
        f !== 'theme' &&
        (existsSync(path.join(full, 'index.tsx')) || existsSync(path.join(full, 'index.ts')))
      )
    })
    .sort()
}

export function collect(paths = PATHS) {
  const four = scanComponents(paths.srcDir) // { core, ai, 'data-viz', marketing }
  const primitives = listDomain(paths.srcDir, 'primitives')
  const byDomain = { ...four, primitives }

  return {
    version: readPackageVersion(paths.pkgJson),
    specVersion: readSpecVersion(paths.designSystemDir),
    byDomain,
    componentCount: countComponents(four) + primitives.length,
    // Count from the tokens/ JSON source (omit the css path) so the number is
    // deterministic with or without a prior `build:tokens`.
    tokenCount: countTokens({ tokensSrcDir: paths.tokensSrcDir }),
    exportSubpaths: readExportSubpaths(paths.pkgJson),
    releases: parseChangelog(paths.changelog)
      .filter((e) => e.kind === 'released')
      .slice(0, 6),
  }
}

/* ─────────────────────────── renderers (markdown) ────────────────────── */

const DOMAIN_ORDER = ['core', 'ai', 'data-viz', 'marketing', 'primitives']

function activeDomains(d) {
  return DOMAIN_ORDER.filter((x) => (d.byDomain[x] || []).length > 0)
}

export function renderSections(d) {
  return {
    status: renderStatus(d),
    imports: renderImports(d),
    components: renderComponents(d),
    changelog: renderChangelog(d),
  }
}

function renderStatus(d) {
  const domains = activeDomains(d)
    .map((x) => `\`${x}\``)
    .join(' · ')
  return [
    `> **Latest published:** \`${d.version}\` · **Design system:** \`GOV-DS-2026-02 v${d.specVersion}\``,
    `>`,
    `> **${d.componentCount} components** across ${domains} · **${d.tokenCount} design tokens** (primitive · semantic · component tiers).`,
    `>`,
    `> Live component gallery, token reference + changelog: **[design.risqbase.com](https://design.risqbase.com)**.`,
  ].join('\n')
}

function renderImports(d) {
  const lines = []
  for (const domain of DOMAIN_ORDER) {
    const names = d.byDomain[domain] || []
    if (names.length === 0) continue
    const shown = names.slice(0, 4)
    const suffix = names.length > shown.length ? ', …' : ''
    lines.push(`import { ${shown.join(', ')}${suffix} } from '${PKG}/${domain}'`)
  }
  lines.push(`import { tokens } from '${PKG}/tokens'`)
  return '```ts\n' + lines.join('\n') + '\n```'
}

function renderComponents(d) {
  const rows = activeDomains(d).map((domain) => {
    const names = d.byDomain[domain].join(', ')
    return `| \`${domain}\` | ${DOMAIN_BLURB[domain] || ''} | ${names} |`
  })
  const table = ['| Domain | Purpose | Components |', '|---|---|---|', ...rows].join('\n')
  return (
    table +
    '\n\n' +
    '`content/` is a reserved export for i18n string bundles (not yet populated). ' +
    'Subpaths above are tree-shakeable; the root barrel re-exports everything for back-compat.'
  )
}

function renderChangelog(d) {
  if (d.releases.length === 0) return '_See [CHANGELOG.md](CHANGELOG.md)._'
  const items = d.releases.map((e) => `- \`${e.version}\`${e.date ? ` — ${e.date}` : ''}`)
  return items.join('\n') + '\n\nFull history: [CHANGELOG.md](CHANGELOG.md).'
}

/* ─────────────────────────── marker injection ────────────────────────── */

export function inject(readme, sections) {
  let out = readme
  for (const key of AUTOGEN_KEYS) {
    const re = new RegExp(
      `(<!-- AUTOGEN:START ${key} -->\\n)[\\s\\S]*?(\\n<!-- AUTOGEN:END ${key} -->)`,
    )
    if (!re.test(out)) {
      throw new Error(
        `README.md is missing the AUTOGEN markers for "${key}". ` +
          `Expected a block delimited by <!-- AUTOGEN:START ${key} --> … <!-- AUTOGEN:END ${key} -->.`,
      )
    }
    out = out.replace(re, `$1${sections[key]}$2`)
  }
  return out
}

export function generate(paths = PATHS) {
  const data = collect(paths)
  const sections = renderSections(data)
  const current = readFileSync(paths.readme, 'utf8')
  return { data, next: inject(current, sections), current }
}

/* ─────────────────────────── command modes ───────────────────────────── */

function run(mode) {
  const { data, next, current } = generate()
  if (mode === 'build') {
    if (next === current) {
      process.stdout.write('readme:build — README.md already current.\n')
      return
    }
    writeFileSync(PATHS.readme, next)
    process.stdout.write(
      `readme:build — README.md regenerated (pkg v${data.version}, DS v${data.specVersion}, ` +
        `${data.componentCount} components, ${data.tokenCount} tokens).\n`,
    )
  } else if (mode === 'check') {
    if (next !== current) {
      process.stderr.write(
        '\n✗ readme:check FAILED — README.md is out of date with its sources.\n\n' +
          'Fix: run `npm run readme:build` and commit the result.\n' +
          'Do NOT hand-edit the <!-- AUTOGEN --> blocks — they are generated.\n',
      )
      process.exit(1)
    }
    process.stdout.write(
      `readme:check passed — README.md matches generator output ` +
        `(pkg v${data.version}, DS v${data.specVersion}, ${data.componentCount} components).\n`,
    )
  } else {
    process.stderr.write(`Unknown mode: ${mode}. Use 'build' or 'check'.\n`)
    process.exit(2)
  }
}

// Only execute when invoked directly — importing for tests must not run.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  try {
    run(process.argv[2] || 'build')
  } catch (err) {
    process.stderr.write(`\n✗ readme generator error: ${err.message}\n`)
    if (process.env.DEBUG) process.stderr.write(err.stack + '\n')
    process.exit(1)
  }
}
