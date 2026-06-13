# B2B Page Patterns

Read this before restructuring an enterprise, admin, SaaS, internal-tool, CRM, approval, operations, analytics, or workflow page.

B2B quality comes from task fit, interaction clarity, consistent components, clear density, and reliable states. Do not use landing-page composition for work surfaces.

## Pattern Selection

Choose one primary pattern per page:

| Pattern | Use for | Structure | UX focus |
|---|---|---|
| Dashboard | monitoring, analytics, operational overview | page header -> key metrics -> primary chart/work queue -> secondary panels | what needs attention and what action follows |
| List | collections, queues, inboxes, CRM objects | title/actions -> filters/search -> table/list -> pagination/bulk actions | scan, filter, compare, act repeatedly |
| Detail | account, order, ticket, user, document | entity header -> status/actions -> summary -> tabs/sections -> activity/related records | understand entity state and decide next action |
| Form | create/edit, approval, configuration detail | grouped fields -> validation -> contextual help -> sticky/visible submit | complete safely with confidence |
| Settings | preferences, integrations, permissions | settings nav -> focused panel -> save state -> dangerous zone separated | configure predictably without accidental damage |
| Workflow | approval, onboarding, pipeline, fulfillment | progress/status -> current task -> required inputs -> history/next actions | know current stage, blocker, owner, next step |
| Split | email, tickets, files, review queues | master list -> detail/work area -> optional metadata/actions panel | move quickly between context and action |
| Workspace | AI tools, editors, builders, consoles | persistent tools -> main work area -> properties/logs/context panel | keep the active work object central |

If a page mixes patterns, identify the user's primary task and make that pattern dominant.

## Global B2B Layout Rules

- Keep app shell consistent across pages.
- Use page headers for location, status, and primary actions, not marketing copy.
- Make the primary action visible in the first viewport.
- Use compact but readable spacing.
- Keep tables and forms calm; reserve stronger visuals for priority/status.
- Avoid decorative card grids unless each card supports a real decision.
- Add empty/loading/error/partial states where the workflow can reach them.
- Make responsive behavior explicit: sidebar collapse, table overflow, filter stacking, sticky actions.
- Prefer shadcn blocks for Tailwind app shells and work-surface scaffolds when the block's structure fits the task.
- Remove block sections that do not serve the functional page.

## Dashboard

Use dashboards to answer "what needs attention?"

Required:

- 3-5 top metrics maximum,
- one primary visualization or queue,
- clear status thresholds,
- links to details or action queues,
- loading and empty states for charts/lists.

Avoid:

- four identical stat cards when one metric is clearly more important,
- decorative icons on every metric,
- charts without interpretation,
- hero banners.

## List / Table

Use lists for scanning, filtering, and acting on many records.

Required:

- search and filters near the table,
- saved views or filter chips when users repeat common slices,
- consistent row height,
- status badges,
- row actions grouped in a dropdown when dense,
- pagination or virtualized load behavior,
- selected/bulk state when bulk actions exist,
- empty/loading/error states.

Use table columns based on decisions users make, not database order.

## Detail

Use detail pages to summarize an entity and support next action.

Required:

- entity header with identity, status, primary actions,
- compact key facts,
- sections or tabs for related data,
- activity/history when relevant,
- destructive actions separated.

Avoid dumping every field into equal cards.

## Form

Use forms for confident completion.

Required:

- visible labels,
- grouped sections,
- inline validation,
- clear required/optional behavior,
- persistent save/cancel action on long forms,
- disabled/loading/submitted states.

Use review/summary before submit when the action is irreversible, high-value, or compliance-sensitive.

Avoid placeholder-only labels and hidden submit actions.

## Settings

Use settings for predictable configuration.

Required:

- category navigation,
- one focused panel at a time,
- explicit save state,
- integration/test connection states when relevant,
- dangerous actions separated and confirmed.

Settings pages should feel calmer than dashboards.

## Workflow

Use workflows for multi-step operational state.

Required:

- current state and next action,
- progress or stage indicator,
- owner/assignee if relevant,
- blockers/errors visible,
- history/audit trail,
- clear completion/rollback behavior.

## Split / Workspace

Use split/workspace layouts when the user repeatedly moves between context and action.

Required:

- stable master/context pane,
- dominant work area,
- keyboard and focus behavior for repeated use,
- clear selected/active item state,
- responsive fallback to stacked or sheet layout.

Use resizable panels or inspector sidebars when the user needs persistent context while editing or reviewing.

## Pattern Output

Before editing a page, state:

```text
页面范式：<pattern>
主要任务：<task>
主路径：<entry -> decision -> action -> feedback>
保留逻辑：<data/api/state/handlers>
组件策略：<tailwind_shadcn|shadcn_blocks|existing|headless-wrapper|suite-library>
UX prompt：<dense-records|contextual-edit|risky-action|long-form|workflow-state|split-workspace|settings-configuration|dashboard-triage|detail-review|ai-workspace|permission-empty|mobile-fallback>
布局变化：<old structure -> new structure>
交互改进：<filters/actions/states/feedback/navigation/responsive>
token 映射：<hardcoded structural styles -> semantic tokens>
```
