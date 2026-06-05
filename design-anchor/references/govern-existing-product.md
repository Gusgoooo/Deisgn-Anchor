# Govern Existing Product

Read this when Design Anchor detects a mature existing product. This file is self-contained — it includes all layout principles, component standards, and audit criteria needed for execution. You do not need to load `layout-governance.md` separately when using this file, though it remains available as extended reference.

## Design Philosophy

Most existing products accumulate layout debt over time. Pages built by different developers at different times end up with inconsistent structures: some have sidebars, some do not; some put filters in modals, others inline; icon libraries get mixed; information architecture drifts from what the user's workflow actually needs.

Token compliance and component replacement fix the surface. Layout governance fixes the experience. A product with correct tokens but wrong information hierarchy is still a product that makes the user's job harder than it needs to be.

The goal is not to preserve the current layout — it is to give the user a better one.

## User-Facing Introduction

When the probe detects a mature product, present the situation with confidence, not caution:

`我检测到这是一个已有产品。我会先分析每个页面的布局、信息架构、组件使用和 icon 一致性，然后给出重构建议。默认推荐整页重构——用更合理的布局重新呈现你的业务数据和功能，同时保留所有业务逻辑和数据绑定。`

Then offer exactly:

- `布局重构`（推荐）：逐页分析后整页重构布局、替换组件、统一 icon、重排信息架构。保留业务逻辑，重建 UI 层。
- `渐进优化`：只修 token 合规、import 路径、组件替换，保留现有布局。
- `只读审计`：仅扫描报告，不改文件。

Default recommendation is layout restructuring. Say so explicitly.

Do not proceed with file changes until the user says a clear confirmation such as `确认，开始重构`, `开始布局重构`, `restructure`, or `我同意，开始`.

## Layout Quality Principles (Inline Reference)

Use these principles to evaluate every page. They replace template matching — AI designs the best layout for each page's purpose, then verifies against these criteria.

**Purpose–Layout Fit.** Every page exists because a user needs to accomplish something. The layout should be shaped by that purpose. A monitoring page needs density; a settings page needs calm; a chat interface needs conversation dominance. Ask: if I described this page's purpose to a designer, would they expect this layout?

**Information Hierarchy.** The most important content must be the most visually prominent. Primary content gets primary space. Status is always visible. Numbers have context (trend, comparison, threshold). Related content stays together. Ask: if the user glances for 2 seconds, do they see the most important thing?

**Action Hierarchy.** Primary actions are prominent and reachable without scrolling. Secondary actions are visually subordinate. Destructive actions are separated and gated. Repeated-use actions are the most accessible. Ask: can the user perform their most frequent action within one click?

**Density–Task Fit.** Monitoring: dense. Data entry: balanced. Content consumption: focused. Settings: calm. Creative workspaces: minimal chrome. Ask: does the density serve the task or the aesthetic?

**Spatial Efficiency.** Headers, banners, and announcements must earn their vertical position. Sidebars are supplementary — if the sidebar has more content than the main area, proportions are wrong. Whitespace is intentional — it groups and separates. Ask: if I removed this element, would the user notice?

**Navigation Clarity.** The user always knows where they are. Active states are visible. Depth matches product complexity. Consistent shell across pages. Ask: if the user was teleported here, would they know their location in the product?

**State Completeness.** Every page has empty, loading, error, and partial states. All must be designed, not blank or broken.

## Component Quality Standards (Inline Reference)

When a component does not meet these standards, replace it — do not report, do not patch. Preserve data bindings and event handlers; replace the UI implementation entirely.

**Sidebar / Navigation:**
- Must be collapsible to icon-only mode with toggle.
- Must have grouped nav items with section labels and active route indicator.
- Must use consistent icons (single library, uniform size/weight).
- Must handle responsive (drawer on mobile).
- Replace when: flat `<ul>` / unstyled div, no collapse, no grouping, mixed icons, hardcoded colors.
- Replacement: `npx design-anchor add sidebar`. If not yet in the registry, write one in `src/components/anchor-ui/sidebar.tsx` following Design Anchor conventions: composable API (`SidebarProvider → Sidebar → SidebarHeader / SidebarContent / SidebarFooter → SidebarGroup → SidebarMenuItem`), semantic token styling, accessible. Then run `npx design-anchor sync` to register.

**Data Table:**
- Must have sortable column headers, row selection (checkboxes), status badges (not plain text), row action dropdown (not inline icons), pagination, empty state, loading skeleton.
- Replace when: inline icon soup for row actions, no empty/loading state, status as plain text, no sort, `<div>` grid without ARIA.
- Replacement: `npx design-anchor add table`. If not yet in the registry, write one in `src/components/anchor-ui/` following Design Anchor conventions. Design Anchor bundles its own primitives — do not install headless table or menu libraries as direct project dependencies. Then run `npx design-anchor sync` to register.

**Form:**
- Must have visible labels (never placeholder-only), section grouping, inline validation on blur, consistent spacing, sticky submit on long forms.
- Replace when: placeholder-only labels, validation only on submit, no section grouping, submit scrolls out of view.
- Replacement: `npx design-anchor add input select textarea checkbox switch`. Use the project's existing form library for logic; Design Anchor handles the field components.

**Dialog / Modal:**
- Must have focus trap, escape-to-close, overlay, accessible title, controlled state. Confirmations must have specific action labels and destructive variant.
- Replace when: `<div>` with `position: fixed`, no focus trap, no escape handling, generic "OK/Cancel".
- Replacement: `npx design-anchor add dialog` / `npx design-anchor add alert-dialog`.

**App Shell:**
- Must have consistent header + sidebar + content structure, responsive collapse, content area with independent scrolling.
- Replace when: each page defines its own header/sidebar, ad-hoc flex divs with hardcoded widths, nested scroll containers.
- Replacement: shared layout component in `src/components/anchor-ui/app-shell.tsx` using CSS Grid.

**Tabs:**
- Must have keyboard arrow navigation, active indicator, proper ARIA roles.
- Replace when: styled `<button>` groups without ARIA or keyboard nav.
- Replacement: `npx design-anchor add tabs`.

**Command Palette / Search:**
- Must have Cmd/Ctrl+K shortcut, keyboard nav, fuzzy filtering, grouped results.
- Replace when: plain `<input>` with manual dropdown.
- Replacement: `npx design-anchor add command`.

## Absolute Bans (Inline from SKILL.md)

When auditing, also check for these AI slop patterns and remove them:

1. Hero metrics grid (four identical stat cards as page opener).
2. Identical card grid (3-4 same-structure cards in a row).
3. Gradient text on headings.
4. Decorative glassmorphism.
5. Side accent stripes with no semantic meaning.
6. Marketing hero on a workbench page.
7. Rainbow status colors (5+ hues on one page).
8. Excessive rounded corners on data-dense components.
9. Decorative icons on every label.
10. Full-width everything regardless of content.

If any of these exist in the current product, flag them in the audit and remove them during restructuring.

## Audit Scope

### Layout Audit

For each page or major route:

- Identify the page's primary user task.
- Read the actual page source and identify the current layout structure.
- Evaluate against the layout quality principles above.
- Report: what sections exist, what is missing, what is misplaced, what is unnecessary.
- Check for absolute ban violations.
- Assess information hierarchy: is the most important content most visible? Are related items grouped?
- Assess action hierarchy: is the primary action obvious? Are destructive actions protected?
- Assess density fit: does the density match the workflow?

### Component Audit (Enforced Replacement)

- Check every sidebar, table, form, dialog, app shell, tabs, and search component against the component quality standards above.
- For each substandard component, note the specific violation and planned replacement.
- Identify raw HTML elements that should be governed components.

### Icon Audit

- List all icon libraries installed in the project.
- Flag mixed icon library usage.
- Flag inconsistent icon sizes or mixed outline/filled styles.
- Flag decorative icons that add no recognition value.
- Recommend consolidation to a single library (default: `lucide-react`).

### Token Audit

- Hardcoded colors, arbitrary Tailwind values, scattered CSS variables.
- Token naming conflicts with Design Anchor conventions.
- Missing semantic token usage.
- WCAG AA contrast violations.

### Navigation Audit

- Does the product have a consistent shell (sidebar + header + content area)?
- Are active navigation states correct?
- Do breadcrumbs or page titles provide location context?
- Does the navigation depth match the product complexity?

## Layout Restructuring Execution

When the user confirms layout restructuring:

### Per-Page Flow

1. **Read the page source completely.** Understand every component, every data binding, every event handler.
2. **Identify the page's primary user task** and evaluate the current layout against the quality principles.
3. **Design the best layout for this page's purpose.** Do not force-fit a template — use the quality principles above as the evaluation standard.
4. **Present the restructuring plan** before writing code:
   - Current layout: describe the existing structure and its problems (tied to quality principles).
   - Proposed layout: describe the target structure.
   - Components to replace: list each substandard component and its replacement.
   - AI slop to remove: list any absolute ban violations found.
   - What stays: business logic, data bindings, API calls, state management.
   - What changes: layout structure, component implementations, section ordering, icon library.
5. **Wait for per-page confirmation.** The user confirms each page before restructuring begins.
6. **Restructure the page.** Rebuild the UI layer. Replace all substandard components. Unify icons. Remove AI slop patterns. Reorder sections by information priority.
7. **Run post-change checks:**
   - `npx design-anchor sync`
   - `npx design-anchor audit`
8. **Verify against Production Quality Bar** (from SKILL.md Design Guidance).
9. **Report what changed** with a Design Anchor self-check line.

### Restructuring Rules

- **Replace the entire page layout, not patches.** Patching a broken layout produces a patched broken layout.
- **Replace substandard components immediately.** If a sidebar has no collapse behavior, replace the entire sidebar. If a table uses inline icon soup, replace the entire table. If a form has no section grouping or validation, replace the entire form. Do not fix one property — rewrite to standard.
- **Use the replacement priority order:** first check `@design`, then `npx design-anchor add`, then write a new component in `src/components/anchor-ui/` following Design Anchor conventions (composable API, semantic token styling, accessibility). Then run `npx design-anchor sync` to register it. Never install UI primitives as direct project dependencies — Design Anchor bundles its own.
- **Unify icons in the same pass.** Replace all icons to the project's chosen library in the same restructuring pass.
- **Remove AI slop patterns in the same pass.** Do not leave hero metrics grids, gradient text, or decorative glassmorphism for later.
- **Preserve all data bindings and business logic.** API calls, state management, data transformations, event handlers, and routing logic stay untouched.
- **Match density to workflow.** Monitoring consoles are dense. Settings pages breathe. Do not apply one density everywhere.
- **One page per confirmation.** Restructure one page, let the user see the result, then continue.

### Component Replacement Announcement

For each component replaced, report:

`Design Anchor 组件治理：[原组件描述] → [新组件]。原因：[具体不达标项]。`

Example: `Design Anchor 组件治理：自定义 div sidebar（无折叠、无分组、icon 混用）→ 标准 Sidebar 组件（可折叠、分组导航、统一 lucide icon）。`

## Progressive Optimization Execution

When the user chooses progressive optimization instead of layout restructuring:

This path fixes token compliance and component quality without changing page-level layout or information architecture.

- Replace hardcoded colors with semantic tokens.
- Replace raw HTML primitives with governed components.
- **Replace substandard components that violate Component Quality Standards** — even in progressive mode, a sidebar with no collapse, a table with icon soup, or a form with no validation should be replaced. The page layout stays the same but the components inside it get upgraded.
- Remove AI slop patterns (absolute bans) within existing components.
- Fix import paths to use `@design` or `@/components/anchor-ui`.
- Consolidate mixed icon libraries to a single library.
- Add missing Design Anchor directories and rules through `sync`.
- Add `.anchor/` to `.gitignore` if missing.
- Do not change page layout, section ordering, or information architecture.
- Do not rearrange sections or restructure the page shell.

## Read-Only Audit Scope

When the user chooses read-only audit:

Scan and report everything listed in the audit scope above. Produce a structured report with sections:

1. **Summary**: overall governance score and top 3 issues.
2. **Per-page analysis**: for each major page/route, report layout quality, component quality (with specific standard violations), icon consistency, and AI slop violations.
3. **Component replacement plan**: list every substandard component, what standard it violates, and what it should be replaced with.
4. **Token and color audit**: hardcoded values, contrast violations.
5. **Recommended action**: whether layout restructuring or progressive optimization is more appropriate, and why.

No files should be edited in read-only audit.
