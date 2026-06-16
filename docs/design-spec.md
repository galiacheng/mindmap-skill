# Mindmap Skill — Design Spec

**Date:** 2026-06-16
**Status:** Approved design, pending implementation plan

## Summary

A user-invocable Claude Code skill, `/mindmap`, that turns any input — a file,
pasted text, or a bare topic — into a [Markmap](https://markmap.js.org) `.md`
file that renders as a zoomable, interactive mindmap. The skill is
prompt-driven: Claude reads the input and builds the hierarchy; the only code is
an optional render step that produces standalone HTML.

## Goals

- Generate a clean, legible Markmap `.md` from varied inputs.
- Work with zero dependencies by default (Read/Write only).
- Offer interactive HTML rendering on demand via `--render`.
- Be general-purpose: one skill handles structured docs, loose notes, and topics.

## Non-Goals (YAGNI)

- ~~No URL fetching as an input source.~~ **Added during development** — URL input is supported in v0.1.0 (fetched via WebFetch). See README.
- No output formats other than Markmap `.md` (no Mermaid/OPML in this version).
- No user-facing styling knobs beyond sensible baked-in defaults.
- No heavy parser/template engine — structuring is Claude's judgment, not code.

## Decisions (locked during brainstorming)

| Decision | Choice |
|---|---|
| Output format | Markmap `.md` (renders as interactive zoomable mindmap) |
| Input sources | A file, pasted text, or a topic prompt |
| Structure logic | **Hybrid** — follow+condense structured input; smart-extract otherwise |
| Rendering | `.md` by default; interactive `.html` only with `--render` |
| Build approach | Prompt-driven skill + thin render helper (Approach A) |

## Architecture

Prompt-driven skill following the existing `deep-research-skills/skills/<name>/`
convention.

### File layout

```
mindmap-skill/
└── skills/
    └── mindmap/
        ├── SKILL.md        # instructions + format spec + worked example
        └── render.sh       # optional: npx markmap-cli wrapper for --render
```

### SKILL.md frontmatter

```yaml
---
name: mindmap
user-invocable: true
description: Generate an interactive Markmap mindmap from a file, pasted text, or a topic.
allowed-tools: Bash, Read, Write, Glob
---
```

### Invocation surface

```
/mindmap <file>                  # read file → mindmap
/mindmap "pasted text or notes"  # map the text
/mindmap "transformer attention" # topic → generate from knowledge
/mindmap <input> --render        # also produce interactive .html
/mindmap <input> --output x.md   # choose output path
```

### Conceptual units

Each unit has one clear purpose and can be understood independently. Units 1–3
are pure instructions in `SKILL.md`; only unit 4 is code.

1. **Input resolver** — classifies the arg as file path / raw text / topic and
   loads the content.
2. **Structure builder** — applies hybrid logic to produce a node hierarchy.
3. **Markmap writer** — emits the `.md` with correct frontmatter and nested nodes.
4. **Renderer** (optional) — `render.sh` shells `npx markmap-cli` when `--render`
   is passed.

## Data Flow

```
/mindmap <arg> [--render] [--output path]
        │
        ▼
1. INPUT RESOLVER
   • arg matches an existing file path?        → Read it
   • arg is multi-line / long / quoted prose?  → treat as raw text
   • arg is a short phrase, no file match?      → treat as topic (from knowledge)
        │
        ▼
2. STRUCTURE BUILDER  (hybrid)
   • Has clear headings/bullets? → follow that outline, condense each node
   • Unstructured / topic?       → extract key concepts, group into 4–7 branches
   • Depth target: 3–4 levels; nodes are phrases, not sentences
        │
        ▼
3. MARKMAP WRITER → write <output>.md
   (default: <inputname>.mindmap.md, or <topic-slug>.mindmap.md)
        │
        ▼
4. RENDERER (only if --render)
   • bash render.sh <md> → npx markmap-cli <md> -o <html> --no-open
   • report the .html path
```

## Markmap Format Spec

The Markmap writer emits exactly this shape:

```markdown
---
title: <map title>
markmap:
  colorFreezeLevel: 2
  maxWidth: 300
---

# <Central topic>

## <Branch 1>
- <point>
  - <sub-point>
- <point>

## <Branch 2>
- <point>
```

Rules:

- Exactly **one `#` H1** = the root node (central topic).
- **`##` H2** = main branches; `###`/bullets = deeper levels.
- Nodes are **concise phrases** (≤ ~8 words), not full sentences.
- Inline markdown (`**bold**`, `` `code` ``, links) is allowed and passes through.
- Frontmatter defaults (`colorFreezeLevel: 2`, `maxWidth: 300`) are fixed, not
  user-facing knobs.

### Sizing guardrail

Target **4–7 main branches** and condense aggressively. For a very large source
document, map its structure and key points rather than every line — legibility
over completeness.

### Default output filename

`<inputname>.mindmap.md` — e.g. `report.md` → `report.mindmap.md`; topic
`transformer attention` → `transformer-attention.mindmap.md`. Override with
`--output`.

## Error Handling

The `.md` is the contract: it is always produced when input is valid. Rendering
is best-effort and degrades gracefully.

| Situation | Behavior |
|---|---|
| Arg looks like a file path but doesn't exist | Don't silently treat as topic. Report "no file at X" and ask: map as a topic, or fix the path? |
| Empty / whitespace-only input | Stop; ask for content or a topic. |
| Ambiguous arg (short text vs. topic) | Default to **topic generation**; state the assumption in one line so the user can correct it. |
| Output file already exists | Write `name.mindmap.md`; if taken, suffix `-2`, `-3`. Never overwrite silently. |
| `--render` but `npx`/node missing | `.md` already written. Report rendering skipped; show the exact `npx markmap-cli` command to run manually. Non-fatal. |
| `--render` network / `npx` fetch fails | Same as above — `.md` is the guaranteed deliverable; HTML is best-effort. |

## Dependencies

- **Default path:** zero dependencies — Read/Write only. Fully portable.
- **`--render` path:** needs `node`/`npx` (uses `npx markmap-cli`, no global
  install). `render.sh` checks `command -v npx` first and exits cleanly with
  guidance if absent.

### render.sh contract

- **Input:** `$1` = path to the `.md`; optional `$2` = output `.html` path
  (default: swap extension).
- **Does:** verify `npx` exists → `npx markmap-cli "$md" -o "$html" --no-open` →
  print the html path.
- **Depends on:** `npx` only. No other state.

## Testing Plan

1. **Structured file** — run on an existing report (e.g.
   `LLM智能体记忆系统研究报告.md`); verify single H1, 4–7 branches, condensed
   phrases, valid frontmatter.
2. **Pasted text** — a paragraph of unstructured notes → verify smart extraction
   produces sensible branches.
3. **Topic prompt** — e.g. `"transformer attention"` → verify a coherent map
   from knowledge.
4. **`--render`** — confirm `.html` is produced and opens as an interactive map;
   confirm graceful message when `npx` is faked-missing.
5. **Edge cases** — nonexistent file path; empty input; existing output filename
   (collision suffix).

A test passes when the `.md` opens correctly at
[markmap.js.org](https://markmap.js.org) or the VS Code Markmap extension and the
hierarchy reads cleanly.
