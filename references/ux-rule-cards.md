# UX Rule Cards

Designer-maintained rule bank for functional page judgment. Load only when UX diagnosis is uncertain, the page is complex, or the user asks for deeper UX reasoning.

These rules are prompts for judgment, not specs. Keep them compact so future models can generalize instead of memorizing.

## Evidence Bar

Only add a rule when it is backed by a mature source, repeated product evidence, or a widely adopted design-system pattern.

Rule format:

```text
<Context> | When <signal>, prefer <move>, because <outcome>. Guardrail: <avoid>.
```

Contribution rules:

- one line per rule,
- one idea per rule,
- source evidence required in the Evidence Map,
- no pixel values,
- no temporary visual taste,
- remove rules that become obvious to the model.

## Source Tags

- NNG: [Nielsen Norman Group, 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/).
- WCAG: [W3C Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/).
- GOVUK: [GOV.UK Design System error summary](https://design-system.service.gov.uk/components/error-summary/).
- APG: [WAI-ARIA Authoring Practices Guide modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

## Core Rules

Status | When an action changes data or starts async work, prefer immediate state and final result feedback, because users need to know what happened. Guardrail: avoid silent save/delete/submit.

Language | When labels, headings, or actions use internal jargon, prefer user/domain language, because recognition beats interpretation. Guardrail: avoid changing legal or business meaning.

Escape | When a flow can be entered by mistake, prefer cancel/back/undo or a clear exit, because users need control and recovery. Guardrail: avoid fake undo when rollback is impossible.

Consistency | When the same action or state appears across pages, prefer the same label, component, and behavior, because inconsistency increases cognitive load. Guardrail: avoid forcing consistency across genuinely different concepts.

Error Prevention | When an action is irreversible, costly, or permission-sensitive, prefer constraints, review, or confirmation, because prevention beats recovery. Guardrail: avoid confirming low-risk repeated actions.

Recognition | When users need a frequent action or status to proceed, prefer visibility near the object, because hidden controls force memory. Guardrail: avoid exposing rare actions as primary UI.

Efficiency | When users repeatedly scan or operate on many records, prefer search/filter/sort, saved views, bulk actions, or keyboard paths, because expert use needs acceleration. Guardrail: avoid optimizing rare tasks into clutter.

Minimalism | When a section does not support decision, action, state, or trust, prefer removing or collapsing it, because irrelevant information competes with the task. Guardrail: avoid removing required context or compliance information.

Validation | When a form can fail validation, prefer a summary plus field-level messages and focus movement to the error context, because users need fast recovery. Guardrail: avoid relying on color alone.

Focus | When UI is interactive, prefer logical focus order, visible focus, keyboard operation, and focus return after modal close, because keyboard users must not get lost. Guardrail: avoid custom widgets without focus behavior.

Dialog | When using a modal/dialog, prefer focused, blocking, or high-risk decisions with managed focus, because interruption must be justified. Guardrail: avoid putting long multi-section workflows in small modals.

Headings | When a page has multiple regions or actions, prefer headings and labels that describe purpose, because navigation depends on structure. Guardrail: avoid placeholder text as the only label.

## Evidence Map

- Status: NNG visibility of system status.
- Language: NNG match with real world; WCAG headings and labels.
- Escape: NNG user control and freedom.
- Consistency: NNG consistency and standards.
- Error Prevention: NNG error prevention.
- Recognition: NNG recognition rather than recall.
- Efficiency: NNG flexibility and efficiency of use.
- Minimalism: NNG aesthetic and minimalist design.
- Validation: GOV.UK error summary; WCAG error/focus expectations.
- Focus: WCAG focus order/focus visible; APG dialog focus return.
- Dialog: APG modal dialog pattern.
- Headings: WCAG headings and labels.
