---
title: Smarter Subagent Delegation in Copilot CLI
markmap:
  colorFreezeLevel: 2
  maxWidth: 300
---

# Smarter Subagent Delegation

## The Problem
- Delegation is powerful but not free
- Unnecessary handoffs for simple tasks
- Overusing exploration subagents
- Repeated / overlapping searches
- Sequential delegation = waiting
- Failure-prone paths (stale, wrong, mismatched)

## The Approach
- Single feedback loop, not separate steps
- **Analyze** — LLMs find delegation bottleneck
  - Subagents called for already-narrow tasks
- **Change** — refine orchestration policy
  - Handle focused work directly
  - Delegate for breadth / parallelism
  - Start narrowest path, escalate only if it adds value
  - Subagents = parallelism tool, not pause button
- **Validate** — offline, then online, then ship

## Results
- Tool failures per session −23%
- Search failures −27%, edit failures −18%
- Wait time −5% P95, −3% P75
- No quality regression
- Subagent LLM duration −12% avg, −18% P95

## Benefits Today
- Simple tasks handled directly
- Complex tasks still get specialists
- Long sessions keep moving
- Behind the scenes — workflows unchanged

## What's Next
- More adaptive across models / agents / skills / tools
- Decide: act, delegate, or use a skill
- Less waiting, fewer failures, more progress

## Rollout
- 100% of production traffic
- `/update` to v1.0.42+
- Feedback via `/feedback`
