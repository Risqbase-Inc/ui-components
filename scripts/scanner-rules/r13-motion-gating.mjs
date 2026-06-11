#!/usr/bin/env node
/**
 * Scanner rule R13 — motion gating (v4.4 GOV-DS-2026-02 rev. v4.4 §9; the brief's
 * "R12", renumbered per §13 decision 2026-06-09·2). Reference
 * implementation, same lifecycle as r11-iris-accent-on.mjs: ships with
 * the package so consumer scanners pick rule updates up via their normal
 * version bump.
 *
 * Rule: animated CSS in component-tier code must be gated on
 * `[data-motion]`, `prefers-reduced-motion`, or the `useReducedMotion()`
 * hook. Violations:
 *
 *   1. A Tailwind `animate-<name>` class with no `motion-reduce:` gate in
 *      the same className AND no `useReducedMotion` usage in the file.
 *      (The central tokens.css [data-motion="reduced"] rules cover the
 *      package's own animation names — `risqbase-`/`animate-skeleton-
 *      shimmer`/`animate-toast-enter` — so those count as gated when the
 *      file uses the hook OR the motion-reduce fallback class.)
 *   2. An inline-style or CSS `animation:` declaration with `infinite`
 *      iteration, ungated.
 *   3. A `transition:`/`transition-duration` longer than 500ms, ungated.
 *      (Short functional transitions — hovers, 300ms gauge sweeps — are
 *      exempt per the rule text: "raw ungated animation:/LONG transition:".)
 *
 * Detection is regex-based and intentionally narrow, like R11: obvious
 * violations error; ambiguity is left to human review.
 *
 * Usage: node scripts/scanner-rules/r13-motion-gating.mjs [--dir <path>]
 * Exit 0 clean, 1 on violations.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const args = process.argv.slice(2)
const dirFlag = args.indexOf('--dir')
const SCAN_DIR = dirFlag >= 0 ? path.resolve(args[dirFlag + 1]) : path.join(ROOT, 'src')

const LONG_MS = 500

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist') continue
      yield* walk(full)
    } else if (/\.(tsx|jsx|ts|css)$/.test(entry) && !/\.stories\./.test(entry)) {
      yield full
    }
  }
}

function durationMs(s) {
  const m = /([\d.]+)(ms|s)\b/.exec(s)
  if (!m) return 0
  return m[2] === 's' ? parseFloat(m[1]) * 1000 : parseFloat(m[1])
}

export function detectR13Violations(source, file) {
  const violations = []
  const usesHook = /useReducedMotion\s*\(/.test(source)
  const lines = source.split('\n')

  lines.forEach((line, i) => {
    const where = `${file}:${i + 1}`

    // 1. Tailwind animate-* classes.
    for (const m of line.matchAll(/(?<![\w:-])animate-(?!none\b)[\w-]+/g)) {
      const gatedInline = /motion-reduce:animate-none/.test(line) || /motion-reduce:animate-none/.test(source)
      if (!gatedInline && !usesHook) {
        violations.push(`${where}: ungated Tailwind animation "${m[0]}" — gate with useReducedMotion(), motion-reduce:animate-none, or the central [data-motion] rules (R13)`)
      }
    }

    // 2. Raw animation declarations (inline style objects or CSS).
    for (const m of line.matchAll(/animation\s*:\s*['"]?([^;,}'"]+)/g)) {
      if (/infinite/.test(m[1]) && !usesHook && !inGatedCssContext(source, line)) {
        violations.push(`${where}: ungated infinite animation "${m[1].trim()}" (R13)`)
      }
    }

    // 3. Long transitions.
    for (const m of line.matchAll(/transition(?:-duration)?\s*:\s*['"]?([^;}'"]+)/g)) {
      if (durationMs(m[1]) > LONG_MS && !usesHook && !inGatedCssContext(source, line)) {
        violations.push(`${where}: ungated transition longer than ${LONG_MS}ms ("${m[1].trim()}") (R13)`)
      }
    }
  })
  return violations
}

// CSS files: a declaration is considered gated when the file wires
// [data-motion] or prefers-reduced-motion handling for it anywhere.
function inGatedCssContext(source, line) {
  if (!/[{}]/.test(source)) return false
  return /\[data-motion=/.test(source) || /prefers-reduced-motion/.test(source)
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  let all = []
  for (const file of walk(SCAN_DIR)) {
    all = all.concat(detectR13Violations(readFileSync(file, 'utf8'), path.relative(ROOT, file)))
  }
  if (all.length) {
    console.error(`R13 motion-gating: ${all.length} violation(s):`)
    for (const v of all) console.error(`  ${v}`)
    process.exit(1)
  }
  console.log('R13 motion-gating: clean.')
}
