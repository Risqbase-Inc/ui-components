#!/usr/bin/env node
/**
 * DoD-5 negative checks (GOV-DS-2026-02 rev. v4.4 §11.5): each v4.4 scanner rule
 * (R12, R13, R14) is proven to FAIL on a deliberately violating fixture
 * before being proven to PASS on the real source. A rule that cannot
 * fail is not implemented.
 *
 * Run: npm run test:scanner-rules — exit 0 only when every rule both
 * fails on its fixture and passes on clean code.
 */

import { spawnSync } from 'node:child_process'
import { mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

let failures = 0
function expect(label, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${label}${ok || !detail ? '' : ` — ${detail}`}`)
  if (!ok) failures++
}

function run(cmd, args, env = {}) {
  return spawnSync(process.execPath, [cmd, ...args], {
    cwd: ROOT,
    env: { ...process.env, ...env },
    encoding: 'utf8',
  })
}

/* R12 — token source hygiene (tools/tokens-build/lint.js) */
{
  const bad = run('tools/tokens-build/lint.js', [], {
    RISQBASE_TOKENS_DIR: path.join(ROOT, 'scripts', '__fixtures__', 'r12-bad-tokens'),
  })
  const out = bad.stderr + bad.stdout
  expect('R12 FAILS on violating fixture (exit 1)', bad.status === 1, `exit ${bad.status}`)
  expect('R12 fixture: raw hex flagged', /raw hex \$value/.test(out))
  expect('R12 fixture: bare .json extension flagged', /\.tokens\.json extension/.test(out))
  expect('R12 fixture: dark completeness flagged', /resolves to the light value/.test(out))
  expect('R12 fixture: invalid $deprecated flagged', /\$deprecated must be boolean or a string/.test(out))

  const good = run('tools/tokens-build/lint.js', [])
  expect('R12 PASSES on real tokens/ (exit 0)', good.status === 0, good.stderr.slice(0, 300))
}

/* R13 — motion gating (scripts/scanner-rules/r13-motion-gating.mjs) */
{
  const bad = run('scripts/scanner-rules/r13-motion-gating.mjs', ['--dir', 'scripts/__fixtures__/r13'])
  const out = bad.stderr + bad.stdout
  expect('R13 FAILS on violating fixture (exit 1)', bad.status === 1, `exit ${bad.status}`)
  expect('R13 fixture: ungated Tailwind animation flagged', /ungated Tailwind animation/.test(out))
  expect('R13 fixture: ungated infinite animation flagged', /ungated infinite animation/.test(out))
  expect('R13 fixture: long transition flagged', /transition longer than/.test(out))
  expect('R13 fixture: clean component NOT flagged', !/clean-component/.test(out))

  const good = run('scripts/scanner-rules/r13-motion-gating.mjs', [])
  expect('R13 PASSES on real src/ (exit 0)', good.status === 0, (good.stderr + good.stdout).slice(0, 300))
}

/* D-124 — expanded verify-contrast gate (text-role completeness + per-theme pairs) */
{
  const bad = run('scripts/verify-contrast.mjs', ['--strict', '--quiet'], {
    RISQBASE_TOKENS_DIR: path.join(ROOT, 'scripts', '__fixtures__', 'd124-bad-contrast'),
  })
  const out = bad.stderr + bad.stdout
  expect('D-124 FAILS on violating fixture (exit 1)', bad.status === 1, `exit ${bad.status}`)
  const verbose = run('scripts/verify-contrast.mjs', [], {
    RISQBASE_TOKENS_DIR: path.join(ROOT, 'scripts', '__fixtures__', 'd124-bad-contrast'),
  })
  const vout = verbose.stderr + verbose.stdout
  expect('D-124 fixture: failing pair flagged', /bad-pair-text/.test(vout))
  expect('D-124 fixture: unannotated text-role token flagged', /unannotated-text/.test(vout))

  const good = run('scripts/verify-contrast.mjs', ['--strict', '--quiet'])
  expect('D-124 PASSES on real tokens/ (exit 0)', good.status === 0, (good.stderr + good.stdout).slice(0, 300))
}

/* R14 — agent-surface freshness (tools/agent-surface/build.mjs check) */
{
  // Stale copy of public/: tamper one mirror, expect drift detection.
  const tmp = mkdtempSync(path.join(tmpdir(), 'r14-'))
  cpSync(path.join(ROOT, 'public'), tmp, { recursive: true })
  writeFileSync(path.join(tmp, 'components', 'button.md'), '# tampered\n')
  const bad = run('tools/agent-surface/build.mjs', ['check'], { RISQBASE_PUBLIC_DIR: tmp })
  expect('R14 FAILS on tampered artefact (exit 1)', bad.status === 1, `exit ${bad.status}`)
  expect('R14 names the drifted file', /components\/button\.md/.test(bad.stderr + bad.stdout))
  rmSync(tmp, { recursive: true, force: true })

  const good = run('tools/agent-surface/build.mjs', ['check'])
  expect('R14 PASSES on committed artefacts (exit 0)', good.status === 0, (good.stderr + good.stdout).slice(0, 300))
}

console.log(failures === 0 ? '\nDoD-5: all negative + positive checks hold.' : `\nDoD-5: ${failures} check(s) failed.`)
process.exit(failures === 0 ? 0 : 1)
