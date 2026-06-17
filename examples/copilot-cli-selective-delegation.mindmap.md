---
title: Copilot CLI — Smarter Subagent Delegation
markmap:
  colorFreezeLevel: 2
  maxWidth: 300
---

# Copilot CLI: Smarter Delegation

## Headline A/B Results
- **Delegation ≠ always better**
- **No new knob added**
- Reliability

  | Failure type | Per session |
  | --- | --- |
  | Tool failures | **−23%** |
  | Search failures | **−27%** |
  | Edit failures | **−18%** |
- Responsiveness

  | Wait time | Delta |
  | --- | --- |
  | P95 | **−5%** |
  | P75 | **−3%** |
- **No quality regression**
- Gains from less overhead
  - Less orchestration overhead
  - Lower subagent workload
  - Not faster LLM calls

## The Problem: Not Free
- **Powerful, but not free**
- Failure modes
  - Unnecessary handoffs, simple tasks
  - Overusing exploration subagents
  - Overlapping, repeated searches
  - Sequential delegation waits
- Failure-prone paths
  - [ ] Stale file paths
  - [ ] Moved files
  - [ ] Incorrect relative paths
  - [ ] Workspace mismatches
- Goal: leverage, not overhead

## The Fix: Orchestration Policy
- Help the main agent
  - Stay focused if faster alone
  - Delegate for real leverage
  - Parallelize independent tasks
- New policy
  - Handle focused work directly
  - `find → read → edit → verify`
  - Reserve delegation: broad / parallel
  - Narrowest path, escalate, step down
- **Parallelism tool, not pause button**
- Handoff specifies
  - [ ] What was asked
  - [ ] What's known
  - [ ] What subagent owns
  - [ ] Result needed back

## From Signals to Shipped
- Single feedback loop
  - Observe → isolate bottleneck
  - Change → validate offline
  - Measure online → ship
- 1. Analyze trajectories
  - LLMs read full trajectories
  - Pattern: redundant re-searching
- 2. Change policy
  - Keep simple work local
  - Reserve breadth for subagents
- 3. Validate
  - Offline: regression + benchmarks
  - Online: staff + public A/B

## Trajectory Analysis
- **Lighter subagent workload**

  | Subagent metric | Delta |
  | --- | --- |
  | Failed searches | **−15%** |
  | Avg LLM duration | **−12%** |
  | P95 LLM duration | **−18%** |

## Benefits & Rollout
- Benefits today
  - Simple tasks handled directly
  - Complex tasks get specialists
  - Long sessions, less waiting
  - Workflows unchanged
- What's next
  - Right model / agent / tools per task
  - More adaptive orchestration
  - Better behavior visibility
- Get it now
  - `/update` to v1.0.42+
  - `/feedback` in the CLI
  - [github.com/github/copilot-cli](https://github.com/github/copilot-cli)
  - **100% production traffic**
