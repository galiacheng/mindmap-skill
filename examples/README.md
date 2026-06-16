# Examples

Real output from the `mindmap` skill — see what it produces before you install.

## GitHub blog post → mindmap

Source: [How we made GitHub Copilot CLI more selective about delegation](https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/)

Generated with a single command (URL input):

```
/mindmap https://github.blog/ai-and-ml/how-we-made-github-copilot-cli-more-selective-about-delegation/ --render
```

The skill fetched the page, mirrored its structure into a condensed hierarchy, wrote the Markmap `.md`, then rendered a standalone interactive `.html`.

| File | What it is |
|---|---|
| [`copilot-cli-selective-delegation.mindmap.md`](copilot-cli-selective-delegation.mindmap.md) | The Markmap source — paste at [markmap.js.org](https://markmap.js.org) or open in the VS Code Markmap extension |
| [`copilot-cli-selective-delegation.mindmap.html`](copilot-cli-selective-delegation.mindmap.html) | The rendered interactive mindmap — **open in any browser** (zoom, click to collapse/expand) |

> Tip: to view the `.html` from GitHub, download it (or use a raw-HTML viewer) and open it locally — GitHub renders `.html` as source, not as a page.
