# Govern Existing Product

Read this when Design Anchor detects a mature existing product. This mode is consent-gated. It must not modify files until the user explicitly chooses a governance option and confirms the risk.

## User-Facing Risk Notice

Before any file edits, tell the user:

`我检测到这是一个已有产品。如果进入「治理现有产品」模式，可能会调整组件组织、token 命名、样式引用、import 路径和部分 UI 实现。目标是尽量保持现有视觉不突变，但仍可能影响页面样式、构建结果或组件行为。建议先在新分支执行，并先做只读审计。`

Then offer exactly:

- `只读审计`: only scan and report; no file changes.
- `生成治理计划`: produce a phased migration plan; no file changes.
- `开始第一阶段治理`: make limited first-stage changes after explicit confirmation.

Do not proceed with file changes until the user says a clear confirmation such as `确认，开始治理`, `开始第一阶段治理`, `govern`, or `我同意风险，开始`.

## Read-Only Audit Scope

Scan and report:

- existing pages/routes and major product surfaces,
- component directories and repeated component patterns,
- UI libraries already used,
- hardcoded colors, arbitrary token-sensitive Tailwind values, and scattered CSS variables,
- raw governed primitives such as buttons, inputs, tables, selects, dialogs, tabs, cards, and menus,
- existing theme files, Tailwind config, global CSS, and CSS variables,
- likely candidates for `src/components/anchor-ui/`,
- existing token candidates and naming conflicts,
- risk areas where automatic migration may change behavior.

No files should be edited in read-only audit.

## Governance Plan Scope

Produce a phased plan:

1. Preserve current visual language.
2. Extract and normalize tokens into `src/design-tokens/tokens.json`.
3. Generate or sync token CSS under `src/styles/`.
4. Map existing reusable components into `src/components/anchor-ui/` or `@design` exports.
5. Keep user-owned components in source; `.anchor/` remains local control plane only.
6. Replace hardcoded colors and raw primitives gradually.
7. Run sync/audit after each stage.
8. Keep risky behavior changes behind separate confirmations.

No files should be edited when only generating the plan.

## First-Stage Governance Scope

When the user explicitly confirms first-stage governance, keep changes low risk:

- create or update missing Design Anchor directories and generated rules through `sync`,
- add `.anchor/` to `.gitignore` if missing,
- create an initial token inventory or token source file without deleting existing styles,
- add or repair `@design` alias only when the target project structure is clear,
- document component candidates and unsafe patterns,
- avoid broad UI rewrites.

Do not migrate large components, rewrite business pages, rename tokens globally, or replace UI libraries in the first stage unless the user explicitly asks.

## Execution Prompt

Use this prompt when the user confirms governance:

```text
You are governing an existing product with Design Anchor.

First, preserve the product's current visual identity and behavior. Do not impose a new style. Extract the existing design language into semantic tokens, component boundaries, and AI coding rules.

Respect these source-of-truth boundaries:
- User-owned components live in src/components/anchor-ui/ and are imported through @design or @/components/anchor-ui.
- Design tokens live in src/design-tokens/tokens.json, with generated CSS under src/styles/.
- .anchor/ is a local, gitignored control plane and must not become the source of app component implementations.
- node_modules/design-anchor/ is read-only.

Work in stages:
1. Audit the current project UI, components, tokens, styles, and risks.
2. Propose a minimal governance plan.
3. Only after explicit confirmation, make low-risk first-stage changes.
4. Run Design Anchor sync and audit after changes.
5. Report what changed, what stayed untouched, and what requires another confirmation.

Do not broad-rewrite business pages, migrate all components, rename all tokens, or change visual behavior without separate confirmation.
```
