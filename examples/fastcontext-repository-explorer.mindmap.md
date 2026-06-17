---
title: FastContext - Training Efficient Repository Explorer for Coding Agents
markmap:
  colorFreezeLevel: 2
  maxWidth: 300
---

# FastContext

## Problem & Motivation
- Repo exploration is the bottleneck
  - Locating code burns token budget
  - Pollutes context with noise
- Main agent (solver) vs subagent (explorer)
- Proprietary mechanisms, no open recipes

## Preliminary Analysis
- 300 GPT-5.4 Mini-SWE-Agent traces
- Read+search = **56.2%** of turns
  - 46.5% of main-agent tokens
- First edit at turn **8.47** avg
  - Median 6 exploration turns before edit
- Unresolved explore more (8.34 vs 6.67)

## System Architecture
- Read-only exploration subagent
- Three language-agnostic tools
  - **Read** — line-numbered contents
  - **Glob** — path discovery
  - **Grep** — ripgrep regex search
- Parallel tool calls per turn
- Returns `<final_answer>`
  - File paths + line ranges
  - Optional relevance notes

## Training
- Stage 1 — **SFT** initialization
  - 2,954 examples from Sonnet 4.6
  - parallel_toolcalls (first-turn search)
  - multiturn_traj (evidence gathering)
  - linerange (precise citations)
  - Assistant-token-only loss
- Stage 2 — **RL** refinement
  - 400 prompts, reference patches
  - Reward: F1(file)+F1(line)+parallel−format
  - GRPO from SFT checkpoint
- Backbones
  - Qwen3-4B-Instruct
  - Qwen3-Coder-30BA3B

## Experiments
- Benchmarks
  - SWE-bench Multilingual (300)
  - SWE-bench Pro (200 subset)
  - SWE-QA (repo QA, LLM-judge)
- Main agents
  - GPT-5.4, GLM-5.1, Kimi-K2.6
- Scaffold: Mini-SWE-Agent
- Variants: 30B-SFT, 4B-SFT, 4B-RL

## Results
- Beats direct solving everywhere
- Resolution **up to +5.5%**
  - SWE-bench Pro GPT-5.4 46.0→51.5
- Tokens **up to −60%**
  - SWE-QA GPT-5.4 −60.3%
- **4B-RL can beat 30B-SFT**
  - GLM-5.1 Pro 22.5 vs 20.0
- RL improves compact explorer (all 9)
- Standalone F1: 73.71 file / 60.35 module

## Cost & Findings
- 4B-RL: 162 calls / 300 tasks
- ~$4.52 explorer vs ~$69 net saving
- Explorer ≈2.1% of total cost
- Exploration = first-class trainable component

## Limitations
- Only Mini-SWE-Agent integration
- Strong main models only
- Possible benchmark overlap
- Smallest explorer 4B (1.7B/0.6B planned)

## Meta
- `cs.SE` · arXiv:2606.14066v1
- Microsoft + SJTU · 12 Jun 2026
- Code: github.com/microsoft/fastcontext
