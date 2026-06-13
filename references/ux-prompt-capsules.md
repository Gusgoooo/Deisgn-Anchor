# UX Prompt Capsules

Read this when `functional-ux.md` has identified an interaction problem and the page needs a strategy, not just visual cleanup.

These are prompt capsules, not templates. Use one or two as strong direction, then adapt to the user's code, business logic, component system, and tokens. If the product goal is unclear on a complex page, ask heuristic questions before choosing a capsule.

Format:

```text
<Context> | When <signal>, prefer <move>, because <outcome>. Guardrail: <avoid>.
```

## Core Capsules

Dense Records | When users scan, compare, filter, and act on many records, prefer a table/list with visible filters, status badges, row actions, selection, bulk feedback, and empty/loading/error states, because repeated operation needs speed and confidence. Guardrail: avoid turning record operations into decorative equal cards.

Contextual Edit | When users edit an item from a list/detail and need surrounding context afterward, prefer a sheet, drawer, inline panel, or split pane, because preserving context reduces navigation cost. Guardrail: avoid full-page navigation for short contextual edits unless the edit is complex.

Risky Action | When an action is destructive, irreversible, permission-sensitive, financial, or compliance-relevant, prefer prevention, review, confirmation, undo, or clear audit feedback, because avoiding errors beats recovering from them. Guardrail: avoid confirmation fatigue for harmless repeated actions.

Long Form | When a form has many fields, dependencies, or validation failure points, prefer grouped sections, clear required/optional cues, inline validation, persistent actions, and review for risky submit, because users need progress, recovery, and confidence. Guardrail: avoid hiding required fields in unclear accordions.

Workflow State | When work passes through stages, owners, blockers, approvals, or handoffs, prefer current state, next action, owner, blocker, history, and progress/timeline, because users need to know what happened and what to do next. Guardrail: avoid static dashboards that hide process state.

Split Workspace | When users repeatedly move between a collection and an active object, prefer master-detail, split pane, or responsive sheet detail, because stable context accelerates review and action. Guardrail: avoid forcing users back and forth through separate pages.

Settings Configuration | When users configure integrations, permissions, preferences, or rules, prefer category navigation, one focused panel, explicit save/apply state, dependency warnings, and separated dangerous zones, because configuration needs predictability and safety. Guardrail: avoid dashboard-style cards that obscure what changed.

Dashboard Triage | When users monitor many signals, prefer a dashboard that prioritizes attention and next action, because the purpose is deciding what needs intervention. Guardrail: avoid equal KPI card grids when one signal is clearly more important.

Detail Review | When users evaluate one entity before acting, prefer an identity/status/action header, compact key facts, meaningful sections or tabs, related records, and history, because decision context should precede action. Guardrail: avoid dumping every database field into equal cards.

AI Workspace | When users collaborate with an AI, agent, builder, or console, prefer a dominant work area with persistent input/tools, contextual side panels, visible progress/streaming state, and recoverable outputs, because users need continuity and trust in intermediate states. Guardrail: avoid marketing feature cards inside the work surface.

Permission Or Empty Gate | When the page can be inaccessible, empty, or blocked by setup, prefer a designed state that explains what happened, why, and the next available action, because blank or generic failure states break trust. Guardrail: avoid inventing permissions or business promises not present in the product.

Mobile Fallback | When a dense desktop layout must work on small screens, prefer explicit responsive behavior such as stacked filters, horizontal table overflow, card rows, sheet detail, sticky submit, or collapsed sidebars, because squeezed desktop layouts break task completion. Guardrail: avoid hiding primary actions behind ambiguous menus.

## Usage

1. Pick the capsule whose signal matches the inspected page.
2. Combine at most two capsules unless the user asked for broad restructuring.
3. Translate the capsule into the smallest useful UI change.
4. Execute through the token-bound component layer.
5. Verify the path from entry to decision to action to feedback.
