# Design Anchor Project Contract

Read this before installing Design Anchor, changing component/token files, deciding whether a repo is a consumer project or the Design Anchor source repo, or explaining what should be committed.

## Consumer Project Layout

| Layer | Location | Git strategy | Rule |
|---|---|---|---|
| User-owned components | `src/components/anchor-ui/` | Commit | Real source used by the app. Add only needed components. Business code imports through `@design` or `@/components/anchor-ui`. |
| Design tokens | `src/design-tokens/tokens.json` | Commit | Product token source of truth. Edit this file, then sync generated assets. |
| Generated token CSS | `src/styles/design-tokens.generated.css` | Commit | Generated from tokens so theme output is reproducible for teammates and CI. |
| Anchor control plane | `.anchor/` | Do not commit | Local Portal, schema, sync/runtime state, demos, and MCP target. It is rebuildable with `hydrate` or `sync`. |
| Component specs | `.anchor/src/anchor/schema/components/*.spec.json` | Do not commit unless the product explicitly changes policy | Local AI contract for governed components. User-written components may have missing or empty specs. |
| AI coding rules | `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/anchor.mdc`, `.github/copilot-instructions.md` | Commit when useful for the team | Generated rules that keep future AI coding aligned with tokens and components. |
| MCP config | `.mcp.json`, `.cursor/mcp.json` | Commit when useful for the team | Should call `npx --no-install design-anchor mcp ./.anchor` so teammates use the installed dependency. |
| Upstream package | `node_modules/design-anchor/` | Never commit | Read-only package cache. Do not patch directly. Use `anchor upgrade` or package source changes. |

Never import app UI from `.anchor/` or `node_modules/design-anchor/` deep paths.

## Source Repo Vs Consumer Repo

The target is the Design Anchor source package when `package.json` has `"name": "design-anchor"` and the repo contains `bin/anchor.mjs` plus `src/anchor-portal/`.

In the source repo:

- Do not run `npx design-anchor start`; it scaffolds consumer state into the package repo.
- Edit package source directly, such as `bin/`, `src/anchor`, `src/anchor-portal`, `src/components`, `src/design-tokens`, or `scripts`.
- Verify with package scripts such as `npm run sync:anchor`, `npm run anchor:audit`, `npm run lint`, `npm run typecheck`, or `npm publish --dry-run` when relevant.

In a consumer project:

- Install the runtime as a dev dependency.
- Use `sync` for background activation and generated rules.
- Use `hydrate` when `.anchor/` is missing after clone.
- Use `add` only for components that the current UI actually needs.
- Use `theme <prompt.md>` when the user gives style direction to extract design tokens.
- Open Portal only for intentional inspection or tuning.

## Preferred Commands

Background activation:

```bash
npm install -D design-anchor
npx design-anchor sync
```

Rebuild local control plane:

```bash
npx design-anchor hydrate
```

Add a component on demand:

```bash
npx design-anchor add button
```

Extract tokens from a user style prompt:

```bash
npx design-anchor theme design-prompt.md
npx design-anchor sync
```

Inspect or tune Design Anchor state:

```bash
npx design-anchor portal tokens
npx design-anchor portal components
npx design-anchor portal specs
npx design-anchor portal docs
```

Post-change checks:

```bash
npx design-anchor sync
npx design-anchor audit
```

Final responses for UI changes must include a `Design Anchor 自检` line.
