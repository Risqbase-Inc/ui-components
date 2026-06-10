# @risqbase-inc/ui-components-mcp

MCP server for the RisqBase Design System (GOV-DS-2026-03 Workstream C).
Read-only (D-102): components, tokens (light + dark), §20 recipes,
promotion lifecycle, accessibility contracts, scanner rules R1–R14, and
Layer-3 showcase entries (flagged `consumable: false`,
`license: "RALIA-private"` — documented for understanding, not reuse).

## Use it

**Local (stdio), zero config:**

```jsonc
// e.g. Claude Code: claude mcp add risqbase-ds -- npx @risqbase-inc/ui-components-mcp
{
  "mcpServers": {
    "risqbase-ds": { "command": "npx", "args": ["@risqbase-inc/ui-components-mcp"] }
  }
}
```

**Remote (Streamable HTTP):** `https://design.risqbase.com/mcp` — no auth;
all exposed data is public by design.

## Tools

`list_components` · `get_component` · `list_tokens` · `get_token` ·
`list_recipes` · `get_recipe` · `get_lifecycle` · `get_usage_rules` ·
`list_showcase` · `get_showcase` · `search`

Every response carries `_meta: { spec, package, generatedAt }` so agents
can detect staleness.

## Data source

`registry.json` — generated at build time from the package source (types
from the TypeScript AST, tokens from the DTCG resolver output, recipes
from `docs/recipes/*.md` frontmatter). Never hand-maintained; freshness
is CI-gated (scanner rule R14). The same artefact drives the docs site
and the `llms.txt` corpus at design.risqbase.com.

Zero runtime dependencies. Versioned in lockstep with
`@risqbase-inc/ui-components`.
