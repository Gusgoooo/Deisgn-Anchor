---
name: design-anchor
description: "Use when a task touches product UI, design prompts, themes, design tokens, component specs, Design Anchor governance, @design components, MCP, sync, audit, layout restructuring, or long-term AI coding consistency. Covers all product types including B2B/SaaS, AI tools, creative tools, and developer tools. Starts by classifying the project and request: detailed prompts are extracted into tokens, incomplete requests are matched to an internal style prompt for a polished first page, and mature existing products are offered layout restructuring as the default governance mode."
---

# Design Anchor Skill

Use this skill as the AI entry layer for Design Anchor. Its first job is to classify the situation: create a polished first page for new or incomplete products, extract tokens from detailed design prompts, or offer layout restructuring as the default governance mode for mature existing products. Its second job is to make the work governable through Design Anchor tokens, components, layout principles, specs, rules, sync, MCP, and audit. This applies to all product types: B2B platforms, SaaS tools, AI products, creative tools, developer tools, and any interface where users do real work.

The npm package is the actual runtime: it creates project tokens, writes generated AI rules, manages the local `.anchor` control plane, exposes MCP, installs source components on demand, and runs sync/audit.

Use the internal prompt pool as matching material, not as a visible product section. Do not tell the user a preset name. Tell them the product-facing result: `我帮你匹配到一个适合这个场景的风格方向，会先转成 token，再生成页面。`

## First Move

When a request touches UI, theme, layout, components, tokens, product screens, SaaS/admin systems, AI tools, dashboards, internal tools, creative tools, developer tools, or any product interface, start visibly:

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

## Design Guidance

These rules are constitutional. They override stylistic preferences, user prompts, and internal style matching. Every UI output must pass these checks before delivery.

### Absolute Bans

Never produce these patterns. They are the saturated defaults of AI-generated UI in 2025-2026 — they signal "this was made by AI" to any experienced designer or user. If you find them in existing code during governance, remove them.

1. **Hero metrics grid at page top.** Four identical stat cards with icon + number + label in a 4-column grid as the first thing on a dashboard. This is the single most common AI layout cliché. If the page needs KPIs, vary the card sizes, combine with inline trends, or integrate into the page header.
2. **Identical card grid.** Three or four cards in a row, same height, same structure, same padding, differing only in icon and text. If content is truly parallel, vary the presentation — mix card sizes, use a table, or combine into a richer composite.
3. **Gradient text on headings.** `bg-clip-text text-transparent bg-gradient-to-r` on page titles or section headings.
4. **Decorative glassmorphism.** `backdrop-blur` and semi-transparent backgrounds used as surface treatment without functional purpose (e.g., a frosted sidebar for aesthetics).
5. **Side accent stripes.** Colored left borders on cards or sections used purely as decoration with no semantic meaning.
6. **Marketing hero on a workbench.** Large hero sections with illustrations, taglines, or "Welcome back" messages on pages the user visits 50+ times a day.
7. **Rainbow status colors.** Using 5+ distinct hues for status badges on the same page. Limit to 3-4 semantic colors (success, warning, error, info) and use intensity/shade to distinguish within a category.
8. **Excessive rounded corners.** `rounded-2xl` or `rounded-3xl` on data-dense components like tables, sidebars, or forms. Use the project's border-radius token consistently — usually `rounded-md` or `rounded-lg` for containers.
9. **Empty decorative icons.** An icon on every section heading, every label, every card title — where the icon adds no recognition value and is just visual noise.
10. **Full-width everything.** Every element stretched to 100% width regardless of content — forms where a date picker is as wide as a textarea, inputs that span 1200px.

### Second-Order Slop Test

After producing UI, run this meta-check: the first generation of AI defaults (hero metrics, gradient text, glassmorphism) is now well-known. Avoiding them has created second-order defaults — predictable "anti-AI" patterns that are equally clichéd:

- Replacing card grids with bento grids (asymmetric cards that still contain the same shallow content).
- Replacing gradient text with animated gradient borders.
- Replacing stat cards with oversized single-number displays.
- Replacing sidebar navigation with a floating command palette as the only navigation.
- Using extreme minimalism (nearly invisible borders, 2px text, ghost buttons everywhere) as a reaction against "AI-looking" UI.

If your output matches a second-order default, redesign. The goal is to serve the user's task, not to look anti-AI.

### Color

**Contrast and encoding:**
- All text must meet WCAG 2.1 AA contrast ratio (4.5:1 for normal text, 3:1 for large text). No exceptions.
- Never use gray text lighter than `text-muted-foreground` token. If a token does not exist, create one that passes contrast.
- Color must not be the only way to convey information. Pair color with icons, text, or patterns.

**No hardcoded colors:**
- Do not hardcode hex/rgb/hsl values. Use semantic token classes (`bg-primary`, `text-foreground`, `border-border`).
- Do not use arbitrary Tailwind color values (`bg-blue-500`, `text-gray-600`, `border-slate-200`). Use token-mapped classes.
- Every color in the codebase must trace back to a semantic token. If a component uses a color that has no token, create the token or replace the color.

**Primary color consistency:**
- All primary interactive elements use the same primary token: buttons, links, active navigation, selected items, toggles, checkboxes, radio buttons, progress bars, focus rings.
- A product must have exactly one primary color across all pages. If page A has blue primary buttons and page B has purple primary buttons, this is a governance failure.
- Secondary/accent colors are permitted but must also be tokenized and used consistently. Do not invent per-component accent colors.

**Interactive state tokens:**
- Hover, focus, active, and disabled states must be derived from semantic tokens, not independently hardcoded.
- Wrong: `bg-indigo-500 hover:bg-blue-600` — two unrelated colors for base and hover.
- Right: `bg-primary hover:bg-primary/90` — hover derived from the same token.
- All interactive components must use the same state derivation pattern. If buttons use `hover:bg-primary/90`, links and nav items must use the same hover pattern, not a different opacity or a completely different color.
- Disabled states use a consistent opacity or muted token, not per-component gray values.

**Surface hierarchy:**
- Background surfaces form a clear visual hierarchy using semantic tokens: page background (`bg-background`) → card/container (`bg-card`) → popover/dialog (`bg-popover`) → tooltip.
- Each level must use its semantic token. No arbitrary `bg-gray-50`, `bg-slate-100`, or `bg-zinc-900` scattered across components.
- Sidebar, header, and content area backgrounds must be intentional and consistent — not three random grays that happen to be close.

**Border consistency:**
- One border color token for standard borders (`border-border`), one for input borders (`border-input`), one for focus rings (`ring-ring`).
- Not five different gray values across components. If a card uses `border-gray-200`, a table uses `border-slate-300`, and a dialog uses `border-neutral-200`, this is a governance failure — all must use `border-border`.

**Text color tiers:**
- Three tiers only: primary text (`text-foreground`), secondary/muted text (`text-muted-foreground`), disabled text.
- Labels, headings, and body text use `text-foreground`. Descriptions, timestamps, and supplementary info use `text-muted-foreground`.
- Do not create ad-hoc text color variations (`text-gray-500` here, `text-slate-400` there, `text-zinc-600` elsewhere). Map them all to the appropriate tier token.

**Status color discipline:**
- Four semantic status categories: success (green), warning (amber/yellow), error/destructive (red), info (blue).
- Each category has tokenized variants for background, text, and border: `bg-destructive`, `text-destructive`, `border-destructive`.
- Do not mix shades within a category. Wrong: `text-red-500` for error text but `bg-rose-100` for error background and `border-red-300` for error border — these should all be semantic tokens from the same destructive palette.
- Do not invent new status color categories. If you need a "pending" or "draft" state, use `muted` tokens or an existing category with a label, not a new color.

**Dark mode:**
- Dark mode is not "invert all colors." Dark surfaces need adjusted contrast ratios, reduced saturation, and elevated surface layers.
- Every semantic token must have a dark mode value. No components that break in dark mode because they used a hardcoded light-theme color.
- Test all surface hierarchy levels in dark mode — the visual distinction between background layers must remain clear.

### Typography

- Body text line width: 55-75 characters (roughly `max-w-prose`). Never let body text run full-width on large screens.
- Heading hierarchy must be visually obvious without reading the text. If h2 and h3 look the same, the hierarchy fails.
- Maximum 2 font families per project. One is usually enough.
- Never use ALL CAPS for body text or long labels. Acceptable only for short badges, overlines, or button text.
- Font sizes below 12px are unreadable for most users. Do not go smaller.

### Interaction

- Every clickable element must have a visible hover state and focus state.
- Destructive actions (delete, remove, reset) must be visually distinct (destructive variant) and require confirmation for irreversible operations.
- Loading states must be visible — never leave the user wondering if something is happening. Use skeleton screens for content areas, spinners for actions.
- Disabled elements must look disabled and explain why (tooltip or adjacent text).
- Dropdown menus and popovers must handle viewport overflow — if there is not enough space below, open above.

### Accessibility

- All form inputs must have associated `<label>` elements — no placeholder-only labels.
- All images must have `alt` text — empty `alt=""` only for purely decorative images.
- Interactive elements must be keyboard-reachable (tab order) and operable (enter/space).
- Focus indicators must be visible. Do not remove the default focus ring without providing a custom one.
- `prefers-reduced-motion` must be respected — skip or simplify animations when the user requests it.

### Production Quality Bar

Every UI output must meet this minimum bar before delivery. If any item fails, fix it before reporting the task as complete.

1. All text passes WCAG AA contrast.
2. Every interactive element has hover and focus states.
3. Empty state, loading state, and error state are handled — not blank areas or console errors.
4. Layout does not break at common viewport widths (320px, 768px, 1024px, 1440px).
5. No hardcoded colors — all colors use semantic tokens.
6. Primary color is consistent — all primary buttons, links, active states, and focus rings use the same `primary` token across every page.
7. Interactive states (hover, focus, active, disabled) are token-derived and consistent across all components.
8. No mixed icon libraries.
9. All form fields have visible labels.
10. Destructive actions are visually distinguished and gated.
11. Keyboard navigation works for all interactive elements.
12. Page renders without layout shift (no elements jumping after load).

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

For a mature existing product, do not start rewriting or normalizing UI automatically. Read `references/govern-existing-product.md` and recommend layout restructuring as the default. Ask for explicit confirmation.

For a detailed design prompt, do not ask style-matching questions. Save the prompt and run token extraction.

For incomplete input, ask one concise heuristic question when needed. Prefer choices that sound like product direction, not preset names:

`我先给你匹配一个适合的风格方向。你更想要：高效紧凑、稳重可信、清爽友好、深色专注，还是实时指挥感？`

If the user does not answer or the task should move fast, infer from product context and continue.

Read `references/style-source-selection.md` before matching an internal style prompt.

### Mature Existing Product Governance

Use this when the project appears complete or already has substantial product UI. This mode governs an existing product with layout restructuring as the default recommendation.

Before any file changes:

1. Run read-only inspection including layout analysis, icon audit, and information architecture assessment.
2. Present the situation with confidence: the product will benefit from layout restructuring, not just token fixes.
3. Recommend a new git branch.
4. Offer exactly these choices:
   - `布局重构`（推荐）: read each page, classify screen type, restructure layout, replace components, unify icons, reorder information architecture. Preserves all business logic and data bindings.
   - `渐进优化`: only fix token compliance, import paths, and raw primitive replacement. Keeps existing layout unchanged.
   - `只读审计`: scan and report only; no file changes.
5. Wait for the user to confirm. Do not treat silence, vague approval, or a different feature request as consent.

Allowed explicit confirmations include phrases such as `确认，开始重构`, `开始布局重构`, `restructure`, `渐进优化`, `只读审计`, or `我同意，开始`.

When confirmed, use `references/govern-existing-product.md` as the execution prompt — it is self-contained with inline layout principles, component standards, and audit criteria. For layout restructuring, work one page at a time with per-page confirmation.

### Detailed Prompt To Tokens

Use this when the user provides a design prompt, brand direction, visual recipe, copied style prompt, or asks to extract tokens from style language.

1. Ensure the runtime is installed and synced.
2. Save the prompt into a project-local markdown file, such as `design-prompt.md` or `.anchor/design-prompt-source.md`.
3. Run `npx design-anchor theme <prompt-file.md>`.
4. Treat the extracted aesthetic as a light layer for density, hierarchy, rhythm, surface tone, and atmosphere.
5. Keep component specs, semantic tokens, accessibility, and product workflow stronger than the prompt.
6. Run `npx design-anchor sync`; run `npx design-anchor audit` when UI changed.

Read `references/style-prompt-guidance.md` before using a style prompt.

### Incomplete Request To Matched Prompt

Use this when the user gives a vague product need, such as `做一个 CRM 后台`, `做个审批系统`, `做个数据看板`, `做一个 AI 助手`, `做个聊天工具`, or only provides partial product context.

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

### First Product Page

Use this when the user asks for any product interface: admin system, dashboard, SaaS app, AI assistant, chat tool, CRM, internal tool, developer tool, creative tool, monitoring console, or any functional product screen.

1. Infer roles, objects, workflows, page purpose, and density from the request.
2. Ensure there is an active style source: either the user's detailed prompt or an internally matched prompt.
3. Build the actual usable screen or flow, not a marketing landing page.
4. Read `references/layout-governance.md` and apply layout quality principles. Design the best layout for this page's purpose — do not force-fit a template.
5. Make the first page feel impressive through information architecture, density, layout rhythm, meaningful data, state design, and interaction affordances.
6. Compose from existing `@design` components and add only the missing components.
7. Keep the look purposeful: polished and memorable, but not decorative-heavy.

Read `references/b2b-product-context.md` before creating product screens.

### Design System Inspection

Use Portal only when the user asks to view, tune, inspect, audit, or document the design system state. Read `references/portal-routing.md` when routing is ambiguous.

## UI Coding Rules

Before writing UI, inspect `@design`, `src/components/anchor-ui`, project tokens, component specs, and the current page layout when available.

### Component Rules

- Prefer imports from `@design`; otherwise use `@/components/anchor-ui`.
- Do not import component implementations from `.anchor/` or `node_modules/design-anchor/`.
- Add only needed components with `npx design-anchor add <component>`.
- Use Design Anchor components instead of raw governed primitives such as buttons, inputs, dialogs, tabs, selects, tables, cards, and menus.
- Use semantic token classes such as `bg-primary`, `text-muted-foreground`, `border-border`, and `rounded-lg`.
- Do not hardcode colors or arbitrary token-sensitive Tailwind values.
- Keep component implementation changes in `src/components/anchor-ui/`.
- Keep token edits in `src/design-tokens/tokens.json`, then sync generated CSS/rules.

### Component Replacement Rules (Enforced)

When encountering substandard components during editing or governance, **do not report — replace immediately.** Read `references/layout-governance.md` Component Quality Standards section for the full replacement specification.

Substandard means: raw HTML where a governed component exists, visually broken or inconsistent implementations, components that violate accessibility or interaction conventions, or custom implementations that duplicate what Design Anchor already provides.

**All component replacements must go through Design Anchor.** Do not introduce external component libraries directly — Design Anchor is the single entry point for governed components.

Replacement flow:
1. Check if the component already exists in `@design` or `src/components/anchor-ui/`.
2. If not, run `npx design-anchor add <component>` to install from Design Anchor's component registry.
3. If Design Anchor does not have the component yet, write a new one in `src/components/anchor-ui/` that conforms to Design Anchor conventions (composable API, semantic token styling, accessibility). Then run `npx design-anchor sync` to register it and generate its spec.
4. **Never** install Radix, cmdk, @tanstack/react-table, or other UI primitives as direct project dependencies just because a component needs them. Design Anchor bundles its own primitives — the `add` command handles the dependency chain.

Key components that must meet Design Anchor quality standards — replace on sight if they do not:

- **Sidebar / Navigation**: `npx design-anchor add sidebar`. Must be collapsible, grouped sections, active state, consistent icons, responsive drawer on mobile.
- **Data Table**: `npx design-anchor add table`. Must have sortable headers, row selection, status badges, row action dropdown (not inline icons), pagination, empty/loading states.
- **Form fields**: `npx design-anchor add input select textarea checkbox switch`. Must have visible labels, inline validation, section grouping, sticky submit bar.
- **Dialog / Modal**: `npx design-anchor add dialog alert-dialog`. Must have focus trap, escape-to-close, overlay, accessible title.
- **Command Palette**: `npx design-anchor add command`. Must have Cmd/Ctrl+K, keyboard nav, fuzzy filtering, grouped results.
- **Tabs**: `npx design-anchor add tabs`. Must have keyboard arrow navigation, active indicator, ARIA roles.
- **App Shell**: `npx design-anchor add sidebar` + project layout in `src/components/anchor-ui/app-shell.tsx`. Must provide consistent header + sidebar + content structure with responsive collapse.

After every component replacement, verify with `npx design-anchor audit` and check the component spec at `.anchor/src/anchor/schema/components/`.

When replacing:

`Design Anchor 组件治理：[component] 不符合规范，已通过 design-anchor add 替换为标准实现。`

### Layout Rules

Read `references/layout-governance.md` when building or modifying any page. Design the best layout for each page's purpose — do not force-fit templates.

- Identify the page's primary user task before choosing a layout. The layout serves the task.
- Primary content gets primary space. A data table that is the page's purpose should not be squeezed by a wide sidebar or tall header. A chat interface should not waste space on persistent sidebars.
- High-frequency actions go where the user can reach them without scrolling.
- Status is always visible — the user should never need to click to discover current state.
- Related information stays together in the same visual group.
- Match density to task: monitoring is dense, content consumption is focused, creative workspaces minimize chrome.
- Use progressive disclosure: show the summary, let the user drill down.
- Consistent shell across pages: sidebar, header, and content area should not shift between pages unless there is a deliberate mode change.
- Use reference examples in `layout-governance.md` as inspiration, not as mandatory patterns.

### Icon Rules

- One icon library per project. Recommend `lucide-react` for new projects.
- Consistent size: pick a base size (16, 20, or 24px) and use it everywhere except explicit variants.
- Do not mix outline and filled icon styles in the same context.
- Icon + label for primary actions; icon-only for secondary/repeated actions with tooltips.
- Remove decorative icons that add no recognition value.

### Information Architecture Rules

- Section ordering follows user workflow priority, not data model structure.
- Page header contains identity (title, status) and primary actions — nothing else.
- Filters and search are always visible on list pages, never hidden behind toggles.
- Danger zones and destructive actions go at the bottom, visually separated.
- Empty states, loading states, and error states are designed, not afterthoughts.

If you encounter unsafe UI while editing, fix it in the current task and say:

`Design Anchor 自动治理：已改为组件或语义 token。`

If you encounter a layout that violates the quality principles in `layout-governance.md`, restructure it and say:

`Design Anchor 布局治理：已根据页面用途重构布局。`

Whenever UI changed, include a final line starting with `Design Anchor 自检` that covers layout quality, component reuse, icon consistency, token compliance, auto-fixes, unresolved confirmations, and sync/audit status.

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
- `references/layout-governance.md` before analyzing, auditing, or restructuring any page layout. Contains layout quality principles, reference examples for common page types (including AI product interfaces), icon governance rules, and information architecture principles.
- `references/b2b-product-context.md` before creating product screens. Covers all product types including AI tools, creative tools, and developer tools.
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
