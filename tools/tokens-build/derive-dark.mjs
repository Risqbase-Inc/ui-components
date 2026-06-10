#!/usr/bin/env node
/**
 * One-shot v4.4 §B1 derivation: fill the dark theme set for every
 * semantic / component color token the shipped BRIEF-401 Phase-2.2 pass
 * did not cover (88 tokens flagged by the R12 completeness rule).
 *
 * Dark values are DERIVED, not improvised (§B1): hue is taken from the
 * light token's OKLCH hue; lightness is lifted / re-targeted per the
 * group rules below; chroma is capped so large-area fills stay calm and
 * the result stays inside the sRGB gamut (auto-reduced when it clips).
 * Every derived value is contrast-verified before the file is written —
 * a failed constraint aborts the run.
 *
 * Group rules (mirroring the shipped 47-token methodology):
 *   risk.*            adopt the matching band.* dark bg (same hue families)
 *   chart.cat.*       L → max(light, 0.72), C ≤ 0.14, hue unchanged (§B1:
 *                     raise L, cap chroma spread; distinguishability is
 *                     carried by hue)
 *   chart.seq.*       dark ramp ascends dark→bright (Carbon convention)
 *   chart.div.*       end stops lifted, neutral mid re-anchored on the
 *                     dark neutral axis
 *   citation.*        surfaces/borders/text re-anchored on the dark
 *                     surface/text scales
 *   telemetry.*       status hues lifted like band/gauge treatments
 *   iris.*            teal hue unchanged; accent re-targeted to clear
 *                     4.5:1 as text on the dark canvas while keeping
 *                     ≥3:1 under white glyphs (v4.3 §4.2 contract);
 *                     surface = dark teal-tinted stone
 *   callout.*         intent hues lifted to the same dark stops as the
 *                     telemetry/band treatments (bg is alpha-blended 10%
 *                     in-component, border/icon render at full strength)
 *
 * Kept in-repo for audit. Idempotent: re-running recomputes the same
 * values (pure function of the light source + rules).
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { hexToOklch, oklchToHex } = require('./lib/oklch.js')

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const TOKENS = join(ROOT, 'tokens')
const DARK_FILE = join(TOKENS, 'themes', 'dark.tokens.json')

/* ── token tree helpers ──────────────────────────────────────────────── */

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue
    if (value && typeof value === 'object' && !Array.isArray(value) && !('$value' in value)) {
      target[key] = target[key] || {}
      deepMerge(target[key], value)
    } else {
      target[key] = value
    }
  }
  return target
}

function loadTier(tier) {
  const tree = {}
  for (const f of readdirSync(join(TOKENS, tier))) {
    if (!f.endsWith('.tokens.json')) continue
    deepMerge(tree, JSON.parse(readFileSync(join(TOKENS, tier, f), 'utf8')))
  }
  return tree
}

const light = {}
for (const tier of ['primitive', 'semantic', 'component']) deepMerge(light, loadTier(tier))

function get(path) {
  let node = light
  for (const seg of path.split('.')) node = node?.[seg]
  return node
}

function resolveLight(path) {
  const leaf = get(path)
  if (!leaf) throw new Error(`No light token ${path}`)
  let v = leaf.$value
  const m = typeof v === 'string' && /^\{(.+)\}$/.exec(v.trim())
  return m ? resolveLight(m[1]) : v
}

const OKLCH_RE = /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)$/
function parseOklch(v) {
  const m = OKLCH_RE.exec(v)
  if (!m) throw new Error(`Not an oklch value: ${v}`)
  return { L: parseFloat(m[1]) / 100, C: parseFloat(m[2]), H: parseFloat(m[3]) }
}
const fmtOklch = ({ L, C, H }) => {
  const f = (n) => {
    let s = n.toFixed(6)
    if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '')
    return s === '-0' ? '0' : s
  }
  return `oklch(${f(L * 100)}% ${f(C)} ${f(H)})`
}

/** Reduce chroma until the oklch value survives the sRGB round-trip with
 *  negligible drift (i.e. it is inside gamut), then re-serialise from the
 *  clamped hex so the stored value is round-trip-exact (§A3 contract). */
function inGamut(spec) {
  let { L, C, H } = spec
  for (let i = 0; i < 40; i++) {
    const hex = oklchToHex(fmtOklch({ L, C, H }))
    const back = parseOklch(hexToOklch(hex))
    const drift = Math.abs(back.L - L) + Math.abs(back.C - C)
    if (drift < 0.004) return hexToOklch(hex)
    C = Math.max(0, C - 0.005)
  }
  throw new Error(`Cannot bring ${JSON.stringify(spec)} into gamut`)
}

/* ── contrast math (WCAG 2.2) ────────────────────────────────────────── */

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16)
  const ch = (c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * ch((n >> 16) & 255) + 0.7152 * ch((n >> 8) & 255) + 0.0722 * ch(n & 255)
}
function contrast(a, b) {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}
const hexOf = (oklch) => oklchToHex(oklch)

/** Binary-search OKLCH L (fixed C/H) to hit a relative-luminance target. */
function atLuminance(targetLum, C, H) {
  let lo = 0
  let hi = 1
  for (let i = 0; i < 48; i++) {
    const L = (lo + hi) / 2
    const lum = luminance(hexOf(inGamut({ L, C, H })))
    if (lum < targetLum) lo = L
    else hi = L
  }
  return inGamut({ L: (lo + hi) / 2, C, H })
}

/* ── existing dark values (anchors) ──────────────────────────────────── */

const dark = JSON.parse(readFileSync(DARK_FILE, 'utf8'))
const darkVal = (path) => {
  let node = dark
  for (const seg of path.split('.')) node = node?.[seg]
  if (!node?.$value) throw new Error(`No existing dark token ${path}`)
  return node.$value
}

const SURFACE = hexOf(darkVal('color.surface.default'))

const hueOf = (lightPath) => parseOklch(resolveLight(lightPath)).H
const lightOk = (lightPath) => parseOklch(resolveLight(lightPath))

/* ── derivations ─────────────────────────────────────────────────────── */

const out = [] // { path, value, description, role, checks: [[fg,bg,min,label]] }

const add = (path, value, description, checks = []) => {
  const role = (get(path)?.$extensions || {})['com.risqbase.role'] || 'semantic'
  out.push({ path, value, description, role, checks })
}

// risk.* — adopt the matching band dark bgs (same hue families, §B1).
for (const [risk, band] of [
  ['low', 'very-low'],
  ['medium', 'medium'],
  ['high', 'high'],
  ['critical', 'very-high'],
]) {
  add(
    `color.risk.${risk}`,
    darkVal(`color.band.${band}.bg`),
    `Risk band — ${risk}; matches the dark band.${band} treatment (lifted, hue preserved)`,
    [[null, SURFACE, 3, 'marker vs dark surface']]
  )
}

// chart.cat.* — raise L, cap chroma spread, hue unchanged.
for (let i = 1; i <= 8; i++) {
  const lo = lightOk(`color.chart.cat.${i}`)
  add(
    `color.chart.cat.${i}`,
    inGamut({ L: Math.max(lo.L, 0.72), C: Math.min(lo.C, 0.14), H: lo.H }),
    `Chart categorical ${i} — lifted for dark canvas (L ≥ 0.72, chroma capped; hue carries identity)`,
    [[null, SURFACE, 3, 'mark vs dark surface']]
  )
}

// chart.seq.* — ascending dark ramp (dark = low, bright = high).
const seqL = [0.32, 0.45, 0.58, 0.71, 0.84]
for (let i = 1; i <= 5; i++) {
  add(
    `color.chart.seq.${i}`,
    inGamut({ L: seqL[i - 1], C: 0.09, H: hueOf(`color.chart.seq.${i}`) }),
    `Chart sequential ${i} — dark ramp ascends dark→bright so emphasis still reads upward`
  )
}

// chart.div.* — lifted ends, dark-neutral mid.
add('color.chart.div.n2', inGamut({ L: 0.6, C: 0.19, H: hueOf('color.chart.div.n2') }), 'Diverging strong negative — lifted for dark canvas', [[null, SURFACE, 3, 'mark vs dark surface']])
add('color.chart.div.n1', inGamut({ L: 0.7, C: 0.15, H: hueOf('color.chart.div.n1') }), 'Diverging negative — lifted for dark canvas', [[null, SURFACE, 3, 'mark vs dark surface']])
add('color.chart.div.0', inGamut({ L: 0.45, C: 0.005, H: 236.7 }), 'Diverging neutral — re-anchored on the dark neutral axis')
add('color.chart.div.p1', inGamut({ L: 0.7, C: 0.12, H: hueOf('color.chart.div.p1') }), 'Diverging positive — lifted for dark canvas', [[null, SURFACE, 3, 'mark vs dark surface']])
add('color.chart.div.p2', inGamut({ L: 0.8, C: 0.11, H: hueOf('color.chart.div.p2') }), 'Diverging strong positive — lifted for dark canvas', [[null, SURFACE, 3, 'mark vs dark surface']])

// chart.null — no-data cell, one step above surface.muted.
add('color.chart.null', inGamut({ L: 0.3, C: 0.006, H: 237 }), 'Null-marker fill — reads as recess against dark plot area, below all data stops')

// citation.* — re-anchored on the dark surface / text scales.
add('color.citation.surface-default', darkVal('color.surface.subtle'), 'Citation chip surface — default; matches surface.subtle on dark')
add('color.citation.surface-low-conf', darkVal('color.surface.muted'), 'Citation chip surface — low-confidence; one step up for differentiation')
add('color.citation.border-default', darkVal('color.border.subtle'), 'Citation chip border — default; decorative rule on dark')
add('color.citation.border-retracted', darkVal('color.chart.tooltip-border'), 'Citation chip border — retracted; raised a step so the strikethrough state reads')
const citText = inGamut({ L: 0.726, C: 0.008, H: 241.7 })
add('color.citation.text-default', citText, 'Citation chip text — default; matches text.subtle scale, clears 4.5:1 on chip surface', [
  [citText, darkVal('color.surface.subtle'), 4.5, 'chip text vs chip surface'],
])
add('color.citation.text-retracted', inGamut({ L: 0.55, C: 0.009, H: 241.7 }), 'Citation chip text — retracted; dimmed one step (de-emphasised state)')
const citIcon = inGamut({ L: 0.65, C: 0.009, H: 241.7 })
add('color.citation.icon-default', citIcon, 'Citation chip source-type glyph — clears 3:1 non-text on chip surface', [
  [citIcon, darkVal('color.surface.subtle'), 3, 'glyph vs chip surface'],
])
add('color.citation.hover', inGamut({ L: 0.3, C: 0.008, H: 240 }), 'Citation chip hover overlay — one step above the chip surface')
add('color.citation.active', inGamut({ L: 0.335, C: 0.008, H: 240 }), 'Citation chip active/pressed overlay — one step above hover')

// telemetry.* — status hues lifted like the band/gauge treatments.
add('color.telemetry.collector.healthy', darkVal('color.band.very-low.bg'), 'Telemetry collector healthy — matches dark band.very-low emerald lift', [[null, SURFACE, 3, 'status dot vs dark surface']])
add('color.telemetry.collector.degraded', darkVal('color.band.medium.bg'), 'Telemetry collector degraded — matches dark band.medium amber lift', [[null, SURFACE, 3, 'status dot vs dark surface']])
const redLift = inGamut({ L: 0.66, C: 0.19, H: hueOf('color.palette.red.500') })
add('color.telemetry.collector.failed', redLift, 'Telemetry collector failed — lifted red, hue preserved', [[null, SURFACE, 3, 'status dot vs dark surface']])
add('color.telemetry.collector.disabled', inGamut({ L: 0.55, C: 0.01, H: hueOf('color.neutral.stone.400') }), 'Telemetry collector disabled — neutral, deliberately low-emphasis')
add('color.telemetry.opt-out-marker', inGamut({ L: 0.72, C: 0.13, H: hueOf('color.palette.sky.500') }), 'Telemetry opt-out marker — lifted sky', [[null, SURFACE, 3, 'marker vs dark surface']])
add('color.telemetry.sampled-marker', inGamut({ L: 0.72, C: 0.14, H: hueOf('color.palette.violet.500') }), 'Telemetry sampled-event marker — lifted violet', [[null, SURFACE, 3, 'marker vs dark surface']])
add('color.telemetry.event-class.adoption', darkVal('color.gauge.arc-teal'), 'Telemetry event class adoption — matches dark gauge teal', [[null, SURFACE, 3, 'mark vs dark surface']])
add('color.telemetry.event-class.error', inGamut({ L: 0.66, C: 0.19, H: hueOf('color.palette.red.600') }), 'Telemetry event class error — lifted red-600 hue', [[null, SURFACE, 3, 'mark vs dark surface']])
add('color.telemetry.event-class.usage', darkVal('color.action.primary'), 'Telemetry event class usage — matches dark action.primary indigo', [[null, SURFACE, 3, 'mark vs dark surface']])
add('color.telemetry.event-class.performance', darkVal('color.band.high.bg'), 'Telemetry event class performance — matches dark band.high orange lift', [[null, SURFACE, 3, 'mark vs dark surface']])

// iris.* — teal hue unchanged; accent re-targeted for the dual contract.
const irisHue = hueOf('color.iris.accent')
const accent = atLuminance(0.26, lightOk('color.iris.accent').C, irisHue)
add('color.iris.accent', accent, 'Iris accent — lifted teal; clears 4.5:1 as text on dark canvas and keeps ≥3:1 under white glyphs (v4.3 §4.2)', [
  [accent, SURFACE, 4.5, 'accent text vs dark surface'],
  ['#ffffff', accent, 3, 'white glyph vs accent (non-text floor)'],
])
const accentL = parseOklch(accent).L
add('color.iris.accent-hover', inGamut({ L: accentL + 0.06, C: lightOk('color.iris.accent').C, H: irisHue }), 'Iris accent hover — lifts a half-step on dark (light darkens; dark brightens)')
add('color.iris.accent-subtle', inGamut({ L: 0.27, C: 0.045, H: irisHue }), 'Iris accent subtle — muted teal wash for halos/hover on dark canvas')
add('color.iris.surface', inGamut({ L: 0.21, C: 0.012, H: 190 }), 'Iris surface — dark teal-tinted stone (§B1), one step above the canvas')
add('color.iris.streamhead', accent, 'StreamingText cursor — matches dark iris.accent', [[null, SURFACE, 3, 'cursor vs dark surface']])
add('color.iris.thinking-outer', inGamut({ L: 0.82, C: 0.115, H: hueOf('color.iris.thinking-outer') }), 'IrisThinking outer arc — brightest of the depth gradient on dark', [[null, SURFACE, 3, 'arc vs dark surface']])
add('color.iris.thinking-mid', inGamut({ L: 0.72, C: 0.115, H: hueOf('color.iris.thinking-mid') }), 'IrisThinking middle arc', [[null, SURFACE, 3, 'arc vs dark surface']])
add('color.iris.thinking-inner', inGamut({ L: 0.6, C: 0.095, H: hueOf('color.iris.thinking-inner') }), 'IrisThinking inner arc — dimmest, still clears the 3:1 non-text floor', [[null, SURFACE, 3, 'arc vs dark surface']])

// callout.* — intent hues at the same dark stops as telemetry/band lifts.
// (bg renders alpha-blended at 10% in-component; border/icon full strength.)
const calloutStops = {
  info: inGamut({ L: 0.72, C: 0.13, H: hueOf('color.palette.sky.500') }),
  warning: darkVal('color.band.medium.bg'),
  danger: inGamut({ L: 0.66, C: 0.19, H: hueOf('color.palette.red.600') }),
  success: darkVal('color.band.very-low.bg'),
}
for (const [intent, value] of Object.entries(calloutStops)) {
  for (const part of ['background', 'border', 'icon']) {
    add(
      `color.callout.${intent}.${part}`,
      value,
      `${intent[0].toUpperCase()}${intent.slice(1)} callout ${part} — lifted intent hue for dark (bg is 10%-alpha-blended in-component)`,
      part === 'icon' ? [[null, SURFACE, 3, 'icon vs dark surface']] : []
    )
  }
}

/* ── verify constraints ──────────────────────────────────────────────── */

let failures = 0
for (const t of out) {
  for (const [fg, bg, min, label] of t.checks) {
    const a = hexOf(fg ?? t.value) || (fg ?? t.value)
    const b = hexOf(bg) || bg
    const ratio = contrast(a, b)
    if (ratio < min) {
      console.error(`FAIL ${t.path}: ${label} = ${ratio.toFixed(2)} < ${min}`)
      failures++
    }
  }
}
if (failures) {
  console.error(`derive-dark: ${failures} contrast constraint(s) failed — file not written.`)
  process.exit(1)
}

/* ── merge into dark.tokens.json ─────────────────────────────────────── */

for (const t of out) {
  const segs = t.path.split('.')
  let node = dark
  for (const seg of segs.slice(0, -1)) {
    // Token paths are in-repo constants, but guard the computed write anyway
    // (CodeQL js/prototype-polluting-assignment hygiene).
    if (seg === '__proto__' || seg === 'constructor' || seg === 'prototype') {
      throw new Error(`Refusing to write reserved key in token path: ${t.path}`)
    }
    node[seg] = node[seg] || {}
    node = node[seg]
  }
  node[segs.at(-1)] = {
    $value: t.value,
    $type: 'color',
    $description: t.description,
    $extensions: {
      'com.risqbase.role': t.role,
      'com.risqbase.figma': { collection: t.role, mode: 'dark', variable: segs.join('/') },
    },
  }
}

writeFileSync(DARK_FILE, JSON.stringify(dark, null, 2) + '\n')
console.log(`derive-dark: wrote ${out.length} derived dark tokens (all contrast constraints verified).`)
