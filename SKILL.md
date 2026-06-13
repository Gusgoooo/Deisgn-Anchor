---
name: design-anchor
description: "Refactor existing B2B/admin/SaaS product UI without rewriting business logic: inspect current code, establish or honor design-tokens.json for style consistency, diagnose UX problems, ask heuristic product-goal questions when complexity is high, and reassemble pages with token-bound components, shadcn blocks, or the project's existing component suite for clearer, safer, more consistent workflows."
---

# Design Anchor Skill

Design Anchor 的一句话卖点：**保留业务逻辑，重组 UI/UX；用 `design-tokens.json` 统一视觉，用 UX prompt routing 选择正确交互策略。**

Use this skill for existing product pages where users do work: admin systems, SaaS apps, CRM, dashboards, tables, forms, settings, approval flows, internal tools, AI workspaces, and operational consoles.

Do not use it as a landing-page or showcase generator. Do not install a `design-anchor` npm package. The user's project owns its tokens, CSS, components, page code, and rollback strategy.

## North Star

Design Anchor has two equal cores:

| Core | Solves | Artifact |
|---|---|---|
| Token foundation | visual consistency across pages and components | `design-tokens.json`, CSS variables, component-library theme mappings |
| UX prompt routing | interaction strategy and page framework | diagnosis, prompt capsules, keep/modify/remove/add/restructure decisions |

The sequence is: preserve logic -> establish or honor tokens -> diagnose UX -> choose strategy -> reassemble with token-bound components -> verify by user path.

## First Move

When the request touches UI cleanup, UX refactor, page redesign, design tokens, component consistency, shadcn, Tailwind, tables, forms, dashboards, settings, workflows, or existing B2B pages:

1. Announce:

```text
Design Anchor 预检：我会先读取已有页面、组件、样式和业务逻辑；业务逻辑会保留，token 负责样式统一，UX 判断负责交互策略和页面框架。简单问题会直接局部修复；复杂或目标不清的问题会先做启发式追问，再重组页面。
```

2. Probe the project:

```bash
node "${CLAUDE_SKILL_DIR:-skills/design-anchor}/scripts/probe-design-anchor.mjs" .
```

If the script path cannot resolve, inspect manually with `rg --files`, `package.json`, route/page files, global CSS, Tailwind config, `components.json`, and existing `src/components` / `components`.

3. Probe the page or feature scope when known:

```bash
node "${CLAUDE_SKILL_DIR:-skills/design-anchor}/scripts/probe-functional-ux.mjs" <page-or-feature-path>
```

Use scripts as structured checklists, not substitutes for judgment.

4. Apply the complexity gate:

- Small, obvious, local fixes: proceed.
- Broad mature-product refactors: recommend a branch, commit, or backup before large edits.
- Complex or high-risk pages with unclear product intent: ask 1-3 contextual heuristic questions based on inspected code/UI signals. Ask what the page, component, or section mainly solves and what user-goal trajectory the product expects. Do not invent a full strategy.

5. State the route:

```text
Design Anchor 判断：我建议先做 <read_only_audit|token_foundation|ux_strategy|component_foundation|single_page_refactor|multi_page_governance>，因为 <reason>。本轮范围是 <scope>；组件策略是 <tailwind_shadcn|shadcn_blocks|existing_suite|local_components|ask_first>。
```

## Reference Map

Load only what the task needs:

- `references/token-contract.md`: token file shape, mapping rules, CSS variable binding, user-owned theme rules.
- `references/functional-ux.md`: UX diagnosis, heuristic clarification, keep/modify/remove/add/restructure, state and feedback rules.
- `references/ux-prompt-capsules.md`: compact interaction prompt patterns such as dense records, long forms, risky actions, workflows, split workspaces.
- `references/component-system.md`: shadcn default for Tailwind, block usage, suite/headless/local component strategy.
- `references/b2b-page-patterns.md`: page pattern selection for dashboards, lists, details, forms, settings, workflows, split views, workspaces.
- `references/page-rendering-pipeline.md`: page rebuild phases and logic preservation.
- `references/ux-rule-cards.md`: optional evidence-backed UX rule bank for complex or ambiguous judgment.
- `references/ux-pattern-sources.md`: optional authority routes for complex enterprise pattern research.
- `references/visual-craft.md`: polish pass when the page is correct but not yet professionally designed.
- `references/quality-bar.md`: final QA gates.
- `references/project-contract.md`: file boundaries, dependency policy, footprint report.

## Execution Contracts

### Preserve Logic

Before rewriting presentation, identify and preserve:

- routes and navigation behavior,
- data loading and API calls,
- state management and reducers,
- event handlers,
- form schemas and validation intent,
- permissions, feature flags, and conditional rendering,
- domain copy and business objects.

If visual refactor requires changing business logic, pause and ask.

### Establish Token Foundation

Read `references/token-contract.md` before creating or changing tokens.

- Use an existing `design-tokens.json` when present.
- Create a compact baseline only when missing and implementation is requested.
- Bind semantic variables into the existing global CSS file.
- Preserve unknown fields and locked/user-defined values.
- For custom token systems, add `mappings.cssVariables` and optional `mappings.componentLibraries.<library>` profiles instead of renaming everything.
- Structural colors must come from tokens; decorative accents can remain raw when intentional.

### Choose UX Strategy

Read `references/functional-ux.md` before changing functional pages.

Classify each meaningful area:

```text
keep | modify | remove | add | restructure
```

Then route the problem through `references/ux-prompt-capsules.md`. Use one or two prompt capsules as strong direction, not fixed templates.

### Assemble Components

Read `references/component-system.md` before adding or standardizing components.

- Reuse existing token-compatible components first.
- React + Tailwind defaults to shadcn components.
- Use shadcn blocks only when their structure fits the work surface; replace demo data, preserve logic, remove irrelevant sections, and bind tokens.
- Non-Tailwind projects should map tokens into the existing suite instead of switching libraries.
- Add only the components or blocks needed for the current scope.

### Rebuild Pages

Read `references/page-rendering-pipeline.md` and `references/b2b-page-patterns.md` before restructuring.

Default implementation order:

1. Confirm rollback/scope for broad mature-product changes.
2. Read the page and layout-owning components completely.
3. Establish or honor token foundation.
4. Diagnose task, friction, states, and risk.
5. Ask heuristic product-goal questions only if complexity requires it.
6. Pick the dominant B2B page pattern.
7. Reassemble with token-bound components.
8. Add reachable loading, empty, error, saving, success, selected, disabled, and permission states.
9. Add final interaction and visual craft: subtle transitions, hover/focus states, card lift, contextual action reveal, responsive behavior, and restrained background/surface texture.
10. Verify responsive, keyboard/focus, visual consistency, and that polish did not hide essential actions.

## Workflow Router

### Read-Only Audit

Use when the user asks to inspect, review, plan, or avoid changes. Report:

- frontend root and maturity,
- token baseline,
- component baseline,
- primary user task,
- likely page pattern,
- keep/modify/remove/add/restructure opportunities,
- missing states and feedback,
- dependency risk,
- recommended first refactor target.

Do not edit files.

### Token Foundation

Use when style consistency is missing or `design-tokens.json` is absent.

1. Read `references/token-contract.md`.
2. Infer existing theme from CSS/config/components.
3. Create or update `design-tokens.json`.
4. Prefer:

```bash
node "${CLAUDE_SKILL_DIR:-skills/design-anchor}/scripts/write-token-baseline.mjs" .
```

5. Bind global CSS variables.
6. Report changed token values and any user decision needed.

### UX Strategy

Use before page restructuring or when the interaction problem is unclear.

1. Read `references/functional-ux.md`.
2. If needed, read `references/ux-prompt-capsules.md`.
3. For complex ambiguous pages, read `references/ux-rule-cards.md`.
4. Ask heuristic questions only when product-goal ambiguity changes the strategy.
5. Choose preserve, focused repair, or structural refactor.

### Component Foundation

Use when inconsistency comes from ad hoc components.

1. Read `references/component-system.md`.
2. Detect Tailwind/shadcn, existing suite, headless primitives, or local UI.
3. Pick one component execution layer.
4. Convert repeated raw controls to token-bound shared components.
5. Avoid duplicate table/form/chart/icon systems.

### Single Page Refactor

Default for messy existing B2B pages.

1. Read the page source and related components.
2. Preserve logic and data.
3. Ensure token foundation exists.
4. Route UX problem to prompt capsules.
5. Choose a B2B pattern.
6. Rebuild page composition with the smallest useful structural change.
7. Verify user path and final quality bar.

### Multi-Page Governance

Use when unifying a product.

1. Confirm branch/backup/rollback path.
2. Establish token foundation.
3. Establish component foundation.
4. Refactor one high-impact page first.
5. Continue page by page: app shell -> primary workflow -> list/table pages -> forms/settings -> detail pages -> secondary pages.
6. Keep a concise running summary in the conversation.

## Dependency Policy

- Never add a `design-anchor` npm package.
- No dependency changes during read-only work.
- Prefer existing local components and dependencies.
- Tailwind projects default to shadcn, but add only specific components/blocks needed now.
- Ask before switching component libraries, broad starters, second table/form/chart systems, duplicate icon libraries, or decorative effect libraries.

## Output Format

For implementation work, end with:

```text
Design Anchor 自检：业务逻辑保留 ✓ | token基座 ✓ | UX策略 ✓ | 组件统一 ✓ | B端页面范式 ✓ | 状态反馈 ✓ | 响应式 ✓ | 可访问性 ✓ | 视觉细节 ✓ | 回退路径 <branch|backup|diff|not-needed> | 依赖变更 <none|listed>
```

If visual/browser verification could not run, state that QA was code-based.

For file changes, include a footprint report:

- token files changed,
- global CSS changed,
- shared components changed,
- page files rebuilt,
- UX interactions/states improved,
- dependencies added or intentionally avoided.
