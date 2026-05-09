#!/usr/bin/env node
/**
 * RisqBase Design System v4.2 — token validation lint (U5.6 / spec §15.8.4)
 *
 * Verifies the W3C JSON token tree for:
 *   - Every leaf has $value, $type and $description.
 *   - Every leaf has $extensions['com.risqbase.figma'] (Figma binding).
 *   - Every leaf has $extensions['com.risqbase.role'] in
 *     {primitive, semantic, component}.
 *   - Every {token.path} reference resolves to a defined token.
 *   - Theme override files only contain keys present in the light layers
 *     (spec §15.2.1: themes never define new tokens).
 *
 * Exit code 0 on success, 1 on any violation; violations are printed
 * one-per-line with the dotted token path and rule id.
 */

const path = require('path')
const fs = require('fs')

const ROOT = path.resolve(__dirname, '..', '..')
const TOKENS_DIR = path.join(ROOT, 'tokens')

const VALID_ROLES = new Set(['primitive', 'semantic', 'component'])

function walk(dir, fn) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, fn)
    else if (entry.isFile() && full.endsWith('.json')) fn(full)
  }
}

function loadAllTokens(layer) {
  const dir = path.join(TOKENS_DIR, layer)
  const tree = {}
  walk(dir, (file) => {
    let parsed
    try {
      parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch (err) {
      throw new Error(`Failed to parse ${path.relative(ROOT, file)}: ${err.message}`)
    }
    deepMerge(tree, parsed)
  })
  return tree
}

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith('$')) continue
    if (value && typeof value === 'object' && !Array.isArray(value) && !value.$value) {
      target[key] = target[key] || {}
      deepMerge(target[key], value)
    } else {
      target[key] = value
    }
  }
  return target
}

function isLeaf(node) {
  return node && typeof node === 'object' && Object.prototype.hasOwnProperty.call(node, '$value')
}

function flatten(node, prefix = []) {
  const out = []
  if (!node || typeof node !== 'object') return out
  if (isLeaf(node)) {
    out.push({ path: prefix, leaf: node })
    return out
  }
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue
    out.push(...flatten(child, [...prefix, key]))
  }
  return out
}

function main() {
  const errors = []
  const lightTree = {}
  for (const layer of ['primitive', 'semantic', 'component']) {
    deepMerge(lightTree, loadAllTokens(layer))
  }

  const lightLeaves = flatten(lightTree)
  const lightKeys = new Set(lightLeaves.map((l) => l.path.join('.')))

  for (const { path: p, leaf } of lightLeaves) {
    const dotted = p.join('.')
    if (typeof leaf.$value !== 'string' && typeof leaf.$value !== 'number') {
      errors.push(`${dotted}: missing or non-string $value`)
    }
    if (typeof leaf.$type !== 'string') {
      errors.push(`${dotted}: missing $type`)
    }
    if (typeof leaf.$description !== 'string' || leaf.$description.length === 0) {
      errors.push(`${dotted}: missing $description (rule §15.8.4)`)
    }
    const role = (leaf.$extensions || {})['com.risqbase.role']
    if (!role || !VALID_ROLES.has(role)) {
      errors.push(
        `${dotted}: $extensions['com.risqbase.role'] must be one of ${[...VALID_ROLES].join(', ')} (got ${JSON.stringify(role)})`
      )
    }
    const fig = (leaf.$extensions || {})['com.risqbase.figma']
    if (!fig || typeof fig.collection !== 'string' || typeof fig.mode !== 'string' || typeof fig.variable !== 'string') {
      errors.push(`${dotted}: $extensions['com.risqbase.figma'] must define { collection, mode, variable } (rule U5.2)`)
    }
    if (typeof leaf.$value === 'string') {
      const m = /^\{(.+)\}$/.exec(leaf.$value.trim())
      if (m && !lightKeys.has(m[1])) {
        errors.push(`${dotted}: reference {${m[1]}} does not resolve to a defined token`)
      }
    }
  }

  for (const theme of ['dark', 'hc']) {
    const themeFile = path.join(TOKENS_DIR, 'themes', `${theme}.json`)
    if (!fs.existsSync(themeFile)) continue
    let themeTree
    try {
      themeTree = JSON.parse(fs.readFileSync(themeFile, 'utf8'))
    } catch (err) {
      errors.push(`tokens/themes/${theme}.json: ${err.message}`)
      continue
    }
    for (const { path: p, leaf } of flatten(themeTree)) {
      const dotted = p.join('.')
      if (!lightKeys.has(dotted)) {
        errors.push(
          `tokens/themes/${theme}.json: ${dotted} is not present in primitive/semantic/component (themes may only override existing tokens — spec §15.2.1)`
        )
      }
      if (typeof leaf.$value !== 'string' && typeof leaf.$value !== 'number') {
        errors.push(`tokens/themes/${theme}.json: ${dotted}: missing or non-string $value`)
      }
    }
  }

  if (errors.length > 0) {
    console.error(`tokens-lint: ${errors.length} violation(s):`)
    for (const e of errors) console.error(`  ${e}`)
    process.exit(1)
  }
  console.log(`tokens-lint: ${lightLeaves.length} tokens validated, no violations.`)
}

try {
  main()
} catch (err) {
  console.error('tokens-lint failed to run:', err.message)
  process.exit(2)
}
