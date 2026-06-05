# Product Context

Read this before creating or changing a product screen. This applies to all product types: admin systems, SaaS platforms, AI tools, internal tools, developer tools, creative tools, data products, monitoring systems, and any interface where users do real work.

## Product Frame

Infer the frame before choosing layout or components:

- Roles: who uses this page? Admin, operator, end user, developer, analyst, content creator, reviewer, or AI-assisted worker.
- Core objects: what does the user work with? Records, conversations, documents, tasks, metrics, configurations, media, code, or AI outputs.
- Main workflow: what is the user doing? Browsing, searching, creating, editing, monitoring, configuring, reviewing, conversing, building, analyzing, or approving.
- Density: does this task need high-density display (monitoring, operations), balanced layout (standard CRUD), focused single-track (writing, chat), or minimal-chrome workspace (canvas, editor)?
- State model: what states does this page need? Empty, loading, success, error, streaming, partial, disabled, pending, archived, or needs-action.

Ask at most one concise product question only when the missing answer would change the layout approach. If the workflow is clear but style is incomplete, use `style-source-selection.md` to match an internal style prompt.

## Page Purpose Categories

Instead of rigid screen types, think about what the page is for. The layout should serve the purpose.

**Consumption** — the user is reading, scanning, or monitoring.
Examples: dashboards, activity feeds, log viewers, monitoring consoles, documentation, report views.
Layout priority: information hierarchy, scanability, density appropriate to refresh frequency.

**Collection management** — the user is browsing, filtering, and acting on groups of items.
Examples: tables, lists, grids, queues, inboxes, file managers.
Layout priority: search/filter always visible, data view maximized, bulk actions contextual.

**Single record focus** — the user is understanding and acting on one specific entity.
Examples: detail pages, profile views, order views, ticket views, single conversation.
Layout priority: identity and status prominent, key facts before details, related context supplementary.

**Input and creation** — the user is providing structured or unstructured content.
Examples: forms, editors, composers, configuration pages, prompt builders.
Layout priority: fields grouped logically, actions always reachable, validation inline, progressive disclosure.

**Conversation and interaction** — the user is communicating with an AI, another person, or a system.
Examples: chat interfaces, AI assistants, support tickets, comment threads, collaborative editing.
Layout priority: conversation dominates, input always anchored, streaming handled gracefully, context collapsible.

**Spatial workspace** — the user is creating or manipulating content in a free-form space.
Examples: design tools, code editors, diagram builders, canvas interfaces, AI agent workspaces.
Layout priority: workspace maximized, chrome minimal and collapsible, tools at edges.

**Decision and review** — the user is evaluating items and making choices.
Examples: approval queues, code review, content moderation, comparison views, AI output review.
Layout priority: split-pane or side-by-side, decision actions sticky, auto-advance after decision.

## Layout Anti-Patterns

These are common layout mistakes. When encountered during audit or restructuring, fix them.

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Marketing hero on a workbench | Wastes vertical space the user scrolls past repeatedly | Remove; put primary content first |
| Filters in a modal or collapsible | Hides the most-used controls on a collection page | Make filters always visible inline |
| Icon soup in rows | Multiple inline icons per row create visual noise and mis-click risk | Use a dropdown menu for row actions |
| Sidebar wider than content | Supplementary context dominates primary content | Reduce sidebar; move primary content out |
| Cards for everything | Cards add borders and padding that reduce density | Use cards for discrete items; rows for settings and configuration |
| Status as plain text | "Active" in plain text has no visual weight | Use semantic badges with color coding |
| No empty state | Blank page when no data exists | Design an empty state with explanation and primary action |
| Inconsistent shell | Sidebar/header rearranges between pages | Keep a consistent shell; only change content area |
| Mixed icon libraries | Lucide + Heroicons + FontAwesome on the same page | Consolidate to one library |
| Decorative icons | Icons on every label with no recognition value | Remove icons that do not aid scanning |
| Chat input at top | Conversation input placed above history | Input at bottom — it is the most recent action point |
| Full-width forms | Every field stretched to 100% width regardless of content | Match field width to expected content length |
| Persistent banners | Welcome messages, announcements shown on every visit | Dismissible, or shown once |

## UI Judgment

Build the working interface first, not a landing page. Prioritize scanability, task completion speed, clear state, and reversible operations.

The first page should feel polished and purposeful. Make it impressive through information architecture, meaningful data, action clarity, state design, and spatial rhythm. Avoid heavy decoration by default.

When restructuring an existing page, the goal is not to make it look different — it is to make the user's task easier. Every layout change should be traceable to a workflow improvement.
