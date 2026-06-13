# Visual Craft Playbook

Read this when the page is functionally correct and token-bound but still does not feel professionally designed.

Visual craft in Design Anchor is not a separate aesthetic preset. It is the final pass that makes the existing product feel coherent, refined, and easier to use while preserving business logic and token governance.

## Phase Order

```text
1. Discovery
   -> inspect existing product style, tokens, components, density, and page purpose
2. Foundation
   -> confirm surfaces, text, primary/action colors, borders, focus, status, radius, and density
3. Structure
   -> confirm primary task, first-viewport hierarchy, section order, action placement, and states
4. Section polish
   -> improve one section/component family at a time
5. QA
   -> verify UX, token use, responsive behavior, accessibility, and visual polish
```

Do not do a broad decorative sweep across the product. Work one page, section, component family, or state family at a time.

## Craft Moves

Use these before adding any dependency:

- Rebalance scale: make the primary workflow visually dominant and secondary areas quieter.
- Improve typography: clearer heading/body/meta hierarchy and better numeric/data styling.
- Improve surfaces: cleaner borders, subtle elevation, quieter cards, focused panels.
- Improve density: reduce wasted padding in dense work surfaces, add breathing room in forms/settings.
- Improve states: designed empty, loading, error, success, selected, disabled, and permission states.
- Improve action clarity: primary/secondary/destructive actions look different and sit near decisions.
- Improve rhythm: group related content and remove repeated equal-card noise.
- Unify icons: one library, consistent size, purposeful placement.

## Final Detail Pass

After UX structure, token binding, and states are correct, add a restrained detail pass. The goal is to make the page feel finished, not decorative.

Use these details when they support the product surface:

- Add subtle transitions to interactive elements: hover, focus, press, selected, expand/collapse, sheet/dialog entrance, and state changes.
- Give cards and table/list rows a small hover lift or surface change when they are clickable or selectable.
- Reveal secondary contextual actions on card/row hover to reduce visual noise, but keep primary actions visible and make the same actions reachable on focus, keyboard, and mobile.
- Use shadow, border, background tint, or slight transform for hover elevation; keep it calm for dense B2B pages.
- Make pages adaptive: responsive grids, wrapping toolbars, stacked filters, scrollable tables, sheet/detail fallback, and sticky mobile actions where useful.
- Add subtle surface depth: faint tinted card backgrounds, soft edge highlights, quiet gradient washes, or low-opacity color diffusion inside card backgrounds.
- Add a very light page background texture or soft color wash only when it improves hierarchy and does not reduce readability.
- Respect `prefers-reduced-motion`; transitions should be short and should not block task completion.

Avoid:

- hiding essential actions behind hover only,
- decorative motion that competes with data or forms,
- visible orb/bokeh blob decorations,
- heavy gradients on dense work surfaces,
- texture that lowers contrast or makes text harder to read.

## Page-Type Notes

### Dashboard

Beauty comes from triage. One or two metrics, queues, or alerts should dominate; supporting metrics should be quieter. Avoid equal KPI grids when priority differs.

### Data Table / List

Beauty comes from scanability: alignment, row rhythm, muted metadata, clear status badges, designed hover/selected states, visible filters, and contextual actions.

### Detail Page

Beauty comes from narrative order: identity, status, key facts, actions, related records, and history. Avoid dumping fields into equal cards.

### Form / Settings

Beauty comes from trust: grouped fields, visible labels, clear helper text, validation, save state, separated dangerous actions, and calm density.

### Workflow / Approval

Beauty comes from state clarity: current stage, owner, blocker, next action, timeline/audit trail, and recoverable decision feedback.

### Workspace / AI Tool

Beauty comes from focus: dominant work area, persistent input/tools, contextual side panels, visible progress/streaming states, and recoverable output history.

## Failure Signals

Run a visual recovery pass when:

- the page looks like a default component demo,
- all cards have equal size and weight,
- the primary task is not visually obvious,
- the primary action is far from the decision point,
- the page is cleaner but not easier,
- mobile is just a squeezed desktop,
- states are technically present but visually untreated,
- token cleanup removed useful product personality.

Repair the smallest failing area first. Do not rewrite business logic, do not add visual packages, and do not abandon token governance.
