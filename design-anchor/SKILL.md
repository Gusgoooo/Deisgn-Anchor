---
name: design-anchor
description: Use when a task touches B2B/SaaS/admin UI, product screens, design prompts, themes, design tokens, component specs, Design Anchor governance, @design components, MCP, sync, audit, or long-term AI coding consistency. Starts by classifying the project and request: detailed prompts are extracted into tokens, incomplete requests are matched to an internal B2B style prompt for a polished first page, and mature existing products are offered a consent-gated governance mode.
---

# Design Anchor Skill

Use this skill as the AI entry layer for Design Anchor. Its first job is to classify the situation: create a polished B2B first page for new or incomplete products, extract tokens from detailed design prompts, or offer a consent-gated governance mode for mature existing products. Its second job is to make the work governable through Design Anchor tokens, components, specs, rules, sync, MCP, and audit.

The npm package is the actual runtime: it creates project tokens, writes generated AI rules, manages the local `.anchor` control plane, exposes MCP, installs source components on demand, and runs sync/audit.

Use the internal prompt pool as matching material, not as a visible product section. Do not tell the user a preset name. Tell them the product-facing result: `我帮你匹配到一个适合这个场景的风格方向，会先转成 token，再生成页面。`

## First Move

When a request touches UI, theme, layout, components, tokens, B2B products, SaaS/admin systems, dashboards, CRM/ERP, internal tools, approval systems, settings, or data-management screens, start visibly:

`Design Anchor 预检：我会先判断项目成熟度和需求完整度；新页面会先匹配/抽取风格 token，已有完整产品会先征求你确认是否进入治理模式。`

Then inspect the target project before editing when a project directory is available:

```bash
node "${CLAUDE_SKILL_DIR:-skills/design-anchor}/scripts/probe-design-anchor.mjs" .
```

If `CLAUDE_SKILL_DIR` is unavailable and the command cannot resolve, run the same script by absolute path from this skill directory.

## Product Model

Keep the current Design Anchor boundaries clear:

- `design-anchor` is installed as a project dev dependency and called by AI tools or scripts.
- `.anchor/` is a local, gitignored, rebuildable control plane. Do not import runtime UI from it.
- User-owned component source lives in `src/components/anchor-ui/` and is committed.
- Components are added only when needed with `npx design-anchor add <component>`.
- Business code imports from `@design` or `@/components/anchor-ui`.
- Design tokens live in `src/design-tokens/tokens.json`; generated CSS lives in `src/styles/design-tokens.generated.css`.
- User-written components may appear in the component library even if their spec is absent or empty.
- Internal style prompts may be used to bootstrap a polished first page when the user's input is incomplete.
- Internal prompt matching is not a visible preset board or product section.
- There is no mandatory Portal reveal.

## Activation Contract

Use the lightest command that gets the project governed.

1. Detect the package manager from lockfiles.
2. If the target is the `design-anchor` source package itself, do not run `start`; edit package source and use package scripts.
3. In a consumer project, install `design-anchor` as a dev dependency if missing.
4. Run `npx design-anchor sync` for background activation. It can hydrate `.anchor`, create/update tokens and generated rules, and prepare MCP without making Portal the first screen.
5. Run `npx design-anchor start` or `npx design-anchor portal <tab>` only when the user explicitly asks to open/start/view Portal.

Install commands by package manager:

```bash
npm install -D design-anchor
npx design-anchor sync
```

```bash
pnpm add -D design-anchor
pnpm exec design-anchor sync
```

```bash
yarn add -D design-anchor
yarn design-anchor sync
```

```bash
bun add -d design-anchor
bunx design-anchor sync
```

If a cloned project has committed tokens/components/rules but no `.anchor/`, rebuild it with:

```bash
npx design-anchor hydrate
```

## Input Router

### Completeness Check

Classify the project and request before generating:

- **Mature existing product**: probe reports `recommendedMode: "offer-existing-product-governance"` or the project clearly has many existing pages/components/styles.
- **Detailed design prompt**: includes a clear product/page goal plus enough visual direction, density, tone, layout, or interaction language to extract tokens.
- **Incomplete product request**: names a product, page, or workflow but does not provide enough style direction.
- **Incomplete style request**: gives mood or aesthetics but does not define the product workflow.

For a mature existing product, do not start rewriting or normalizing UI automatically. Read `references/govern-existing-product.md`, explain risk, and ask for explicit confirmation. Default to read-only audit.

For a detailed design prompt, do not ask style-matching questions. Save the prompt and run token extraction.

For incomplete input, ask one concise heuristic question when needed. Prefer choices that sound like product direction, not preset names:

`我先给你匹配一个适合的 B2B 风格方向。你更想要：高效紧凑、稳重可信、清爽友好、深色专注，还是实时指挥感？`

If the user does not answer or the task should move fast, infer from product context and continue.

Read `references/style-source-selection.md` before matching an internal style prompt.

### Mature Existing Product Governance

Use this when the project appears complete or already has substantial product UI. This mode is for governing an existing product, not creating a new first page.

Before any file changes:

1. Run only read-only inspection.
2. Explain the risk clearly: component organization, token naming, style references, import paths, and UI behavior may change.
3. Recommend a new git branch and the read-only audit option first.
4. Offer exactly these choices:
   - `只读审计`: scan and report only; no file changes.
   - `生成治理计划`: produce a phased plan; no file changes.
   - `开始第一阶段治理`: make limited first-stage changes only after explicit confirmation.
5. Wait for the user to confirm. Do not treat silence, vague approval, or a different feature request as consent.

Allowed explicit confirmations include phrases such as `确认，开始治理`, `开始第一阶段治理`, `govern`, or `我同意风险，开始`.

When confirmed, use `references/govern-existing-product.md` as the execution prompt. Keep each stage small; token remapping, component normalization, and business-code rewrites should remain separate confirmation gates.

### Detailed Prompt To Tokens

Use this when the user provides a design prompt, brand direction, visual recipe, copied style prompt, or asks to extract tokens from style language.

1. Ensure the runtime is installed and synced.
2. Save the prompt into a project-local markdown file, such as `design-prompt.md` or `.anchor/design-prompt-source.md`.
3. Run `npx design-anchor theme <prompt-file.md>`.
4. Treat the extracted aesthetic as a light layer for B2B density, hierarchy, rhythm, surface tone, and atmosphere.
5. Keep component specs, semantic tokens, accessibility, and product workflow stronger than the prompt.
6. Run `npx design-anchor sync`; run `npx design-anchor audit` when UI changed.

Read `references/style-prompt-guidance.md` before using a style prompt.

### Incomplete Request To Matched Prompt

Use this when the user gives a vague product need, such as `做一个 CRM 后台`, `做个审批系统`, `做个数据看板`, `做一个 SaaS 管理台`, or only provides partial product context.

1. Infer roles, objects, workflows, page type, and density from the request.
2. Use heuristic Q&A only if the missing answer would change the style or workflow.
3. List available prompt files with `scripts/list-style-prompts.mjs` or by scanning `references/b2b-design-prompts/*.md`.
4. Select the best internal prompt using each file's frontmatter scenario metadata.
5. Load only the selected file under `references/b2b-design-prompts/`.
6. Do not reveal the preset name; tell the user you matched an appropriate direction.
7. Save that prompt into a project-local markdown file, such as `.anchor/design-prompt-source.md`.
8. Run `npx design-anchor theme <prompt-file.md>`.
9. Generate the first polished page using extracted tokens, product context, `@design` components, and on-demand components.
10. Run `npx design-anchor sync`; run `npx design-anchor audit` when UI changed.

### First B2B Page

Use this when the user asks for a B2B product, admin system, dashboard, SaaS app, CRM, ERP, internal tool, approval system, settings area, reporting view, or monitoring console.

1. Infer roles, objects, workflows, page type, and density from the request.
2. Ensure there is an active style source: either the user's detailed prompt or an internally matched prompt.
3. Build the actual usable screen or flow, not a marketing landing page.
4. Make the first page feel impressive through hierarchy, density, layout rhythm, meaningful data, state design, and interaction affordances.
5. Compose from existing `@design` components and add only the missing components.
6. Keep the look B2B-appropriate: polished and memorable, but not decorative-heavy.

Read `references/b2b-product-context.md` before creating B2B product screens.

### Design System Inspection

Use Portal only when the user asks to view, tune, inspect, audit, or document the design system state. Read `references/portal-routing.md` when routing is ambiguous.

## UI Coding Rules

Before writing UI, inspect `@design`, `src/components/anchor-ui`, project tokens, and component specs when available.

- Prefer imports from `@design`; otherwise use `@/components/anchor-ui`.
- Do not import component implementations from `.anchor/` or `node_modules/design-anchor/`.
- Add only needed components with `npx design-anchor add <component>`.
- Use Design Anchor components instead of raw governed primitives such as buttons, inputs, dialogs, tabs, selects, tables, cards, and menus.
- Use semantic token classes such as `bg-primary`, `text-muted-foreground`, `border-border`, and `rounded-lg`.
- Do not hardcode colors or arbitrary token-sensitive Tailwind values.
- Keep component implementation changes in `src/components/anchor-ui/`.
- Keep token edits in `src/design-tokens/tokens.json`, then sync generated CSS/rules.

If you encounter unsafe UI while editing, fix it in the current task and say:

`Design Anchor 自动治理：已改为组件或语义 token。`

Whenever UI changed, include a final line starting with `Design Anchor 自检` that covers component reuse, token compliance, auto-fixes, unresolved confirmations, and sync/audit status.

## Command Router

Use the npm runtime for continuing work:

- Install missing runtime: `npm install -D design-anchor`
- Background activation and rule generation: `npx design-anchor sync`
- Rebuild local `.anchor/`: `npx design-anchor hydrate`
- Add a needed source component: `npx design-anchor add <component>`
- Extract tokens from a style prompt: `npx design-anchor theme <prompt-file.md>`
- List internal style prompt metadata: `node scripts/list-style-prompts.mjs`
- Open Portal intentionally: `npx design-anchor portal tokens`, `components`, `specs`, `theme`, or `docs`
- Audit project compliance: `npx design-anchor audit`
- Upgrade local kit from the npm package: `npx design-anchor upgrade`
- MCP server command for tools: `npx --no-install design-anchor mcp ./.anchor`

## References

Read only what the task needs:

- `references/project-contract.md` before installs, file-boundary decisions, source-vs-consumer detection, or component/token writes.
- `references/govern-existing-product.md` before offering or executing governance for a mature existing product.
- `references/b2b-product-context.md` before creating B2B product screens.
- `references/style-source-selection.md` before matching incomplete input to an internal style prompt.
- `references/b2b-design-prompt-pool.md` when selecting an internal prompt.
- `references/style-prompt-guidance.md` before turning a user style prompt into tokens.
- `references/portal-routing.md` before opening Portal or answering Portal intent questions.

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
