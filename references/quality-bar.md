# Design Anchor Quality Bar

Read this before final delivery for any UI/UX refactor.

The page is only done when it preserves logic, improves the user's workflow, and looks consistent through the token foundation.

## Non-Negotiables

1. Preserve business logic, data contracts, permissions, validation intent, and event handlers.
2. Use `design-tokens.json` and emitted CSS variables/classes for structural styling.
3. Choose UX structure from the user's task, not from decorative preference.
4. Do not turn work surfaces into landing/showcase pages.
5. Do not add dependencies as a shortcut for beauty.
6. Ask heuristic product-goal questions when a complex page lacks enough context.
7. Verify by user path, not just screenshot appearance.

## UX Quality

A refactor fails if:

- the primary task is unclear,
- the primary action is far from the decision point,
- users must scan irrelevant sections before acting,
- a simple page was over-restructured,
- errors explain failure but not recovery,
- saves/submits lack progress or result feedback,
- destructive actions are too easy,
- repeated operations lack filters, bulk actions, saved views, row actions, or keyboard paths when appropriate,
- mobile hides core actions or makes dense data unusable,
- keyboard/focus behavior regresses.

Recovery order:

1. Restate the shortest path from entry to success.
2. Move required information before the decision.
3. Move actions to where the decision happens.
4. Add missing state/feedback.
5. Remove or collapse sections that do not support the task.
6. Preserve the original layout if focused repair is enough.

## Token Quality

Structural styles must use semantic tokens:

- page/card/popover surfaces,
- foreground and muted text,
- primary actions, active navigation, selected states, focus rings,
- form fields, borders, inputs,
- destructive/success/warning states,
- shared component variants.

Intentional decorative styles may stay raw:

- charts and visualizations,
- logos and illustrations,
- product-specific gradients or accents,
- one-off visual emphasis that is not a shared semantic state.

When in doubt, preserve decorative styles and govern only the structural anchor.

## Component Quality

Use one component vocabulary per job:

- shared `Button`, `Input`, `Select`, `Checkbox`, `Switch`,
- shared `Table` / local table pattern,
- shared `Dialog`, `AlertDialog`, `Sheet`, `DropdownMenu`, `Popover`, `Tabs`,
- shared `Badge` for status,
- `Skeleton` and designed empty/error states.

Avoid duplicate button, form, table, chart, or icon systems.

Component isolation fails if:

- a shared component imports page-specific API calls, routes, permissions, or validation schemas,
- component extraction hides the main user path,
- a one-off section becomes a shared abstraction without reuse,
- props become a large bag of page-specific configuration,
- state ownership becomes unclear,
- changing one component unexpectedly affects unrelated pages,
- a second primitive system is introduced for the same job.

Recovery order:

1. Move business logic back to page, route, hook, store, or domain layer.
2. Keep one-off workflow composition local.
3. Reduce shared component props to stable visual and interaction inputs.
4. Use explicit callbacks for events.
5. Bind structural styling to tokens.
6. Verify the affected user path.

## Responsive Quality

Check these breakpoints when a browser can run:

| Width | Use |
|---|---|
| 320px | small phone |
| 768px | tablet |
| 1024px | laptop |
| 1440px | desktop |

Rules:

- sidebars collapse or become sheets on mobile,
- multi-column grids collapse below `md`,
- tables scroll horizontally or become card/list rows where useful,
- split views stack or use sheet detail,
- forms become single column,
- sticky actions remain reachable,
- touch targets are at least 44x44px on mobile.

## Accessibility Quality

- Form inputs have visible associated labels.
- Interactive elements are keyboard reachable and operable.
- Focus indicators are visible.
- Color is not the only way to convey state.
- Text contrast should meet WCAG AA when possible.
- Dialogs/sheets manage focus and restore it on close.
- Respect reduced motion.

## Visual Quality

The page should not look like default utility CSS or a component-library demo. Polish through:

- stronger hierarchy,
- clear section rhythm,
- consistent density,
- refined borders/surfaces,
- meaningful state design,
- restrained accents drawn from tokens or existing product style.
- subtle transitions and hover/focus feedback,
- card or row hover lift where the element is interactive,
- contextual secondary actions that reveal on hover/focus while remaining available on mobile and keyboard,
- faint card tint, quiet surface gradients, or very light page texture/color diffusion when it improves hierarchy.

If token governance made the page flatter, colder, or less useful, repair the visual hierarchy while keeping structural anchors token-bound.

Visual polish must not reduce usability:

- primary actions stay visible,
- hover-only controls have keyboard/focus and mobile alternatives,
- motion respects reduced-motion preferences,
- background texture or color diffusion never harms contrast,
- dense work surfaces stay calm and scannable.

## Final Gate

Before delivery, verify:

1. business logic is preserved,
2. token foundation exists or was intentionally unchanged,
3. UX prompt strategy is clear,
4. page pattern fits the primary task,
5. components are consistent,
6. reachable states have feedback,
7. responsive behavior is explicit,
8. accessibility is not worse,
9. final interaction details are present where useful,
10. no unapproved dependency was added,
11. rollback path or diff is clear for broad changes,
12. component boundaries are explicit and no shared UI component owns hidden business logic.
