<div align="center">

# Design Anchor

**Refactor UI/UX from existing page logic**

<br/>

<p>
  <img src="https://img.shields.io/badge/Agent_Skill-Design_Anchor-6B5CE7?style=flat-square" alt="Agent Skill" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square&color=0a0a0a" alt="MIT" />
</p>

<h3>Read an existing page's routes, data, state, permissions, and interaction intent; preserve the business logic that works; restructure weak UI/UX; then use a unified component system to make the product clearer, more consistent, and easier to use.</h3>

[中文](./README.md)

</div>

---

## What It Does

Design Anchor is for existing B2B, SaaS, admin, and internal-tool pages. It treats the old page as the source of business logic, then reorganizes the experience, component structure, and visual system.

The core moves are simple:

1. Preserve business logic: routes, APIs, state, permissions, validation, and event handlers stay intact.
2. Refactor UI/UX: identify user tasks, information hierarchy, state gaps, and interaction problems; then preserve, repair, or restructure.
3. Unify visuals: prefer GenDesignSystem / Theme Lab; otherwise establish or reuse `design-tokens.json`, then rebuild pages with token-bound components.

## Best Fit

- The page works, but visual style, component usage, and interaction patterns have drifted.
- Lists, tables, detail views, forms, settings, approval flows, workspaces, or dashboards need better UX.
- You want to keep business code but substantially rebuild layout, visual design, and interaction.
- Multiple pages need shared color, radius, border, focus, state, density, and component semantics.

## Workflow

```text
Read existing pages
  -> extract business logic and user tasks
  -> connect Theme Lab or design-tokens.json
  -> choose a UX strategy
  -> reassemble pages with one component system
  -> reconnect data, state, permissions, and events
  -> complete states, responsiveness, accessibility, and visual craft
```

Simple pages usually keep their existing layout and receive focused fixes for style, state, and local interaction.

Complex pages can be restructured into more suitable patterns such as table toolbars, filter areas, detail drawers, edit modals, split workspaces, bulk actions, step flows, confirmations, and undo feedback.

When product intent is unclear, change risk is high, or the page task is complex, the Skill should ask heuristic questions based on inspected code and UI signals before refactoring.

## Tokens And Components

GenDesignSystem / Theme Lab is the preferred token source. When a project already has `theme-lab.json` or a `theme-lab:runtime` CSS marker, the Skill consumes its shadcn adapter and semantic variables instead of silently creating a parallel `design-tokens.json`.

When Theme Lab is absent, `design-tokens.json` is the fallback style contract. The Skill may create, complete, or map tokens, but should not silently overwrite user-defined themes.

Structural styles must come from tokens:

```text
primary / primary-foreground
background / foreground
card / card-foreground
muted / muted-foreground
border / input / ring
destructive / success / warning
```

Component strategy:

Component isolation is not about splitting pages into fragments. It reduces AI edit risk by classifying boundaries first: shared primitives, feature-local components, or page-local composition. Shared components should not take over APIs, routing, permissions, validation, or business state.

1. Prefer the project's existing token-compatible components.
2. Tailwind projects default to shadcn component semantics; when Theme Lab exists, component styles should resolve through its shadcn adapter variables.
3. Other suites connect through theme mappings, including Ant Design, MUI, Chakra, Mantine, and Radix-based systems.
4. Vercel UI skills are used as execution references: shadcn for components, v0 output for normalization, Geist for typography discipline, and browser verify for visual checks.
5. Components provide consistent execution; business tasks and UX judgment decide the page structure.

## Quality Bar

A refactored page should deliver:

- Clear placement for primary, secondary, and destructive actions.
- Complete loading, empty, error, saving, success, and disabled states.
- Smoother B2B paths for tables, forms, filters, details, and bulk actions.
- Responsive behavior across desktop and mobile without content breakage.
- Hover, focus, transition, elevation, subtle texture, or soft color diffusion only when they improve usability and polish.
- Backup, branch, or readable diff before large changes, so rollback is possible.

## References

- `references/token-contract.md`: token structure, CSS variables, and component-library mappings.
- `references/gendesignsystem-token-bridge.md`: GenDesignSystem / Theme Lab token contract, runtime marker, and shadcn adapter integration.
- `references/functional-ux.md`: business-logic recognition, interaction diagnosis, and restructuring strategy.
- `references/component-isolation.md`: component boundaries, state ownership, and over-componentization guardrails for AI-assisted frontend refactors.
- `references/vercel-ui-skill-routes.md`: Vercel UI skill routes for shadcn, v0, Geist, AI Elements, React review, and browser verification.
- `references/ux-prompt-capsules.md`: prompt capsules for complex interaction problems.
- `references/ux-rule-cards.md`: one-line format for designer-contributed rules.
- `references/ux-pattern-sources.md`: authority routes such as Salesforce, IBM, SAP Fiori, GOV.UK, and W3C.
- `references/visual-craft.md`: final visual polish, motion, and responsive refinement.

## Install

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
    ├── gendesignsystem-token-bridge.md
    ├── functional-ux.md
    ├── ux-prompt-capsules.md
    ├── ux-rule-cards.md
    ├── ux-pattern-sources.md
    ├── component-system.md
    ├── component-isolation.md
    ├── vercel-ui-skill-routes.md
    ├── b2b-page-patterns.md
    ├── page-rendering-pipeline.md
    ├── project-contract.md
    ├── visual-craft.md
    └── quality-bar.md
```
