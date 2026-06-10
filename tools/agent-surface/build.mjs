#!/usr/bin/env node
/**
 * Agent-surface build (v4.4 Workstream C, GOV-DS-2026-03 §C1–§C4).
 *
 * ONE build step produces every machine-readable artefact agents consume,
 * all derived from the same sources of truth — never hand-maintained:
 *
 *   public/agent/registry.json   consumed by the MCP server (both
 *                                transports), the llms.txt generator
 *                                below, and the docs site
 *   dist/agent/registry.json     same content (brief §C4 path; the MCP
 *                                package bundles it at publish)
 *   public/llms.txt              llms.txt-convention index
 *   public/llms-full.txt         full concatenated corpus
 *   public/components/<n>.md     per-component mirrors
 *   public/tokens/<group>.md     per-token-group mirrors (+ theming.md)
 *   public/patterns/<id>.md      recipe mirrors
 *   public/products/ralia/<id>.md  Layer-3 showcase mirrors (D-104 flags)
 *
 * Sources: src/<domain>/<Component>/{types.ts,index.tsx,tokens.md,
 * accessibility.md} (props extracted from the TypeScript AST),
 * tokens/** via the resolver (light + dark resolutions),
 * docs/recipes/*.md frontmatter, docs/showcase/*.json,
 * docs/design-system/lifecycle.json, scripts/scanner-rules/rules.json.
 *
 * Modes:
 *   node tools/agent-surface/build.mjs build   — write artefacts
 *   node tools/agent-surface/build.mjs check   — fail if committed
 *     artefacts drift from regeneration (scanner rule R14; same
 *     mechanism as docs:check)
 *
 * Output is deterministic: no timestamps (the MCP server stamps
 * `generatedAt` at serve time); `sourceHash` keys the content.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const { oklchToHex } = require('../tokens-build/lib/oklch.js')

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const SRC = path.join(ROOT, 'src')
const TOKENS = path.join(ROOT, 'tokens')
// RISQBASE_PUBLIC_DIR override exists for the R14 negative-check fixture
// (scripts/test-scanner-rules.mjs, DoD-5).
const PUBLIC = process.env.RISQBASE_PUBLIC_DIR
  ? path.resolve(process.env.RISQBASE_PUBLIC_DIR)
  : path.join(ROOT, 'public')

const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'))

const SPEC_VERSION = 'v4.4'

/* ── components ──────────────────────────────────────────────────────── */

const DOMAIN_LAYER = { core: 1, ai: 2, 'data-viz': 2, marketing: 2, primitives: 1 }
const EXCLUDED = new Set(['theme'])

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

function extractProps(typesPath) {
  if (!existsSync(typesPath)) return []
  const src = readFileSync(typesPath, 'utf8')
  const sf = ts.createSourceFile(typesPath, src, ts.ScriptTarget.Latest, true)
  const out = []
  const jsdocOf = (node) => {
    const docs = ts.getJSDocCommentsAndTags(node)
    return docs
      .map((d) => (typeof d.comment === 'string' ? d.comment : ''))
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  sf.forEachChild((node) => {
    const exported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    if (!exported) return
    if (ts.isInterfaceDeclaration(node)) {
      out.push({
        name: node.name.text,
        kind: 'interface',
        members: node.members.filter(ts.isPropertySignature).map((m) => ({
          name: m.name.getText(sf).replace(/^['"]|['"]$/g, ''),
          type: m.type ? m.type.getText(sf).replace(/\s+/g, ' ') : 'unknown',
          required: !m.questionToken,
          description: jsdocOf(m) || undefined,
        })),
      })
    } else if (ts.isTypeAliasDeclaration(node)) {
      out.push({
        name: node.name.text,
        kind: 'type',
        definition: node.type.getText(sf).replace(/\s+/g, ' '),
      })
    }
  })
  return out
}

function extractDescription(indexPath) {
  if (!existsSync(indexPath)) return ''
  const lines = readFileSync(indexPath, 'utf8').split('\n')
  const block = []
  for (const line of lines) {
    const t = line.trim()
    if (t.startsWith('//')) block.push(t.replace(/^\/\/\s?/, ''))
    else if (block.length > 0 && t !== '') break
  }
  return block.join(' ').replace(/\s+/g, ' ').trim()
}

function extractExports(indexPath) {
  if (!existsSync(indexPath)) return []
  const src = readFileSync(indexPath, 'utf8')
  const names = new Set()
  for (const m of src.matchAll(/export\s+(?:function|const)\s+([A-Z]\w+)/g)) names.add(m[1])
  return [...names].sort()
}

function extractComposesWith(indexPath, allNames) {
  if (!existsSync(indexPath)) return []
  const src = readFileSync(indexPath, 'utf8')
  const found = new Set()
  for (const m of src.matchAll(/import\s+\{([^}]+)\}\s+from\s+'\.\.[^']*'/g)) {
    for (const name of m[1].split(',').map((s) => s.trim().split(' ')[0])) {
      if (allNames.has(name)) found.add(name)
    }
  }
  return [...found].sort()
}

function scanComponents(lifecycle) {
  const names = new Set()
  const dirs = []
  for (const domain of Object.keys(DOMAIN_LAYER)) {
    const dd = path.join(SRC, domain)
    if (!existsSync(dd)) continue
    for (const entry of readdirSync(dd, { withFileTypes: true })) {
      if (!entry.isDirectory() || EXCLUDED.has(entry.name)) continue
      const full = path.join(dd, entry.name)
      if (!existsSync(path.join(full, 'index.tsx')) && !existsSync(path.join(full, 'index.ts'))) continue
      names.add(entry.name)
      dirs.push({ domain, name: entry.name, dir: full })
    }
  }
  return dirs
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ domain, name, dir }) => {
      const indexPath = existsSync(path.join(dir, 'index.tsx'))
        ? path.join(dir, 'index.tsx')
        : path.join(dir, 'index.ts')
      const read = (f) => (existsSync(path.join(dir, f)) ? readFileSync(path.join(dir, f), 'utf8') : null)
      const state = lifecycle.states[name]?.state ?? 'stable'
      return {
        name,
        slug: kebab(name),
        domain,
        layer: DOMAIN_LAYER[domain],
        state,
        stateNote: lifecycle.states[name]?.note,
        description: extractDescription(indexPath),
        exports: extractExports(indexPath),
        import: `import { ${name} } from '@risqbase-inc/ui-components/${domain}'`,
        api: extractProps(path.join(dir, 'types.ts')),
        tokensDoc: read('tokens.md'),
        accessibilityDoc: read('accessibility.md'),
        composesWith: extractComposesWith(indexPath, names),
        storybook: existsSync(path.join(dir, `${name}.stories.tsx`)) ? `src/${domain}/${name}/${name}.stories.tsx` : null,
      }
    })
}

/* ── tokens (resolver-driven, light + dark resolutions) ──────────────── */

function deepMerge(target, source, overrideLeaves = false) {
  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith('$')) continue
    if (value && typeof value === 'object' && !Array.isArray(value) && !('$value' in value)) {
      target[key] = target[key] || {}
      deepMerge(target[key], value, overrideLeaves)
    } else if (overrideLeaves && target[key] && typeof target[key] === 'object' && '$value' in target[key]) {
      target[key] = { ...target[key], ...value, $extensions: { ...(target[key].$extensions || {}), ...(value.$extensions || {}) } }
    } else {
      target[key] = value
    }
  }
  return target
}

function flatten(node, prefix = [], out = []) {
  if (node && typeof node === 'object') {
    if ('$value' in node) out.push({ path: prefix.join('.'), leaf: node })
    else for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) flatten(v, [...prefix, k], out)
  }
  return out
}

function resolveValue(byKey, value, seen = new Set()) {
  if (typeof value !== 'string') return value
  const whole = /^\{(.+)\}$/.exec(value.trim())
  if (whole) {
    if (seen.has(whole[1]) || !byKey.has(whole[1])) return undefined
    seen.add(whole[1])
    return resolveValue(byKey, byKey.get(whole[1]).$value, seen)
  }
  return value.replace(/\{([^}]+)\}/g, (m, ref) =>
    byKey.has(ref) ? String(resolveValue(byKey, byKey.get(ref).$value, new Set([...seen, ref])) ?? m) : m
  )
}

const withHex = (v) =>
  typeof v === 'string' && v.startsWith('oklch(') ? { value: v, hex: oklchToHex(v) } : { value: v }

function buildTokens() {
  const resolver = JSON.parse(readFileSync(path.join(TOKENS, 'resolver.tokens.json'), 'utf8'))
  const base = {}
  for (const f of resolver.sets.flatMap((s) => s.values)) {
    deepMerge(base, JSON.parse(readFileSync(path.join(TOKENS, f), 'utf8')))
  }
  const themeMod = resolver.modifiers.find((m) => m.name === 'theme')
  const themes = {}
  for (const t of themeMod.values) {
    const tree = JSON.parse(JSON.stringify(base))
    for (const f of t.values) deepMerge(tree, JSON.parse(readFileSync(path.join(TOKENS, f), 'utf8')), true)
    themes[t.name] = new Map(flatten(tree).map(({ path: p, leaf }) => [p, leaf]))
  }
  const lightMap = themes[themeMod.default]

  return flatten(base).map(({ path: p, leaf }) => {
    const tier = (leaf.$extensions || {})['com.risqbase.role'] || 'primitive'
    const chain = []
    let cursor = leaf.$value
    let cursorMap = lightMap
    while (typeof cursor === 'string' && /^\{.+\}$/.test(cursor.trim())) {
      const ref = cursor.trim().slice(1, -1)
      chain.push(ref)
      cursor = cursorMap.get(ref)?.$value
      if (cursor === undefined) break
    }
    const out = {
      path: p,
      type: leaf.$type,
      description: leaf.$description,
      tier,
      value: leaf.$value,
      resolutionChain: chain,
      resolved: {},
      cssVariable: `--${p.split('.').join('-').toLowerCase()}`,
    }
    for (const [name, map] of Object.entries(themes)) {
      out.resolved[name] = withHex(resolveValue(new Map([...map].map(([k, v]) => [k, v])), map.get(p).$value))
    }
    if (leaf.$deprecated !== undefined) out.deprecated = leaf.$deprecated
    const pair = (leaf.$extensions || {})['com.risqbase.contrastPair']
    if (pair) out.contrastPair = pair.replace(/^\{|\}$/g, '')
    const level = (leaf.$extensions || {})['com.risqbase.contrastLevel']
    if (level) out.contrastLevel = level
    const invariant = (leaf.$extensions || {})['com.risqbase.themeInvariant']
    if (invariant) out.themeInvariant = invariant
    return out
  })
}

/* ── recipes (docs/recipes/*.md YAML frontmatter) ────────────────────── */

function parseFrontmatter(md) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(md)
  if (!m) return { meta: {}, body: md }
  const meta = {}
  let currentKey = null
  for (const line of m[1].split('\n')) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line)
    if (kv) {
      currentKey = kv[1]
      const v = kv[2].trim()
      meta[currentKey] = v === '' ? [] : v.replace(/^['"]|['"]$/g, '')
    } else {
      const item = /^\s*-\s+(.*)$/.exec(line)
      if (item && currentKey) {
        if (!Array.isArray(meta[currentKey])) meta[currentKey] = meta[currentKey] === '' ? [] : [meta[currentKey]]
        meta[currentKey].push(item[1].replace(/^['"]|['"]$/g, ''))
      }
    }
  }
  return { meta, body: m[2] }
}

function buildRecipes() {
  const dir = path.join(ROOT, 'docs', 'recipes')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => {
      const { meta, body } = parseFrontmatter(readFileSync(path.join(dir, f), 'utf8'))
      return { id: meta.id || f.replace(/\.md$/, ''), ...meta, body: body.trim() }
    })
}

/* ── showcase / rules / lifecycle ────────────────────────────────────── */

function buildShowcase() {
  const dir = path.join(ROOT, 'docs', 'showcase')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => JSON.parse(readFileSync(path.join(dir, f), 'utf8')))
}

/* ── registry assembly ───────────────────────────────────────────────── */

function buildRegistry() {
  const lifecycle = JSON.parse(readFileSync(path.join(ROOT, 'docs', 'design-system', 'lifecycle.json'), 'utf8'))
  const registry = {
    spec: SPEC_VERSION,
    package: pkg.version,
    name: pkg.name,
    docsSite: 'https://design.risqbase.com',
    components: scanComponents(lifecycle),
    tokens: buildTokens(),
    recipes: buildRecipes(),
    showcase: buildShowcase(),
    usageRules: JSON.parse(readFileSync(path.join(ROOT, 'scripts', 'scanner-rules', 'rules.json'), 'utf8')).rules,
    lifecycle,
  }
  const hash = createHash('sha256').update(JSON.stringify(registry)).digest('hex').slice(0, 16)
  return { ...registry, sourceHash: hash }
}

/* ── llms.txt family + .md mirrors ───────────────────────────────────── */

function componentMd(c) {
  const lines = [
    '---',
    `name: ${c.name}`,
    `domain: ${c.domain}`,
    `layer: ${c.layer}`,
    `state: ${c.state}`,
    'consumable: true',
    '---',
    '',
    `# ${c.name}`,
    '',
    c.description || '',
    '',
    '```ts',
    c.import,
    '```',
    '',
    '## API',
    '',
  ]
  for (const t of c.api) {
    if (t.kind === 'type') {
      lines.push(`- \`type ${t.name} = ${t.definition}\``)
    } else {
      lines.push(`### \`${t.name}\``, '', '| Prop | Type | Required | Description |', '|---|---|:---:|---|')
      for (const m of t.members) {
        lines.push(`| \`${m.name}\` | \`${m.type.replace(/\|/g, '\\|')}\` | ${m.required ? 'yes' : 'no'} | ${m.description ?? ''} |`)
      }
      lines.push('')
    }
  }
  if (c.composesWith.length) lines.push('', `Composes with: ${c.composesWith.join(', ')}`)
  if (c.tokensDoc) lines.push('', '## Token chain', '', c.tokensDoc.trim())
  if (c.accessibilityDoc) lines.push('', '## Accessibility contract', '', c.accessibilityDoc.trim())
  lines.push('')
  return lines.join('\n')
}

function tokenGroupMd(group, tokens) {
  const lines = [
    '---',
    `group: ${group}`,
    `count: ${tokens.length}`,
    '---',
    '',
    `# Tokens — \`${group}.*\``,
    '',
    '| Token | Tier | Type | Light | Dark | Description |',
    '|---|---|---|---|---|---|',
  ]
  for (const t of tokens) {
    const light = t.resolved.light?.hex ?? t.resolved.light?.value ?? ''
    const dark = t.resolved.dark?.hex ?? t.resolved.dark?.value ?? ''
    const dep = t.deprecated ? ' **DEPRECATED**' : ''
    lines.push(`| \`${t.path}\` (\`${t.cssVariable}\`) | ${t.tier} | ${t.type} | \`${light}\` | \`${dark}\` | ${(t.description || '').replace(/\|/g, '\\|')}${dep} |`)
  }
  lines.push('')
  return lines.join('\n')
}

function showcaseMd(s) {
  return [
    '---',
    `id: ${s.id}`,
    'consumable: false',
    'license: RALIA-private',
    `layer: 3`,
    '---',
    '',
    `# ${s.title}`,
    '',
    `> **Not consumable.** This is a Layer-3 product-showcase entry (license: RALIA-private).`,
    `> Build with the Layer 1/2 primitives it composes instead.`,
    '',
    s.summary,
    '',
    '## Composed of (all consumable)',
    '',
    ...s.composedOf.map((c) => `- **${c.component}** — ${JSON.stringify(c.config)}`),
    '',
    `Tokens: ${s.tokens.join(', ')}`,
    '',
    `What to build instead: ${s.buildInstead}`,
    '',
    `Showcase: ${s.showcaseUrl}`,
    '',
  ].join('\n')
}

function recipeMd(r) {
  return [
    '---',
    `id: ${r.id}`,
    'kind: recipe',
    '---',
    '',
    r.body,
    '',
  ].join('\n')
}

function buildArtefacts(registry) {
  const files = new Map() // relative path under public/ → content

  files.set('agent/registry.json', JSON.stringify(registry, null, 2) + '\n')

  for (const c of registry.components) files.set(`components/${c.slug}.md`, componentMd(c))

  const groups = new Map()
  for (const t of registry.tokens) {
    const seg = t.path.split('.')
    const group = seg[0] === 'color' ? `color-${seg[1]}` : seg[0]
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push(t)
  }
  for (const [group, tokens] of [...groups].sort()) files.set(`tokens/${group}.md`, tokenGroupMd(group, tokens))
  files.set('tokens/theming.md', readFileSync(path.join(ROOT, 'docs', 'theming.md'), 'utf8'))

  for (const r of registry.recipes) files.set(`patterns/${r.id}.md`, recipeMd(r))
  for (const s of registry.showcase) files.set(`products/ralia/${s.id}.md`, showcaseMd(s))

  // llms.txt — index per the convention.
  const idx = [
    '# RisqBase Design System',
    '',
    `> Three-layer design system for RisqBase products (spec ${registry.spec}, package ${registry.name}@${registry.package}). Layer 1 (core/) universal primitives, Layer 2 (ai/, data-viz/) domain primitives, Layer 3 RALIA-private product showcases (documented, NOT consumable). Three-tier DTCG token graph (primitive → semantic → component), light + dark themes, WCAG 2.2 AA contracts. An MCP server is available: \`npx ${registry.name}-mcp\` (stdio) or https://design.risqbase.com/mcp (Streamable HTTP).`,
    '',
    '## Components',
    '',
    ...registry.components.map(
      (c) => `- [${c.name}](/components/${c.slug}.md): ${c.domain} · Layer ${c.layer} · ${c.state}${c.description ? ` — ${c.description.slice(0, 120)}` : ''}`
    ),
    '',
    '## Tokens',
    '',
    ...[...groups.keys()].sort().map((g) => `- [${g}](/tokens/${g}.md)`),
    `- [theming](/tokens/theming.md): light + dark themes, forced-colors high-contrast contract`,
    '',
    '## Patterns',
    '',
    ...registry.recipes.map((r) => `- [${r.id}](/patterns/${r.id}.md): ${r.use_case ?? ''}`),
    '',
    '## Products (Layer 3 — NOT consumable, RALIA-private)',
    '',
    ...registry.showcase.map((s) => `- [${s.title}](/products/ralia/${s.id}.md): consumable: false · license: RALIA-private`),
    '',
    '## Governance',
    '',
    '- [Usage rules](/agent/registry.json): scanner rules R1–R14 (machine-readable in registry.usageRules)',
    '- [Promotion lifecycle](/agent/registry.json): registry.lifecycle',
    '',
  ].join('\n')
  files.set('llms.txt', idx)

  const full = [idx, '']
  for (const [rel, content] of files) {
    if (rel === 'llms.txt' || rel === 'agent/registry.json') continue
    full.push('---', '', `<!-- source: /${rel} -->`, '', content)
  }
  files.set('llms-full.txt', full.join('\n'))

  return files
}

/* ── entry ───────────────────────────────────────────────────────────── */

const mode = process.argv[2] || 'build'
const registry = buildRegistry()
const files = buildArtefacts(registry)

if (mode === 'build') {
  for (const [rel, content] of files) {
    const dest = path.join(PUBLIC, rel)
    mkdirSync(path.dirname(dest), { recursive: true })
    writeFileSync(dest, content)
  }
  // dist copy (brief §C4 path) + the MCP package bundle snapshot.
  const distDest = path.join(ROOT, 'dist', 'agent', 'registry.json')
  mkdirSync(path.dirname(distDest), { recursive: true })
  writeFileSync(distDest, files.get('agent/registry.json'))
  writeFileSync(path.join(ROOT, 'mcp', 'registry.json'), files.get('agent/registry.json'))
  console.log(
    `agent-surface: ${registry.components.length} components, ${registry.tokens.length} tokens, ` +
      `${registry.recipes.length} recipes, ${registry.showcase.length} showcase entries, ` +
      `${registry.usageRules.length} rules → ${files.size} artefacts (sourceHash ${registry.sourceHash}).`
  )
} else if (mode === 'check') {
  const drifted = []
  for (const [rel, content] of files) {
    const dest = path.join(PUBLIC, rel)
    const onDisk = existsSync(dest) ? readFileSync(dest, 'utf8') : ''
    if (onDisk !== content) drifted.push(rel)
  }
  const mcpSnapshot = path.join(ROOT, 'mcp', 'registry.json')
  const mcpOnDisk = existsSync(mcpSnapshot) ? readFileSync(mcpSnapshot, 'utf8') : ''
  if (mcpOnDisk !== files.get('agent/registry.json')) drifted.push('../mcp/registry.json')
  if (drifted.length) {
    console.error(`agent:check FAILED (scanner rule R14) — ${drifted.length} artefact(s) drifted:`)
    for (const d of drifted) console.error(`  - public/${d}`)
    console.error('Fix: run `npm run build:agent-surface` and commit the regenerated public/ artefacts.')
    process.exit(1)
  }
  console.log(`agent:check passed — ${files.size} artefacts match regeneration (sourceHash ${registry.sourceHash}).`)
} else {
  console.error(`Unknown mode: ${mode}`)
  process.exit(2)
}
