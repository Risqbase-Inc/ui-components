#!/usr/bin/env node
/**
 * Local axe-core probe harness — GOV-DS-2026-02 rev. v4.4 A11Y-FIX §2
 * (work-order step 2: confirmation probes; step 10: pre-Chromatic
 * verification sweep).
 *
 * Runs axe against the built Storybook (storybook-static/) in a real
 * Chromium via Playwright, per story×theme, using the same theme globals
 * Chromatic's modes use (`globals=theme:dark` → withThemeByDataAttribute).
 *
 * Usage:
 *   node scripts/a11y-probe.mjs --probe "Footer/Default:dark" [--probe …]
 *   node scripts/a11y-probe.mjs --all [--modes dark,light,hc] [--csv out.csv]
 *   (default with no args: the five A11Y-FIX §2 probes)
 *
 * Output: per story×mode, axe rule ids with node counts; for
 * color-contrast violations, the offending fg/bg/ratio triples — the
 * token-level diagnosis the Chromatic CSV export lacks.
 */

import { createServer } from 'node:http'
import { readFileSync, existsSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const STATIC = path.join(ROOT, 'storybook-static')

const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
const values = (name) =>
  args.flatMap((a, i) => (a === `--${name}` ? [args[i + 1]] : []))

const DEFAULT_PROBES = [
  'ClientGrid/All Mode 12 Clients:dark',
  'ClientGrid/All Mode 12 Clients:light',
  'Footer/Default:dark',
  'Callout/Intents:dark',
  'StreamingText/Default:dark',
  'Header/Gallery:light',
]

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
}

function serve() {
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://x')
    let file = path.join(STATIC, decodeURIComponent(url.pathname))
    if (url.pathname === '/') file = path.join(STATIC, 'index.html')
    if (!existsSync(file)) {
      res.statusCode = 404
      return res.end('not found')
    }
    res.setHeader('Content-Type', MIME[path.extname(file)] ?? 'application/octet-stream')
    res.end(readFileSync(file))
  })
  return new Promise((resolve) => server.listen(0, () => resolve(server)))
}

function loadIndex() {
  const index = JSON.parse(readFileSync(path.join(STATIC, 'index.json'), 'utf8'))
  return Object.values(index.entries).filter((e) => e.type === 'story')
}

function resolveStoryId(entries, componentAndStory) {
  const [component, storyName] = componentAndStory.split('/')
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
  const hit = entries.find(
    (e) => norm(e.title.split('/').pop()) === norm(component) && norm(e.name) === norm(storyName)
  )
  if (!hit) throw new Error(`No story matching "${componentAndStory}" in storybook-static/index.json`)
  return hit
}

async function main() {
  const { chromium } = await import('playwright')
  const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')

  const entries = loadIndex()
  let targets
  if (flag('all')) {
    const modes = (values('modes')[0] ?? 'dark,light,hc').split(',')
    targets = entries.flatMap((e) => modes.map((mode) => ({ entry: e, mode })))
  } else {
    const probes = values('probe').length ? values('probe') : DEFAULT_PROBES
    targets = probes.map((p) => {
      const [name, mode] = p.split(':')
      return { entry: resolveStoryId(entries, name), mode }
    })
  }

  const server = await serve()
  const port = server.address().port
  // CHROME_BIN override: the remote-exec environment ships a provisioned
  // Chromium under /opt/pw-browsers that may not match the npm playwright
  // revision; CI uses the default download.
  const executablePath = process.env.CHROME_BIN || undefined
  const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  const rows = []
  for (const { entry, mode } of targets) {
    const url = `http://localhost:${port}/iframe.html?id=${entry.id}&globals=theme:${mode}`
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
      await page.waitForTimeout(350) // settle animations/effects
      await page.evaluate(axeSource)
      const result = await page.evaluate(async () => {
        // Same scope Chromatic's a11y test uses: the story root.
        return await window.axe.run(document.body, {
          resultTypes: ['violations'],
          reporter: 'v2',
          // Parity with .storybook/preview.ts: the page-level `region`
          // rule is disabled for component stories (fragments ≠ pages).
          rules: { region: { enabled: false } },
        })
      })
      const violations = result.violations.map((v) => ({
        rule: v.id,
        impact: v.impact,
        nodes: v.nodes.length,
        samples: v.nodes.slice(0, 4).map((n) => ({
          target: n.target.join(' '),
          data: n.any?.[0]?.data
            ? {
                fg: n.any[0].data.fgColor,
                bg: n.any[0].data.bgColor,
                ratio: n.any[0].data.contrastRatio,
                expected: n.any[0].data.expectedContrastRatio,
              }
            : undefined,
          summary: n.failureSummary?.split('\n')[1]?.trim(),
        })),
      }))
      rows.push({
        component: entry.title.split('/').pop(),
        story: entry.name,
        mode,
        total: violations.reduce((s, v) => s + v.nodes, 0),
        violations,
      })
      if (!flag('quiet')) {
        const v = rows.at(-1)
        console.log(`\n■ ${v.component} / ${v.story} / ${mode} — ${v.total} violation node(s)`)
        for (const viol of v.violations) {
          console.log(`  ${viol.rule} [${viol.impact}] × ${viol.nodes}`)
          for (const s of viol.samples) {
            const c = s.data?.ratio ? `  fg ${s.data.fg} on bg ${s.data.bg} = ${s.data.ratio} (needs ${s.data.expected})` : ''
            console.log(`    · ${s.target.slice(0, 90)}${c}`)
          }
        }
      }
    } catch (err) {
      rows.push({ component: entry.title.split('/').pop(), story: entry.name, mode, error: String(err.message).slice(0, 120) })
      if (!flag('quiet')) console.log(`\n■ ${entry.title} / ${entry.name} / ${mode} — ERROR ${err.message}`)
    }
  }

  const csvOut = values('csv')[0]
  if (csvOut) {
    const lines = ['Component,Story,Mode,Violation count,Rules']
    for (const r of rows) {
      const rules = (r.violations ?? []).map((v) => `${v.rule}×${v.nodes}`).join(' ')
      lines.push(`${r.component},${r.story},${r.mode},${r.total ?? 'ERROR'},${rules}`)
    }
    writeFileSync(csvOut, lines.join('\n') + '\n')
    console.log(`\nwrote ${csvOut} (${rows.length} story×modes)`)
  }
  const jsonOut = values('json')[0]
  if (jsonOut) writeFileSync(jsonOut, JSON.stringify(rows, null, 2) + '\n')

  const grand = rows.reduce((s, r) => s + (r.total ?? 0), 0)
  console.log(`\nTOTAL: ${grand} violation node(s) across ${rows.length} story×mode(s)`)
  await browser.close()
  server.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
