# GenDesignSystem Token Bridge

Read this before creating, editing, or binding tokens when the user mentions GenDesignSystem, Design System Lab, Theme Lab, or when the project contains Theme Lab artifacts.

GenDesignSystem is an upstream token-generation system. Design Anchor should consume its exported contract instead of replacing it with a separate `design-tokens.json` baseline.

## Detection

Treat the project as GenDesignSystem / Theme Lab powered when any of these exist:

- `theme-lab.json` with `kind: "theme-lab-manifest"`,
- `theme.preset.json`,
- `vibe.json` or `vibe.manifest.json`,
- global CSS marker `/* theme-lab:runtime:start */`,
- `AGENTS.md` marker `<!-- theme-lab:agents:start -->`,
- code or docs that describe `seed -> map tokens -> semantic tokens -> shadcn adapter`.

If only a pasted Theme Lab export is available, ask the user whether to apply it as one-shot polish or a persistent project contract.

## Source Priority

Token source priority:

1. Existing Theme Lab runtime CSS marker and `theme-lab.json`.
2. Existing user token system with explicit mappings.
3. Existing `design-tokens.json`.
4. Design Anchor compact baseline.

When Theme Lab is detected, do not run the Design Anchor baseline writer unless the user explicitly asks to replace the token source.

## Theme Lab Contract

Theme Lab exports a compact but deeper contract:

```text
seed token -> algorithm map tokens -> semantic tokens -> shadcn adapter -> runtime CSS variables
```

Important runtime groups:

- shadcn adapter: `--background`, `--foreground`, `--card`, `--primary`, `--border`, `--ring`, `--radius`, sidebar/chart variables.
- semantic surfaces: `--surface-canvas`, `--surface-panel`, `--surface-raised`, `--surface-overlay`.
- semantic content: `--content-primary`, `--content-secondary`, `--content-tertiary`, `--content-disabled`.
- action/status: `--action-primary`, `--action-primary-hover`, `--status-success`, `--status-warning`, `--status-danger`.
- system feel: `--control-height-*`, `--list-row-height`, `--panel-padding`, `--elevation-card`, `--duration-*`, `--ease-*`, font variables.

Use the shadcn adapter variables first for normal shadcn components. Use the extended semantic variables when the page needs stronger surface hierarchy, density, elevation, motion, or status nuance.

## Import Modes

Use one of three modes:

| Mode | Use when | File strategy |
|---|---|---|
| One-shot page polish | user only wants one selected page/component improved | Do not create persistent theme files; use provided runtime CSS/vibe as reference for selected scope. |
| Persistent project contract | existing product should keep the theme over time | Update existing global CSS marker, create/update `theme-lab.json`, update only the `AGENTS.md` Theme Lab marker. |
| Full reproducible package | team explicitly wants local deterministic regeneration | Add seed/vibe/algorithm handoff only when requested and compatible with the project. |

Default for Design Anchor: persistent project contract when the user asks to install or adopt a GenDesignSystem theme; one-shot polish for a narrow UI refactor with pasted tokens.

## Editing Rules

- Update only Theme Lab marker blocks when they exist.
- Do not rewrite entire global CSS files.
- Do not create a parallel design-system folder.
- Do not scaffold a new app inside an existing project.
- Do not install dependencies unless approved.
- Do not manually invent new structural visual values.
- Do not copy Theme Lab preview fixtures into the user project.
- Preserve routes, APIs, data loading, state, handlers, forms, validation, permissions, feature flags, and business logic.

When changing UI, consume compiled CSS variables and token classes. When changing theme direction, update the Theme Lab seed and regenerate through Theme Lab or the available theme pipeline; do not hand-edit generated semantic values.

## Allowed Structural Styling

Prefer shadcn classes:

```text
bg-background text-foreground
bg-card text-card-foreground
bg-primary text-primary-foreground
bg-secondary text-secondary-foreground
bg-muted text-muted-foreground
border-border ring-ring
```

Use extended variables when needed:

```text
bg-[var(--surface-canvas)]
bg-[var(--surface-panel)]
bg-[var(--surface-raised)]
text-[var(--content-primary)]
text-[var(--content-secondary)]
border-[var(--border-subtle)]
border-[var(--border-default)]
[box-shadow:var(--elevation-card)]
[box-shadow:var(--elevation-popover)]
```

Forbidden for structural UI:

- raw Tailwind palette classes,
- hardcoded hex colors,
- arbitrary OKLCH values,
- one-off shadows,
- one-off border colors,
- random gradients,
- unapproved new color scales.

Raw colors can remain only for non-structural decoration, charts, or legacy assets when explicitly justified.

## Component Library Mapping

For shadcn:

- Use Theme Lab shadcn adapter variables as the runtime source.
- Keep existing `components.json`, component paths, and local shadcn source.
- Do not run `shadcn init` over an existing Theme Lab CSS marker without checking the diff.

For non-shadcn suites:

- Map Theme Lab semantic variables into the suite theme provider or CSS bridge.
- Do not replace MUI, Ant Design, Chakra, Mantine, or another suite just to use shadcn.

For custom local components:

- Replace structural raw styles with Theme Lab CSS variables gradually.
- Preserve component APIs and business logic ownership.

## Output Check

Report:

- token source: `theme-lab`, `design-tokens`, `existing-custom`, or `none`,
- Theme Lab artifacts created/updated/skipped,
- global CSS marker updated or preserved,
- whether `design-tokens.json` was avoided because Theme Lab is authoritative,
- component system consuming Theme Lab variables,
- structural raw styles replaced or intentionally preserved.
