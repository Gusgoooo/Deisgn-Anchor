<div align="center">

# Design Anchor

**UI/UX refactoring skill for existing projects**

<br/>

<p>
  <img src="https://img.shields.io/badge/Claude_Code-Agent_Skill-6B5CE7?style=flat-square" alt="Claude Code" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square&color=0a0a0a" alt="MIT" />
</p>

<h3>Preserve business logic, recompose UI/UX, use design-tokens.json for visual consistency, and route interaction problems to the right UX prompt strategy.</h3>

[中文](./README.md)

</div>

---

## Positioning

Design Anchor does not depend on a same-name npm package. It is a Skill workflow for UI/UX refactoring in existing projects, not marketing/showcase pages.

Its structure is:

- Treat the old page as the source of business logic, preserving routes, data bindings, state management, permissions, API calls, and event handlers.
- Identify the real task, interaction problems, state gaps, and information hierarchy before selecting a UX strategy.
- Keep and repair simple pages; restructure complex pages with tables, split panes, drawers, modals, workflow steps, bulk actions, or other suitable patterns.
- Establish or honor the user's `design-tokens.json` as a beautiful and consistent style foundation.
- Reassemble pages and components on top of tokens, keeping color, state, border, focus, radius, density, and component semantics consistent across pages.
- Tailwind projects default to shadcn as the execution layer, with fitting shadcn blocks as functional scaffolds; non-Tailwind projects map tokens into the existing suite's theme entry points.

## Why

Existing projects often work logically but drift visually and experientially: button colors diverge, tables miss filters and states, forms give weak feedback, risky actions are unsafe, dialogs differ by page, and mobile paths break.

Design Anchor handles the foundations:

| Problem | Response |
|---|---|
| Existing logic must survive | Treat old pages as logic sources and refactor only presentation, interaction, and component structure |
| Inconsistent styling | Establish or reuse `design-tokens.json`, CSS variables, and component-library theme mappings |
| Unclear task path | Identify user tasks, decision points, action hierarchy, and feedback path |
| Page structure does not fit the job | Choose preservation, focused repair, or structural refactoring by complexity |
| Missing state feedback | Add loading/empty/error/saving/success/selected/disabled states |
| Inconsistent components | Reassemble pages with one token-bound component vocabulary |

## Workflow

```text
Confirm scope and rollback path
  -> read existing pages, components, styles, and business logic
  -> establish or reuse design-tokens.json as the style foundation
  -> bind global CSS variables and component-library theme entry points
  -> identify user tasks, interaction problems, and state gaps
  -> ask heuristic product-goal questions for complex unclear problems
  -> choose the right UX strategy
  -> reassemble pages through tokens and the component system
  -> verify states / responsiveness / accessibility by user path
  -> roll back through backup, branch, or diff when needed
```

## Change Safety

Design Anchor preserves existing logic as much as possible, but UI/UX refactoring can still make large page-structure changes, especially on complex tables, long forms, approval flows, settings pages, and workspaces.

When a problem is complex, high-risk, or unclear in product intent, the Skill should not hallucinate a complete solution. It should ask contextual heuristic questions based on inspected code and UI signals, helping the user clarify what the page, component, or section mainly solves and the user's expected goal trajectory from entry to completion. Small local fixes do not need this step.

For mature projects, create a git branch, commit the current state, or make a backup before a broad refactor. If a restructuring pass does not fit, use diff, revert, or branch switching to return to the original page.

## Component Strategy

Default order:

1. Reuse existing token-compatible components.
2. React + Tailwind defaults to shadcn components.
3. If shadcn blocks match the functional page structure, use them as scaffolds and reconnect business logic.
4. If MUI, Ant Design, Chakra, Mantine, or a similar suite exists, map tokens into its theme entry points.
5. Add headless primitives or small wrappers only when the current layer cannot cover the interaction.

Common B2B components:

```text
button input textarea label select checkbox switch
card badge table tabs dialog dropdown-menu popover sheet tooltip
breadcrumb pagination skeleton toast/sonner
```

## UX Rule

Every functional page first answers:

```text
What task is the user trying to finish?
What information do they need before acting?
Where do primary, secondary, and destructive actions belong?
Which loading / empty / error / saving / success / disabled states exist?
Can repeat use become faster?
Do mobile and keyboard paths break?
```

Blocks and components carry the experience; they do not replace UX judgment. UX prompts decide the interaction direction; tokens decide visual consistency.

Simple pages should usually keep their existing layout with focused repair. Complex pages can be refactored with drawers, modals, split panes, bulk actions, workflow steps, and other interaction structures when the task needs them.

`references/ux-prompt-capsules.md` is the interaction prompt library for problems such as dense records, contextual edits, risky actions, long forms, workflow states, and split workspaces.

When designers add UX knowledge, use the one-line format in `references/ux-rule-cards.md`: stable signal, preferred move, and guardrail only. Avoid pixel-level details or temporary visual taste.

For complex problems that need external precedent, use the authority routes in `references/ux-pattern-sources.md`. It only guides where to look, such as Salesforce, IBM, SAP Fiori, GOV.UK, and W3C; it does not require browsing every time.

## Token Rule

`design-tokens.json` is the user's theme contract and the core of style consistency. The skill may create, complete, or suggest changes, but must not silently overwrite locked user values. New projects default to Design Anchor's compact semantic tokens; existing projects can keep custom token names as long as `mappings.cssVariables` and `mappings.componentLibraries.<library>` map them to the CSS variables components consume.

Structural colors must use tokens:

```text
primary / primary-foreground
background / foreground
card / card-foreground
muted / muted-foreground
border / input / ring
destructive / success / warning
```

Decorative gradients, chart colors, illustration colors, and page atmosphere colors may remain raw when they are not structural action or state colors.

## Install Skill

```bash
mkdir -p .claude/skills/design-anchor
cp -R SKILL.md scripts references agents .claude/skills/design-anchor/
```

Or install globally:

```bash
mkdir -p ~/.claude/skills/design-anchor
cp -R SKILL.md scripts references agents ~/.claude/skills/design-anchor/
```

## Structure

```text
design-anchor/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── scripts/
│   ├── probe-design-anchor.mjs
│   ├── probe-functional-ux.mjs
│   └── write-token-baseline.mjs
└── references/
    ├── token-contract.md
    ├── functional-ux.md
    ├── ux-prompt-capsules.md
    ├── ux-rule-cards.md
    ├── ux-pattern-sources.md
    ├── component-system.md
    ├── b2b-page-patterns.md
    ├── page-rendering-pipeline.md
    ├── project-contract.md
    ├── visual-craft.md
    └── quality-bar.md
```
