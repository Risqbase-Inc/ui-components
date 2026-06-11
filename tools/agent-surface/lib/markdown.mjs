/**
 * Markdown-cell escaping for the generated agent-surface mirrors.
 *
 * CodeQL js/incomplete-string-escaping (PR #84 review threads on
 * build.mjs:367/395): escaping pipes alone is incomplete — an input that
 * already contains backslashes can neutralise the escape. Order matters:
 * backslashes first, then pipes, then newlines (a literal newline would
 * break the table row).
 */
export function escapeMdCell(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')
}
