# Portal Routing Reference

Read this when the user asks to view, tune, inspect, audit, document, or troubleshoot Design Anchor state.

## Open Portal Intentionally

Portal should not be the first thing shown for ordinary UI generation. Open it when the user explicitly wants a control surface.

| Intent | Examples | Command |
|---|---|---|
| Tokens/theme | design tokens, token status, theme editor, brand color, radius, spacing, dark mode, 管理 token, 改主题, 品牌色, 圆角, 间距 | `npx design-anchor portal tokens` |
| Components/library | component library, available components, component list, component preview, 组件库, 有哪些组件, 组件列表, 组件预览 | `npx design-anchor portal components` |
| Component specs | component spec, schema, props contract, variant mapping, 组件规范, props 协议, 变体映射 | `npx design-anchor portal specs` |
| Health/governance | dashboard, governance, health, audit, self-check, 右上角仪表盘, 健康度, AI 约束状态, 审计, 自检 | `npx design-anchor portal theme` |
| Docs/help | docs, how to integrate, CLI commands, 文档, 怎么接入, CLI 命令 | `npx design-anchor portal docs` |

## Style Prompt Route

If the user gives a style prompt or asks to extract tokens, do not open Portal first. Save the prompt, run theme extraction, sync, then open tokens only if the user wants to inspect the result.

```bash
npx design-anchor theme <prompt.md>
npx design-anchor sync
npx design-anchor portal tokens
```

## Continue After Portal

After opening Portal, tell the user:

- which tab opened,
- which source-of-truth files matter,
- what you will run after they finish editing, usually `sync` and possibly `audit`.

If the user asks the AI to make the change instead of using Portal, edit the source of truth directly, run sync/audit, and summarize the Design Anchor self-check.

## Do Not Open Portal

Skip Portal when:

- the user explicitly says not to open it,
- the task is ordinary UI implementation,
- the task is a code-only bug fix unrelated to UI/theme/components/tokens/layout,
- the target directory is the Design Anchor source repo and the user is asking to edit the package itself,
- the environment cannot run a local server.
