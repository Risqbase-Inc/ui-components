#!/usr/bin/env node
/**
 * stdio transport — `npx @risqbase-inc/ui-components-mcp` (zero config).
 * Newline-delimited JSON-RPC 2.0 per the MCP stdio transport spec.
 * Logging goes to stderr only; stdout carries protocol messages.
 */

import { createInterface } from 'node:readline'
import { createServer } from './server.mjs'

const server = createServer()

const rl = createInterface({ input: process.stdin, terminal: false })

rl.on('line', (line) => {
  const trimmed = line.trim()
  if (!trimmed) return
  let msg
  try {
    msg = JSON.parse(trimmed)
  } catch {
    process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }) + '\n')
    return
  }
  const response = server.handleMessage(msg)
  if (response) process.stdout.write(JSON.stringify(response) + '\n')
})

process.stderr.write(
  `risqbase ui-components MCP server (stdio) — registry ${server.registry.spec} / package ${server.registry.package}\n`
)
