# Vercel UI Skill Routes

Read this when the project is Vercel-stack, Next.js, React + Tailwind, shadcn-based, AI-interface-heavy, or when a UI refactor could benefit from Vercel's product UI patterns.

Use these routes as decision support. Do not require the user to install Vercel tools, v0, Geist, or AI Elements unless the project already uses them or the user explicitly asks.

## Which Vercel Skill Helps UI Most

| Vercel skill | Use for | Design Anchor adaptation |
|---|---|---|
| `shadcn` | component execution, theming, registry components, product UI composition | Primary reference for Tailwind projects; use local shadcn primitives, CSS variables, and blocks when the functional page pattern fits. |
| `v0-dev` | generating or exploring UI components/layouts from prompts | Treat v0 output as a draft. Normalize it into existing business logic, GenDesignSystem/Theme Lab tokens, shadcn primitives, and component boundaries. |
| `geist` | typography and Vercel product aesthetic | Borrow the typography discipline: precise hierarchy, restrained weights, mono for metrics/IDs/timestamps. Do not add the font dependency unless approved. |
| `react-best-practices` | TSX safety review after UI edits | Use as a final React checklist: hooks, state ownership, accessibility, performance, TypeScript, and component structure. |
| `agent-browser-verify` | visual/runtime verification | After meaningful frontend implementation and a runnable dev server, verify page load, blank state, console errors, key elements, desktop/mobile framing. |
| `ai-elements` | AI-native interfaces: chat, streaming markdown, tool calls, reasoning, code/terminal panels | Use only for AI surfaces. Install specific elements only when approved or already present; never install the full suite by default. |
| `next-forge` | monorepo SaaS design-system structure | Borrow the `packages/design-system` pattern when a monorepo already has it; do not force this structure into normal apps. |
| `geistdocs` | docs sites | Mostly irrelevant for B2B product UI unless the target is a documentation surface. |

## v0 Output Normalization

When using or importing v0-generated UI:

1. Treat it as composition input, not final product code.
2. Preserve existing routes, data loading, APIs, permissions, validation, state, and event handlers.
3. Replace demo data and mock handlers with existing logic.
4. Replace ad hoc controls with the chosen component layer.
5. Bind structural styling to GenDesignSystem/Theme Lab or Design Anchor tokens.
6. Collapse repeated generic card grids into task-appropriate B2B patterns.
7. Remove decorative gradients, mixed radii, random shadows, and generic AI visual tropes unless they support the user task.
8. Keep only the files/components needed for the selected scope.

Best use: generate a component or layout option for a selected scope, then normalize it through Design Anchor.

Poor use: ask v0 to rewrite a mature product page without first extracting business logic and token/component contracts.

## shadcn Product UI Defaults

For React + Tailwind projects:

- Prefer local shadcn primitives before raw HTML controls.
- Use `new-york` style conventions when compatible with the project.
- Use CSS variables for surfaces, text, borders, focus, and state colors.
- Use `AlertDialog` for destructive confirmations, not generic `Dialog`.
- Use `Sheet` for contextual editing when surrounding page context matters.
- Use `Table` + `DropdownMenu` + `Sheet` for CRUD/data-heavy pages.
- Use `Tabs` + `Card` for settings and stable grouped information.
- Use `Skeleton`, empty states, and alerts for non-happy paths.
- Avoid nested cards, repeated `div rounded-xl border p-6`, multiple accent colors, and ad hoc palette classes.

If GenDesignSystem/Theme Lab is present, shadcn classes should resolve through its shadcn adapter variables, not newly invented values.

## Geist-Inspired Typography

Use these principles even when the project does not install Geist:

- Let typography create hierarchy before color and decoration.
- Use restrained heading weights; avoid making every title bold.
- Use mono only for IDs, timestamps, commands, metrics, code, logs, and tabular numbers.
- Keep secondary text muted but legible.
- Avoid multiple unrelated font families.

When the project already uses Geist or the user approves it, keep font variables integrated through the existing global layout and token system.

## AI Interface Route

When the target page contains AI-generated text, chat, tool calls, reasoning panels, code output, or streaming content:

- Prefer AI Elements only if the project already uses it or the user approves specific components.
- Install only the needed components, not the full suite.
- Render AI-generated markdown through a markdown-aware message component rather than raw `{text}`.
- Surround AI Elements with the same shadcn + token discipline as the rest of the product.
- Avoid purple gradient/glassmorphism defaults unless the user's product style demands them.

## Verification Route

After meaningful UI implementation, if a local dev server can run:

1. Open the page in a browser.
2. Check that the body is nonblank and no framework error overlay is present.
3. Check console errors.
4. Check key interactive elements.
5. Capture desktop and mobile viewport issues when layout changed.
6. Re-run after fixes.

If browser verification cannot run, state that QA was code-based.

## Final Reporting

When Vercel UI routes influenced the refactor, report:

- Vercel skill route used: `shadcn`, `v0-dev`, `geist`, `ai-elements`, `react-best-practices`, `agent-browser-verify`, or none.
- Whether any generated/imported UI was normalized.
- Whether Theme Lab / Design Anchor tokens drove structural styles.
- Whether browser verification ran.
