# Copilot CLI Tool Mapping

This skill is written with Claude Code tool names. GitHub Copilot CLI exposes the
same capabilities under different names. When the skill says one of the
left-hand tools, use the Copilot CLI equivalent on the right.

| Skill references (Claude Code) | Copilot CLI equivalent |
|-------------------------------|------------------------|
| `Read` (read a file)          | `view`                 |
| `Write` (create a file)       | `create`               |
| `Edit` (edit a file)          | `edit`                 |
| `Bash` (run a command)        | `bash`                 |
| `Glob` (find files by name)   | `glob`                 |
| `WebFetch` (fetch a URL)      | `web_fetch`            |

Everything else in the skill (the workflow, the Markmap format, `render.sh`)
is platform-neutral and works the same on both.

## Notes for Copilot CLI

- **`--render` step:** the skill calls `bash <skill-dir>/scripts/render.sh`. On
  Copilot CLI this is the `bash` tool — same command, same behavior.
- **URL input:** the skill fetches a URL with `WebFetch`; on Copilot CLI that is
  `web_fetch`.
- **Collision check before writing:** the skill uses `Glob`; on Copilot CLI that
  is `glob`.
