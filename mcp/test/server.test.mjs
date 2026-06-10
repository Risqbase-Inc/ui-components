/**
 * Integration tests — v4.4 §C5 row 2: one test per C2 tool, exercised
 * through the real protocol layers (stdio child process for the
 * transport-level tests; createServer().handleMessage for the rest;
 * http.mjs for the Streamable HTTP wrapper). Run: `node --test mcp/test/`
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createServer, TOOLS } from '../server.mjs'
import httpHandler from '../http.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))

const server = createServer()

let nextId = 1
function call(name, args = {}) {
  const res = server.handleMessage({ jsonrpc: '2.0', id: nextId++, method: 'tools/call', params: { name, arguments: args } })
  assert.equal(res.error, undefined, `tools/call ${name} returned protocol error: ${JSON.stringify(res.error)}`)
  const { result } = res
  assert.notEqual(result.isError, true, `tool ${name} errored: ${result.content?.[0]?.text}`)
  return JSON.parse(result.content[0].text)
}

test('initialize + tools/list over the real stdio transport', async () => {
  const child = spawn(process.execPath, [path.join(HERE, '..', 'stdio.mjs')], { stdio: ['pipe', 'pipe', 'pipe'] })
  const lines = []
  let buffer = ''
  child.stdout.on('data', (d) => {
    buffer += d.toString()
    let i
    while ((i = buffer.indexOf('\n')) >= 0) {
      lines.push(JSON.parse(buffer.slice(0, i)))
      buffer = buffer.slice(i + 1)
    }
  })
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '0' } } }) + '\n')
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n')
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' }) + '\n')
  const deadline = Date.now() + 5000
  while (lines.length < 2 && Date.now() < deadline) await new Promise((r) => setTimeout(r, 20))
  child.kill()
  await once(child, 'exit')

  assert.equal(lines.length, 2, 'expected exactly 2 responses (the notification gets none)')
  const init = lines.find((l) => l.id === 1).result
  assert.equal(init.serverInfo.name, 'risqbase-ui-components')
  assert.ok(init.capabilities.tools)
  const toolsList = lines.find((l) => l.id === 2).result
  assert.equal(toolsList.tools.length, 11, 'C2 contract: exactly 11 tools')
  assert.deepEqual(
    toolsList.tools.map((t) => t.name).sort(),
    [
      'get_component', 'get_lifecycle', 'get_recipe', 'get_showcase', 'get_token', 'get_usage_rules',
      'list_components', 'list_recipes', 'list_showcase', 'list_tokens', 'search',
    ]
  )
})

test('every response carries staleness metadata (spec/package/generatedAt)', () => {
  const out = call('list_recipes')
  assert.equal(out._meta.spec, 'v4.4')
  assert.match(out._meta.package, /^\d+\.\d+\.\d+/)
  assert.ok(Date.parse(out._meta.generatedAt))
})

test('list_components filters by domain, layer and state', () => {
  const all = call('list_components').components
  assert.ok(all.length >= 25, `expected ≥25 components, got ${all.length}`)
  const core = call('list_components', { domain: 'core' }).components
  assert.ok(core.every((c) => c.domain === 'core' && c.layer === 1))
  const beta = call('list_components', { state: 'beta' }).components
  assert.deepEqual(beta.map((c) => c.name).sort(), ['ChartContainer', 'MotionProvider'])
  const layer2 = call('list_components', { layer: 2 }).components
  assert.ok(layer2.some((c) => c.name === 'CitationChip'))
})

test('get_component returns full API + token chain + a11y contract', () => {
  const c = call('get_component', { name: 'CitationChip' })
  assert.equal(c.domain, 'ai')
  const variant = c.api.find((t) => t.name === 'CitationVariant')
  assert.match(variant.definition, /low-confidence/)
  const props = c.api.find((t) => t.name === 'CitationChipProps')
  assert.ok(props.members.find((m) => m.name === 'variant').required)
  assert.match(c.tokenChain, /citation-chip/)
  assert.ok(c.accessibilityContract.length > 100)
  assert.match(c.import, /@risqbase-inc\/ui-components\/ai/)
  // unknown component is a tool error, not a crash
  const res = server.handleMessage({ jsonrpc: '2.0', id: 999, method: 'tools/call', params: { name: 'get_component', arguments: { name: 'Nope' } } })
  assert.equal(res.result.isError, true)
})

test('list_tokens filters by tier and group', () => {
  const iris = call('list_tokens', { group: 'color.iris' }).tokens
  assert.ok(iris.length >= 10, `iris chain should be ≥10 tokens, got ${iris.length}`)
  const semantic = call('list_tokens', { tier: 'semantic' }).tokens
  assert.ok(semantic.every((t) => t.tier === 'semantic'))
})

test('get_token returns resolution chain + light AND dark values + contrastPair', () => {
  const t = call('get_token', { path: 'color.iris.accent-on' })
  assert.equal(t.contrastPair, 'color.iris.accent')
  assert.equal(t.contrastLevel, 'aa-large')
  assert.ok(t.resolved.light.hex)
  assert.ok(t.resolved.dark.hex)
  const accent = call('get_token', { path: 'color.iris.accent' })
  assert.notEqual(accent.resolved.light.hex, accent.resolved.dark.hex, 'iris.accent must be themed in dark')
  assert.deepEqual(accent.resolutionChain, ['color.palette.teal.600'])
})

test('list_recipes + get_recipe (v4.1 §20 schema fields)', () => {
  const list = call('list_recipes').recipes
  assert.ok(list.find((r) => r.id === 'motion-preference'))
  const r = call('get_recipe', { id: 'motion-preference' })
  for (const field of ['trigger', 'composed_of', 'states', 'voice_examples', 'anti_patterns']) {
    assert.ok(r[field], `recipe missing §20 field ${field}`)
  }
})

test('get_lifecycle returns states + promotion log, filterable per component', () => {
  const all = call('get_lifecycle')
  assert.equal(all.states.MotionProvider.state, 'beta')
  assert.ok(all.promotionLog.length >= 18)
  const one = call('get_lifecycle', { component: 'MotionProvider' })
  assert.equal(one.state, 'beta')
  assert.equal(one.promotionLog.length, 1)
})

test('get_usage_rules returns R1–R14 with severity + instead', () => {
  const { rules } = call('get_usage_rules', { consumer: 'ralia' })
  assert.equal(rules.length, 14)
  const r12 = rules.find((r) => r.id === 'R12')
  assert.match(r12.description, /OKLCH/)
  assert.ok(r12.instead)
  assert.ok(rules.every((r) => r.severity && r.description))
})

test('list_showcase + get_showcase carry the D-104 flags on every entry', () => {
  const { showcase } = call('list_showcase')
  assert.equal(showcase.length, 4)
  assert.ok(showcase.every((s) => s.consumable === false && s.license === 'RALIA-private'))
  const s = call('get_showcase', { id: 'risk-gauge-configuration' })
  assert.equal(s.consumable, false)
  assert.equal(s.license, 'RALIA-private')
  assert.ok(s.composedOf.find((c) => c.component === 'Gauge'))
  assert.ok(s.buildInstead)
})

test('search ranks the C5 smoke-test queries correctly', () => {
  // §C5: "what do I use for an AI citation with low confidence?"
  const citation = call('search', { query: 'citation low-confidence' })
  assert.ok(
    citation.hits.slice(0, 3).some((h) => h.id === 'CitationChip'),
    `expected CitationChip in top hits, got ${JSON.stringify(citation.hits.slice(0, 3).map((h) => h.id))}`
  )
  assert.ok(
    citation.hits.slice(0, 3).every((h) => h.id === 'CitationChip' || /citation/.test(h.id)),
    'top hits must all point at the citation chain'
  )
  // §C5: "build a risk band chip" → BandBadge (Badge band variants), not custom
  const band = call('search', { query: 'risk band chip' })
  assert.equal(band.hits[0].id, 'Badge', `expected Badge as top hit, got ${JSON.stringify(band.hits.slice(0, 3))}`)
  assert.ok(band.hits[0].exports.includes('BandBadge'), 'Badge summary must surface the BandBadge export')
})

test('Streamable HTTP wrapper answers list_components over POST', async () => {
  const req = makeReq('POST', { jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'list_components', arguments: { domain: 'ai' } } })
  const res = makeRes()
  await httpHandler(req, res)
  assert.equal(res.statusCode, 200)
  const body = JSON.parse(res.body)
  const payload = JSON.parse(body.result.content[0].text)
  assert.ok(payload.components.every((c) => c.domain === 'ai'))
  // GET is 405 (no server-initiated streams)
  const res2 = makeRes()
  await httpHandler(makeReq('GET'), res2)
  assert.equal(res2.statusCode, 405)
})

function makeReq(method, body) {
  return {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    async *[Symbol.asyncIterator]() {
      if (body !== undefined) yield Buffer.from(JSON.stringify(body))
    },
  }
}

function makeRes() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(k, v) { this.headers[k] = v },
    end(chunk) { if (chunk) this.body += chunk },
  }
}
