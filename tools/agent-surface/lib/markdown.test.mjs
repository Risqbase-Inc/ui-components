import { test } from 'node:test'
import assert from 'node:assert/strict'
import { escapeMdCell } from './markdown.mjs'

test('escapeMdCell escapes backslashes BEFORE pipes (CodeQL fixture, PR #84 threads)', () => {
  // The incomplete-sanitization case: a pre-existing backslash directly
  // before a pipe. Pipe-only escaping would yield `\\|` where the first
  // backslash re-arms — Markdown reads `\\` as a literal backslash and the
  // pipe becomes a live cell separator again.
  assert.equal(escapeMdCell('a\\|b'), 'a\\\\\\|b')
  assert.equal(escapeMdCell('Record<string, string | number>'), 'Record<string, string \\| number>')
  assert.equal(escapeMdCell('path\\to\\thing'), 'path\\\\to\\\\thing')
  assert.equal(escapeMdCell('multi\nline'), 'multi line')
  assert.equal(escapeMdCell(''), '')
  // Idempotence is NOT expected (escaping is one-shot at generation time),
  // but the output must never contain an unescaped pipe:
  assert.ok(!/[^\\]\|/.test(escapeMdCell('x|y\\|z')))
})
