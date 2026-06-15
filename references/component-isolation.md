# Component Isolation

Read this before extracting, creating, replacing, or heavily editing components during a UI/UX refactor.

Component isolation is an execution guardrail, not a goal by itself. Use it to preserve business logic, reduce AI edit blast radius, keep state ownership clear, and make token-bound UI easier to verify.

## Why It Exists

AI-assisted frontend refactors are risky when page code mixes:

- business data loading,
- permission logic,
- form state,
- validation,
- layout,
- visual styling,
- local interaction state,
- side effects,
- component-library choices.

Before editing, separate what the component owns from what the page, route, hook, store, or API layer owns.

The purpose is:

```text
clear responsibility
smaller change surface
fewer hidden side effects
safer AI edits
easier review and rollback
more consistent component reuse
```

## Boundary Contract

Every meaningful component should have a clear boundary.

Inputs:

- props,
- controlled values,
- callbacks,
- explicit children,
- optional config.

Outputs:

- rendered UI,
- typed callback events,
- accessible interaction state.

Must not silently own:

- route changes,
- API contracts,
- permission decisions,
- global state mutation,
- business validation rules,
- unrelated layout decisions,
- theme/token source of truth.

If a component needs to change business logic, pause and ask.

## Isolation Decision

Use this decision before extracting or creating a component:

1. Is this UI repeated now or likely to be reused across the current scope?
2. Does it represent a stable B2B primitive, such as Button, Field, TableToolbar, StatusBadge, EmptyState, DetailHeader, FilterBar, or ActionMenu?
3. Can its API be expressed with props and callbacks without importing page-specific business logic?
4. Will extraction reduce duplication or risk?
5. Will extraction make the user path clearer, not just the file tree cleaner?

If the answer is mostly no, keep the composition local.

## Extract When

Extract into a shared or feature component when:

- the same primitive appears in multiple places,
- inconsistent UI is causing UX or accessibility problems,
- the component maps to a stable B2B pattern,
- the component can be token-bound,
- the API can stay small and explicit,
- extraction makes the next edit safer.

Examples:

- raw buttons -> shared Button,
- custom status text -> StatusBadge / Badge variant,
- repeated table controls -> TableToolbar / FilterBar,
- repeated empty states -> EmptyState,
- row action clusters -> RowActions,
- repeated detail headers -> EntityHeader,
- repeated confirmation flows -> ConfirmAction.

## Do Not Extract When

Do not extract only because JSX looks long.

Avoid extraction when:

- the UI is used once,
- the component API would need many page-specific props,
- extraction would hide the primary user flow,
- the component would import page API calls, routes, or permission logic,
- the component is only decorative,
- the current fix is local spacing, copy, state, or token cleanup,
- the abstraction would make future product changes harder.

Long page composition is acceptable when it keeps the workflow readable.

## State Ownership

Use this default ownership model:

| State Type | Owner |
|---|---|
| API data | route/page/query hook |
| permissions | route/page/domain layer |
| form schema and validation intent | page/form domain layer |
| selected row/item | page or feature component |
| dialog open/close | page or colocated feature component |
| hover/focus/pressed visual state | shared component |
| loading/empty/error rendering | page or reusable state component |
| theme/token values | `design-tokens.json` and global CSS |

Shared UI components should not make domain decisions.

## File Placement

Use the smallest responsible location:

```text
src/components/ui/*        shared primitives
src/components/*           reusable product components
src/features/<x>/*         feature-local components
app/<route>/* or pages/*   page composition and route wiring
```

Do not create a new design-system folder unless the project already has that convention or the user asks for it.

## AI-Safe Editing Rules

When using AI to modify frontend code:

- Define the target file and allowed edit surface before changing code.
- Preserve imports that provide data, permissions, validation, routing, and event handlers.
- Convert repeated raw UI to existing token-bound components first.
- Create new shared components only when reused now or needed as a baseline.
- Keep page-only composition local.
- Avoid adding new dependencies for isolation.
- Do not refactor unrelated files opportunistically.
- Report every shared component changed or added.

## Component Isolation Prompt Capsule

Use this capsule when asking an AI agent to work on a page or component:

```text
Component Boundary | When refactoring an existing product page with business logic already wired, prefer isolated token-bound components with explicit props and callbacks, because AI edits are safer when page logic, state ownership, and visual execution are separated. Guardrail: do not extract one-off layout or move API, routing, permission, or validation logic into shared UI components.
```

## Output Check

Before delivery, verify:

- component boundaries are explicit,
- shared UI has no hidden business logic,
- page logic remains in page/feature/domain layer,
- new components are reused now or justified,
- props and callbacks are small and typed,
- structural styles are token-bound,
- no unrelated files were changed,
- no duplicate component system was introduced.
