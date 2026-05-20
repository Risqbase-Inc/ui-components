#!/usr/bin/env node
// BRIEF-436 — design.risqbase.com generator.
//
// Reads sources of truth (package.json, CHANGELOG.md, src/, dist/tokens.css,
// docs/design-system/v*/) and emits public/*.html. Run via:
//
//   npm run docs:build         — write the files
//   npm run docs:check         — fail if working tree drifts from emission
//
// CI invokes docs:build on every `main` push that touches a tracked source.
// See `.github/workflows/docs-publish.yml`.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  readPackageVersion,
  readSpecVersion,
  scanComponents,
  countComponents,
  countTokens,
  readChartTypes,
  readThemes,
  parseChangelog,
} from './lib/extractors.mjs'
import {
  renderChangelogEntries,
  renderChangelogNav,
  renderComponentGrid,
  renderComponentNav,
  renderThemeList,
} from './lib/render.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '..', '..')

const PATHS = {
  pkgJson: path.join(REPO_ROOT, 'package.json'),
  changelog: path.join(REPO_ROOT, 'CHANGELOG.md'),
  srcDir: path.join(REPO_ROOT, 'src'),
  tokensCss: path.join(REPO_ROOT, 'dist', 'tokens.css'),
  tokensSrcDir: path.join(REPO_ROOT, 'tokens'),
  chartTypes: path.join(REPO_ROOT, 'src', 'data-viz', 'ChartContainer', 'types.ts'),
  themeIndex: path.join(REPO_ROOT, 'src', 'core', 'theme', 'index.ts'),
  designSystemDir: path.join(REPO_ROOT, 'docs', 'design-system'),
  templatesDir: path.join(__dirname, 'templates'),
  publicDir: path.join(REPO_ROOT, 'public'),
}

const PAGES = ['index', 'tokens', 'components', 'charts', 'patterns', 'changelog']

/* ─────────────────────────── build pipeline ──────────────────────────── */

function buildContext() {
  const pkgVersion = readPackageVersion(PATHS.pkgJson)
  const specVersion = readSpecVersion(PATHS.designSystemDir)
  const components = scanComponents(PATHS.srcDir)
  const componentCount = countComponents(components)
  const tokenCount = countTokens({
    tokensCssPath: PATHS.tokensCss,
    tokensSrcDir: PATHS.tokensSrcDir,
  })
  const chartTypes = readChartTypes(PATHS.chartTypes)
  const themes = readThemes(PATHS.themeIndex)
  const changelogEntries = parseChangelog(PATHS.changelog)

  return {
    PKG_VERSION: pkgVersion,
    SPEC_VERSION: specVersion,
    TOKEN_COUNT: String(tokenCount),
    COMPONENT_COUNT: String(componentCount),
    CHART_TYPE_COUNT: String(chartTypes.length),
    CHART_TYPES_LIST: chartTypes.join(' · ') || 'none yet',
    THEME_COUNT: String(themes.length),
    THEME_LIST: renderThemeList(themes),
    COMPONENT_GRID_CORE: renderComponentGrid('core', components.core),
    COMPONENT_GRID_AI: renderComponentGrid('ai', components.ai),
    COMPONENT_GRID_VIZ: renderComponentGrid('data-viz', components['data-viz']),
    COMPONENT_GRID_MARKETING: renderComponentGrid('marketing', components.marketing),
    COMPONENT_LIST_CORE: renderComponentNav(components.core),
    COMPONENT_LIST_AI: renderComponentNav(components.ai),
    COMPONENT_LIST_VIZ: renderComponentNav(components['data-viz']),
    COMPONENT_LIST_MARKETING: renderComponentNav(components.marketing),
    CHANGELOG_ENTRIES: renderChangelogEntries(changelogEntries),
    CHANGELOG_NAV: renderChangelogNav(changelogEntries),
  }
}

function applyTemplate(template, context) {
  let out = template
  // Two passes so a placeholder value referencing another placeholder
  // would resolve. We deliberately don't support recursive templating
  // (yagni); a single pass usually suffices. Two-pass adds <1ms.
  for (let pass = 0; pass < 2; pass++) {
    out = out.replace(/\{\{([A-Z_]+)\}\}/g, (match, key) => {
      if (!Object.prototype.hasOwnProperty.call(context, key)) {
        // Unknown placeholder — leave intact so the audit catches it on
        // first run, rather than silently emitting empty content.
        return match
      }
      return context[key]
    })
  }
  return out
}

function listAllPlaceholders(template) {
  const matches = template.matchAll(/\{\{([A-Z_]+)\}\}/g)
  return [...new Set([...matches].map((m) => m[1]))]
}

function generateAll() {
  const context = buildContext()
  const results = []

  for (const page of PAGES) {
    const tmplPath = path.join(PATHS.templatesDir, `${page}.html`)
    if (!existsSync(tmplPath)) {
      throw new Error(`Template missing: ${tmplPath}`)
    }
    const template = readFileSync(tmplPath, 'utf8')
    const rendered = applyTemplate(template, context)

    // Guard: unsubstituted placeholders are a bug. Fail loudly.
    const remaining = listAllPlaceholders(rendered)
    if (remaining.length > 0) {
      throw new Error(
        `Template '${page}.html' contains unsubstituted placeholders: ${remaining.join(', ')}`,
      )
    }

    results.push({ page, path: path.join(PATHS.publicDir, `${page}.html`), content: rendered })
  }
  return { results, context }
}

/* ─────────────────────────── command modes ───────────────────────────── */

function modeWrite() {
  const { results, context } = generateAll()
  for (const r of results) {
    writeFileSync(r.path, r.content)
    process.stdout.write(`  ✓ wrote public/${r.page}.html (${r.content.length} bytes)\n`)
  }
  process.stdout.write(
    `\ndocs:build complete — pkg v${context.PKG_VERSION}, spec v${context.SPEC_VERSION}, ` +
      `${context.COMPONENT_COUNT} components, ${context.TOKEN_COUNT} tokens, ` +
      `${context.CHART_TYPE_COUNT} chart types, ${context.THEME_COUNT} themes\n`,
  )
}

function modeCheck() {
  const { results, context } = generateAll()
  const drifted = []
  for (const r of results) {
    const onDisk = existsSync(r.path) ? readFileSync(r.path, 'utf8') : ''
    if (onDisk !== r.content) {
      drifted.push(r)
    }
  }
  if (drifted.length === 0) {
    process.stdout.write(
      `docs:check passed — ${results.length} pages match generator output ` +
        `(pkg v${context.PKG_VERSION}, ${context.COMPONENT_COUNT} components, ${context.TOKEN_COUNT} tokens).\n`,
    )
    return
  }
  process.stderr.write(
    `\n✗ docs:check FAILED — ${drifted.length} page(s) drifted from generator output:\n\n`,
  )
  for (const r of drifted) {
    process.stderr.write(`  - public/${r.page}.html\n`)
  }
  process.stderr.write(
    `\nFix: run \`npm run docs:build\` to regenerate from sources, then commit the result.\n` +
      `Do NOT hand-edit public/*.html — those files are generated.\n`,
  )
  process.exit(1)
}

/* ─────────────────────────── entry ───────────────────────────────────── */

const mode = process.argv[2] || 'build'
try {
  if (mode === 'build') modeWrite()
  else if (mode === 'check') modeCheck()
  else {
    process.stderr.write(`Unknown mode: ${mode}. Use 'build' or 'check'.\n`)
    process.exit(2)
  }
} catch (err) {
  process.stderr.write(`\n✗ docs generator error: ${err.message}\n`)
  if (process.env.DEBUG) process.stderr.write(err.stack + '\n')
  process.exit(1)
}
