#!/usr/bin/env node
/**
 * verify-contrast — walk tokens/semantic/color.json, find every leaf with
 * `$extensions['com.risqbase.contrastPair']`, resolve both sides through the
 * primitive layer, and compute WCAG 2.2 contrast ratios.
 *
 * Emits a markdown table to stdout. Exit code:
 *   0 — every pair clears AA at body weight (4.5:1)
 *   1 — at least one pair fails AND --strict is set; otherwise warns and exits 0
 *
 * v4.3 §11.1 row 8. Wired into CI as a non-blocking informational step
 * initially; promote to blocking once any baseline failures are resolved.
 *
 * Spec references:
 *   - WCAG 2.2 contrast formula: §1.4.3 + §1.4.6
 *   - Token annotation: $extensions.com.risqbase.contrastPair (DS v4.3 §4.2)
 */

import { readFileSync, readdirSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const TOKENS_DIR = join(ROOT, 'tokens')

const args = new Set(process.argv.slice(2))
const STRICT = args.has('--strict')
const QUIET = args.has('--quiet')

// ---- token loading ----

/** Recursively read every *.json under tokens/{primitive,semantic,component}/, return merged tree. */
function loadTokenTree() {
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
      if (!ent.isFile() || !ent.name.endsWith('.json')) continue
      const json = JSON.parse(readFileSync(join(dir, ent.name), 'utf8'))
      mergeDeep(tree, json)
    }
  }
  return tree
}

function mergeDeep(target, source) {
  for (const key of Object.keys(source)) {
    const sv = source[key]
    if (sv && typeof sv === 'object' && !Array.isArray(sv) && !('$value' in sv)) {
      if (!target[key] || typeof target[key] !== 'object') target[key] = {}
      mergeDeep(target[key], sv)
    } else {
      target[key] = sv
    }
  }
  return target
}

/** Resolve a `{color.brand.indigo.600}` reference through the tree to its `$value`. */
function resolveRef(tree, ref) {
  // Strip braces.
  const path = ref.replace(/^\{|\}$/g, '').split('.')
  let node = tree
  for (const seg of path) {
    if (!node || typeof node !== 'object') return undefined
    node = node[seg]
  }
  if (!node) return undefined
  // If the leaf is a $value, return it (recursing through nested refs).
  if (typeof node === 'object' && '$value' in node) return resolveValue(tree, node.$value)
  return undefined
}

function resolveValue(tree, value) {
  if (typeof value !== 'string') return undefined
  if (value.startsWith('{') && value.endsWith('}')) return resolveRef(tree, value)
  return value
}

/** Walk every leaf in the tree, calling `fn(path, leaf)` on nodes that look like W3C tokens. */
function walkLeaves(tree, fn, path = []) {
  for (const [k, v] of Object.entries(tree)) {
    if (v && typeof v === 'object' && '$value' in v) {
      fn([...path, k], v)
    } else if (v && typeof v === 'object') {
      walkLeaves(v, fn, [...path, k])
    }
  }
}

// ---- contrast math ----

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

const tree = loadTokenTree()
const rows = []
walkLeaves(tree, (path, leaf) => {
  const pair = leaf.$extensions?.['com.risqbase.contrastPair']
  if (!pair) return
  const valueHex = resolveValue(tree, leaf.$value)
  const pairHex = resolveValue(tree, pair)
  const ratio = valueHex && pairHex ? contrastRatio(valueHex, pairHex) : undefined
  rows.push({
    token: path.join('.'),
    pair: pair.replace(/^\{|\}$/g, ''),
    valueHex,
    pairHex,
    ratio,
  })
})

const AA_BODY = 4.5
const AA_LARGE = 3.0
const AAA_BODY = 7.0

let failures = 0
const tableRows = rows.map((r) => {
  const ratio = r.ratio
  const body = ratio && ratio >= AA_BODY ? '✓' : '✗'
  const large = ratio && ratio >= AA_LARGE ? '✓' : '✗'
  const aaa = ratio && ratio >= AAA_BODY ? '✓' : '·'
  if (!ratio || ratio < AA_BODY) failures += 1
  const ratioStr = ratio ? ratio.toFixed(2) : '—'
  return `| \`${r.token}\` | \`${r.pair}\` | \`${r.valueHex ?? '—'}\` | \`${r.pairHex ?? '—'}\` | ${ratioStr} | ${body} | ${large} | ${aaa} |`
})

if (!QUIET) {
  console.log('# Contrast verification')
  console.log('')
  console.log(`${rows.length} annotated token pairs. ${failures === 0 ? 'All pass AA body.' : `${failures} fail AA body (4.5:1).`}`)
  console.log('')
  console.log('| Token | Pair | Value | Pair value | Ratio | AA body | AA large | AAA body |')
  console.log('|---|---|---|---|---:|:---:|:---:|:---:|')
  for (const r of tableRows) console.log(r)
  console.log('')
  console.log('Thresholds: AA body 4.5:1 · AA large 3.0:1 · AAA body 7.0:1.')
}

if (failures > 0 && STRICT) {
  process.exit(1)
}
process.exit(0)
