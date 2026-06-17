# Page Rendering Pipeline

Read this before rebuilding, restructuring, or materially improving an existing functional B2B page.

The goal is not to patch old styles, force a new layout, or create a showcase page. Extract business logic and content, diagnose the user's task, preserve UI that already works, then modify/add/remove/restructure only where the interaction path fails.

## Phase 1: Understand And Preserve Logic

Read the page and related components before editing.

Preserve:

- route behavior,
- data loading,
- API calls,
- state management,
- event handlers,
- form fields and validation intent,
- permissions and conditional rendering,
- domain text and business objects.

Discard by default:

- ad hoc layout,
- hardcoded structural color classes,
- inconsistent component styling,
- raw modals/selects/dropdowns/tabs that should be shared components,
- filler cards or generic AI layout patterns.

If the page imports many local components, inspect the ones that own layout, forms, dialogs, tables, filters, or navigation before replacing them.

## Phase 2: Diagnose Functional UX

Read `references/functional-ux.md` and, when the problem maps to a known interaction strategy, `references/ux-prompt-capsules.md`.

State:

- primary user task,
- entry point and expected exit/success,
- decision points and required information,
- high-frequency actions,
- risky or irreversible actions,
- missing or weak states,
- responsive and keyboard/focus risks.
- selected UX prompt capsule, if any.

Do not choose layout or components until the task and friction are clear.

Classify major areas as:

- keep: already supports the task,
- modify: mostly right but weak hierarchy/state/component consistency,
- remove: duplicate, distracting, or decorative without task value,
- add: missing state/control/feedback/safety,
- restructure: current interaction model blocks efficient task completion.

## Phase 3: Pick The B2B Pattern

Read `references/b2b-page-patterns.md` and classify the page:

- dashboard,
- list/table,
- detail,
- form,
- settings,
- workflow,
- split,
- workspace.

State the page's primary task and choose a layout that serves it. Functional pages must not become marketing/showcase pages.

## Phase 4: Confirm Token And Component Baseline

Before major page edits:

1. Detect Theme Lab / GenDesignSystem artifacts before creating fallback tokens.
2. Read or create `design-tokens.json` only when Theme Lab is absent.
3. Confirm global CSS variables exist.
4. Detect the component system: Tailwind/shadcn, shadcn blocks opportunity, existing custom components, headless wrappers, suite library, or none.
5. Use token-bound shared components for repeated B2B primitives.
6. In Tailwind projects, default to shadcn components and use shadcn blocks when the block matches the page task.
7. For non-Tailwind suites, map tokens into the existing suite.

Read `references/token-contract.md` and `references/component-system.md` when touching either layer. Read `references/gendesignsystem-token-bridge.md` when Theme Lab appears.

## Component Boundary Pass

Before rebuilding composition, define the component boundary:

```text
shared primitives:
feature-local components:
page-local composition:
state owner:
business logic owner:
callbacks/events:
files allowed to change:
files not to touch:
```

Use `references/component-isolation.md`.

Keep business logic in the page, route, hook, store, or domain layer. Shared UI components should execute presentation and accessible interaction behavior, not decide permissions, API calls, validation rules, or routing.

Create a new shared component only when it is reused now, replaces repeated unsafe raw UI, or is necessary for the component baseline. Otherwise keep the composition local.

## Vercel UI Route Pass

Read `references/vercel-ui-skill-routes.md` when the target uses Vercel-stack UI patterns or when v0/shadcn/Geist/AI Elements/browser verification can improve the refactor.

Use it to:

- normalize v0-generated UI instead of accepting it as final,
- choose shadcn primitives for common B2B interactions,
- apply Geist-inspired typography discipline,
- select AI Elements only for AI-native interfaces,
- plan browser verification after implementation.

## Phase 5: Rebuild Interaction And Composition

Recompose the page with the selected pattern, UX diagnosis, and chosen UX prompt capsule. Preserve the current layout when focused repair is enough; restructure only when the existing interaction model is the problem.

1. Page header: location, status/context, primary action.
2. Core workflow area: table, form, chart, detail summary, active task, or split workspace.
3. Decision support: filters, comparison, metadata, history, related records, help text, warnings.
4. Action model: primary, secondary, row, bulk, destructive, undo/confirm, save/cancel.
5. States: loading, empty, error, partial, saving, saved, success, selected/active, disabled, permission denied.
6. Responsive behavior: sidebar collapse, filter stacking, table overflow, sheet/dialog behavior.

Choose the smallest useful interaction pattern:

- inline controls for simple low-risk edits,
- drawers/sheets when users need surrounding context,
- dialogs/modals for short focused tasks or confirmations,
- tabs for stable information groups,
- split panes for repeated list/detail work,
- timelines for history and audit trails,
- stepper/progress for staged workflows.

Use shared components first:

- `Button` for actions,
- `Input`, `Select`, `Checkbox`, `Switch` for forms,
- `Card` for grouped surfaces,
- `Table` for dense records,
- `Tabs` for detail sections,
- `Badge` for status,
- `Dialog`/`Sheet`/`Popover`/`DropdownMenu` for interactions,
- `Skeleton` and empty-state blocks for state handling.

Keep page-only composition inline or feature-local. Create new shared components only when reused now or needed as a component baseline.

## Phase 6: Bind Styling

Replace structural colors with semantic tokens:

- primary actions -> `bg-primary text-primary-foreground hover:bg-primary/90`,
- page surface -> `bg-background text-foreground`,
- cards -> `bg-card text-card-foreground border-border`,
- muted regions -> `bg-muted text-muted-foreground`,
- inputs -> `border-input focus-visible:ring-ring`,
- destructive actions -> `bg-destructive text-destructive-foreground`,
- status -> `success`, `warning`, `destructive`, or project-defined semantic tokens.

Keep intentional decorative colors for charts, illustrations, and page-specific accents.

## Phase 7: Verify By User Path

Check:

- business logic still wired,
- primary user task is faster or clearer,
- primary action sits near the decision point,
- risky actions are safer,
- component usage is consistent,
- component boundaries are explicit,
- shared components contain no hidden business logic,
- one-off layout was not over-extracted,
- Theme Lab or Design Anchor token source was respected,
- structural colors are token-bound,
- page pattern fits the primary task,
- empty/loading/error/saving/success/selected/disabled states are present where relevant,
- responsive behavior is explicit,
- keyboard/focus behavior is not worse,
- icons come from one library or a documented existing mix,
- no new dependency was added without confirmation.

When a local app can run, verify in browser at desktop and mobile widths. If not, do code-based QA and say so.
