# B2B Product Context

Read this before creating or changing a B2B product screen, admin system, SaaS console, CRM/ERP view, internal tool, approval flow, data-management page, settings area, reporting surface, or monitoring workspace.

## Product Frame

Infer the frame before choosing layout or components:

- Roles: admin, operator, manager, reviewer, customer success, finance, developer, analyst, or external customer.
- Core objects: customers, orders, projects, tickets, invoices, tasks, alerts, assets, policies, reports, workflows, integrations, members, or permissions.
- Main workflow: browse, filter, edit, approve, monitor, configure, investigate, report, onboard, resolve, export, or hand off.
- Density: compact workbench, balanced SaaS, trust-heavy business, friendly internal platform, dark focused workspace, or command center.
- State model: empty, loading, success, warning, error, disabled, pending, archived, overdue, or needs approval.

Ask at most one concise product question only when the missing answer would change the workflow. If the workflow is clear but style is incomplete, use `style-source-selection.md` to match an internal style prompt.

## Common Screen Types

- Dashboard: KPI cards, trend charts, alerts, recent activity, ownership, and quick actions.
- List management: search, filters, saved views, table, bulk actions, row states, pagination, and export.
- Detail page: summary header, status, metadata, tabs, timeline, related records, comments, and primary actions.
- Create/edit form: grouped fields, validation, permissions, sticky actions, and preview when useful.
- Approval queue: priority, assignee, SLA, decision actions, comments, evidence, and audit trail.
- Settings: sections, toggles, role controls, integration status, defaults, and danger zone.
- Analytics/reporting: date ranges, segments, comparisons, drill-downs, annotations, and exports.
- Monitoring console: live status, severity, ownership, incidents, logs, and escalation path.
- Permission management: roles, scopes, members, inherited access, exceptions, and audit log.

## UI Judgment

Build the working screen first, not a landing page. Prioritize scanability, comparison, repeated action, clear state, permissions, and reversible operations.

The first page should feel polished and memorable. For B2B, make it impressive through information architecture, meaningful sample data, action clarity, state design, and surface rhythm. Avoid heavy decoration by default. Compose the requested workflow from installed or on-demand components.
