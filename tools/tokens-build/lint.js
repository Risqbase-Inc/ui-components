#!/usr/bin/env node
/**
 * RisqBase Design System v4.4 — token validation lint
 * (scanner rule R12 "token source hygiene" reference implementation —
 * see docs/design-system/v4.4/scanner-rules-r12-r14.md)
 *
 * Validates the DTCG 2025.10 token source (`tokens/**\/*.tokens.json`,
 * media type `application/design-tokens+json`):
 *
 *   - Every token file uses the `.tokens.json` extension (bare `.json`
 *     token files are a violation since the v4.4 §A1 rename).
 *   - Every leaf has $value, $type and $description.
 *   - `$deprecated`, when present, is boolean or a string reason.
 *   - Every leaf has $extensions['com.risqbase.figma'] (Figma binding)
 *     and $extensions['com.risqbase.role'] ∈ {primitive, semantic, component}.
 *   - Color `$value`s are OKLCH — raw hex is rejected everywhere
 *     (legacy hex lives only in $extensions['com.risqbase.legacyHex'],
 *     which must itself be a #rrggbb string when present). v4.4 §A3.
 *   - Every {token.path} reference resolves to a defined token.
 *   - Theme sets (discovered via tokens/resolver.tokens.json, §A4) only
 *     override keys present in the base set — themes never define new
 *     tokens.
 *   - Dark completeness (v4.4 §B5 row 1): every semantic/component color
 *     token must RESOLVE differently under dark than under light, or the
 *     base leaf must carry $extensions['com.risqbase.themeInvariant']
 *     (a string reason) declaring it intentionally theme-stable.
 *
 * Exit code 0 on success, 1 on any violation; violations are printed
 * one-per-line with the dotted token path and rule id.
 */

const path = require('path')
const fs = require('fs')

const ROOT = path.resolve(__dirname, '..', '..')
// RISQBASE_TOKENS_DIR override exists for the R12 negative-check fixtures
// (scripts/test-scanner-rules.mjs, DoD-5): the rule must demonstrably fail
// on a violating token tree before it counts as implemented.
const TOKENS_DIR = process.env.RISQBASE_TOKENS_DIR
  ? path.resolve(process.env.RISQBASE_TOKENS_DIR)
  : path.join(ROOT, 'tokens')

const VALID_ROLES = new Set(['primitive', 'semantic', 'component'])
const HEX_RE = /^#[0-9a-fA-F]{3,8}$/
const OKLCH_RE = /^oklch\(\s*[\d.]+%\s+[\d.]+\s+[\d.]+\s*\)$/

function walk(dir, fn) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, fn)
    else if (entry.isFile() && full.endsWith('.json')) fn(full)
  }
}

function loadAllTokens(layer, errors) {
  const dir = path.join(TOKENS_DIR, layer)
  const tree = {}
  walk(dir, (file) => {
    const rel = path.relative(ROOT, file)
    if (!file.endsWith('.tokens.json')) {
      errors.push(`${rel}: token files must use the .tokens.json extension (v4.4 §A1 / R12)`)
    }
    let parsed
    try {
      parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch (err) {
      throw new Error(`Failed to parse ${rel}: ${err.message}`)
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

/** Resolve a token $value through {a.b.c} references to its literal.
 *  Also substitutes references embedded in composite values (gradients,
 *  shadows) so theme-completeness comparisons see the resolved form. */
function resolveValue(byKey, value, seen = new Set()) {
  if (typeof value !== 'string') return value
  const whole = /^\{(.+)\}$/.exec(value.trim())
  if (whole) {
    if (seen.has(whole[1])) return undefined
    seen.add(whole[1])
    const target = byKey.get(whole[1])
    if (!target) return undefined
    return resolveValue(byKey, target.leaf.$value, seen)
  }
  return value.replace(/\{([^}]+)\}/g, (m, ref) => {
    if (seen.has(ref)) return m
    const target = byKey.get(ref)
    if (!target) return m
    const resolved = resolveValue(byKey, target.leaf.$value, new Set([...seen, ref]))
    return resolved === undefined ? m : String(resolved)
  })
}

function readResolver(errors) {
  const file = path.join(TOKENS_DIR, 'resolver.tokens.json')
  if (!fs.existsSync(file)) {
    errors.push('tokens/resolver.tokens.json: missing (v4.4 §A4 — theming is resolver-driven)')
    return { themes: [] }
  }
  const resolver = JSON.parse(fs.readFileSync(file, 'utf8'))
  const setFiles = new Set(resolver.sets.flatMap((s) => s.values))
  // Every tier file on disk must be declared in the resolver base set.
  for (const tier of ['primitive', 'semantic', 'component']) {
    walk(path.join(TOKENS_DIR, tier), (file) => {
      const rel = path.relative(TOKENS_DIR, file)
      if (!setFiles.has(rel)) {
        errors.push(`tokens/resolver.tokens.json: ${rel} exists on disk but is not declared in any set`)
      }
    })
  }
  for (const f of setFiles) {
    if (!fs.existsSync(path.join(TOKENS_DIR, f))) {
      errors.push(`tokens/resolver.tokens.json: declared set file ${f} does not exist`)
    }
  }
  const themeModifier = (resolver.modifiers || []).find((m) => m.name === 'theme') || { values: [] }
  const themes = themeModifier.values
    .filter((v) => v.name !== themeModifier.default)
    .map((v) => ({ name: v.name, files: v.values }))
  for (const t of themes) {
    for (const f of t.files) {
      if (!fs.existsSync(path.join(TOKENS_DIR, f))) {
        errors.push(`tokens/resolver.tokens.json: theme '${t.name}' file ${f} does not exist`)
      }
    }
  }
  return { themes }
}

function lintLeaf(dotted, leaf, errors, { requireMeta = true } = {}) {
  if (typeof leaf.$value !== 'string' && typeof leaf.$value !== 'number') {
    errors.push(`${dotted}: missing or non-string $value`)
  }
  if (requireMeta && typeof leaf.$type !== 'string') {
    errors.push(`${dotted}: missing $type`)
  }
  if (requireMeta && (typeof leaf.$description !== 'string' || leaf.$description.length === 0)) {
    errors.push(`${dotted}: missing $description (rule §15.8.4)`)
  }
  if ('$deprecated' in leaf && typeof leaf.$deprecated !== 'boolean' && typeof leaf.$deprecated !== 'string') {
    errors.push(`${dotted}: $deprecated must be boolean or a string reason (DTCG 2025.10)`)
  }
  const ext = leaf.$extensions || {}
  if (requireMeta) {
    const role = ext['com.risqbase.role']
    if (!role || !VALID_ROLES.has(role)) {
      errors.push(
        `${dotted}: $extensions['com.risqbase.role'] must be one of ${[...VALID_ROLES].join(', ')} (got ${JSON.stringify(role)})`
      )
    }
    const fig = ext['com.risqbase.figma']
    if (!fig || typeof fig.collection !== 'string' || typeof fig.mode !== 'string' || typeof fig.variable !== 'string') {
      errors.push(`${dotted}: $extensions['com.risqbase.figma'] must define { collection, mode, variable } (rule U5.2)`)
    }
  }
  if ('com.risqbase.legacyHex' in ext && !HEX_RE.test(String(ext['com.risqbase.legacyHex']))) {
    errors.push(`${dotted}: $extensions['com.risqbase.legacyHex'] must be a #rrggbb string`)
  }
  if (
    leaf.$type === 'color' &&
    typeof leaf.$value === 'string' &&
    HEX_RE.test(leaf.$value.trim())
  ) {
    errors.push(
      `${dotted}: raw hex $value — color sources are OKLCH-only since v4.4 §A3 (R12); legacy hex belongs in $extensions['com.risqbase.legacyHex']`
    )
  }
  if ('com.risqbase.themeInvariant' in ext && typeof ext['com.risqbase.themeInvariant'] !== 'string') {
    errors.push(`${dotted}: $extensions['com.risqbase.themeInvariant'] must be a string reason`)
  }
}

function main() {
  const errors = []
  const lightTree = {}
  for (const layer of ['primitive', 'semantic', 'component']) {
    deepMerge(lightTree, loadAllTokens(layer, errors))
  }

  const lightLeaves = flatten(lightTree)
  const lightByKey = new Map(lightLeaves.map((l) => [l.path.join('.'), l]))

  for (const { path: p, leaf } of lightLeaves) {
    const dotted = p.join('.')
    lintLeaf(dotted, leaf, errors)
    if (typeof leaf.$value === 'string') {
      const m = /^\{(.+)\}$/.exec(leaf.$value.trim())
      if (m && !lightByKey.has(m[1])) {
        errors.push(`${dotted}: reference {${m[1]}} does not resolve to a defined token`)
      }
    }
  }

  const { themes } = readResolver(errors)
  for (const theme of themes) {
    const themeTree = {}
    for (const f of theme.files) {
      const full = path.join(TOKENS_DIR, f)
      if (!fs.existsSync(full)) continue
      try {
        deepMerge(themeTree, JSON.parse(fs.readFileSync(full, 'utf8')))
      } catch (err) {
        errors.push(`tokens/${f}: ${err.message}`)
      }
    }
    const themeLeaves = flatten(themeTree)
    const themeByKey = new Map(lightByKey)
    for (const { path: p, leaf } of themeLeaves) {
      const dotted = p.join('.')
      if (!lightByKey.has(dotted)) {
        errors.push(
          `theme '${theme.name}': ${dotted} is not present in primitive/semantic/component (themes may only override existing tokens — §A4)`
        )
        continue
      }
      lintLeaf(`theme '${theme.name}': ${dotted}`, leaf, errors, { requireMeta: false })
      themeByKey.set(dotted, { path: p, leaf })
    }

    // Dark completeness (§B5 row 1, R12): every semantic/component color
    // token must resolve differently under the theme, or carry an explicit
    // themeInvariant reason on the base leaf.
    const explicitOverrides = new Set(themeLeaves.map((l) => l.path.join('.')))
    for (const { path: p, leaf } of lightLeaves) {
      if (leaf.$type !== 'color') continue
      const role = (leaf.$extensions || {})['com.risqbase.role']
      if (role !== 'semantic' && role !== 'component') continue
      const dotted = p.join('.')
      // An explicit theme override is intentional even when it lands on the
      // light value (e.g. text.on-action stays pure white by design).
      if (explicitOverrides.has(dotted)) continue
      const lightResolved = resolveValue(lightByKey, leaf.$value)
      const themeResolved = resolveValue(themeByKey, (themeByKey.get(dotted) || { leaf }).leaf.$value)
      if (
        lightResolved === themeResolved &&
        !(leaf.$extensions || {})['com.risqbase.themeInvariant']
      ) {
        errors.push(
          `theme '${theme.name}': ${dotted} resolves to the light value (${lightResolved}) — add a theme override or declare $extensions['com.risqbase.themeInvariant'] with a reason (§B5/R12 completeness)`
        )
      }
    }
  }

  if (errors.length > 0) {
    console.error(`tokens-lint: ${errors.length} violation(s):`)
    for (const e of errors) console.error(`  ${e}`)
    process.exit(1)
  }
  const deprecatedCount = lightLeaves.filter((l) => l.leaf.$deprecated).length
  console.log(
    `tokens-lint: ${lightLeaves.length} tokens validated, no violations.` +
      (deprecatedCount ? ` ${deprecatedCount} deprecated.` : '')
  )
}

try {
  main()
} catch (err) {
  console.error('tokens-lint failed to run:', err.message)
  process.exit(2)
}
