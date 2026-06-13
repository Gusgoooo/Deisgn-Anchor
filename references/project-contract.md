# Project Contract

Read this before changing files in a user project, adding tokens, adding component-library files, or reporting what changed.

Design Anchor is a skill workflow. Do not add a `design-anchor` npm dependency. The user project owns the token file, CSS variables, components, and page code.

## User Project Layers

| Layer | Typical location | Commit? | Rule |
|---|---|---|---|
| Token source | `design-tokens.json` | Yes | User-owned source of truth for theme decisions. |
| Global token CSS | `app/globals.css`, `src/index.css`, `src/styles/globals.css`, or CSS path in `components.json` | Yes | CSS variables derived from tokens. |
| Component config | `components.json` or suite theme config | Yes | Component registry or suite theme config when the project uses one. |
| Shared UI components | `src/components/ui/*` or project convention | Yes | Token-bound shared components. |
| Feature/page code | route/page/feature files | Yes | Page composition and business logic. |
| Generated package cache | `node_modules/` | No | Never stage. |
| Temporary notes/audits | none by default | No | Keep state in the conversation unless user requests an artifact. |

## What May Be Added

| Trigger | May add/change | Confirmation |
|---|---|---|
| Read-only audit | Nothing | Not needed |
| Token baseline | `design-tokens.json`, global CSS variables | Proceed if user requested implementation |
| Theme customization | `design-tokens.json`, global CSS variables | Proceed for explicit theme request; ask before changing locked values |
| Component baseline | `components.json`, `src/components/ui/*`, shadcn block files, suite theme files, package files | Proceed for Tailwind implementation scope; ask before switching suites or broad installs |
| Headless wrapper | small reusable component wrapper | Ask if it adds a dependency or broad shared component |
| Single page rebuild | one page/route/feature file plus existing components | Proceed when user requested page cleanup/rebuild |
| Multi-page governance | many pages/shared shell/components | Confirm scope and proceed page by page |

Do not create duplicate design-system folders, temporary docs, wrapper files, or audit ledgers unless the user asks.

## Dependency Policy

- Do not install `design-anchor`.
- Do not add dependencies during read-only work.
- Prefer existing project components and dependencies.
- If the project uses Tailwind, use shadcn as the default component layer.
- If shadcn blocks fit the current functional page, add only the specific block or components needed now.
- If a non-Tailwind component system exists, use it before adding anything else.
- Ask before switching component libraries, adding broad starters, or adding a second table/form/chart system.
- Avoid full starters, broad block bundles, decorative effect libraries, duplicate icon libraries, second table libraries, and second form libraries.

## Logic Preservation

When rebuilding an existing page, preserve:

- routes and navigation behavior,
- imports that provide data/business utilities,
- API calls,
- state and reducer logic,
- event handlers,
- form schemas and validation intent,
- permission checks,
- feature flags,
- data transformations.

If visual cleanup would require changing business logic, pause and ask.

## Footprint Report

Final responses after implementation must report:

- token files changed,
- global CSS changed,
- shared components changed or added,
- page files rebuilt,
- dependencies added or avoided,
- QA run or skipped.
