/**
 * Streamable HTTP transport (D-101 remote leg) — stateless request/response.
 *
 * POST <endpoint> with a JSON-RPC 2.0 body → application/json response.
 * GET is answered 405 (this server never opens a server-initiated SSE
 * stream — every interaction is request/response). No auth for v1: all
 * exposed data is public by design (D-114).
 *
 * Deployed as the docs-site function at /mcp (see api/mcp.js); the same
 * handler is importable for any other Node HTTP host.
 */

import { createServer } from './server.mjs'

let cached
function server() {
  if (!cached) cached = createServer()
  return cached
}

/** Node/Vercel-style (req, res) handler. */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Mcp-Session-Id, MCP-Protocol-Version')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    return res.end()
  }
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Allow', 'POST')
    return res.end(JSON.stringify({ error: 'Streamable HTTP: POST JSON-RPC 2.0 messages to this endpoint' }))
  }

  let body = req.body
  if (body === undefined) {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    body = Buffer.concat(chunks).toString('utf8')
  }
  let msg
  try {
    msg = typeof body === 'string' ? JSON.parse(body) : body
  } catch {
    res.statusCode = 400
    return res.end(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }))
  }

  const messages = Array.isArray(msg) ? msg : [msg]
  const responses = messages.map((m) => server().handleMessage(m)).filter(Boolean)

  if (responses.length === 0) {
    res.statusCode = 202 // notifications only
    return res.end()
  }
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(Array.isArray(msg) ? responses : responses[0]))
}
