#!/usr/bin/env node
/**
 * Scanner rule R15 — brand-mark integrity (brand-mark v3 hand-off, PR-A T5).
 * Reference implementation, same lifecycle as r11/r13: ships with the
 * package so consumer scanners pick rule updates up via their normal
 * version bump.
 *
 * Rule: the brand mark is frozen vector paths (public/mark.svg) — it must
 * never be re-typed as SVG `<text>`, and component code must never name a
 * web/installed font family (the Footer's Helvetica mark sailed past R1
 * because R1 only catches serif/mono stacks). Violations:
 *
 *   1. A `fontFamily`/`font-family` literal whose FIRST family is a named
 *      font (e.g. 'Helvetica Neue', Arial, Geist) rather than a system
 *      entry (system-ui, ui-*, -apple-system, BlinkMacSystemFont), a CSS
 *      generic (sans-serif/serif/monospace/…), a var(--…) reference, or a
 *      CSS-wide keyword. System-first stacks may list named fonts as
 *      fallbacks (e.g. 'system-ui, "Segoe UI", Roboto, sans-serif').
 *   2. An SVG `<text>` element rendering the brand lockup (`r|ↄ` — any
 *      content containing `ↄ` U+2184 or a literal `r|`). Charts may use
 *      `<text>` for data labels; the lockup may not be one of them.
 *
 * Detection is regex-based and intentionally narrow, like R11/R13: obvious
 * violations error; ambiguity is left to human review.
 *
 * Usage: node scripts/scanner-rules/r15-brand-mark-integrity.mjs [--dir <path>]
 * Exit 0 clean, 1 on violations.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const args = process.argv.slice(2)
const dirFlag = args.indexOf('--dir')
const SCAN_DIR = dirFlag >= 0 ? path.resolve(args[dirFlag + 1]) : path.join(ROOT, 'src')

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

// First-family allowlist: system entries, CSS generics, custom-property
// references and CSS-wide keywords.
const SYSTEM_FIRST =
  /^(system-ui|ui-(sans-serif|serif|monospace|rounded)|-apple-system|BlinkMacSystemFont|sans-serif|serif|monospace|cursive|fantasy|math|emoji|inherit|initial|unset|revert|var\(--)/i

function firstFamily(stack) {
  return stack.split(',')[0].trim().replace(/^['"`]+|['"`]+$/g, '').trim()
}

function lineOf(src, index) {
  return src.slice(0, index).split('\n').length
}

const violations = []

for (const file of walk(SCAN_DIR)) {
  const src = readFileSync(file, 'utf8')
  const rel = path.relative(ROOT, file)

  // 1a. JSX/object form: fontFamily= / fontFamily: with a string literal.
  for (const m of src.matchAll(/fontFamily\s*[:=]\s*\{?\s*(['"`])([\s\S]*?)\1/g)) {
    const fam = firstFamily(m[2])
    if (fam && !SYSTEM_FIRST.test(fam)) {
      violations.push(`${rel}:${lineOf(src, m.index)} — non-system font-family literal ('${fam}' leads the stack); the brand mark is frozen paths and component text uses the system stack (GOV-DS-2026-01)`)
    }
  }

  // 1b. CSS form: font-family: <stack>; (template-literal CSS, .css files).
  for (const m of src.matchAll(/font-family\s*:\s*([^;}{]+)/gi)) {
    const fam = firstFamily(m[1])
    if (fam && !SYSTEM_FIRST.test(fam)) {
      violations.push(`${rel}:${lineOf(src, m.index)} — non-system font-family literal ('${fam}' leads the stack); the brand mark is frozen paths and component text uses the system stack (GOV-DS-2026-01)`)
    }
  }

  // 2. Brand lockup re-typed as SVG <text>.
  for (const m of src.matchAll(/<text\b[^]*?<\/text>/g)) {
    if (/ↄ|\br\s*\|/.test(m[0])) {
      violations.push(`${rel}:${lineOf(src, m.index)} — brand lockup re-typed as <text>; use the frozen mark paths (public/mark.svg geometry, fill="currentColor")`)
    }
  }
}

if (violations.length) {
  console.error(`R15 brand-mark integrity: ${violations.length} violation(s)\n`)
  for (const v of violations) console.error(`  ✗ ${v}`)
  console.error('\nThe brand mark ships as frozen outlines (brand-mark v3 hand-off, LOCKED 2026-06-11); never re-type it as <text>, never name a web font in component code.')
  process.exit(1)
}

console.log(`R15 brand-mark integrity: clean (${SCAN_DIR === path.join(ROOT, 'src') ? 'src/' : SCAN_DIR}).`)
