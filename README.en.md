<div align="center">

# Design Anchor

**For React + Tailwind products — from the first page's design to the hundredth page's consistency,<br/>Design Anchor acts like a design lead: diagnosing the stage, guiding the next step, covering the full design lifecycle.**

<br/>

<p>
  <img src="https://img.shields.io/npm/v/design-anchor?style=flat-square&color=0a0a0a" alt="npm" />
  <img src="https://img.shields.io/badge/Claude_Code-Agent_Skill-6B5CE7?style=flat-square" alt="Claude Code" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square&color=0a0a0a" alt="MIT" />
</p>

Not just one good-looking page — every page, consistent and maintainable, across a long-lived project.

[中文](./README.md)

</div>

---

## Why

The problem with AI-generated UI isn't page one — it's page ten: button colors start drifting, hover states get hardcoded independently, three icon libraries sneak in, layouts converge toward generic templates.

Design Anchor gives AI a layer of design judgment:

| Problem | How it's solved |
|---|---|
| No design foundation | Install runtime, establish `design-tokens.json`, all structural colors go through tokens |
| Vague style direction | Auto-match from 26 built-in style prompts, extract into tokens |
| Pages diverge over time | Primary, status, and interactive colors unified via tokens; decorative colors stay free |
| Existing product, afraid to touch | Probe first, recommend full-page restructuring, confirm page by page |
| Don't know what's next | Acts like a design lead — diagnoses the stage, recommends the next move |
| Token-compliant but ugly | Keeps polishing until it looks professionally designed |

---

## Workflows

```
User request → Probe script → Route → Execute
```

| Scenario | What the Skill does |
|---|---|
| **Clear design direction** | Save prompt → `theme` extracts tokens → generate page |
| **Just a product idea** | Match built-in style → convert to tokens → generate first page |
| **Existing product** | Probe → recommend layout restructuring / progressive optimization / read-only audit |
| **Unsure what's next** | Diagnose stage, proactively recommend next action |
| **Inspect design system** | Open Portal on demand |

---

## Governance Boundaries

**Tokens govern structure, not personality.**

| Must use tokens | Free to design |
|---|---|
| Primary buttons, links, active, focus → `primary` | Decorative gradients, illustration colors, page atmosphere |
| Success / warning / error / info → semantic tokens | Data visualization palettes |
| Hover / disabled → derived from tokens | Shadows, textures, signature elements |

**Functional components from runtime, presentational designed freely.**

| Type | Strategy |
|---|---|
| **Functional** (dialog, command, select, popover, sheet, tooltip, tabs) | `npx design-anchor add <component>` — accessibility, keyboard nav, ARIA |
| **Presentational** (cards, nav, tables, hero, form layouts…) | AI designs freely from the style prompt, no mandatory library |

**Layout by principles, not templates.** 7 quality principles: purpose-layout fit, information hierarchy, action hierarchy, density-task fit, spatial efficiency, navigation clarity, state completeness.

---

## Quick Start

**Install the Skill:**

```bash
# Project-level
mkdir -p .claude/skills/design-anchor
cp -R SKILL.md scripts references agents .claude/skills/design-anchor/

# Or global
mkdir -p ~/.claude/skills/design-anchor
cp -R SKILL.md scripts references agents ~/.claude/skills/design-anchor/
```

**Install the Runtime (in your target project):**

```bash
npm install -D design-anchor && npx design-anchor sync
```

<details>
<summary>Other package managers</summary>

```bash
pnpm add -D design-anchor && pnpm exec design-anchor sync
yarn add -D design-anchor && yarn design-anchor sync
bun add -d design-anchor && bunx design-anchor sync
```

</details>

> The runtime targets React + Tailwind projects. Other stacks can use the Skill's design diagnosis and layout principles, but runtime/component installs should be confirmed first.

---

## Command Reference

| Command | Purpose |
|---|---|
| `npx design-anchor sync` | Activate governance: token CSS, `.anchor`, rule mirrors |
| `npx design-anchor theme <prompt.md>` | Style prompt → tokens |
| `npx design-anchor add <component>` | Install functional components on demand |
| `npx design-anchor audit` | 13-point design compliance check |
| `npx design-anchor govern` | Optional: inject AI bridge (AGENTS / CLAUDE / Cursor / MCP) |
| `npx design-anchor hydrate` | Rebuild `.anchor/` after clone |
| `npx design-anchor portal` | Inspect design system on demand |

---

## Quality Gates

13-point self-check after every UI change:

| # | Gate |
|---|---|
| 1 | Visually polished, not a wireframe |
| 2 | Text meets WCAG AA contrast |
| 3 | Interactive elements have hover / focus |
| 4 | Empty, loading, error states complete |
| 5 | No breakage at 320 / 768 / 1024 / 1440px |
| 6 | Structural colors use semantic tokens |
| 7 | Primary color consistent across product |
| 8 | Hover / focus / disabled derived consistently |
| 9 | Single icon library |
| 10 | Form fields have visible labels |
| 11 | Destructive actions gated |
| 12 | Keyboard navigable |
| 13 | No layout shift on load |

---

## Artifacts

| Artifact | Path | Commit |
|---|---|---|
| Token source | `design-tokens.json` | Yes |
| Generated CSS | `.anchor/design-tokens.generated.css` | No (rebuild) |
| Functional components | `src/components/` | As needed |
| AI bridge | `AGENTS.md` / `CLAUDE.md` / `.cursor/rules/` | Team decides |
| Control plane | `.anchor/` | No (rebuild) |

---

## Directory Structure

```
design-anchor/
├── SKILL.md                        # AI entry: routing, rules, progressive loading
├── agents/
│   └── openai.yaml                 # OpenAI agent metadata
├── scripts/
│   ├── probe-design-anchor.mjs     # Project probe
│   └── list-style-prompts.mjs      # Style pool metadata
└── references/
    ├── govern-existing-product.md   # Existing product governance
    ├── layout-governance.md         # Layout principles & component strategy
    ├── page-rendering-pipeline.md   # Three-phase page rendering
    ├── visual-craft.md              # Visual polish playbook
    ├── quality-bar.md               # Quality gates
    ├── component-decision.md        # Component install decisions
    ├── product-context.md           # Product types & page purpose
    ├── style-source-selection.md    # Style source selection
    ├── style-prompt-guidance.md     # Style prompt → token guide
    ├── project-contract.md          # File boundaries
    ├── design-prompt-pool.md        # Style pool format
    ├── portal-routing.md            # Portal routing
    └── design-prompts/              # 26 curated style directions
```

`agents/` is the Agent Skills UI metadata directory for this skill package. Design Anchor does not write it into consumer projects.

---

## Design Philosophy

**Deterministic probing** — Scripts scan the project before AI acts, outputting structured JSON so AI guesses less.

**Progressive loading** — SKILL.md routes; references load only when relevant, keeping context lean.

**Pattern awareness** — Inspired by [Impeccable](https://github.com/pbakaus/impeccable), intercepts unconscious AI defaults without banning intentional design choices.

**Principle-driven** — Layout governance uses quality principles, not fixed templates. AI designs freely but must justify the layout.

---

MIT
