---
name: design-anchor
description: Skill gateway for Design Anchor. Use when the user wants B2B/SaaS/admin UI, a polished page from a design prompt, prompt-to-design-system style transfer, token/theme/component/spec governance, or long-term AI coding consistency. The skill installs the design-anchor npm runtime, initializes project rules, then routes ongoing work through npx design-anchor commands, @design components, tokens, specs, Portal, sync, and audit.
---

# Design Anchor Skill Gateway

Use this skill as the AI entry layer for Design Anchor. The skill chooses the route, prepares style sources, and triggers the npm runtime. The `design-anchor` npm package is the lasting governance layer: after initialization it writes project AI coding rules, component specs, token sources, Portal integration, MCP config, and audit hooks, so future AI coding work is governed even when the skill is not explicitly mentioned.

Do not treat this skill as a standalone prompt library or component system. Prompts and presets are style sources; Design Anchor stores and enforces the resulting system.

## First Move

When a request touches B2B products, admin systems, dashboards, SaaS apps, CRM, ERP, internal tools, approval systems, settings, data tables, UI, theme, components, tokens, design prompts, or page layout, start visibly:

`Design Anchor 入口预检：我会先确认项目是否已安装治理运行时；如果没有，会安装 design-anchor 并写入 AI coding 规则。`

Then inspect the target project before editing when a project directory is available:

```bash
node "${CLAUDE_SKILL_DIR:-skills/design-anchor}/scripts/probe-design-anchor.mjs" .
```

If `CLAUDE_SKILL_DIR` is unavailable and the command cannot resolve, run the same script by absolute path from this skill directory.

## Product Relationship

The skill and npm package have separate jobs:

- **Skill**: entry point, intent router, prompt/preset selection, style source preparation, and command orchestration.
- **Design Anchor npm runtime**: project initialization, AI coding rules, tokens, components, specs, Portal, MCP, sync, audit, and long-term consistency.

The coupling must stay execution-based. The skill should call the real npm CLI and read project state; it should not duplicate component source, token JSON, Portal implementation, or audit logic.

After `design-anchor` is installed and initialized, the package-generated files make the project behave like always-run governance:

- `AGENTS.md`
- `CLAUDE.md`
- `.cursor/rules/anchor.mdc`
- `.cursor/rules/anchor-selfcheck.mdc`
- `.github/copilot-instructions.md`
- `.mcp.json` and `.cursor/mcp.json`
- `.cursor/hooks.json`
- `src/design-tokens/tokens.json`
- `src/components/anchor-ui`
- `.anchor/src/anchor/schema/components`

## Activation Contract

Use the skill as the one-time gateway into the Design Anchor runtime.

1. Detect the package manager from lockfiles.
2. If the target project is the `design-anchor` source package itself, do not run `start`; work on the package source.
3. If `design-anchor` is not in project dependencies, install it first.
4. Run `npx design-anchor start` from the project root to initialize `.anchor`, visible component source, token source, AI rules, MCP config, audit hooks, and Portal.
5. After initialization, route all feature commands through `npx design-anchor ...`.

Install command by package manager:

```bash
npm install design-anchor
npx design-anchor start
```

```bash
pnpm add design-anchor
pnpm exec anchor start
```

```bash
yarn add design-anchor
yarn anchor start
```

```bash
bun add design-anchor
bunx design-anchor start
```

Do not describe this as onboarding. It is runtime activation: install the npm package, write the project's AI coding rules, and open the Portal/control plane.

## Input Router

Choose one of two entry paths, then converge into the same Design Anchor governance pipeline.

### Path A: User Prompt Style Transfer

Use this when the user provides a rich design prompt, external UI prompt, visual recipe, copied template prompt, or detailed design direction.

Treat the prompt as a style source, not a one-off page instruction.

1. Ensure Design Anchor is activated.
2. Save the user's prompt into a project-local markdown file, such as `design-prompt.md` or `.anchor/design-prompt-source.md`.
3. Run `npx design-anchor theme <prompt-file.md>` to extract token signals and write active prompt style rules.
4. Generate the requested page using the extracted style plus the product context.
5. Use `@design` components and semantic token classes.
6. Run `npx design-anchor sync` and `npx design-anchor audit`.
7. Open Portal with `npx design-anchor portal tokens` so the user can see the style as governed tokens/components/specs.

### Path B: Need-First Style Source Selection

Use this when the user gives a vague product need, such as `做一个 CRM 后台`, `做个审批系统`, `做个 B 端首页`, `搭个数据看板`, or `做一个 SaaS 管理台`.

1. Infer roles, core objects, workflow, page type, and data density.
2. Choose a style source from `references/b2b-design-prompt-pool.md`.
3. Load only the matching style file under `references/b2b-design-prompts/`.
4. Treat that preset file exactly like a user-provided prompt: it is style source material, not a product template.
5. Ensure Design Anchor is activated.
6. Run `npx design-anchor theme <style-source-file.md>`.
7. Generate the requested page from `style source + product context`.
8. Run `npx design-anchor sync` and `npx design-anchor audit`.
9. Open Portal with `npx design-anchor portal tokens`.

## Shared Governance Pipeline

Both input paths must converge here.

Never stop at a generated page. A page is complete only when its style decisions are represented in Design Anchor runtime state.

1. Tokens live in `src/design-tokens/tokens.json`.
2. Components live in `src/components/anchor-ui` and are imported from `@design` or `@/components/anchor-ui`.
3. Component contracts live in `.anchor/src/anchor/schema/components/*.spec.json`.
4. Active prompt style guidance lives in `.anchor/src/anchor/rules/ACTIVE_PROMPT_STYLE.md` and is mirrored into AI rules by sync.
5. AI coding rules are generated into `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/anchor.mdc`, `.github/copilot-instructions.md`, and related files.
6. Always run `npx design-anchor sync` after token/spec/style-rule changes.
7. Run `npx design-anchor audit` after UI changes.

## Style Source Model

There are two kinds of style sources:

1. **User-provided prompt**: a rich external prompt supplied by the user.
2. **Preset prompt**: a built-in Design Anchor style source selected by the skill.

Both are parsed by the same Design Anchor extraction and application flow. The skill must keep style source and product context separate:

- Style source answers: density, rhythm, contrast, radius, typography, surface hierarchy, state language, and component tone.
- Product context answers: who uses it, what objects they manage, what workflow they complete, and what page type is needed.

Only combine them when generating the governed page.

## B2B Product Context

When the user asks to build a B2B product, admin system, dashboard, SaaS app, CRM, ERP, internal tool, approval system, data-management product, operations console, settings area, or reporting surface, infer or ask briefly for:

1. User roles: admin, operator, manager, reviewer, customer success, finance, developer, analyst, or end customer.
2. Core objects: customers, orders, projects, tickets, invoices, tasks, alerts, assets, policies, reports, workflows, or integrations.
3. Main workflow: browse, filter, edit, approve, monitor, configure, investigate, report, onboard, resolve, or export.
4. Data density: compact workbench, balanced SaaS, trust-heavy business, friendly platform, dark focused workspace, or command center.

Read `references/b2b-product-patterns.md` before creating B2B product screens. Read `references/style-source-selection.md` when choosing a style source from vague user intent. Read `references/b2b-design-prompt-pool.md` when choosing a style source or when the user asks to add, collect, save, expand, or reuse B端设计 prompts.

## B2B Design Prompt Pool

The reusable prompt pool is split by style source.

- Index: `references/b2b-design-prompt-pool.md`
- Style files: `references/b2b-design-prompts/linear.md`, `stripe.md`, `saas-style-01.md`, `google-style.md`, `minimal-dark.md`, and `hud-dark-style.md`

When the user asks to add, collect, save, expand, or reuse B端设计 prompts, choose the matching style file and append the new prompt there. Preset prompt files should stay style-focused; do not bind them deeply to specific products.

## Command Router

Use the npm runtime for continuing work:

- Initialize / activate: `npx design-anchor start`
- Apply a style source or user design prompt: `npx design-anchor theme <prompt-file.md>`
- Open Portal: `npx design-anchor portal tokens`, `components`, `specs`, `theme`, or `docs`
- Sync generated rules and tokens: `npx design-anchor sync`
- Audit project compliance: `npx design-anchor audit`
- Upgrade local kit from the npm package: `npx design-anchor upgrade`
- Start MCP server if needed: `npx design-anchor mcp`

Open Portal instead of editing blindly when the user wants to inspect or tune design-system state. Read `references/portal-routing.md` when intent routing is ambiguous. Read `references/project-contract.md` before changing files, tokens, component specs, install commands, or source-vs-consumer boundaries.

## Coding Rules

When writing UI:

- Prefer imports from `@design`; otherwise use `@/components/anchor-ui`.
- Do not import component implementations from `node_modules/design-anchor` or `.anchor` deep paths.
- Use Design Anchor components instead of raw `<button>`, `<input>`, `<table>`, dialogs, tabs, selects, and other governed primitives.
- Use semantic token classes such as `bg-primary`, `text-muted-foreground`, `border-border`, and `rounded-lg`.
- Do not hardcode colors, arbitrary token-sensitive Tailwind values, or one-off component variants.
- If you encounter unsafe UI while editing, fix it in the current task and say:

`Design Anchor 自动治理：已改为组件或语义 token。`

Whenever UI changed, include a final line that explicitly starts with `Design Anchor 自检` and covers component reuse, token compliance, auto-fixes, unresolved confirmations, and sync/audit status.

## User-Facing Reveal

After showing the first polished page, explain the distinction:

`这个页面不是一次性 prompt 结果。我已经把它的风格通过 Design Anchor 写进 token、组件规范、AI coding 规则和 audit 链路里：后续继续做页面时，会复用同一套 @design 组件、语义 token、表格/表单/状态规则，不会每次生成一套新风格。`

## Claude Compatibility

This skill uses the Agent Skills `SKILL.md` layout supported by Claude. For Claude Code project use, place or symlink this folder at:

```text
.claude/skills/design-anchor/SKILL.md
```

For personal Claude Code use, copy the folder to:

```text
~/.claude/skills/design-anchor/SKILL.md
```

For Claude.ai upload, zip the `design-anchor/` folder so the archive contains `design-anchor/SKILL.md` at the top level, not `SKILL.md` directly at the zip root.
