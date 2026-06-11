// design.risqbase.com/mcp → routed here (vercel.json `routes`).
// Thin re-export of the shared MCP HTTP handler (D-101: transports are
// wrappers around one implementation — mcp/server.mjs).
export { default } from '../mcp/http.mjs'
