#!/usr/bin/env node
/**
 * R11 · iris.accent-on contrast guard
 *
 * Reference implementation of the v4.3 scanner rule defined in
 * docs/design-system/v4.3/scanner-rule-r11.md. Consumer scanners
 * (RALIA, marketing site) import or copy this function into their
 * design-rules pipeline.
 *
 * Rule: pairing iris.accent-on (white) with iris.accent (teal-600)
 *       computes to 3.74:1 — passes AA Large + Non-Text, fails AA
 *       Normal. When iris.accent-on is used as a text colour on an
 *       iris.accent surface, the element must satisfy AA Large
 *       (≥18.66px bold or ≥24px regular) or be non-text.
 *
 * Usage:
 *   node r11-iris-accent-on.mjs <path>...    # CLI — scans files/dirs
 *   import { detectR11Violations } from ...  # programmatic
 *
 * Returns an array of { file, line, snippet, severity, message } per
 * file scanned.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

// ---- public API ----

/** @typedef {{ file: string, line: number, snippet: string, severity: 'error' | 'warn', message: string }} R11Violation */

/**
 * Scan a single file's contents for R11 violations. Returns an array of
 * violations (possibly empty). The function is intentionally narrow:
 * it inspects element-like JSX expressions and HTML-attribute strings,
 * does not build an AST.
 *
 * @param {string} fileContents
 * @param {string} [filePath]
 * @returns {R11Violation[]}
 */
export function detectR11Violations(fileContents, filePath = '') {
  const violations = []
  const lines = fileContents.split('\n')

  // Element-block matcher. Matches a JSX element open through its
  // first `>` or self-close — we look at the full `<Foo ... />` or
  // `<div ...>` blob, then scan for the three signals.
  //
  // This is intentionally generous; false positives are filtered by
  // requiring ALL THREE signals (fg + bg + small-size) in the same
  // block.
  const blockMatcher = /<[A-Za-z][^>]*>/g

  let match
  while ((match = blockMatcher.exec(fileContents)) !== null) {
    const block = match[0]
    const fg = matchesForegroundIrisAccentOn(block)
    if (!fg) continue
    const bg = matchesBackgroundIrisAccent(block)
    if (!bg) continue

    const size = classifyFontSize(block)
    // size === 'large'   → passes; skip
    // size === 'small'   → error (clear violation)
    // size === 'unknown' → warn
    if (size === 'large') continue

    const lineNumber = lineFromOffset(fileContents, match.index)
    const snippet = lines[lineNumber - 1]?.trim() ?? block.trim()
    violations.push({
      file: filePath,
      line: lineNumber,
      snippet,
      severity: size === 'small' ? 'error' : 'warn',
      message:
        size === 'small'
          ? `iris.accent-on on iris.accent surface with small text — swap to iris.accent-on-dark, or render at ≥18.66px bold / ≥24px regular (DS v4.3 §4.2 / R11)`
          : `iris.accent-on on iris.accent surface — font size could not be determined statically. Confirm the element satisfies AA Large or use iris.accent-on-dark (DS v4.3 §4.2 / R11)`,
    })
  }

  return violations
}

/**
 * Scan a list of file or directory paths. Recursive on directories.
 * Skips node_modules / dist / build outputs.
 *
 * @param {string[]} paths
 * @returns {R11Violation[]}
 */
export function scanPaths(paths) {
  const violations = []
  for (const p of paths) walkPath(p, (file) => {
    const ext = extname(file)
    if (!['.tsx', '.jsx', '.ts', '.mdx', '.html'].includes(ext)) return
    let contents
    try {
      contents = readFileSync(file, 'utf8')
    } catch {
      return
    }
    violations.push(...detectR11Violations(contents, file))
  })
  return violations
}

// ---- internals ----

function matchesForegroundIrisAccentOn(block) {
  // Direct CSS custom property reference
  if (/--color-iris-accent-on(?!-dark)/.test(block)) return true
  // Tailwind class with arbitrary value
  if (/text-\[var\(--color-iris-accent-on(?!-dark)\)\]/.test(block)) return true
  // Direct Tailwind class (consumer preset wires `text-iris-accent-on`)
  if (/\btext-iris-accent-on(?!-dark)\b/.test(block)) return true
  // Inline `color: white` adjacent to iris-context is too ambiguous —
  // skip it; we want explicit token references.
  return false
}

function matchesBackgroundIrisAccent(block) {
  // The token `iris.accent-on` already matched above — we need the bare
  // `iris.accent` here. Negative-lookahead to avoid matching `accent-on`.
  if (/--color-iris-accent(?!-(?:on|hover|subtle))/.test(block)) return true
  if (/bg-\[var\(--color-iris-accent(?!-(?:on|hover|subtle))\)\]/.test(block)) return true
  if (/\bbg-iris-accent(?!-(?:on|hover|subtle))\b/.test(block)) return true
  return false
}

/**
 * Classify the effective font size of an element block.
 * Returns 'large' / 'small' / 'unknown'.
 *
 * AA Large = ≥24px regular OR ≥18.66px bold.
 */
function classifyFontSize(block) {
  const hasBold = /\b(font-bold|font-semibold)\b/.test(block) || /font-weight:\s*(?:700|600|bold)/.test(block)

  // Tailwind text-* classes
  if (/\btext-3xl\b/.test(block) || /\btext-4xl\b/.test(block) || /\btext-5xl\b/.test(block) || /\btext-6xl\b/.test(block)) {
    return 'large'
  }
  if (/\btext-2xl\b/.test(block)) return 'large' // 24px
  if (/\btext-xl\b/.test(block)) return hasBold ? 'large' : 'small' // 20px — bold qualifies
  if (/\btext-lg\b/.test(block)) return 'small' // 18px — even bold falls below 18.66
  if (/\btext-base\b/.test(block) || /\btext-sm\b/.test(block) || /\btext-xs\b/.test(block)) return 'small'

  // Inline font-size
  const m = block.match(/font-size:\s*(\d+(?:\.\d+)?)px/)
  if (m) {
    const px = parseFloat(m[1])
    if (hasBold ? px >= 18.66 : px >= 24) return 'large'
    return 'small'
  }
  const remMatch = block.match(/font-size:\s*(\d+(?:\.\d+)?)rem/)
  if (remMatch) {
    const px = parseFloat(remMatch[1]) * 16
    if (hasBold ? px >= 18.66 : px >= 24) return 'large'
    return 'small'
  }

  // No size declared on this element — caller's responsibility (warn).
  return 'unknown'
}

function lineFromOffset(text, offset) {
  let line = 1
  for (let i = 0; i < offset && i < text.length; i++) if (text[i] === '\n') line++
  return line
}

const EXCLUDED_DIRS = new Set(['node_modules', 'dist', '.next', 'storybook-static', '.git', 'build', 'coverage'])

function walkPath(path, cb) {
  let st
  try {
    st = statSync(path)
  } catch {
    return
  }
  if (st.isFile()) {
    cb(path)
    return
  }
  if (!st.isDirectory()) return
  for (const ent of readdirSync(path, { withFileTypes: true })) {
    if (EXCLUDED_DIRS.has(ent.name)) continue
    walkPath(join(path, ent.name), cb)
  }
}

// ---- CLI ----

const isMain = import.meta.url === `file://${process.argv[1]}`
if (isMain) {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Usage: r11-iris-accent-on.mjs <path>...')
    process.exit(2)
  }
  const violations = scanPaths(args)
  if (violations.length === 0) {
    console.log('R11: no violations.')
    process.exit(0)
  }
  let errors = 0
  for (const v of violations) {
    console.log(`${v.severity === 'error' ? 'ERROR' : 'WARN '} ${v.file}:${v.line}: ${v.message}`)
    console.log(`        ${v.snippet}`)
    if (v.severity === 'error') errors++
  }
  console.log('')
  console.log(`R11: ${violations.length} total (${errors} error, ${violations.length - errors} warn).`)
  process.exit(errors > 0 ? 1 : 0)
}
