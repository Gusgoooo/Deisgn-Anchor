# Component System

Read this before standardizing components, adding shadcn components/blocks, changing shared UI primitives, or wrapping headless primitives.

For B2B products, consistent components are the fastest path to consistent pages. Favor a token-bound component system over page-by-page visual invention.

## Decision Order

1. If the project uses Tailwind, default to shadcn components.
2. If an official shadcn block matches the functional page pattern, use the block as the starting scaffold.
3. If the project already has shadcn or registry-style files such as `components.json`, `components/ui`, or `src/components/ui`, standardize around those files.
4. If the project uses headless primitive wrappers, standardize those wrappers and bind tokens.
5. If the project already uses MUI, Ant Design, Chakra, Mantine, or another non-Tailwind suite, map Design Anchor tokens into that library's theme/CSS-variable entry points.
6. Use headless primitives directly only for interactions not covered by shadcn, blocks, or existing suite components.

Do not mix multiple component suites for the same job unless the project already has a clear boundary. Do not add a second library for buttons, dialogs, tables, forms, or icons when one already exists.

## Tailwind Default

Tailwind projects use shadcn by default because the components are local, token-friendly, and easy to reshape for functional pages.

Use this default without over-asking when:

- the project is React + Tailwind,
- the user requested implementation, cleanup, rebuild, or UX improvement,
- the page needs common B2B primitives or a page scaffold,
- no stronger existing local component system already solves the interaction.

Ask before switching away from an established non-Tailwind suite, adding broad starters, or introducing a second table/form/chart system.

## shadcn Blocks

Prefer shadcn blocks when they provide a useful functional scaffold:

- dashboard/app shell with sidebar,
- data table with filters/actions,
- login/auth flow,
- settings-style layout,
- page shell/header/sidebar patterns,
- chart + table operational overview.

Block rules:

- Treat blocks as scaffolds, not final UX.
- Replace demo data with existing APIs/state.
- Preserve routes, permissions, handlers, validation, and domain copy.
- Remove sections that do not support the page's primary task.
- Bind structural colors to `design-tokens.json`.
- Add missing states: loading, empty, error, saving, selected, disabled, permission denied.
- Keep or improve keyboard/focus behavior.
- Do not use landing/marketing blocks for work surfaces.
- Verify official/current block instructions before running a generator command in a real project.

## Component Boundary First

Before adding, extracting, or replacing components, read `references/component-isolation.md`.

Classify the target as one of:

| Boundary | Use for | Rule |
|---|---|---|
| Shared primitive | buttons, inputs, dialogs, badges, tabs, table controls | token-bound, reusable, no business logic |
| Product component | repeated domain-neutral product UI, such as EntityHeader or EmptyState | explicit props/callbacks, no API ownership |
| Feature-local component | workflow-specific section reused inside one feature | may know feature concepts, but should not own global state |
| Page-local composition | one-off layout or task flow | keep inline when extraction would hide the workflow |

Default to page-local or feature-local composition unless reuse, consistency, accessibility, or risk reduction justifies a shared component.

Do not create shared components that import page-specific APIs, routes, permission checks, validation schemas, or business transformations.

## Baseline Components

For B2B pages, the useful baseline is:

```text
button input textarea label select checkbox radio-group switch
card badge separator breadcrumb tabs
table dropdown-menu popover dialog alert-dialog sheet tooltip
command pagination skeleton toast/sonner
```

Add only the components needed now. Do not install a broad starter or block bundle unless the user asks for one.

For Tailwind implementation work, adding specific shadcn components/blocks is allowed when they directly serve the current functional page. Ask before broad starters, switching component libraries, duplicate table/form/chart systems, or non-shadcn dependencies.

## Supported Component Paths

Use the first path that fits the project:

| Path | Detect | Action |
|---|---|---|
| Existing local UI | `src/components/ui`, `components/ui`, repeated custom primitives | Refactor toward token-bound variants and reuse. |
| Tailwind + shadcn | `tailwindcss`, `components.json`, `components/ui`, `src/components/ui` | Use shadcn components by default; use blocks when they fit the page task. |
| Registry-style UI | generated component files, Tailwind semantic classes | Standardize the generated/local files and keep variables enabled. |
| Headless primitives | `@radix-ui/*`, Ariakit, React Aria, Headless UI, local wrappers | Wrap only the needed primitive and bind visual states to tokens. |
| Suite library | MUI, Ant Design, Chakra, Mantine, similar | Feed the suite theme with Design Anchor token CSS variables; do not duplicate primitives. |
| Raw HTML | Many ad hoc controls, no shared layer | Create the smallest local token-bound primitives or ask before adopting a component registry. |

## Headless Primitive Role

Headless primitives are the lower-level accessibility and behavior layer. They are ideal when:

- the project already wraps them,
- the approved component layer is too opinionated,
- you need custom composition but still need focus, keyboard, ARIA, portal, collision, or state behavior,
- the component must expose `data-state`, `data-disabled`, or similar state hooks for token-bound styling.

When using headless primitives directly, create or update a small local wrapper only when it will be reused or replaces unsafe raw interactions. Bind all visual states to tokens.

Example state styling:

```tsx
<TabsTrigger className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" />
```

## Token-Bound Component Rules

All shared components must use semantic token classes or CSS variables:

```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90" />
<Card className="border-border bg-card text-card-foreground" />
<Input className="border-input bg-background focus-visible:ring-ring" />
<Badge className="bg-secondary text-secondary-foreground" />
```

Avoid hardcoded structural colors in shared components:

```tsx
// Avoid
<button className="bg-blue-600 hover:bg-blue-700 text-white" />

// Prefer
<Button className="bg-primary text-primary-foreground hover:bg-primary/90" />
```

Decorative accents may be raw values inside page-specific UI when they are not structural anchors.

## Component Replacement Rules

Replace raw or ad hoc UI when it affects consistency, accessibility, interaction quality, or repeated B2B patterns:

- raw buttons -> shared `Button`,
- raw inputs/selects -> shared `Input`, `Select`, `Checkbox`, `Switch`,
- raw modals -> shared `Dialog` / `AlertDialog`,
- custom dropdowns -> shared `DropdownMenu` / `Popover`,
- custom tabs -> shared `Tabs`,
- repeated status pills -> shared `Badge` variants,
- custom tables -> local table pattern or the project's suite table.
- generic page shells -> shadcn block scaffold when Tailwind and the block matches the work surface.

Keep business logic intact:

- preserve handlers,
- preserve controlled values,
- preserve API calls,
- preserve validation rules,
- preserve routing and permissions.
- preserve the original state owner. Do not move data loading, permissions, validation intent, routing, or domain transformations into the replacement component.

## Suite Library Mapping

When using MUI, Ant Design, Chakra, Mantine, or a similar suite:

- Do not replace the suite just to make pages consistent.
- Bind its theme provider, CSS variables, or design-token config to `design-tokens.json`.
- Add `mappings.componentLibraries.<library>.cssVariables` only for variables the suite needs beyond Design Anchor semantic keys.
- Keep semantic page roles consistent: primary actions, muted text, destructive actions, selected rows, focus rings, card surfaces.
- Prefer the suite's accessible components over raw HTML for forms, dialogs, menus, tabs, and tables.

## B2B Component Defaults

- Use compact density by default.
- Prefer 8px radius for cards/inputs/buttons unless tokens say otherwise.
- Use clear labels; do not rely on placeholders only.
- Use row actions in dropdown menus for dense tables.
- Use destructive variants only for destructive actions.
- Use `Badge` for status, not random colored text.
- Use `Skeleton` for loading and designed empty states for no data.
- Use `Dialog`/`Sheet` for focused workflows; avoid hidden offscreen panels without focus management.

## Dependency Report

Every final response after component work must state:

- components reused,
- shadcn components or blocks added, if any,
- component-library files added, if any,
- headless wrappers added or changed, if any,
- dependencies added,
- components deliberately avoided.
