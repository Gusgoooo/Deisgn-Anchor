# Design Anchor Skill

[中文](./README.md)

Design Anchor Skill is the AI entry layer for the [`design-anchor`](https://www.npmjs.com/package/design-anchor) npm package, running as a Claude Code Agent Skill.

It solves a core problem: **AI-written UI goes out of control in long-term projects** — style drift, inconsistent layouts, mixed component usage, icon library conflicts. Design Anchor makes AI read the project's tokens, component constraints, and layout quality principles before writing any code, ensuring page 100 follows the same rules as page 1.

Works with all product types: B2B platforms, SaaS tools, AI products (ChatGPT/Gemini-style), creative tools, developer tools — any interface where users do real work.

## Core Capabilities

**Smart Classification** — On activation, the skill inspects the project and request first:

| Scenario | Behavior |
|---|---|
| Mature existing product | Recommends layout restructuring by default (page analysis → layout rebuild → component replacement → icon unification) |
| Detailed design prompt | Extract tokens directly, freely design the best layout for each page's purpose |
| Vague product request | Match from built-in style prompt pool, convert to tokens, generate first page |

**Layout Governance** — Goes beyond token and import fixes to govern page structure:

- Based on layout quality principles (purpose-layout fit, information hierarchy, action hierarchy, density-task fit, spatial efficiency, navigation clarity, state completeness) — AI freely designs the best layout, then verifies against principles
- Provides reference examples for common page types (data workspaces, detail pages, dashboards, forms, chat interfaces, canvas workspaces, agent workflows, settings, etc.) as inspiration, not mandatory templates
- Detects and unifies icon libraries (mixed usage detection + migration to a single library)
- Full-page restructuring instead of patching — preserves business logic, rebuilds the UI layer
- Per-page confirmation: each page is individually approved before changes

**Design Governance** — Powered by the `design-anchor` npm runtime:

- `sync` — Background activation: generates token CSS, AI coding rules, MCP config, local `.anchor` control plane
- `theme <prompt.md>` — Extract design tokens from a style prompt
- `add <component>` — Install source-level components on demand to `src/components/anchor-ui/`
- `audit` — Compliance check after UI changes
- `portal` — Open the design system inspection panel on demand (tokens / components / specs / docs)

**Style Prompt Pool** — Built-in style templates under `references/b2b-design-prompts/` (Stripe-like, Linear-like, HUD dark, minimal dark, Google-like, generic SaaS, etc.), auto-matched to user scenarios via frontmatter metadata. Preset names are never exposed to users.

## Directory Structure

```
design-anchor/
├── SKILL.md                          # Skill entry point (read by Claude)
├── agents/
│   └── openai.yaml                   # OpenAI agent adapter
├── scripts/
│   ├── probe-design-anchor.mjs       # Project probe (maturity, deps, icon libraries, layout signals)
│   └── list-style-prompts.mjs        # List prompt pool metadata
└── references/
    ├── project-contract.md           # File boundaries & source/consumer detection
    ├── govern-existing-product.md    # Existing product governance (layout restructuring first)
    ├── layout-governance.md          # Layout governance: quality principles, reference examples, icon rules
    ├── b2b-product-context.md        # Product context: page purpose categories + anti-patterns
    ├── style-source-selection.md     # Style matching decisions
    ├── style-prompt-guidance.md      # Style prompt → token guide
    ├── b2b-design-prompt-pool.md     # Prompt pool format spec
    ├── portal-routing.md             # Portal routing intent
    └── b2b-design-prompts/           # Built-in style prompt pool
        ├── _template.md
        ├── stripe.md
        ├── linear.md
        ├── google-style.md
        ├── hud-dark-style.md
        ├── minimal-dark.md
        └── saas-style-01.md
```

## Installation

### Claude Code (Project-level)

```bash
mkdir -p .claude/skills
cp -R design-anchor .claude/skills/design-anchor
```

### Claude Code (Personal Global)

```bash
cp -R design-anchor ~/.claude/skills/design-anchor
```

### Claude.ai Upload

Package from the repo root:

```bash
zip -r design-anchor.zip design-anchor -x "*/.DS_Store"
```

Upload the zip file. The zip must contain `design-anchor/SKILL.md` at the top level, not a bare `SKILL.md`.

## Runtime Model

The skill itself is an AI instruction layer; the actual runtime is provided by the `design-anchor` npm package. File boundaries in a consumer project:

| Layer | Location | Git Strategy |
|---|---|---|
| User component source | `src/components/anchor-ui/` | Commit |
| Design tokens | `src/design-tokens/tokens.json` | Commit |
| Generated token CSS | `src/styles/design-tokens.generated.css` | Commit |
| Local control plane | `.anchor/` | Do not commit (rebuild with `hydrate`) |
| AI coding rules | `AGENTS.md` / `CLAUDE.md` / `.cursor/rules/` | Commit as needed |

Business code imports from `@design` or `@/components/anchor-ui` only. Never import from `.anchor/` or `node_modules/design-anchor/` deep paths.

## Existing Product Governance

When the probe script detects a mature product, the skill defaults to recommending **layout restructuring**, not conservative token patching:

- **Layout restructuring** (recommended) — Analyze layout, information architecture, component usage, and icon consistency page by page, then rebuild the UI layer while preserving all business logic and data bindings
- **Progressive optimization** — Only fix token compliance, import paths, and raw primitive replacement. Keeps existing layout unchanged
- **Read-only audit** — Scan and report only, no file changes

Layout restructuring is executed page by page, with each page individually confirmed before changes begin.

## Layout Governance Approach

Layout governance is based on **quality principles**, not fixed templates. AI freely designs the best layout for each page's purpose, then verifies the result against these principles:

| Quality Principle | Verification Question |
|---|---|
| Purpose–layout fit | If you described this page's purpose to a designer, would they expect this layout? |
| Information hierarchy | Can the user see the most important content in a 2-second glance? |
| Action hierarchy | Can the user perform their most frequent action within one click of landing? |
| Density–task fit | Does the density serve the task or the aesthetic? |
| Spatial efficiency | If you removed this element, would the user notice or care? |
| Navigation clarity | If the user was teleported to this page, would they know where they are? |
| State completeness | What does this page look like when data is empty, loading, or errored? |

Reference examples cover: data workspaces, detail pages, dashboards, forms, chat/conversational interfaces, canvas/workspaces, agent workflows, settings — as inspiration, not mandatory templates.

## Extending the Prompt Pool

Add a `.md` file under `references/b2b-design-prompts/`. The file must start with standard frontmatter:

```yaml
---
name: "Your Internal Prompt Name"
slug: "your-stable-slug"
user_facing_direction: "User-facing style direction"
best_for:
  - "scenario or product type"
keywords:
  - "matching keyword"
density: "compact | balanced | spacious | command-center"
tone: "focused, trustworthy, friendly"
mode: "light | dark | mixed | either"
---
```

The skill auto-matches user requests against `best_for`, `keywords`, `density`, `tone`, and `mode`. No additional registration needed.

## Quick Command Reference

```bash
npm install -D design-anchor        # Install runtime
npx design-anchor sync              # Background governance activation
npx design-anchor theme <prompt.md> # Style prompt → tokens
npx design-anchor add <component>   # Add component on demand
npx design-anchor audit             # Compliance check
npx design-anchor hydrate           # Rebuild local .anchor
npx design-anchor portal tokens     # Inspect tokens
npx design-anchor portal components # Inspect component library
```

## npm Package Dependencies

The following capabilities require implementation in the `design-anchor` npm package (not achievable at the skill layer alone):

- `npx design-anchor audit` to include layout and icon checking rules
- `sync`-generated AI rule templates to include layout constraints

These do not block the skill's layout governance — the skill's own instructions already guide AI through layout analysis and restructuring.

## License

MIT
