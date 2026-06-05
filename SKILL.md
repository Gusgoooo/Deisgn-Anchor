---
name: design-anchor
description: "从第一个页面的设计落地，到第一百个页面的设计一致性，Design Anchor 覆盖设计的完整生命周期：开始、维护、审查、修改。"
allowed-tools:
  - Bash
  - Read
  - Write
compatibility:
  - "Node.js >= 18"
  - "design-anchor npm package"
---

# Design Anchor Skill

Use this skill as the AI entry layer for Design Anchor. Its first job is to classify the situation: create a polished first page for new or incomplete products, extract tokens from detailed design prompts, or offer layout restructuring as the default governance mode for mature existing products. Its second job is to make the work visually consistent through the Design Anchor **token system** — the single structural constraint that ensures color, typography, and spacing coherence across pages, while leaving all component design and visual creativity completely free. This applies to all product types: SaaS tools, AI products, creative tools, developer tools, consumer apps, and any interface where users do real work.

The npm package is the actual runtime: it creates project tokens, writes generated AI rules, manages the local `.anchor` control plane, exposes MCP, installs source components on demand, and runs sync/audit.

Use the internal prompt pool as matching material, not as a visible product section. Do not tell the user a preset name. Tell them the product-facing result: `我帮你匹配到一个适合这个场景的风格方向，会先转成 token，再生成页面。`

## First Move

When a request touches UI, theme, layout, components, tokens, product screens, SaaS/admin systems, AI tools, dashboards, internal tools, creative tools, developer tools, or any product interface, execute these steps in order:

**Step 1 — Announce:**

`Design Anchor 预检：我会先判断项目成熟度和需求完整度；新页面会先匹配/抽取风格 token，已有完整产品会先征求你确认是否进入治理模式。`

**Step 2 — Probe:**

```bash
node "${CLAUDE_SKILL_DIR:-skills/design-anchor}/scripts/probe-design-anchor.mjs" .
```

If `CLAUDE_SKILL_DIR` is unavailable and the command cannot resolve, run the same script by absolute path from this skill directory.

**Step 3 — Install runtime if missing:**

If the probe shows `design-anchor` is not installed (no `node_modules/design-anchor`), install it immediately before any UI work:

```bash
# Detect package manager from lockfiles, then:
npm install -D design-anchor && npx design-anchor sync
# or pnpm/yarn/bun equivalent — see Activation Contract below
```

This is not optional. The runtime provides token CSS generation, AI coding rules, and the `.anchor` control plane. Without it, token governance has no enforcement mechanism.

**Step 4 — Route to the appropriate flow** based on the probe result and request (see Input Router below).

## Product Model

Keep the current Design Anchor boundaries clear:

- `design-anchor` is installed as a project dev dependency and called by AI tools or scripts.
- `.anchor/` is a local, gitignored, rebuildable control plane. Do not import runtime UI from it.
- **Token system is the structural constraint.** Design tokens live in `src/design-tokens/tokens.json`; generated CSS lives in `src/styles/design-tokens.generated.css`. All structural colors must reference token CSS variables.
- **Functional components** (dialog, command, select, popover, etc.) are installed on demand with `npx design-anchor add <component>` and imported from `@design` or `@/components/anchor-ui/`. These provide accessibility and interaction behavior.
- **Presentational components** (cards, sections, layouts, navigation appearance, data displays, etc.) are freely designed by AI. No mandatory library. Style prompt drives the visual direction.
- User-written components live in `src/components/` and are committed.
- Internal style prompts may be used to bootstrap a polished first page when the user's input is incomplete.
- Internal prompt matching is not a visible preset board or product section.
- There is no mandatory Portal reveal.

## Design Guidance

These rules are constitutional. They override stylistic preferences, user prompts, and internal style matching. Every UI output must pass these checks before delivery.

### AI Pattern Awareness

Be aware of common AI-generated UI patterns that can make output feel generic. These are not bans — a good designer might use any of these intentionally. The problem is when they appear by default, without thought:

- **Turning a Functional page into a Showcase page** — this is the #1 sin. An AI agent workspace with a hero section, a dashboard with feature cards, a settings page with CTA blocks. The style prompt makes things look good; it does not change what the page IS.
- Four identical stat cards in a row as the first element on every dashboard
- Three cards in a grid, same height/structure, differing only in icon and text
- Gradient text on headings as a default decorative choice
- `backdrop-blur` glassmorphism used everywhere without purpose
- Colored left borders on every card as generic decoration
- "Welcome back" hero sections on frequently-visited workbench pages
- 5+ different hues for status badges on a single page
- `rounded-2xl` or `rounded-3xl` on data-dense components
- An icon on every heading/label/title where it adds no recognition value
- Every element stretched to 100% width regardless of content

**The test is intent.** If a pattern serves the page's purpose and the user's task, use it. If it's there because it's the first thing that comes to mind, find a better solution. Design for the specific product, not for a generic "modern dashboard."

### Visual Quality Priority

Token governance exists to enforce structural consistency — not to strip visual richness. A governed product must look MORE polished and appealing than before governance, never less. If a page looks black-and-white, monochrome, or "wireframe-like" after governance, the governance failed.

**Style prompt drives beauty.** The style prompt (user-provided or internally matched) defines the product's visual soul: color palette richness, gradient usage, shadow depth, surface treatment, accent tones, illustration style. Token governance then locks the structural anchors (primary, CTA, status) so they stay consistent across pages — but it does NOT replace every color in the codebase with a token reference.

**Functional components provide behavior, not aesthetics.** Design Anchor's functional components (dialog, command, select, etc.) ensure interaction quality (accessibility, keyboard nav, focus management). All visual beauty — color richness, spacing rhythm, typographic feel, surface depth, component appearance — comes from the style prompt and AI's design creativity. Do not expect any component library to make pages beautiful. Beauty comes from design, not from library defaults.

**Design personality is mandatory.** Every product must have visible design personality from its style prompt: distinctive color palette, intentional typography pairing, specific shadow/depth treatment, and 2-3 signature elements that make it recognizable. If the generated page looks like a generic Tailwind/shadcn default, the style prompt was not applied deeply enough.

A comprehensive style prompt covers: design philosophy, color strategy with specific hex values, typography system with font pairings, surface and depth approach, component visual styling specifications, effects and micro-interactions, signature bold elements, and style-specific anti-patterns. Thin prompts (just mood keywords) produce thin visuals. See `references/style-prompt-guidance.md` and `references/design-prompts/_template.md` for the full specification.

**Balance rule:** After any governance action, the page should look at least as visually appealing as before. If governance made it look worse (plainer, less colorful, more generic), undo the visual regression and preserve the original aesthetic choices while only fixing the structural anchors.

### Color

Color governance targets **structural anchors only** — the handful of colors that must be consistent across the entire product. All other colors (decorative accents, illustration colors, page-specific backgrounds, gradients, shadows) are intentional design choices and should be preserved.

**What to govern (structural anchors):**
- Primary interactive color: buttons, links, active nav, selected states, toggles, checkboxes, focus rings → must all use the same `primary` token.
- CTA / call-to-action elements → must align with primary or a designated accent token.
- Status colors: success, warning, error, info → must use semantic tokens (`bg-destructive`, `text-destructive`, etc.) consistently.
- Base text colors: primary text (`text-foreground`), secondary text (`text-muted-foreground`) → must be consistent across pages.
- Interactive states: hover, focus, active, disabled → must be derived from the base token, not independently hardcoded. Wrong: `bg-indigo-500 hover:bg-blue-600`. Right: `bg-primary hover:bg-primary/90`.

**What NOT to govern (preserve as-is):**
- Page-specific decorative colors, accent backgrounds, gradients, and shadows that contribute to visual richness.
- Illustration and data visualization colors.
- Tailwind utility colors used for intentional one-off styling (a specific card background tint, a subtle highlight).
- Colors in third-party embedded content.
- Any color that is clearly an intentional design choice rather than an accidental inconsistency.

**How to distinguish:** An accidental inconsistency is when the same semantic concept (e.g., "primary button") appears in two different colors across pages. An intentional design choice is when a specific element has a unique color for a clear visual reason (e.g., a warm background on a welcome section, a gradient on a feature card). When in doubt, preserve the existing color — do not convert it to a token.

**How to find and fix:** For existing products, use `grep` to scan for hardcoded Tailwind color classes (e.g., `bg-blue-600`, `text-gray-900`) and classify each match as structural (replace with token) or decorative (keep). Build a replacement map (e.g., `bg-indigo-600` → `bg-primary`), verify `tokens.json` has matching values, then execute. See `govern-existing-product.md` for the complete 5-step Token Identification and Replacement Execution flow.

**Contrast and encoding:**
- All text must meet WCAG 2.1 AA contrast ratio (4.5:1 for normal text, 3:1 for large text).
- Color must not be the only way to convey information. Pair color with icons, text, or patterns.

**Dark mode** — see the Dark Mode section above for full implementation spec. Key points:
- Structural anchor tokens must have dark mode values defined in `tokens.json`.
- Decorative colors that break in dark mode should be adjusted — replace with dark-mode-appropriate equivalents that maintain the same visual richness, not stripped.
- After completing a page, proactively ask the user if they want dark mode enabled.

### Responsive Design (自适应)

Every page must work across common viewport widths. This is not optional polish — it is part of the initial build.

**Breakpoints (Tailwind default):**

| Breakpoint | Width | Typical Device |
|---|---|---|
| Base (mobile-first) | < 640px | Phone |
| `sm` | ≥ 640px | Large phone / small tablet |
| `md` | ≥ 768px | Tablet |
| `lg` | ≥ 1024px | Laptop |
| `xl` | ≥ 1280px | Desktop |
| `2xl` | ≥ 1536px | Large desktop |

**Layout adaptation rules:**

- **Sidebar**: collapsed or hidden below `lg`. On mobile (`< md`), sidebar becomes a sheet/drawer overlay triggered by a hamburger button. Use Design Anchor `sheet` for the overlay.
- **Multi-column grids**: collapse to single column below `md`. Two-column grids may persist at `sm` if content fits.
- **Data tables**: horizontal scroll with sticky first column below `lg`. Optionally switch to card-based layout below `md`.
- **Split views** (master-detail): stack vertically below `md`. Show list first, detail on tap/click.
- **Forms**: single column below `sm`. Two-column short-field pairs (first name + last name) only above `sm`.
- **Charts and visualizations**: simplify or stack below `md`. Never let charts overflow horizontally.
- **Fixed/sticky elements**: header stays sticky. Sidebar collapse control always accessible. Submit buttons in sticky footer on mobile.
- **Touch targets**: minimum 44×44px on mobile. Interactive elements have adequate spacing to prevent mis-taps.
- **Typography**: body text stays within 55-75 character line width on large screens (`max-w-prose` or equivalent). On mobile, full-width with appropriate padding.

**Implementation approach:**
- Write mobile-first CSS. Base styles are for mobile; use `sm:`, `md:`, `lg:` to add complexity.
- Test at 320px, 768px, 1024px, 1440px — these are the four checkpoints in the Production Quality Bar.
- Use Tailwind responsive utilities, not custom media queries.
- Container queries (`@container`) are acceptable for component-level responsiveness.

### Dark Mode (暗色模式)

**Proactive prompt:** After generating the first page or completing a governance pass, ask the user:

`页面已完成。需要我顺便做一个暗色模式吗？会基于 token 系统实现，一套代码自动适配。`

If the user confirms, implement dark mode using the token system:

**Token-based dark mode implementation:**
1. Define dark mode values for all structural tokens in `tokens.json`:
   - `--background` → dark surface (e.g., `#0a0a0a` or `#121212`)
   - `--foreground` → light text (e.g., `#fafafa`)
   - `--primary` → same hue, adjusted brightness for dark backgrounds
   - `--muted` / `--muted-foreground` → dark-appropriate muted values
   - `--card` / `--popover` → slightly elevated dark surfaces
   - `--border` → subtle dark borders (e.g., `#27272a`)
   - `--destructive` / status colors → adjusted for dark background contrast
2. Use CSS `prefers-color-scheme: dark` or a class-based toggle (`.dark`) depending on project setup.
3. All structural colors already reference token CSS variables — dark mode swaps the variable values, not the code.
4. **Decorative colors must also work in dark mode.** Light-mode-only decorative colors (pastel backgrounds, light gradients) need dark-mode equivalents that maintain the same visual richness — not stripped, but adapted.
5. Verify WCAG AA contrast in both modes.
6. Run `npx design-anchor sync` after updating dark mode tokens.

**What NOT to do:**
- Do not add `dark:` prefixes to every Tailwind class manually. Use token CSS variables so dark mode is automatic.
- Do not make dark mode an afterthought with washed-out colors. Dark mode should look intentionally designed, not just inverted.
- Do not break decorative elements — gradients, shadows, accent tints should have dark-mode-appropriate equivalents.

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

1. **Visual polish** — the page looks polished, colorful, and appealing. Not a wireframe, not black-and-white, not a plain skeleton. The page has visible design personality from the style prompt.
2. All text passes WCAG AA contrast.
3. Every interactive element has hover and focus states.
4. Empty state, loading state, and error state are handled — not blank areas or console errors.
5. **Responsive** — layout adapts correctly at 320px, 768px, 1024px, 1440px. Sidebar collapses below `lg`, tables adapt below `md`, grids stack on mobile, touch targets ≥ 44px.
6. **Token compliance** — structural anchor colors (primary, CTA, status, base text) reference token CSS variables consistently across pages. Decorative colors are free.
7. Primary color is consistent — all primary buttons, links, active states, and focus rings use the same `primary` token across every page.
8. Interactive states (hover, focus, active, disabled) are token-derived and consistent.
9. No mixed icon libraries.
10. All form fields have visible labels.
11. Destructive actions are visually distinguished and gated.
12. Keyboard navigation works for all interactive elements.
13. Page renders without layout shift (no elements jumping after load).

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
2. **Match a style prompt for beautification.** Even for existing products, select an appropriate prompt from the prompt pool (via `scripts/list-style-prompts.mjs` or scanning `references/design-prompts/*.md`) based on the product's type, tone, and density. If the user has provided style direction, use that instead. If a design prompt source already exists in the project (`.anchor/design-prompt-source.md` or `design-prompt.md`), reuse it. This prompt drives the page-level beautification phase after structural governance.
3. Present the situation with confidence: the product will benefit from layout restructuring, not just token fixes.
4. Recommend a new git branch.
5. Offer exactly these choices:
   - `布局重构`（推荐）: read each page, extract content and business logic, completely redesign layout and visual presentation using style prompt. Only functional components (dialog, command, etc.) from Design Anchor; all presentational components freely designed. Token system constrains structural colors.
   - `渐进优化`: only fix token compliance for structural anchor colors. Keeps existing layout and components unchanged.
   - `只读审计`: scan and report only; no file changes.
6. Wait for the user to confirm. Do not treat silence, vague approval, or a different feature request as consent.

Allowed explicit confirmations include phrases such as `确认，开始重构`, `开始布局重构`, `restructure`, `渐进优化`, `只读审计`, or `我同意，开始`.

When confirmed, use `references/govern-existing-product.md` as the execution prompt — it is self-contained with inline layout principles, component strategy, token identification/replacement execution, and audit criteria. For layout restructuring, work one page at a time with per-page confirmation. **Token replacement is not optional** — use the concrete scan-classify-map-replace flow in that file to find and fix every hardcoded structural color.

### Detailed Prompt To Tokens

Use this when the user provides a design prompt, brand direction, visual recipe, copied style prompt, or asks to extract tokens from style language.

1. Ensure the runtime is installed and synced.
2. Save the prompt into a project-local markdown file, such as `design-prompt.md` or `.anchor/design-prompt-source.md`.
3. Run `npx design-anchor theme <prompt-file.md>`.
4. Apply the extracted aesthetic as the visual foundation: color palette, typography, shadow/depth, component styling, signature elements. The style prompt drives every visual decision within structural constraints (accessibility, layout governance, component interaction quality).
5. Run `npx design-anchor sync`; run `npx design-anchor audit` when UI changed.

Read `references/style-prompt-guidance.md` before using a style prompt.

### Incomplete Request To Matched Prompt

Use this when the user gives a vague product need, such as `做一个 CRM 后台`, `做个审批系统`, `做个数据看板`, `做一个 AI 助手`, `做个聊天工具`, or only provides partial product context.

1. Infer roles, objects, workflows, page type, and density from the request.
2. Use heuristic Q&A only if the missing answer would change the style or workflow.
3. List available prompt files with `scripts/list-style-prompts.mjs` or by scanning `references/design-prompts/*.md`.
4. Select the best internal prompt using each file's frontmatter scenario metadata.
5. Load only the selected file under `references/design-prompts/`.
6. Do not reveal the preset name; tell the user you matched an appropriate direction.
7. Save that prompt into a project-local markdown file, such as `.anchor/design-prompt-source.md`.
8. Run `npx design-anchor theme <prompt-file.md>`.
9. Generate the first polished page using extracted tokens, product context, and the Page Rendering Pipeline (layout → components → styling).
10. Run `npx design-anchor sync`; run `npx design-anchor audit` when UI changed.

### First Product Page

Use this when the user asks for any product interface: admin system, dashboard, SaaS app, AI assistant, chat tool, CRM, internal tool, developer tool, creative tool, monitoring console, or any functional product screen.

**Follow the Page Rendering Pipeline (three phases in order):**

1. **Phase 1 — Layout Blueprint:** Infer roles, objects, workflows, page purpose, and density. Select the appropriate layout block. Read `references/layout-governance.md` and apply layout quality principles. Define the spatial structure.
2. **Phase 2 — Component Composition:** Freely design presentational components for each layout slot. Use Design Anchor only for functional primitives (dialog, command, select, etc.). Enhance key moments with effect libraries (MagicUI, Reactbits). All structural colors reference token CSS variables.
3. **Phase 3 — Visual Styling:** Ensure a comprehensive style prompt is active (user-provided or internally matched). Apply the full visual personality: color palette, typography, shadow/depth, signature elements, decorative touches.

The first page must feel impressive — not through decorative excess, but through visual personality, confident composition, effect-enhanced key moments, meaningful data, and polished states.

Read `references/product-context.md` before creating product screens.

### Design System Inspection

Use Portal only when the user asks to view, tune, inspect, audit, or document the design system state. Read `references/portal-routing.md` when routing is ambiguous.

## Page Rendering Pipeline

Every page — whether new or restructured — follows three phases in strict order. Do not skip phases or mix their concerns.

### Phase 1: Layout Blueprint (布局蓝图)

Determine the page's spatial structure before touching any component or color. This phase answers: what goes where.

1. **Classify page nature — this gates everything else.**

   | Nature | Description | Layout follows | Style prompt scope |
   |---|---|---|---|
   | **Functional（工具型）** | User is doing work: browsing data, chatting with AI, configuring settings, monitoring, editing, reviewing, building | Task workflow | Visual skin only — colors, typography, shadows, radius, spacing |
   | **Showcase（展示型）** | User is being informed or persuaded: landing page, product tour, marketing, onboarding intro | Storytelling flow | Full creative freedom including hero, CTA, feature sections |

   **Most pages in a product are Functional.** An AI agent workspace, a dashboard, a settings page, a chat interface, a data table — these are all Functional. They exist to help the user accomplish a task, not to sell the product.

   **Showcase pages are rare.** They are the landing page, the pricing page, the "what's new" page. They are explicitly about presenting information to persuade or inform, not about getting work done.

   **When in doubt, it is Functional.** The default assumption is that the user wants a working tool, not a marketing page. Only classify as Showcase when the page's explicit purpose is presentation or persuasion.

   **Critical rule: a Functional page must NEVER be styled as a Showcase page.** No hero sections on a dashboard. No feature cards on a settings page. No CTA blocks on a chat interface. No marketing-style copy on a monitoring console. The style prompt shapes how the tool looks — it does not turn the tool into a brochure.

2. **Identify page purpose.** Read `references/product-context.md` to classify: consumption, collection management, single record focus, creation/editing, configuration, conversation, canvas, or workflow orchestration.
3. **Select a layout block and match an open-source block as the structural scaffold.**

   First, identify the layout block type:

   | Block | Structure | When to Use |
   |---|---|---|
   | **Dashboard** | stats header → chart/visualization area → data table | Monitoring, analytics, overview pages |
   | **List** | search/filter bar → data table/grid → pagination | Collection browsing, queues, inboxes |
   | **Detail** | entity header (title + status + actions) → content sections → related items (sidebar or bottom) | Single record, profile, order, ticket view |
   | **Form** | section groups → field clusters → sticky submit bar | Creation, editing, settings with many fields |
   | **Settings** | sidebar category nav → content panel | Configuration, preferences, account |
   | **Chat** | conversation area (scrollable) → input bar (bottom-fixed) → optional side panel | Messaging, AI assistant, support |
   | **Canvas** | toolbar (top/side) → workspace (center, maximized) → properties panel (collapsible right) | Editor, builder, whiteboard, design tool |
   | **Split** | master list (left) → detail panel (right) | Email, file manager, two-pane navigation |

   Then, **immediately install a matching shadcn block** as the page's structural scaffold.

   **How to install shadcn blocks:**

   ```bash
   npx shadcn@latest add <block-name>
   ```

   shadcn blocks are named by component type + variant number. Browse and select the best variant for the page's needs:

   | Component | Available Blocks | How to Choose |
   |---|---|---|
   | **Sidebar** | `sidebar-01` through `sidebar-15` | Browse variants at ui.shadcn.com/blocks. `sidebar-07` = floating with rounded corners. `sidebar-08` = inset floating. `sidebar-10` = collapsible with submenus. Pick the one closest to the page's navigation needs. |
   | **Dashboard** | `dashboard-01` through `dashboard-07` | Full page compositions. `dashboard-01` = sidebar + charts + table. Pick based on data density and chart needs. |
   | **Login / Auth** | `login-01` through `login-05` | Different layouts: centered card, split screen, etc. |
   | **Charts** | `chart-area-*`, `chart-bar-*`, `chart-line-*`, `chart-pie-*`, `chart-radar-*`, `chart-tooltip-*` | Install specific chart types as needed. |
   | **Calendar** | `calendar-*` | Date picker and calendar view variants. |

   **Example — building a page with a floating sidebar:**
   ```bash
   npx shadcn@latest add sidebar-08    # Inset floating sidebar
   npx shadcn@latest add dashboard-03  # Dashboard layout to pair with it
   ```

   **After installing, customize extensively with the style prompt.** The block gives you production-quality structure (layout, spacing, responsive breakpoints, component arrangement, collapse behavior). You then apply the style prompt's colors, typography, shadows, and signature elements to make it look like it was custom-designed for this product.

   **Other open-source block sources** (when shadcn doesn't cover the scenario):

   | Scenario | Source | Install |
   |---|---|---|
   | Extended patterns (kanban, gantt, timeline, file tree, carousel) | **Kibo UI** (kibo-ui.com) | `npx kibo-ui add <block-name>` |
   | Landing / Showcase pages (hero, navbar, footer, pricing, FAQ, bento grid, CTA, stats, logos, testimonials) | **Launch UI** (launchuicomponents.com) | `npx shadcn@latest add @launchui/launchui` (base, run once) then `npx shadcn@latest add @launchui/<block>` |
   | E-commerce (product cards, banners, cart, reviews, address forms, variant selectors) | **Commerce UI** (ui.stackzero.co) | `npx shadcn@latest add https://ui.stackzero.co/r/<block-name>.json` |
   | Admin CRUD, complete admin starter | **shadcn-admin** (github: satnaing/shadcn-admin) | Clone template: `git clone https://github.com/satnaing/shadcn-admin.git` — full app, not composable blocks |

   **Kibo UI blocks:** `npx kibo-ui add gantt`, `kanban`, `timeline`, `file-tree`, `carousel`, `sortable`, `dnd`, `code-block`, `media-player`, `data-table`, `charts`, `calendar`, and more. See kibo-ui.com for full list.

   **Launch UI blocks:** `npx shadcn@latest add @launchui/hero`, `@launchui/navbar`, `@launchui/footer`, `@launchui/stats`, `@launchui/faq`, `@launchui/cta`, `@launchui/logos`, `@launchui/badge`, `@launchui/button`, `@launchui/card`, `@launchui/screenshot`, `@launchui/mockup`, `@launchui/glow`. Each has multiple variants — pick the variant that matches the page's layout needs.

   **Commerce UI blocks:** `npx shadcn@latest add https://ui.stackzero.co/r/product-card-01-block.json` (product cards 01–13), `banner-01-block` through `banner-12-block`, `cart-01-block`, `review-01-block` through `review-10-block`, `product-variant-01-block` through `product-variant-05-block`, `address-01-block` through `address-03-block`.

   **This is not optional inspiration — it is the default workflow.** Always check if a shadcn block exists for the page type before designing from scratch. The block gives you a skeleton that would take significant effort to recreate — responsive sidebar collapse, proper scroll management, chart integration, data table layout — all production-quality out of the box.

   Only design from scratch when no existing block matches the page's specific requirements. Even then, combine patterns from multiple blocks rather than starting from zero.

   Modify blocks freely — add sections, remove sections, rearrange — based on the page's actual needs. The block is a structural starting point, not a rigid template.

4. **Define section ordering** by user workflow priority — not by data model structure.
5. **Set density** to match the task: dense for monitoring, balanced for CRUD, focused for content, minimal for creative work.

Output of Phase 1: a spatial wireframe based on a matched block — section names, positions, and relative sizes. No colors yet, but the structural skeleton is production-quality.

### Phase 2: Component Composition (组件填充)

Fill each layout slot with the right component. This phase answers: what renders in each section.

**Component freedom principle:** AI freely designs and writes all presentational components — cards, sections, headers, stat blocks, navigation appearance, data displays, layouts. No mandatory component library for visual/presentational elements. But "freely designed" does not mean "anything goes" — each presentational component has quality criteria (see `layout-governance.md`). When a component fails its criteria, redesign it.

**Block-first composition:** The page structure comes from Phase 1's matched block. Phase 2 fills each slot in that structure with components — evaluating existing components against quality criteria, redesigning those that fail, and adding missing components for state completeness (empty, loading, error states).

**Functional components — use Design Anchor:**
- Dialog, AlertDialog, Command palette, Select, Dropdown, Popover, Sheet, Tooltip → `npx design-anchor add <component>`.
- These are **interaction primitives** that require focus trap, keyboard navigation, ARIA roles, escape-to-close, overlay management, and other accessibility behavior that is hard to get right from scratch.
- Only functional/behavioral components go through Design Anchor. If a component's value is primarily visual (how it looks), write it freely.

**Effect libraries — encouraged for visual enhancement:**
- MagicUI, Reactbits, or similar libraries for micro-interactions, button feedback, state transitions, loading animations, key interactive moments.
- On Showcase pages only: hero animations, feature section effects, scroll-triggered transitions.
- On Functional pages: effects serve the task (progress indicators, status transitions, hover feedback) — NOT decorative showcasing.
- Install to `src/components/magicui/` or `src/components/effects/`.
- Effects everywhere dilute impact. Use strategically.

**Token constraint on all components:**
- Regardless of how a component is written, structural colors must reference token CSS variables: `var(--primary)`, `var(--background)`, `var(--foreground)`, `var(--destructive)`, etc.
- This ensures that primary buttons, links, active states, and status colors are consistent across the entire product — even though each page's components may look completely different.
- Decorative colors, gradients, shadows, accents, and page-specific treatments are free — no token required.

Output of Phase 2: layout slots filled with components. Functional primitives from Design Anchor, everything else freely designed. All structural colors reference tokens.

### Phase 3: Visual Styling (风格绘制)

Apply the matched style prompt as the aesthetic layer across the entire page. This phase answers: how everything looks and feels as a whole.

**Critical boundary: the style prompt is a visual skin, not a content template.** It controls how things look (colors, typography, shadows, radius, spacing, animation timing, surface treatment). It does NOT control what things are on the page. A style prompt that includes "hero section" or "feature showcase" — those elements only apply to Showcase pages. On Functional pages, ignore any content/layout suggestions from the style prompt and apply only its visual treatment to the existing functional layout from Phase 1.

1. **Ensure a style prompt is active.** Either the user's own prompt, an internally matched prompt from the pool, or the project's existing design prompt source.
2. **Apply color palette** — primary actions, surface tints, accent backgrounds, section colors, status colors. Use the prompt's specific hex values, not generic defaults.
3. **Apply typography** — font pairing, heading weights, body sizes, letter spacing, line height per the prompt's spec.
4. **Apply surface and depth** — shadow approach, border treatment, border radius, surface layering per the prompt's philosophy.
5. **Apply signature elements** — 2-3 distinctive visual choices from the prompt that give the page its recognizable personality.
6. **Apply decorative touches** — subtle section background tints, accent borders, card treatments, gradient accents where the prompt specifies.
7. **Visual Enhancement Pass (视觉增强轮)** — after applying the style prompt's base layer, scan the page for opportunities to add visual polish. This is what separates "functional with colors" from "professionally designed."

   **Surface & Background:**
   - Subtle gradient backgrounds on page or section level (aligned with style prompt palette, not random)
   - Section-to-section color temperature shifts (e.g., slightly warmer or cooler tints between sections)
   - Dot grid, noise texture, or subtle pattern as page background when the style supports it
   - Content area with a slight inset or paper-like surface against the page background

   **Sidebar Enhancement:**
   - Floating sidebar: rounded corners, elevated shadow, margin from page edges — visually separated from the content as its own layer
   - Glassmorphic or tinted sidebar background when the style prompt supports blur/glass effects
   - Sidebar and content area should have visible depth difference — the sidebar is not just a colored column, it's a distinct spatial layer

   **Card & Grid Layout:**
   - Bento-style unequal grid for dashboard metrics — key metrics get larger cards, secondary ones smaller
   - Featured/primary cards with accent background, border highlight, or subtle glow
   - Card hover: micro lift (`translateY(-2px)`) + shadow deepen, transition `ease-out 150ms`
   - Cards with varied visual weight — not all cards identical in size and treatment

   **Borders & Dividers:**
   - Gradient borders on featured elements (primary cards, active sidebar items, hero inputs)
   - Accent color strip or top-border on section headers
   - Refined dividers: hairline with gradient fade-out at edges, not solid full-width lines

   **Depth & Dimension:**
   - Multi-layer shadows on elevated elements (not just `shadow-md` but layered soft + sharp shadows)
   - Clear elevation hierarchy: page bg → card surface → popover/modal → toast
   - Backdrop blur on overlays and floating elements

   **Micro-motion:**
   - Hover lift on interactive cards and buttons (`translateY` + shadow change)
   - Smooth state transitions (`transition-all duration-150 ease-out`) on interactive elements
   - Skeleton shimmer animation on loading states
   - Subtle scale feedback on button press (`active:scale-[0.98]`)

   **Rules for this pass:**
   - Pick 3-5 enhancements per page that best fit the style prompt. Do not apply all of them everywhere.
   - Functional pages: enhancements are subtle and professional. The user should feel "this is polished" without being able to point to why.
   - All enhancements must be consistent with the style prompt's visual direction. A minimal Swiss style gets clean shadows and subtle tints, not glassmorphism and gradient borders.
   - Do not add enhancements that conflict with the page's density. Dense monitoring pages get minimal surface treatment; spacious settings pages can afford more.
   - Dark mode: all enhancements must work in dark mode if enabled. Gradient tints, shadows, and surface treatments need dark-mode-appropriate values.

8. **Verify visual quality** — the page looks professionally designed for this specific product. Run the Visual Quality Checklist from `style-prompt-guidance.md`.

Output of Phase 3: a complete, visually polished page with intentional visual enhancements that looks like it was designed by a professional for this specific product — not just a colored wireframe.

**The three phases are sequential and non-negotiable.** Phase 1 without Phase 3 produces a wireframe. Phase 3 without Phase 1 produces a pretty mess. Phase 2 without Phase 3 produces a generic component library demo.

## UI Coding Rules

Before writing UI, inspect `@design`, `src/components/anchor-ui`, project tokens, component specs, and the current page layout when available.

### Component Rules

**Presentational components — AI freely designs.** Cards, sections, headers, stat blocks, navigation appearance, data displays, hero sections, feature cards, dashboards — write whatever looks best for the product. Use the style prompt as design direction. No mandatory library.

**Functional components — use Design Anchor.** These are interaction primitives where accessibility and behavior are critical:
- `npx design-anchor add dialog alert-dialog` — focus trap, escape-to-close, overlay
- `npx design-anchor add command` — Cmd/Ctrl+K, keyboard nav, fuzzy filtering
- `npx design-anchor add select` — keyboard navigation, ARIA listbox
- `npx design-anchor add popover dropdown-menu` — positioning, viewport overflow
- `npx design-anchor add sheet` — slide-over panel, focus management
- `npx design-anchor add tooltip` — delay, positioning, accessible description
- `npx design-anchor add tabs` — keyboard arrow navigation, ARIA tablist

Functional components from Design Anchor import from `@design` or `@/components/anchor-ui`. Do not import from `.anchor/` or `node_modules/design-anchor/`.

**Token constraint on everything.** Whether a component is freely written or from Design Anchor, structural colors must reference token CSS variables. See the Color section for what counts as structural vs decorative.

**Effect libraries are encouraged.** MagicUI, Reactbits, or similar for visual enhancement. Install to `src/components/magicui/` or `src/components/effects/`.

Keep token edits in `src/design-tokens/tokens.json`, then sync generated CSS/rules.

### Screenshot / Reference Image Rules

When the user provides a screenshot, mockup, or reference image along with a request to generate UI:

1. **Extract only content and business logic** from the reference: data structure, text, labels, field types, workflow steps, navigation items. The reference tells you WHAT the page does.
2. **Completely redesign the layout.** Do not replicate the reference's spatial arrangement, section ordering, or component placement. Use Phase 1 (Layout Blueprint) to determine the best layout for this page's purpose.
3. **Freely design all components.** Do not copy the reference's component styles, card shapes, button treatments, or visual patterns. Design from the style prompt.
4. **Apply token-constrained colors.** Structural colors from tokens, decorative colors from the style prompt.
5. **Tell the user explicitly:** `参考图中提取了内容和业务逻辑，布局和视觉已完全重新设计。`

The reference image is a **content source**, not a design template. If the reference has poor layout, ugly components, or bad information architecture, those problems should not appear in the output.

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

If you encounter unsafe UI while editing, fix it in the current task. If you encounter a layout that violates the quality principles, restructure it. Use the message templates defined in the Output Format section for all governance actions and self-checks.

## Command Router

Use the npm runtime for continuing work:

- Install missing runtime: `npm install -D design-anchor`
- Background activation and rule generation: `npx design-anchor sync`
- Rebuild local `.anchor/`: `npx design-anchor hydrate`
- Add a functional component (dialog, command, select, etc.): `npx design-anchor add <component>`
- Extract tokens from a style prompt: `npx design-anchor theme <prompt-file.md>`
- List internal style prompt metadata: `node scripts/list-style-prompts.mjs`
- Open Portal intentionally: `npx design-anchor portal tokens`, `components`, `specs`, `theme`, or `docs`
- Audit project compliance: `npx design-anchor audit`
- Upgrade local kit from the npm package: `npx design-anchor upgrade`
- MCP server command for tools: `npx --no-install design-anchor mcp ./.anchor`

## Output Format

All UI-related responses must use these standardized message templates.

### Probe / Pre-check

```
Design Anchor 预检：我会先判断项目成熟度和需求完整度；新页面会先匹配/抽取风格 token，已有完整产品会先征求你确认是否进入治理模式。
```

### Auto-governance (token fix during editing)

```
Design Anchor 自动治理：已将结构色对齐到语义 token。
```

### Layout governance (layout restructured)

```
Design Anchor 布局治理：已根据页面用途重构布局。
```

### Screenshot generation

```
参考图中提取了内容和业务逻辑，布局和视觉已完全重新设计。
```

### Self-check (required on every UI change)

Every response that changes UI must end with a `Design Anchor 自检` line covering:

- Visual quality (page looks polished, colorful, and appealing — has visible design personality)
- Layout quality (purpose-layout fit, information hierarchy, page nature correct)
- Responsive (tested at 320px / 768px / 1024px / 1440px, sidebar collapses, tables adapt, touch targets adequate)
- Icon consistency (single library, uniform size)
- Token compliance (structural anchor colors reference token CSS variables consistently)
- Dark mode (if enabled: token values defined, decorative colors adapted, contrast verified)
- Sync / audit status

```
Design Anchor 自检：视觉 ✓ | 布局 ✓ | 响应式 ✓ | icon ✓ | token ✓ | 暗色 ✓/未启用 | sync ✓ audit ✓
```

After completing a page, also prompt:

```
页面已完成。需要我顺便做一个暗色模式吗？会基于 token 系统实现，一套代码自动适配。
```

## References

Read only what the task needs:

- `references/project-contract.md` before installs, file-boundary decisions, source-vs-consumer detection, or component/token writes.
- `references/govern-existing-product.md` before offering or executing governance for a mature existing product.
- `references/layout-governance.md` before analyzing, auditing, or restructuring any page layout. Contains layout quality principles, reference examples for common page types (including AI product interfaces), icon governance rules, and information architecture principles.
- `references/product-context.md` before creating product screens. Covers all product types including AI tools, creative tools, and developer tools.
- `references/style-source-selection.md` before matching incomplete input to an internal style prompt.
- `references/design-prompt-pool.md` when selecting an internal prompt.
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
