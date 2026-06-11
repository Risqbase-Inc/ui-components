#!/usr/bin/env node
/**
 * verify-contrast — walk the token source, find every leaf with
 * `$extensions['com.risqbase.contrastPair']`, resolve both sides through the
 * token graph, and compute WCAG 2.2 contrast ratios — PER THEME.
 *
 * v4.4 (Workstream B): themes are discovered via tokens/resolver.tokens.json;
 * every annotated pair is verified under light AND dark (§B5 row 2 — pairs
 * re-pointed at dark surfaces automatically by the resolver). Color sources
 * are OKLCH since §A3; values are converted through the same round-trip-exact
 * math the build uses (tools/tokens-build/lib/oklch.js).
 *
 * Pass criteria per pair: AA body (4.5:1) by default, or the floor named by
 * `$extensions['com.risqbase.contrastLevel']` ('aa-large' → 3:1) for
 * documented exceptions (v4.3 §4.2: iris.accent-on is AA Large + Non-Text
 * only, enforced at usage sites by scanner rule R11).
 *
 * Emits a markdown table per theme. Exit code:
 *   0 — every pair clears its floor in every theme
 *   1 — at least one pair fails AND --strict is set; otherwise warns, exits 0
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { oklchToHex } = require('../tools/tokens-build/lib/oklch.js')

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
// RISQBASE_TOKENS_DIR override exists for the D-124 negative-check fixture
// (scripts/test-scanner-rules.mjs): the expanded gate must demonstrably
// fail on a seeded bad text-role token before it counts as implemented.
const TOKENS_DIR = process.env.RISQBASE_TOKENS_DIR
  ? resolve(process.env.RISQBASE_TOKENS_DIR)
  : join(ROOT, 'tokens')

const args = new Set(process.argv.slice(2))
const STRICT = args.has('--strict')
const QUIET = args.has('--quiet')

// ---- token loading ----

function mergeDeep(target, source) {
  for (const key of Object.keys(source)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue
    const sv = source[key]
    if (sv && typeof sv === 'object' && !Array.isArray(sv) && !('$value' in sv)) {
      if (!Object.hasOwn(target, key) || typeof target[key] !== 'object') target[key] = {}
      mergeDeep(target[key], sv)
    } else if (
      sv &&
      typeof sv === 'object' &&
      '$value' in sv &&
      target[key] &&
      typeof target[key] === 'object' &&
      '$value' in target[key]
    ) {
      // Theme override onto an existing leaf: keep base annotations
      // (contrastPair, contrastLevel) unless the override restates them.
      target[key] = {
        ...target[key],
        ...sv,
        $extensions: { ...(target[key].$extensions || {}), ...(sv.$extensions || {}) },
      }
    } else {
      target[key] = sv
    }
  }
  return target
}

function loadBaseTree() {
  const tree = {}
  for (const tier of ['primitive', 'semantic', 'component']) {
    const dir = join(TOKENS_DIR, tier)
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const ent of entries) {
      if (!ent.isFile() || !ent.name.endsWith('.tokens.json')) continue
      mergeDeep(tree, JSON.parse(readFileSync(join(dir, ent.name), 'utf8')))
    }
  }
  return tree
}

function readThemes() {
  const file = join(TOKENS_DIR, 'resolver.tokens.json')
  if (!existsSync(file)) return [{ name: 'light', files: [] }]
  const resolver = JSON.parse(readFileSync(file, 'utf8'))
  const mod = (resolver.modifiers || []).find((m) => m.name === 'theme')
  if (!mod) return [{ name: 'light', files: [] }]
  return mod.values.map((v) => ({ name: v.name, files: v.values }))
}

function resolveRef(tree, ref) {
  const path = ref.replace(/^\{|\}$/g, '').split('.')
  let node = tree
  for (const seg of path) {
    if (!node || typeof node !== 'object') return undefined
    node = node[seg]
  }
  if (!node) return undefined
  if (typeof node === 'object' && '$value' in node) return resolveValue(tree, node.$value)
  return undefined
}

function resolveValue(tree, value) {
  if (typeof value !== 'string') return undefined
  if (value.startsWith('{') && value.endsWith('}')) return resolveRef(tree, value)
  return value
}

function walkLeaves(tree, fn, path = []) {
  for (const [k, v] of Object.entries(tree)) {
    if (k.startsWith('$')) continue
    if (v && typeof v === 'object' && '$value' in v) {
      fn([...path, k], v)
    } else if (v && typeof v === 'object') {
      walkLeaves(v, fn, [...path, k])
    }
  }
}

// ---- contrast math ----

function toHex(value) {
  if (typeof value !== 'string') return undefined
  const v = value.trim()
  if (/^#?[0-9a-f]{6}$/i.test(v)) return v.startsWith('#') ? v : `#${v}`
  if (v.startsWith('oklch(')) return oklchToHex(v) ?? undefined
  return undefined
}

function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex)
  if (!m) return undefined
  const n = parseInt(m[1], 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function channelToLinear(c) {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function luminance({ r, g, b }) {
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b)
}

function contrastRatio(hexA, hexB) {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  if (!a || !b) return undefined
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

// ---- main ----

const AA_BODY = 4.5
const AA_LARGE = 3.0
const AAA_BODY = 7.0

const base = loadBaseTree()
const themes = readThemes()
let failures = 0
const sections = []

// ── D-124 gate: TEXT-role completeness ────────────────────────────────
// Every semantic/component color token whose Figma binding carries the
// TEXT_FILL scope must declare a contrastPair (verified per theme below)
// or an explicit com.risqbase.contrastExempt reason. This is the net the
// build-6a1c1e6f a11y report slipped through: verify-contrast used to
// check 8 curated pairs while axe checks every element.
const unannotated = []
const exemptions = []
walkLeaves(base, (path, leaf) => {
  const ext = leaf.$extensions ?? {}
  const role = ext['com.risqbase.role']
  if (role !== 'semantic' && role !== 'component') return
  if (leaf.$type !== 'color') return
  const scopes = ext['com.risqbase.figma']?.scopes ?? []
  if (!scopes.includes('TEXT_FILL')) return
  if (ext['com.risqbase.contrastExempt']) {
    exemptions.push({ token: path.join('.'), reason: ext['com.risqbase.contrastExempt'] })
    return
  }
  if (!ext['com.risqbase.contrastPair']) unannotated.push(path.join('.'))
})
failures += unannotated.length

for (const theme of themes) {
  const tree = JSON.parse(JSON.stringify(base))
  for (const f of theme.files) {
    mergeDeep(tree, JSON.parse(readFileSync(join(TOKENS_DIR, f), 'utf8')))
  }

  const rows = []
  walkLeaves(tree, (path, leaf) => {
    const pair = leaf.$extensions?.['com.risqbase.contrastPair']
    if (!pair) return
    if (leaf.$extensions?.['com.risqbase.contrastExempt']) return // documented exemption (reported above)
    const floor = leaf.$extensions?.['com.risqbase.contrastLevel'] === 'aa-large' ? AA_LARGE : AA_BODY
    const valueHex = toHex(resolveValue(tree, leaf.$value))
    const pairHex = toHex(resolveValue(tree, pair))
    const ratio = valueHex && pairHex ? contrastRatio(valueHex, pairHex) : undefined
    rows.push({ token: path.join('.'), pair: pair.replace(/^\{|\}$/g, ''), valueHex, pairHex, ratio, floor })
  })

  let themeFailures = 0
  const tableRows = rows.map((r) => {
    const ok = r.ratio !== undefined && r.ratio >= r.floor
    if (!ok) themeFailures += 1
    const body = r.ratio && r.ratio >= AA_BODY ? '✓' : '✗'
    const large = r.ratio && r.ratio >= AA_LARGE ? '✓' : '✗'
    const aaa = r.ratio && r.ratio >= AAA_BODY ? '✓' : '·'
    const floorLabel = r.floor === AA_LARGE ? 'AA large†' : 'AA body'
    const ratioStr = r.ratio ? r.ratio.toFixed(2) : '—'
    return `| \`${r.token}\` | \`${r.pair}\` | \`${r.valueHex ?? '—'}\` | \`${r.pairHex ?? '—'}\` | ${ratioStr} | ${floorLabel} | ${ok ? '✓' : '✗'} | ${body} | ${large} | ${aaa} |`
  })
  failures += themeFailures
  sections.push({ theme: theme.name, rows, tableRows, themeFailures })
}

if (!QUIET) {
  console.log('# Contrast verification')
  console.log('')
  if (unannotated.length) {
    console.log(`## ✗ ${unannotated.length} TEXT-role token(s) missing contrastPair/contrastExempt (D-124 gate)`)
    for (const t of unannotated) console.log(`  - ${t}`)
    console.log('')
  }
  if (exemptions.length) {
    console.log(`## Documented exemptions (${exemptions.length})`)
    for (const e of exemptions) console.log(`  - \`${e.token}\`: ${e.reason}`)
    console.log('')
  }
  for (const s of sections) {
    console.log(`## Theme: ${s.theme}`)
    console.log('')
    console.log(
      `${s.rows.length} annotated token pairs. ${s.themeFailures === 0 ? 'All clear their floor.' : `${s.themeFailures} below their floor.`}`
    )
    console.log('')
    console.log('| Token | Pair | Value | Pair value | Ratio | Floor | Pass | AA body | AA large | AAA body |')
    console.log('|---|---|---|---|---:|---|:---:|:---:|:---:|:---:|')
    for (const r of s.tableRows) console.log(r)
    console.log('')
  }
  console.log('Thresholds: AA body 4.5:1 · AA large 3.0:1 · AAA body 7.0:1.')
  console.log('† documented AA-Large-only exception (v4.3 §4.2), usage-site-enforced by scanner rule R11.')
}

if (failures > 0 && STRICT) {
  if (QUIET && unannotated.length) {
    console.error(`verify-contrast: ${unannotated.length} TEXT-role token(s) missing contrastPair/contrastExempt (D-124)`)
  }
  process.exit(1)
}
process.exit(0)
