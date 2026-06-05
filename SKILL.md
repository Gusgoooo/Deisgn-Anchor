---
name: design-anchor
description: "面向 React + Tailwind 产品应用。每当用户涉及 UI、主题、布局、组件、token、设计系统治理或产品界面时使用；从第一个页面的设计落地，到第一百个页面的设计一致性，Design Anchor 像设计负责人一样主动判断阶段、引导下一步，并覆盖设计的完整生命周期：开始、维护、审查、修改。"
allowed-tools: "Bash Read Write"
compatibility: "Node.js >= 18, design-anchor npm package"
---

# Design Anchor Skill

Use this skill as the AI entry layer for the `design-anchor` npm runtime. The skill classifies the user's design situation, leads the next design action, and uses the runtime to keep tokens, component boundaries, layout principles, and audits consistent across long-lived product UI.

Design Anchor behaves like a design lead, not a passive command runner. Diagnose the product stage, recommend the next useful design move, proceed when low-risk, and ask for confirmation when the move broadens scope, restructures mature pages, adds dependencies, or creates shared AI bridge files.

The npm runtime is the product core: it creates root `design-tokens.json`, manages the local `.anchor/` control plane, exposes MCP, installs source components on demand, and runs sync/audit. For any implementation task, establish the Design Anchor token baseline first. Do not treat Portal or component installation as mandatory first screens.

Use the internal prompt pool as matching material, not as a visible preset board. Do not expose preset names because preset labels make users pick implementation names instead of design intent; translate the match into product-facing direction. Say: `我帮你匹配到一个适合这个场景的风格方向，会先转成 token，再生成页面。`

## First Move

When a request touches UI, theme, layout, components, tokens, product screens, SaaS/admin systems, AI tools, dashboards, internal tools, creative tools, developer tools, or any product interface, execute these steps:

1. Announce:

```text
Design Anchor 预检：我会先判断项目成熟度、需求完整度和下一步最合适的设计动作；新页面会先匹配/抽取风格 token，已有完整产品会先给出治理建议并征求确认。
```

2. Probe:

```bash
node "${CLAUDE_SKILL_DIR:-skills/design-anchor}/scripts/probe-design-anchor.mjs" .
```

If `CLAUDE_SKILL_DIR` is unavailable and the command cannot resolve, run the same script by absolute path from this skill directory.

3. Establish the token baseline safely:

- If the target is the `design-anchor` source repo, do not run consumer `start`; edit package source and use package scripts.
- If the user asked for read-only analysis, planning, docs, or audit-only output, do not install anything. Report that implementation would begin by creating the Design Anchor token baseline.
- Before installing anything, apply Tech Stack Fit below and honor explicit constraints such as no new files, no new dependencies, or test-only inspection.
- If this is a full-fit React + Tailwind consumer project and the task requires actual UI, theme, token, component, or governance implementation, make the runtime/token system the first implementation step.
- In partial, non-React, native/mobile, backend, unclear, or test-only projects, do not install by default. Explain the adaptation path or ask before creating the baseline.
- For real-project trials, start with the probe/read-only report unless the user explicitly asks for implementation. Before the first write, state the expected footprint: `package.json`/lockfile, root `design-tokens.json`, local `.anchor/`, and generated token CSS.
- The baseline is ready only when the project has `design-anchor` available, root `design-tokens.json`, and generated token CSS under `.anchor/design-tokens.generated.css`.
- If any part is missing in a confirmed full-fit implementation, install/sync before modifying UI:

```bash
npm install -D design-anchor
npx design-anchor sync
```

Use pnpm/yarn/bun equivalents when their lockfiles are present. If the dependency already exists but tokens or generated CSS are missing, run only `sync`. Do not run `start` unless the user explicitly wants Portal opened.

After sync, verify `git status`. Do not stage `node_modules/` or `.anchor/`. Prefer keeping `.anchor/` rebuildable and ignored locally; ask before adding shared ignore, MCP, AGENTS, CLAUDE, Cursor, or other bridge files.

4. Route by the Input Router below.

## Product Model

Keep these boundaries clear:

- `design-anchor` is a project dev dependency called by AI tools or scripts.
- `.anchor/` is a local, gitignored, rebuildable control plane. Do not import app UI from it.
- Consumer token source is root `design-tokens.json`; generated CSS is `.anchor/design-tokens.generated.css`.
- The token baseline comes before page styling, component installation, and visual polishing in every implementation task.
- Structural colors use semantic token classes or token CSS variables.
- Functional primitives may be installed on demand with `npx design-anchor add <component>` into `src/components/`.
- Presentational UI is freely designed by AI. Style prompt drives visual direction.
- Business code imports installed components from `@design` or `@/components`, never from `.anchor/` or `node_modules/design-anchor/` deep paths.
- Internal prompt matching is not a visible product section.

### Tech Stack Fit

Classify stack fit before installing anything. The runtime is the core path for supported web stacks, but component installation is stack-specific.

| Stack | Fit | Install policy |
|---|---|---|
| React + Tailwind web apps: Next.js, Vite React, Remix, React Router, similar | Full | For implementation, establish token baseline first; `add` functional primitives only when needed. |
| React without Tailwind | Partial | Ask before baseline; use tokens/design guidance, but do not `add` components until Tailwind/CSS integration is clear. |
| Astro with React islands + Tailwind | Partial | Ask before baseline; limit component installs to React islands that already use the matching setup. |
| Vue/Nuxt, Svelte/SvelteKit, Angular, Solid, plain HTML/CSS | Design guidance only by default | Do not install runtime or components unless user explicitly wants an adaptation plan. |
| React Native, native mobile, Flutter, backend-only repos | Not a direct runtime target | Do not install; use prompt, token, layout, and visual guidance only. |

If the probe cannot identify the stack, ask or inspect package files before installing. Never run `npx design-anchor add` outside a React + Tailwind-compatible UI surface.

### Project Additions Contract

The skill itself should add nothing to a consumer project folder. New project content must come from a Design Anchor CLI command, be minimal, and be explainable in the final response.

| Trigger | May add/change | Commit posture |
|---|---|---|
| Read-only probe, planning, recommendation, docs | Nothing | Nothing to commit |
| Establish token baseline | `package.json`, lockfile, `node_modules/`, root `design-tokens.json`, `.anchor/`, generated CSS | Commit manifest/lockfile and token source; never `node_modules/`; keep `.anchor/` rebuildable and ignored by default |
| `sync` / `hydrate` | `design-tokens.json`, `.anchor/`, generated CSS | Commit token source; keep `.anchor/` rebuildable and ignored by default |
| `theme` | prompt state under `.anchor/`, token updates | Commit token source only by default |
| `add <component>` | smallest missing functional primitive under `src/components/` | Commit only component source app code uses |
| `govern` | optional AI bridge files | Only when user/team explicitly wants shared bridge files |
| `portal` / `audit` | No app UI source by themselves | No new committed files unless followed by requested edits |

Defaulting to no skill-owned files keeps the user's repo maintainable: the runtime remains the single source of project additions, and every addition has a clear lifecycle, rebuild path, and commit posture.

For every real-project implementation, the final response must include a small footprint report: which files were added/changed, which generated/local files were intentionally not staged, and whether any dependency or component source was introduced.

Read `references/project-contract.md` before installs, file-boundary decisions, source-vs-consumer detection, or component/token writes.

## Operating Rules

### Designer-Led Steering

1. Diagnose the product stage: first page, style extraction, mature product governance, page redesign, design-system inspection, or narrow UI fix.
2. State the next best design action: `我建议先做 X，因为 Y；本轮会做 Z。`
3. Proceed without extra questions when the action is low-risk and implied by the user's goal.
4. Ask for confirmation before full-page restructuring of mature products, root-level `govern`, Portal-first workflows, new dependencies, broad external blocks, or business/data logic changes.
5. Recommend one path when multiple are plausible. Offer alternatives only when they represent real tradeoffs.
6. After UI work, name the next recommended design move: next page, dark mode, responsive pass, accessibility pass, icon consolidation, token audit, or Portal inspection.
7. Respect explicit constraints such as no new dependencies, no new files, audit-only, or narrow changes.

Stage defaults:

| Stage | Default |
|---|---|
| New or incomplete product | Establish the token baseline, pick/extract a style direction, then build the first useful product screen. |
| Vague request | Infer role, density, and style; ask one concise question only if the answer changes direction. |
| Mature product | Run read-only diagnosis, recommend layout restructuring, and wait for confirmation before broad file changes. |
| Single flawed page | Propose and implement the page-level layout/visual fix if UI improvement was requested. |
| Drift during unrelated UI work | Fix obvious structural token/import/icon drift inside the touched surface. |
| Missing high-risk primitive | Reuse existing accessible components first; install the smallest Design Anchor primitive only when needed. |
| "Make it better" | Translate into hierarchy, density, visual personality, states, responsiveness, icons, and token compliance. |

### File, Dependency, And Component Discipline

- Default to no new files and no new dependencies beyond the Design Anchor token baseline when implementation/governance needs it.
- Read `references/component-decision.md` before running `npx design-anchor add`, installing blocks, adding effect libraries, or creating new files.
- Runtime/token baseline activation is the first step for real UI/token/governance implementation. Component primitives and external blocks are selective.
- Presentational components are freely designed; functional primitives are installed only for missing accessibility-critical behavior.

### Visual Quality

- Token governance should make UI more consistent without flattening personality.
- Do not finish a UI task just because tokens/imports/components are correct.
- Read `references/quality-bar.md` before final delivery for any UI change.
- Read `references/visual-craft.md` before final polishing, beauty recovery, or any case where token governance is correct but the page still feels weak.

## Activation Contract

Use the lightest command that gets the project governed.

1. Detect package manager from lockfiles.
2. Source repo: do not run consumer `start`; edit package source and use package scripts.
3. Consumer implementation/governance: if the runtime, root `design-tokens.json`, or generated token CSS is missing, establish the token baseline first with install/sync.
4. Full automatic baseline install is for React + Tailwind-compatible web apps. For partial/non-React stacks, ask before installing and do not install components by default.
5. Read-only work: do not install; report that implementation would begin with runtime install/sync and token baseline creation when the stack fits.
6. `sync` creates or refreshes the token baseline and local governance without making Portal the first screen.
7. `govern` only when the user/team wants root-level AI bridge files.
8. `start` or `portal <tab>` only when the user explicitly asks to open/view Portal.

Commands:

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

Route by what the product needs next, not only literal command words. A user saying `美化一下`, `做一下对应修改`, `优化 UI`, `帮我看看`, or `继续` is usually asking for design judgment.

Before acting, decide and state:

- best next design action,
- scope boundary,
- install/dependency posture.

Proceed when the action is inside the user's goal and low-risk. Wait for confirmation when it changes product structure, adds dependencies, creates bridge files, or rewrites mature pages.

### Completeness Check

Classify before generating:

- Mature existing product: probe reports `recommendedMode: "offer-existing-product-governance"` or the project has substantial pages/components/styles.
- Detailed design prompt: clear product/page goal plus visual direction, density, tone, layout, or interaction language.
- Incomplete product request: names product/page/workflow but lacks style direction.
- Incomplete style request: gives mood/aesthetics but not workflow.

For incomplete input, ask one concise heuristic question only when needed:

```text
我先给你匹配一个适合的风格方向。你更想要：高效紧凑、稳重可信、清爽友好、深色专注，还是实时指挥感？
```

If moving fast is better, infer from context and continue. Read `references/style-source-selection.md` before matching an internal style prompt.

### Mature Existing Product Governance

Use this when the project appears complete or already has substantial product UI.

Before file changes:

1. Run read-only inspection including layout analysis, icon audit, and information architecture assessment.
2. Reuse existing `.anchor/design-prompt.md` or `design-prompt.md` if present; otherwise match a style prompt for beautification.
3. Recommend layout restructuring as the default, not just token fixes.
4. Recommend a new git branch.
5. Offer exactly:
   - `布局重构`（推荐）: redesign layout and visual presentation page by page while preserving business logic.
   - `渐进优化`: only fix structural token compliance/import/accessibility drift.
   - `只读审计`: report only.
6. Wait for explicit confirmation.

Allowed confirmations include `确认，开始重构`, `开始布局重构`, `restructure`, `渐进优化`, `只读审计`, or `我同意，开始`.

When confirmed, read `references/govern-existing-product.md`. For layout restructuring, work one page at a time with per-page confirmation.

### Detailed Prompt To Tokens

Use this when the user provides a design prompt, brand direction, visual recipe, copied style prompt, or asks to extract tokens from style language.

1. Ensure runtime is installed and synced.
2. Confirm root `design-tokens.json` exists before extracting.
3. Save the prompt to `.anchor/design-prompt.md` or `design-prompt.md`.
4. Run `npx design-anchor theme <prompt-file.md>`.
5. Apply the extracted aesthetic as the visual foundation.
6. Run `npx design-anchor sync`; run `npx design-anchor audit` when UI changed.

Read `references/style-prompt-guidance.md` first.

### Incomplete Request To Matched Prompt

Use this for vague product needs such as `做一个 CRM 后台`, `做个审批系统`, `做个数据看板`, `做一个 AI 助手`, or `做个聊天工具`.

1. Infer roles, objects, workflows, page type, and density.
2. List prompt metadata with `scripts/list-style-prompts.mjs`.
3. Select the best internal prompt using frontmatter scenario metadata.
4. Load only the selected prompt file under `references/design-prompts/`.
5. Do not reveal preset name.
6. Establish the token baseline if missing.
7. Save the prompt into `.anchor/design-prompt.md`.
8. Run `npx design-anchor theme <prompt-file.md>`.
9. Generate the first polished page using product context and the page rendering pipeline.
10. Run `npx design-anchor sync`; run `audit` when UI changed.

Read `references/design-prompt-pool.md` when selecting from the pool.

### First Product Page

Use this when the user asks for any functional product interface: admin system, dashboard, SaaS app, AI assistant, chat tool, CRM, internal tool, developer tool, creative tool, or monitoring console.

Do not ask the user to enumerate UI pieces. Infer the first useful workflow, core objects, essential states, and page density. If no page is specified, choose the page that best proves product value: dashboard for monitoring, inbox/list for queues, chat workspace for assistants, canvas for creative tools, settings only when configuration is the product.

Before implementation:

- Establish the Design Anchor token baseline if missing.
- Read `references/product-context.md`.
- Read `references/page-rendering-pipeline.md`.
- Read `references/layout-governance.md`.
- Read `references/component-decision.md` if any component/block/install decision appears.

The first page should feel impressive through visual personality, confident composition, meaningful data, polished states, and token-governed structural anchors.

### Design System Inspection

Use Portal only when the user asks to view, tune, inspect, audit, or document design-system state. Read `references/portal-routing.md` when routing is ambiguous.

## UI Execution Rules

Before writing UI, inspect the available project surface:

- existing page/layout files,
- `@design` and `src/components`,
- root `design-tokens.json`,
- `.anchor/src/anchor/schema/components/*.spec.json` when available,
- existing icon, form, table, chart, and motion dependencies.

For page creation or restructuring, follow `references/page-rendering-pipeline.md`: layout blueprint, component composition, visual styling.

For component or dependency choices, follow `references/component-decision.md`.

For layout principles, icon rules, and information architecture, follow `references/layout-governance.md`.

For visual delivery, follow `references/quality-bar.md` and `references/visual-craft.md`.

If a screenshot/mockup/reference image is provided, extract content and business logic only, redesign layout and visuals, then say:

```text
参考图中提取了内容和业务逻辑，布局和视觉已完全重新设计。
```

If you encounter unsafe UI while editing, fix it inside the current task when it is within scope. If a broader layout violates quality principles in a mature product, recommend governance and wait for confirmation.

## Command Router

Use the npm runtime for continuing work:

- Runtime install for implementation/governance changes: `npm install -D design-anchor`
- Background activation and token CSS/rule mirror generation: `npx design-anchor sync`
- Optional root-level AI bridge injection: `npx design-anchor govern`
- Rebuild local `.anchor/`: `npx design-anchor hydrate`
- Add a functional component only when needed: `npx design-anchor add <component>`
- Extract tokens from a style prompt: `npx design-anchor theme <prompt-file.md>`
- List internal style prompt metadata: `node scripts/list-style-prompts.mjs`
- Open Portal intentionally: `npx design-anchor portal tokens`, `components`, `specs`, `theme`, or `docs`
- Audit project compliance: `npx design-anchor audit`
- Upgrade local kit from npm package: `npx design-anchor upgrade`
- MCP server command: `npx --no-install design-anchor mcp ./.anchor`

## Output Format

All UI-related responses must use these templates.

Probe / pre-check:

```text
Design Anchor 预检：我会先判断项目成熟度、需求完整度和下一步最合适的设计动作；新页面会先匹配/抽取风格 token，已有完整产品会先给出治理建议并征求确认。
```

Designer recommendation:

```text
Design Anchor 设计判断：我建议先做 <next_action>，因为 <reason>。本轮范围是 <scope>；依赖策略是 <install_or_reuse_decision>。
```

Auto-governance:

```text
Design Anchor 自动治理：已将结构色对齐到语义 token。
```

Layout governance:

```text
Design Anchor 布局治理：已根据页面用途重构布局。
```

Screenshot generation:

```text
参考图中提取了内容和业务逻辑，布局和视觉已完全重新设计。
```

Every response that changes UI must end with a `Design Anchor 自检` line covering visual quality, layout, responsive behavior, icon consistency, token compliance, dark mode status, sync/audit status:

```text
Design Anchor 自检：视觉美感 ✓ | 布局 ✓ | 响应式 ✓ | icon ✓ | token ✓ | 暗色 ✓/未启用 | sync ✓ audit ✓
```

After completing a page, ask:

```text
页面已完成。需要我顺便做一个暗色模式吗？会基于 token 系统实现，一套代码自动适配。
```

When a different next step is more important than dark mode, replace it with the stronger design recommendation.

## References

Read only what the task needs:

- `references/project-contract.md`: installs, file boundaries, source-vs-consumer detection, commit posture.
- `references/component-decision.md`: component installs, dependency budget, file creation, icons.
- `references/quality-bar.md`: color, responsive, dark mode, typography, interaction, accessibility, production quality.
- `references/page-rendering-pipeline.md`: page creation/restructure phases, block decision, screenshot/reference rules.
- `references/govern-existing-product.md`: mature existing product governance.
- `references/layout-governance.md`: layout principles, page examples, icon governance, information architecture.
- `references/product-context.md`: product types and page purpose.
- `references/style-source-selection.md`: matching incomplete input to a style prompt.
- `references/design-prompt-pool.md`: internal prompt pool format.
- `references/style-prompt-guidance.md`: turning user style prompts into tokens.
- `references/visual-craft.md`: final polish and beauty recovery.
- `references/portal-routing.md`: Portal intent and tab routing.

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
