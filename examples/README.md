# Examples

Real output from the `mindmap` skill — see what it produces before you install.

## GitHub blog post → mindmap

**▶ [Open the live interactive mindmap](https://galiacheng.github.io/mindmap-skills/examples/copilot-cli-selective-delegation.mindmap.html)** (hosted on GitHub Pages — click, zoom, collapse branches).

Source: [How we made GitHub Copilot CLI more selective about delegation](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/)

Generated with a single command (URL input), using the multi-agent judge panel:

```
/mindmap https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/ --panel --render
```

The `--panel` flag runs a 3-proposer / 3-judge / 1-synthesizer panel that designs the structure and picks the best format per node — note the **bolded headline metrics**, the reliability/responsiveness **tables**, the handoff **checklist**, and the `find → read → edit → verify` **code** node. The skill then rendered a standalone interactive `.html`.

| File | What it is |
|---|---|
| [`copilot-cli-selective-delegation.mindmap.md`](copilot-cli-selective-delegation.mindmap.md) | The Markmap source — paste at [markmap.js.org](https://markmap.js.org) or open in the VS Code Markmap extension |
| [`copilot-cli-selective-delegation.mindmap.html`](copilot-cli-selective-delegation.mindmap.html) | The rendered interactive mindmap — open it [live on GitHub Pages](https://galiacheng.github.io/mindmap-skills/examples/copilot-cli-selective-delegation.mindmap.html), or download and open in any browser |

## arXiv paper → mindmap

**▶ [Open the live interactive mindmap](https://galiacheng.github.io/mindmap-skills/examples/fastcontext-repository-explorer.mindmap.html)** (hosted on GitHub Pages — click, zoom, collapse branches).

Source: [FastContext: Training Efficient Repository Explorer for Coding Agents](https://arxiv.org/abs/2606.14066) (arXiv:2606.14066)

Generated with a single command (URL input), using the multi-agent judge panel:

```
/mindmap https://arxiv.org/html/2606.14066v1 --panel --render
```

The `--panel` flag runs a 3-proposer / 3-judge / 1-synthesizer panel. For this paper it surfaced the payoff first (**+5.5% resolution, −60% tokens**), rendered the benchmark and F1 results as **tables**, the reward function as a **code** node, and the limitations as a **checklist** — then rendered a standalone interactive `.html`.

| File | What it is |
|---|---|
| [`fastcontext-repository-explorer.mindmap.md`](fastcontext-repository-explorer.mindmap.md) | The Markmap source — paste at [markmap.js.org](https://markmap.js.org) or open in the VS Code Markmap extension |
| [`fastcontext-repository-explorer.mindmap.html`](fastcontext-repository-explorer.mindmap.html) | The rendered interactive mindmap — open it [live on GitHub Pages](https://galiacheng.github.io/mindmap-skills/examples/fastcontext-repository-explorer.mindmap.html), or download and open in any browser |

## LinkedIn article → mindmap

**▶ [Open the live interactive mindmap](https://galiacheng.github.io/mindmap-skills/examples/why-systems-thinkers-define-ai-era.mindmap.html)** (hosted on GitHub Pages — click, zoom, collapse branches).

Source: [Why Systems Thinkers Will Define the AI Era](https://www.linkedin.com/pulse/why-systems-thinkers-define-ai-era-catherine-bye-5ralc/) by Catherine Bye

Generated with a single command (URL input), using the multi-agent judge panel:

```
/mindmap https://www.linkedin.com/pulse/why-systems-thinkers-define-ai-era-catherine-bye-5ralc/ --panel --render
```

The `--panel` flag runs a 3-proposer / 3-judge / 1-synthesizer panel that designs the structure and picks the best format per node — note the punchline-first thesis, the **bolded headline numbers** (`+30%` productivity, `92%` vs `1%` AI-maturity, `1 in 5` neurodivergent), the archetype and research **tables**, and the "who to look for" **checklist**. The skill then rendered a standalone interactive `.html`.

| File | What it is |
|---|---|
| [`why-systems-thinkers-define-ai-era.mindmap.md`](why-systems-thinkers-define-ai-era.mindmap.md) | The Markmap source — paste at [markmap.js.org](https://markmap.js.org) or open in the VS Code Markmap extension |
| [`why-systems-thinkers-define-ai-era.mindmap.html`](why-systems-thinkers-define-ai-era.mindmap.html) | The rendered interactive mindmap — open it [live on GitHub Pages](https://galiacheng.github.io/mindmap-skills/examples/why-systems-thinkers-define-ai-era.mindmap.html), or download and open in any browser |

