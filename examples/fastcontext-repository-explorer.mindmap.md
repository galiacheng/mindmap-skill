---
title: FastContext — Efficient Repository Explorer
markmap:
  colorFreezeLevel: 2
  maxWidth: 300
---

# FastContext: Repository Explorer

## Headline Win
- **+5.5% resolution gain**
- **−60% fewer tokens**
- Separates exploring from solving
- Marginal overhead
- **Exploration = trainable subagent**

## The Bottleneck
- **Exploration drains the budget**
- Reading + searching dominate
  - **56.2%** of tool-use turns
  - **46.5%** of total tokens
  - 9.96 of 17.72 turns
- Slow first edit
  - First edit @ turn 8.47
  - Median 6 explore turns
  - 15.5 tool calls before edit
- Unresolved explore more

  | Outcome | Pre-edit turns |
  | --- | --- |
  | Unresolved | 8.34 |
  | Resolved | 6.67 |

## Explorer Subagent
- Read-only, called on demand
- Three language-agnostic tools
  - Read — line-numbered contents
  - Glob — path discovery
  - Grep — ripgrep regex
- Parallel tool calls per turn
- Returns `<final_answer>`
  - File paths + line ranges
  - Optional relevance notes
- Backbones: 4B & 30B

## Two-Stage Training
- Stage 1 — SFT
  - 2,954 Sonnet-4.6 traces
  - Assistant-token-only loss
- SFT data mix

  | Type | Count |
  | --- | --- |
  | Parallel search | 990 |
  | Multi-turn gather | 983 |
  | Line-range cite | 981 |
- Stage 2 — RL (GRPO)
  - 400 prompts / 395 repos
  - Avg 11 citation ranges
  - From SFT checkpoint
- Reward design
  - `R = F1(files) + F1(lines) + r_parallel − r_format`
  - Rewards 3–6 parallel calls
  - Penalizes malformed output
- Backbones: Qwen3 4B & 30B

## Evaluation Setup
- Benchmarks
  - SWE-bench Multilingual (300)
  - SWE-bench Pro (200 subset)
  - SWE-QA (repo QA)
- Main agents
  - GPT-5.4
  - GLM-5.1
  - Kimi-K2.6
- Scaffold: Mini-SWE-Agent
- Variants
  - w/o Explore; same-model
  - FC-30B-SFT; FC-4B-SFT; FC-4B-RL

## Proven Gains
- Resolution before → after

  | Bench · Agent | Before | After |
  | --- | --- | --- |
  | Pro · GPT-5.4 | 46.0 | **51.5** |
  | Pro · GLM-5.1 | 17.5 | **22.5** |
  | Pro · Kimi | 31.0 | **33.5** |
  | Multi · GPT-5.4 | 71.7 | **75.0** |
  | Multi · Kimi | 76.3 | **78.3** |
- Tokens ↓
  - SWE-QA: up to **−60.3%**
  - Multilingual: −26% to −28%
- Standalone file F1 vs frontier

  | Explorer | File F1 |
  | --- | --- |
  | FC-30B-SFT | 73.71 |
  | FC-4B-RL | 71.48 |
  | GLM-5.1 (frontier) | 73.88 |
  | GPT-5.4 (frontier) | 72.34 |
- **FC-30B rivals frontier**
- **Small RL beats big SFT**
  - 4B-RL > 30B-SFT
  - RL wins all 9 settings

## Cost & Limits
- Cost (GPT-5.4, 4B-RL)

  | Item | Value |
  | --- | --- |
  | Main: before → after | $282 → $209 |
  | Explorer API | $4.52 |
  | **Net saving** | **$69** |
  | Explorer share | ~2.1% |
- Limitations
  - [ ] Mini-SWE-Agent only
  - [ ] Strong main agents only
  - [ ] Possible pretrain overlap
  - [ ] Smallest is 4B (want 1.7B / 0.6B)
- Open source
  - [github.com/microsoft/fastcontext](https://github.com/microsoft/fastcontext)
  - [arXiv:2606.14066](https://arxiv.org/abs/2606.14066)
