# mindmap

[English](README.md) | [中文](README.zh.md)

一个适用于 [Claude Code](https://docs.claude.com/en/docs/claude-code) 与 [GitHub Copilot CLI](https://docs.github.com/copilot/concepts/agents/copilot-cli) 的插件，能把**任意输入——文件、URL、粘贴的文本或一个主题——变成可交互的 [Markmap](https://markmap.js.org) 思维导图。**

> 内置两种语言：`/mindmap`（英文）与 `/mindmap-zh`（中文）。二者打包在同一个插件里。

```
/mindmap-zh LLM-研究报告.md
/mindmap-zh https://zh.wikipedia.org/wiki/知识图谱
/mindmap-zh "缓存能降低延迟和成本。命中率取决于 TTL 与键设计。淘汰策略可用 LRU 或 LFU。"
/mindmap-zh "Transformer 注意力机制" --render
```

技能读取你的输入，构建清晰的节点层级，并写出一个 Markmap `.md` 文件，可作为可缩放、可折叠的思维导图打开。加上 `--render` 还能额外生成一个独立的可交互 `.html`。

---

## 功能特性

- **四种输入类型** — 文件路径、URL（经由 WebFetch 抓取）、粘贴的文本/笔记，或一个简短主题（基于模型自身知识生成）。
- **混合式结构化** — 若输入本身已有结构（标题/列表），则沿用其大纲并将每个节点压缩为简短短语；若是松散文本或主题，则提炼关键概念并归纳为 4–7 个主分支。
- **Markmap 输出** — 一个 `.md` 文件，可在 [markmap.js.org](https://markmap.js.org)、VS Code 的 [Markmap 扩展](https://marketplace.visualstudio.com/items?itemName=gera2ld.markmap-vscode) 中渲染为可交互导图，或导出为独立 HTML。
- **可选 HTML 渲染** — `--render` 调用 `npx markmap-cli` 生成自包含的 `.html`。零配置；若没有 `npx`，仍会写出 `.md`，并给出可手动执行的确切命令。
- **默认安全** — 绝不覆盖已有文件；重名时追加 `-2`、`-3`…… 后缀。

---

## 安装

同一个仓库既是 Claude Code 的有效插件，也是 GitHub Copilot CLI 的有效插件——二者共用插件/市场（marketplace）格式。

### Claude Code

```
/plugin marketplace add https://github.com/galiacheng/mindmap-skills.git
/plugin install mindmap@mindmap-marketplace
/reload-plugins
```

> 使用显式的 `https://` 地址可避免走 SSH 克隆。`galiacheng/mindmap-skills` 简写形式也可用，**前提是**你已配置 GitHub SSH 密钥；否则会报 `Permission denied (publickey)`。

### GitHub Copilot CLI

```bash
copilot plugin marketplace add galiacheng/mindmap-skills
copilot plugin install mindmap@mindmap-marketplace
```

随后在会话中运行 `/mindmap`（英文）或 `/mindmap-zh`（中文）。在 Copilot CLI 上工作流相同，工具名会自动映射（见 [`skills/mindmap-zh/references/copilot-tools.md`](skills/mindmap-zh/references/copilot-tools.md)）。

市场清单位于 [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json)。

### 手动安装（本地，不经市场）

把技能复制到项目级（或用户级）的 skills 目录：

```bash
# 项目级
mkdir -p .claude/skills
cp -r skills/mindmap skills/mindmap-zh .claude/skills/

# 或用户级（在所有项目中可用）
mkdir -p ~/.claude/skills
cp -r skills/mindmap skills/mindmap-zh ~/.claude/skills/
```

随后运行 `/reload-skills`（或重启 Claude Code）。用 `/help` 确认 `/mindmap` 与 `/mindmap-zh` 已列出。

---

## 用法

```
/mindmap-zh <输入> [--render] [--output <路径>]
```

| 输入 | 示例 | 行为 |
|---|---|---|
| **文件** | `/mindmap-zh 报告.md` | 读取文件，沿用其结构，压缩节点。写出 `报告.mindmap.md`。 |
| **URL** | `/mindmap-zh https://example.com/article` | 抓取页面（WebFetch），映射其内容。写出 `<页面-slug>.mindmap.md`。 |
| **粘贴文本** | `/mindmap-zh "关于 X、Y、Z 的笔记……"` | 提炼概念为分支。写出 `<标题-slug>.mindmap.md`。 |
| **主题** | `/mindmap-zh "向量数据库"` | 基于模型知识生成导图。写出 `向量数据库.mindmap.md`。 |

**参数**

- `--render` — 写出 `.md` 后，额外生成一个独立的可交互 `.html`（需要 Node.js / `npx`）。
- `--output <路径>` — 将 `.md` 写到指定路径，而非默认路径。

---

## 输出格式

技能写出 [Markmap](https://markmap.js.org) 风格的 markdown——单个 `#` 根节点、`##` 分支、嵌套列表项：

```markdown
---
title: 检索增强生成（RAG）
markmap:
  colorFreezeLevel: 2
  maxWidth: 300
---

# 检索增强生成（RAG）

## 索引
- 切分文档
- 嵌入片段
- 存储向量

## 检索
- 对查询做嵌入
- 找到最近邻片段

## 生成
- 注入上下文到提示词
```

**查看 `.md`：**
- 粘贴到 [markmap.js.org](https://markmap.js.org)，**或**
- 在 VS Code 中用 [Markmap 扩展](https://marketplace.visualstudio.com/items?itemName=gera2ld.markmap-vscode) 打开，**或**
- 用 `--render` 生成可在任意浏览器打开的 `.html`。

---

## 渲染为 HTML

```
/mindmap-zh "Transformer 注意力机制" --render
```

底层运行 `npx markmap-cli <文件>.md -o <文件>.html --no-open`（经由 [`skills/mindmap-zh/scripts/render.sh`](skills/mindmap-zh/scripts/render.sh)）。

- **`.md` 始终是有保证的交付物。** 渲染是尽力而为。
- 若未安装 `npx` / Node.js，技能仍会写出 `.md`，报告已跳过渲染，并打印可手动执行的确切命令——不会丢失任何内容。

**前置要求：** [Node.js](https://nodejs.org)（提供 `npx`）。无需全局安装——`npx` 会按需拉取 `markmap-cli`。

---

## 工作原理

这是一个**提示词驱动**的技能：智能体现在指令里，而非代码里。

```
skills/mindmap-zh/
├── SKILL.md            # Claude 遵循的工作流：判定输入 → 构建层级 → 写出 .md →（可选）渲染
├── scripts/
│   └── render.sh       # 唯一的代码 —— 对 `npx markmap-cli` 的薄封装
└── references/
    └── copilot-tools.md  # Claude Code → Copilot CLI 工具名映射
```

- [`SKILL.md`](skills/mindmap-zh/SKILL.md) 告诉 Claude 如何判定输入、应用混合式结构化规则、写出格式正确的 Markmap 文件，并处理边界情况（文件缺失、空输入、重名冲突、渲染回退）。
- [`scripts/render.sh`](skills/mindmap-zh/scripts/render.sh) 是一个约 35 行的 bash 辅助脚本，退出码明确（`0` 成功 · `1` 用法错误 · `2` 文件未找到 · `3` 缺少 npx · `4` 渲染失败）。成功时只在 stdout 打印 `.html` 路径。

完整设计见 [`docs/design-spec.md`](docs/design-spec.md)。

---

## 开发

渲染脚本带有 bash 测试套件（不联网——使用伪造的 `npx`）：

```bash
bash tests/run_tests.sh
```

预期：`ALL TESTS PASSED`（跨 `test_render.sh`、`test_skill_frontmatter.sh`、`test_skill_body.sh`、`test_skill_zh.sh` 共 45 项检查）。

```
mindmap/
├── .claude-plugin/
│   ├── plugin.json        # 插件清单
│   └── marketplace.json   # 市场清单（供 /plugin marketplace add 使用）
├── skills/
│   ├── mindmap/           # 英文技能（/mindmap）
│   └── mindmap-zh/        # 中文技能（/mindmap-zh）
├── tests/                 # render.sh + SKILL.md 结构的 bash 测试
├── docs/                  # 设计文档
├── LICENSE
└── README.md
```

---

## 许可证

[MIT](LICENSE) © 2026 Haixia Cheng
