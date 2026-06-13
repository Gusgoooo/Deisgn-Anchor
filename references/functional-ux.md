# Functional UX Refactoring

Read this before changing an existing functional product page.

Design Anchor optimizes work surfaces, not showcase pages. It keeps business logic and improves the user's path through better structure, states, feedback, safety, and component consistency.

## Operating Stance

Do not beautify before diagnosing the work.

Infer:

- who uses the page,
- what job they are trying to finish,
- what information they need before acting,
- what decision or action is primary,
- what can go wrong,
- what feedback confirms progress,
- what should become faster on repeat use.

If the page is marketing, landing, editorial, or brand showcase, say it is outside the default Design Anchor path unless the user explicitly asks for showcase work.

## Heuristic Clarification

Do not hallucinate a product strategy for complex pages.

Ask a few contextual questions before restructuring when the page, component, or section is complex, high-risk, domain-specific, or missing enough product context. Base the questions on inspected code and UI signals, not on a fixed questionnaire.

Ask only what changes the strategy, such as:

- what problem this page, component, or section mainly solves,
- who the primary user is,
- what user-goal trajectory is expected from entry to decision to action to feedback,
- what constraints must not break, such as permissions, compliance, data accuracy, or ownership.

Use this actively for approval flows, settings/configuration, data-heavy workspaces, financial or permission-sensitive actions, multi-role workflows, and complex creation/editing flows.

Skip it for small obvious repairs such as token cleanup, local spacing, missing loading state, a mislabeled button, or replacing an ad hoc component with an existing token-bound component.

## Keep / Modify / Remove / Add / Restructure

Classify meaningful UI areas before editing:

| Decision | Use when | Action |
|---|---|---|
| Keep | The current layout supports the task, state, and interaction clearly | Preserve structure; bind tokens or lightly polish. |
| Modify | The structure is mostly right but weak in hierarchy, feedback, density, or component consistency | Improve spacing, labels, states, action placement, and component usage. |
| Remove | The section distracts, duplicates information, hides the primary task, or exists only as decoration | Delete or collapse after confirming it has no business value. |
| Add | A necessary task, state, feedback, control, or safety mechanism is missing | Add the smallest useful interaction or component. |
| Restructure | The current model prevents efficient task completion | Recompose with tables, tabs, drawers/sheets, dialogs, split panes, timelines, or workflow steps. |

Simple pages should usually be keep/modify. Complex pages can be add/restructure. Do not redesign just to make the result look new.

## Diagnosis Shape

Before editing, build a compact diagnosis:

```text
功能页面：<yes|no>
用户任务：<scan|filter|compare|approve|configure|create|edit|monitor|debug|collaborate|review|other>
主路径：<entry -> decision -> action -> feedback>
关键对象：<records/entities/settings/messages/files/jobs/etc>
痛点假设：<slow scanning|unclear status|hidden action|unsafe submit|weak feedback|state gaps|mobile friction|other>
保留/改动：<keep|modify|remove|add|restructure>
UX prompt：<dense-records|contextual-edit|risky-action|long-form|workflow-state|split-workspace|settings-configuration|dashboard-triage|detail-review|ai-workspace|permission-empty|mobile-fallback>
```

Read `references/ux-prompt-capsules.md` when the diagnosis points to a specific interaction problem. Use one or two capsules as strong direction, then adapt to local code and token-bound components.

For complex or ambiguous pages, optionally read `references/ux-rule-cards.md`. If the problem is still enterprise-specific or accessibility-uncertain, use `references/ux-pattern-sources.md` to choose an authoritative pattern source. Do not browse by default.

## Interaction Moves

Use these when they serve the task:

- Move primary actions to the decision point.
- Separate primary, secondary, destructive, row-level, and bulk actions.
- Add search/filter/sort where users scan many records.
- Add selected, hover, loading, empty, error, partial, saving, saved, success, disabled, and permission states.
- Make validation local, visible, and recoverable.
- Add confirmation only for irreversible or high-risk actions.
- Use optimistic UI only when rollback is clear.
- Add progress, stage, owner, blocker, due date, or audit trail when workflow state matters.
- Use inline editing for fast low-risk changes.
- Use sheets/drawers for contextual create/edit/detail flows where surrounding context matters.
- Use dialogs/modals for focused confirmation, short forms, or interruptive high-risk decisions.
- Use split panes when the user repeatedly moves between list and detail.
- Preserve the original layout when adding a state, label, or action placement is enough.
- Make mobile behavior explicit: stacked filters, sheet detail, horizontal table fallback, sticky submit where useful.

Animation is acceptable only when it clarifies feedback, continuity, or state.

## Copy And Feedback

Improve microcopy when it affects UX:

- replace vague labels with domain-specific action names,
- make empty states say what happened and what to do next,
- make errors recoverable,
- make destructive copy explicit,
- make disabled states explain why,
- make success feedback confirm the object and result.

Do not invent business claims or change domain meaning. Preserve product terminology unless it is clearly inconsistent.

## Delivery Self-Check

Before final response, verify:

- primary task is obvious,
- primary action is near the decision point,
- repeated tasks are faster or clearer,
- risky actions are safer,
- reachable states have feedback,
- keyboard/focus behavior is not worse,
- responsive behavior is explicit,
- structural styles are token-bound,
- no showcase pattern replaced a work surface.
