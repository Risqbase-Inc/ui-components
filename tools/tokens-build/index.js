#!/usr/bin/env node
/**
 * RisqBase Design System v4.4 — token build pipeline
 *
 * Reads DTCG 2025.10 token source from `tokens/**\/*.tokens.json`
 * (media type `application/design-tokens+json`) and emits:
 *
 *   dist/tokens.css           CSS custom properties (runtime)
 *   src/tokens/generated.ts   TypeScript constants — picked up by tsup as
 *                             the source of the `tokens/index` entry, so
 *                             the published artefact at
 *                             `dist/tokens/index.{js,mjs,d.ts}` carries
 *                             the resolved values. Gitignored.
 *   dist/tailwind-tokens.js   Tailwind preset values
 *   dist/figma-tokens.json    Figma Variables import payload (spec §15.8)
 *
 * v4.4 (GOV-DS-2026-03 Workstream A):
 *   - Theme discovery is resolver-driven: `tokens/resolver.tokens.json`
 *     declares the base set and the theme contexts. The v4.2-era
 *     hardcoded themes/{dark,hc}.json override mechanism is gone.
 *   - Color primitives are OKLCH at source (§A3). The CSS emits the
 *     round-trip-exact sRGB hex as the base declaration and the oklch()
 *     value inside an `@supports (color: oklch(0% 0 0))` override block —
 *     custom properties are not validated at parse time, so a bare second
 *     declaration would always win; @supports is the working form of the
 *     brief's "hex first, oklch second" progressive enhancement (§13
 *     decision 2026-06-09·4). Derived outputs (TS / Tailwind / Figma)
 *     keep emitting hex. Zero visual drift either way: conversion is
 *     round-trip-exact (or `com.risqbase.legacyHex`-pinned).
 *   - `$deprecated` (boolean | string reason) is surfaced in the build log.
 *
 * Spec refs: v4.3 §4 (token graph), v4.4 §A1–§A4.
 */

const path = require('path')
const fs = require('fs')
const StyleDictionary = require('style-dictionary').default
const { oklchToHex } = require('./lib/oklch.js')

const ROOT = path.resolve(__dirname, '..', '..')
const TOKENS_DIR = path.join(ROOT, 'tokens')
const DIST = path.join(ROOT, 'dist')
const SRC_TOKENS = path.join(ROOT, 'src', 'tokens')

const isTokenLeaf = (node) =>
  node && typeof node === 'object' && Object.prototype.hasOwnProperty.call(node, '$value')

function walkTokens(node, fn, prefix = []) {
  if (!node || typeof node !== 'object') return
  if (isTokenLeaf(node)) {
    fn(prefix, node)
    return
  }
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue
    walkTokens(child, fn, [...prefix, key])
  }
}

const cssVarName = (segments) => `--${segments.join('-').toLowerCase()}`

function renderCssBlock(selector, lines, indent = '') {
  return `${indent}${selector} {\n${lines.map((l) => `${indent}  ${l}`).join('\n')}\n${indent}}`
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

/* ── oklch fallback handling (§A3) ───────────────────────────────────── */

const OKLCH_SUB_RE = /oklch\([^)]*\)/g

const hasOklch = (v) => typeof v === 'string' && v.includes('oklch(')

/** Replace every oklch(…) substring with its round-trip sRGB hex.
 *  `legacyHex` (from $extensions['com.risqbase.legacyHex']) wins when the
 *  whole value is a single oklch() that could not round-trip exactly. */
function toFallback(value, legacyHex) {
  if (!hasOklch(value)) return value
  if (legacyHex && value.trim().match(/^oklch\([^)]*\)$/)) return legacyHex.toLowerCase()
  return value.replace(OKLCH_SUB_RE, (m) => {
    const hex = oklchToHex(m)
    if (!hex) throw new Error(`Unparseable oklch value in token source: ${m}`)
    return hex
  })
}

/* ── resolver (§A4) ──────────────────────────────────────────────────── */

function readResolver() {
  const file = path.join(TOKENS_DIR, 'resolver.tokens.json')
  const resolver = JSON.parse(fs.readFileSync(file, 'utf8'))
  const base = resolver.sets.flatMap((s) => s.values).map((f) => path.join(TOKENS_DIR, f))
  const themeModifier = resolver.modifiers.find((m) => m.name === 'theme')
  const themes = themeModifier.values.map((v) => ({
    name: v.name,
    files: v.values.map((f) => path.join(TOKENS_DIR, f)),
  }))
  return { base, themes, defaultTheme: themeModifier.default }
}

async function buildTheme(baseFiles, themeFiles) {
  const sd = new StyleDictionary({
    log: { warnings: 'silent', verbosity: 'silent', errors: { brokenReferences: 'throw' } },
    source: [...baseFiles, ...themeFiles],
    platforms: {
      raw: {
        transformGroup: 'js',
        files: [{ destination: '_unused.json', format: 'json/nested' }],
      },
    },
  })
  await sd.hasInitialized
  return sd
}

async function main() {
  ensureDir(DIST)

  const { base, themes, defaultTheme } = readResolver()

  const leavesByTheme = {}
  for (const theme of themes) {
    const sd = await buildTheme(base, theme.files)
    const tree = await sd.exportPlatform('raw')
    const leaves = []
    walkTokens(tree, (segments, leaf) => leaves.push({ path: segments, leaf }))
    leavesByTheme[theme.name] = leaves
  }

  const lightLeaves = leavesByTheme[defaultTheme]
  const lightByKey = new Map(lightLeaves.map((x) => [x.path.join('.'), x]))

  const themeOverrides = {}
  for (const theme of themes) {
    if (theme.name === defaultTheme) continue
    themeOverrides[theme.name] = leavesByTheme[theme.name].filter(({ path: p, leaf }) => {
      const light = lightByKey.get(p.join('.'))
      return light && leaf.$value !== light.leaf.$value
    })
  }

  // $deprecated surfacing (§A2) ----------------------------------------
  const deprecated = lightLeaves.filter(({ leaf }) => leaf.$deprecated)
  for (const { path: p, leaf } of deprecated) {
    const reason = typeof leaf.$deprecated === 'string' ? ` — ${leaf.$deprecated}` : ''
    console.log(`tokens-build: DEPRECATED ${p.join('.')}${reason}`)
  }

  // dist/tokens.css ----------------------------------------------------
  const legacyHexOf = (leaf) => (leaf.$extensions || {})['com.risqbase.legacyHex']
  const cssLine = ({ path: p, leaf }) => `${cssVarName(p)}: ${toFallback(leaf.$value, legacyHexOf(leaf))};`
  const cssOklchLine = ({ path: p, leaf }) => `${cssVarName(p)}: ${leaf.$value};`

  const cssBlocks = []
  for (const theme of themes) {
    const isDefault = theme.name === defaultTheme
    const all = isDefault ? lightLeaves : themeOverrides[theme.name]
    if (!isDefault && all.length === 0) continue
    const selector = isDefault ? `:root, [data-theme="${theme.name}"]` : `[data-theme="${theme.name}"]`
    cssBlocks.push(renderCssBlock(selector, all.map(cssLine)))
    const oklchLeaves = all.filter(({ leaf }) => hasOklch(leaf.$value))
    if (oklchLeaves.length > 0) {
      cssBlocks.push(
        `@supports (color: oklch(0% 0 0)) {\n${renderCssBlock(selector, oklchLeaves.map(cssOklchLine), '  ')}\n}`
      )
    }
  }
  const staticCss = fs.readFileSync(path.join(__dirname, 'static.css'), 'utf8')
  fs.writeFileSync(
    path.join(DIST, 'tokens.css'),
    [
      '/* RisqBase Design System v4.2 — generated by tools/tokens-build. Do not edit. */',
      cssBlocks.join('\n\n'),
      '',
      staticCss,
    ].join('\n')
  )

  // src/tokens/generated.ts ---------------------------------------------
  const tsTree = {}
  for (const { path: p, leaf } of lightLeaves) {
    let cursor = tsTree
    for (let i = 0; i < p.length - 1; i++) {
      cursor[p[i]] = cursor[p[i]] || {}
      cursor = cursor[p[i]]
    }
    cursor[p[p.length - 1]] = toFallback(leaf.$value, legacyHexOf(leaf))
  }
  const tsBody = [
    '// AUTO-GENERATED, DO NOT EDIT.',
    '// RisqBase Design System v4.4 — emitted by `npm run build:tokens`',
    '// (tools/tokens-build/index.js) from /tokens/**/*.tokens.json. tsup picks',
    '// this file up as the source of the `tokens/index` entry; the',
    '// published artefact lives at dist/tokens/index.{js,mjs,d.ts}.',
    '// File is gitignored; regenerate with `npm run build:tokens`.',
    '',
    '/** Resolved light-theme token values. Consumers can import for prop typing.',
    '  * Colors are the round-trip-exact sRGB hex of the OKLCH source (§A3).',
    '  * Theme overrides live in CSS and are not statically expressible here. */',
    '',
    `export const tokens = ${JSON.stringify(tsTree, null, 2)} as const`,
    '',
    'export type Tokens = typeof tokens',
    '',
  ].join('\n')
  ensureDir(SRC_TOKENS)
  fs.writeFileSync(path.join(SRC_TOKENS, 'generated.ts'), tsBody)

  // dist/tailwind-tokens.js -------------------------------------------
  const tw = { colors: {}, spacing: {}, borderRadius: {}, transitionDuration: {} }
  for (const { path: p, leaf } of lightLeaves) {
    const value = toFallback(leaf.$value, legacyHexOf(leaf))
    if (leaf.$type === 'color') {
      tw.colors[p.slice(1).join('-')] = value
    } else if (leaf.$type === 'dimension') {
      if (p[1] === 'spacing') tw.spacing[p.slice(2).join('-')] = value
      else if (p[1] === 'radius') tw.borderRadius[p.slice(2).join('-')] = value
    } else if (leaf.$type === 'duration') {
      tw.transitionDuration[p.slice(1).join('-')] = value
    }
  }
  fs.writeFileSync(
    path.join(DIST, 'tailwind-tokens.js'),
    [
      '// RisqBase Design System v4.2 — generated by tools/tokens-build. Do not edit.',
      `module.exports = ${JSON.stringify(tw, null, 2)}`,
      '',
    ].join('\n')
  )

  // dist/figma-tokens.json --------------------------------------------
  const themeNames = themes.map((t) => t.name)
  const overrideValue = (themeName, key) => {
    const hit = (themeOverrides[themeName] || []).find((x) => x.path.join('.') === key)
    return hit ? toFallback(hit.leaf.$value, legacyHexOf(hit.leaf)) : undefined
  }
  const figmaPayload = {
    $schema: 'https://www.figma.com/schemas/variables/v1.json',
    generatedAt: new Date().toISOString().slice(0, 10),
    collections: {
      primitive: { modes: themeNames, variables: [] },
      semantic: { modes: themeNames, variables: [] },
      component: { modes: themeNames, variables: [] },
    },
  }
  for (const { path: p, leaf } of lightLeaves) {
    const key = p.join('.')
    const ext = (leaf.$extensions || {})['com.risqbase.figma'] || null
    const role = (leaf.$extensions || {})['com.risqbase.role'] || 'primitive'
    const collection = (ext && ext.collection) || role
    const variableName = (ext && ext.variable) || p.join('/')
    if (!figmaPayload.collections[collection]) {
      figmaPayload.collections[collection] = { modes: themeNames, variables: [] }
    }
    const values = { [defaultTheme]: toFallback(leaf.$value, legacyHexOf(leaf)) }
    for (const t of themeNames) {
      if (t === defaultTheme) continue
      const v = overrideValue(t, key)
      if (v !== undefined) values[t] = v
    }
    figmaPayload.collections[collection].variables.push({
      name: variableName,
      type: leaf.$type,
      description: leaf.$description || '',
      values,
    })
  }
  fs.writeFileSync(path.join(DIST, 'figma-tokens.json'), JSON.stringify(figmaPayload, null, 2) + '\n')

  const counts = { primitive: 0, semantic: 0, component: 0 }
  for (const { leaf } of lightLeaves) {
    const r = (leaf.$extensions || {})['com.risqbase.role']
    if (counts[r] != null) counts[r]++
  }
  const overrideSummary = Object.entries(themeOverrides)
    .map(([name, list]) => `${name} overrides: ${list.length}`)
    .join(', ')
  console.log(
    `tokens-build: ${lightLeaves.length} tokens ` +
      `(${counts.primitive} primitive, ${counts.semantic} semantic, ${counts.component} component). ` +
      `${overrideSummary}. deprecated: ${deprecated.length}.`
  )
}

main().catch((err) => {
  console.error('tokens-build failed:', err)
  process.exit(1)
})
