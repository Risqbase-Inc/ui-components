/**
 * sRGB hex ↔ OKLCH conversion — CSS Color 4 reference math (Ottosson 2020).
 *
 * Vendored rather than depending on culori so the conversion is pinned by
 * source control (v4.4 §A3 / §13 decision 2026-06-09·5). The round-trip
 * contract is enforced by the caller: `oklchToHex(hexToOklch(hex)) === hex`
 * for every token, with `com.risqbase.legacyHex` as the escape hatch for
 * any value that cannot round-trip exactly.
 *
 * Serialisation: `oklch(<L>% <C> <H>)` with 6 decimal places — enough that
 * re-parsing lands within ~1e-7 in OKLab space, far below the half-step
 * quantisation threshold (~2e-3 in gamma space) needed for exact hex
 * round-trips.
 */

'use strict'

function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function linearToSrgb(c) {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

function parseHex(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim())
  if (!m) return null
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** [r,g,b] 0-255 → { L, C, H } (L 0-1, H degrees 0-360). */
function rgbToOklch([r8, g8, b8]) {
  const r = srgbToLinear(r8 / 255)
  const g = srgbToLinear(g8 / 255)
  const b = srgbToLinear(b8 / 255)

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  const C = Math.sqrt(a * a + bb * bb)
  let H = (Math.atan2(bb, a) * 180) / Math.PI
  if (H < 0) H += 360
  // Achromatic: hue is meaningless below visual precision; pin to 0 so
  // serialisation is deterministic.
  if (C < 1e-7) H = 0
  return { L, C, H }
}

/** { L, C, H } → [r,g,b] 0-255 (clamped + rounded). */
function oklchToRgb({ L, C, H }) {
  const hr = (H * Math.PI) / 180
  const a = C * Math.cos(hr)
  const b = C * Math.sin(hr)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  return [r, g, bb].map((c) => {
    const v = Math.round(linearToSrgb(Math.min(1, Math.max(0, c))) * 255)
    return Math.min(255, Math.max(0, v))
  })
}

const fmt = (n) => {
  // toFixed(6) then strip trailing zeros — deterministic and compact.
  let s = n.toFixed(6)
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '')
  if (s === '-0') s = '0'
  return s
}

/** "#4F46E5" → "oklch(48.7282% 0.225072 273.0935)" (or null if not a hex). */
function hexToOklch(hex) {
  const rgb = parseHex(hex)
  if (!rgb) return null
  const { L, C, H } = rgbToOklch(rgb)
  return `oklch(${fmt(L * 100)}% ${fmt(C)} ${fmt(H)})`
}

const OKLCH_RE = /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)$/

function isOklch(value) {
  return typeof value === 'string' && OKLCH_RE.test(value.trim())
}

/** "oklch(48.7282% 0.225072 273.0935)" → "#4f46e5" (lowercase, build-output casing). */
function oklchToHex(value) {
  const m = OKLCH_RE.exec(String(value).trim())
  if (!m) return null
  const [r, g, b] = oklchToRgb({ L: parseFloat(m[1]) / 100, C: parseFloat(m[2]), H: parseFloat(m[3]) })
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')
}

module.exports = { hexToOklch, oklchToHex, isOklch }
