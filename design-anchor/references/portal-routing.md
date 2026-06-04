# Portal Routing Reference

Read this when the user's request sounds like design-system inspection, tuning, governance, or style direction rather than direct feature implementation.

## Open Portal First

Open Portal first when the user asks to see, manage, tune, change, configure, inspect, review, or audit Design Anchor state.

| Intent | Examples | Command |
|---|---|---|
| Tokens/theme | manage token, edit tokens, show token status, theme editor, brand color, radius, spacing, dark mode, 管理 token, 改主题, 品牌色, 圆角, 间距, 深色模式 | `npx design-anchor portal tokens` |
| Components/library | component library, available components, component list, component preview, 组件库, 有哪些组件, 组件列表, 组件预览 | `npx design-anchor portal components` |
| Component style tuning | change button style, tune table, component style, 调整按钮样式, 表格样式, 组件风格 | `npx design-anchor portal components` |
| Specs/schema | component spec, schema, props contract, variant mapping, 组件规范, 组件 schema, props 协议, 变体映射 | `npx design-anchor portal specs` |
| Dashboard/health | dashboard, governance, health, audit, self-check, 右上角仪表盘, 健康度, AI 约束状态, 审计, 自检 | `npx design-anchor portal theme` |
| Docs/help | docs, how to integrate, CLI commands, 文档, 怎么接入, CLI 命令 | `npx design-anchor portal docs` |
| Style prompt/theme extraction | design prompt, style prompt, brand style, extract token, prompt to theme, 风格 prompt, 品牌风格, 从 prompt 提取 token | `npx design-anchor theme <prompt.md>` then `npx design-anchor portal tokens` |

## Continue After Portal

After opening Portal, tell the user:

- which tab opened,
- which files are the source of truth,
- what to say when they are ready to continue, for example "调好 token 后告诉我继续，我会回来同步并检查页面。"

If the user asks the AI to make the change instead of using Portal, edit the source of truth directly, run sync/audit, and summarize the Design Anchor self-check.

If the user gives a full design prompt, do not open Portal first. Save the prompt to a markdown file, run `npx design-anchor theme <prompt.md>`, then open `npx design-anchor portal tokens` after extraction.

## Do Not Open Portal

Skip Portal when:

- the user explicitly says not to open Portal,
- the request is a narrow code-only bug fix unrelated to UI/theme/components/tokens/layout,
- the target directory is the Design Anchor source repo and the user is asking to edit the package itself,
- the environment cannot run a local dev server. In that case, explain the command the user can run and continue with file-based changes where possible.
