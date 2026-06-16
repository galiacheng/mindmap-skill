# Copilot CLI 工具名映射

本技能使用 Claude Code 的工具名编写。GitHub Copilot CLI 以不同名称提供相同能力。
技能中出现左侧工具时，请使用右侧的 Copilot CLI 对应工具。

| 技能中的写法（Claude Code） | Copilot CLI 对应工具 |
|----------------------------|----------------------|
| `Read`（读取文件）          | `view`               |
| `Write`（创建文件）         | `create`             |
| `Edit`（编辑文件）          | `edit`               |
| `Bash`（运行命令）          | `bash`               |
| `Glob`（按文件名查找）      | `glob`               |
| `WebFetch`（抓取 URL）      | `web_fetch`          |

技能中的其余部分（工作流、Markmap 格式、`render.sh`）与平台无关，在两个平台上行为一致。

## Copilot CLI 注意事项

- **`--render` 步骤：** 技能调用 `bash <skill-dir>/scripts/render.sh`。在 Copilot CLI 上即 `bash` 工具——命令相同、行为相同。
- **URL 输入：** 技能用 `WebFetch` 抓取 URL；在 Copilot CLI 上对应 `web_fetch`。
- **写入前的重名检查：** 技能使用 `Glob`；在 Copilot CLI 上对应 `glob`。
