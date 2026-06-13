# UX Pattern Sources

Optional authority map for complex functional UX questions. Use only when local code, `functional-ux.md`, and `ux-rule-cards.md` are not enough.

Do not browse by default. Do not copy patterns blindly. Use these sources to calibrate judgment, then adapt to the user's business logic, data, stack, and component system.

## When To Look Outside

Look up an external pattern source when:

- the interaction is complex, high-risk, or enterprise-specific,
- local UI has no reliable precedent,
- the page combines multiple workflows,
- accessibility behavior is uncertain,
- the user asks for deeper design reasoning.

## Authority Routes

| Source | Use For | Start Here |
|---|---|---|
| Salesforce Lightning Design System | CRM, record/detail pages, dense tables, enterprise workflows, filters/rules, modals | https://www.lightningdesignsystem.com/ |
| IBM Carbon Design System | enterprise product patterns, empty states, AI/product workflows, complex data and state guidance | https://carbondesignsystem.com/patterns/overview/ |
| SAP Fiori | ERP, master data, configuration, approvals, object pages, enterprise forms, role-based workflows | https://www.sap.com/design-system/fiori-design-web |
| Atlassian Design System | collaboration, project/work management, issue/task flows, status, navigation, product pattern consistency | https://atlassian.design/patterns |
| Microsoft Fluent 2 | productivity apps, command surfaces, layout, focus/tab order, Microsoft-like enterprise UX | https://fluent2.microsoft.design/ |
| Shopify Polaris | admin tools, resource indexes, filters, saved views, resource details, commerce operations | https://polaris-react.shopify.com/patterns |
| Adobe Spectrum | creative/professional tools, panels, complex controls, inclusive product interaction | https://spectrum.adobe.com/ |
| GOV.UK Design System | forms, validation, error summaries, transactional clarity, accessibility-first public service UX | https://design-system.service.gov.uk/ |
| W3C WCAG / WAI-ARIA APG | accessibility requirements, focus, keyboard, dialogs, names/roles/states | https://www.w3.org/TR/WCAG22/ and https://www.w3.org/WAI/ARIA/apg/ |
| Nielsen Norman Group | general usability heuristics, error prevention, recognition, status, efficiency, cognitive load | https://www.nngroup.com/articles/ten-usability-heuristics/ |

## Use Rules

- Prefer official design-system pages over blogs.
- Prefer pattern/component guidance over visual examples.
- Extract the principle, not the visual skin.
- Cite the source in reasoning only when it materially influenced the decision.
- Do not use Material Design or Material You as an authority route unless the user explicitly asks for that ecosystem.
- Never let an external pattern override local business logic.
