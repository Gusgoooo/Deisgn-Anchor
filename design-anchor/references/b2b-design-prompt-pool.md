# B2B Design Prompt Pool

This is the index for reusable B2B style sources. Each preset/style has its own prompt file under `references/b2b-design-prompts/`.

Read this file first when the user asks for a B2B product/page and the product type, workflow, or visual direction would benefit from a richer style source. Then load only the closest style file.

## Style Source Files

| Preset | File | Use when |
|---|---|---|
| `linear` | `references/b2b-design-prompts/linear.md` | Dense workbenches, CRM, task systems, operations, data-heavy admin pages |
| `stripe` | `references/b2b-design-prompts/stripe.md` | Billing, finance, account portals, compliance, procurement, trust-heavy workflows |
| `saas-style-01` | `references/b2b-design-prompts/saas-style-01.md` | Modern SaaS dashboards, analytics, onboarding, team collaboration |
| `google-style` | `references/b2b-design-prompts/google-style.md` | Friendly internal tools, support, education, HR, broad-team CRM, settings |
| `minimal-dark` | `references/b2b-design-prompts/minimal-dark.md` | AI workspaces, developer tools, focused analysis, model ops, premium productivity |
| `hud-dark-style` | `references/b2b-design-prompts/hud-dark-style.md` | Security, risk, trading, incident response, infrastructure, command centers |

## How To Use

1. Infer or choose the style source from the user's requested feeling, density, and workflow.
2. Read only the matching style file.
3. Treat the file like a user-provided prompt.
4. Run `npx design-anchor theme <style-source.md>` so Design Anchor extracts token/style guidance.
5. Generate a complete polished B2B screen from `style source + product context` with `@design` components, semantic tokens, specs, sync, and audit.

## How To Add Prompts

When the user asks to add, collect, save, or expand B端设计 prompts/style sources:

1. Choose the matching style file.
2. Append a compact page variant or prompt section to that file.
3. Preserve the user's wording when it carries useful product taste.
4. Keep prompt text style-facing and reusable; avoid binding preset files deeply to one product type.

Use this card shape inside a style file:

```md
### Prompt Name

Design ...
```

If a prompt does not fit any existing style, create a new file in `references/b2b-design-prompts/` and add it to the Style Files table.

## Governance Reveal

Use this after the first polished page is generated:

```text
这不是一次性的页面样式。它已经被 Design Anchor 接到 token、组件、spec 和 audit 上：后续新增页面会继续复用同一套 @design 组件和语义 token，避免按钮、表格、表单、状态色各长各的。
```
