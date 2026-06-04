# Design Anchor Skill

Design Anchor Skill is the AI entry layer for the `design-anchor` npm runtime.

Use it when AI coding work touches B2B product UI, design tokens, component specs, `@design` components, style prompts, MCP, sync, audit, or Design Anchor Portal. The skill helps new products start with a polished first page, and helps mature existing products enter a consent-gated governance flow.

## What It Does

- Checks whether the target project is a consumer app or the Design Anchor source repo.
- Detects whether the target looks like a mature existing product.
- Decides whether the user's design request is complete enough to extract tokens directly.
- Uses a short heuristic question when the request is incomplete.
- Matches an internal B2B style prompt without exposing preset names to the user.
- Offers `只读审计`, `生成治理计划`, or `开始第一阶段治理` for mature products, and never edits files until the user explicitly confirms the governance risk.
- Lets the skill maintainer expand the prompt pool by adding one markdown file per prompt under `design-anchor/references/b2b-design-prompts/`.
- Installs `design-anchor` as a dev dependency when missing.
- Runs `npx design-anchor sync` for background governance instead of forcing Portal first.
- Converts user style prompts into design tokens with `npx design-anchor theme <prompt.md>`.
- Adds source components only when needed with `npx design-anchor add <component>`.
- Keeps business code importing from `@design` or `@/components/anchor-ui`.
- Treats `.anchor/` as local, gitignored, and rebuildable with `hydrate` or `sync`.
- Opens Portal only when the user wants to inspect or tune tokens, components, specs, docs, or health.

## Install Locally

Copy the skill folder into your Codex skills directory:

```bash
mkdir -p ~/.codex/skills
cp -R design-anchor ~/.codex/skills/design-anchor
```

Then use `$design-anchor` in Codex.

## Runtime Model

Design Anchor separates user-owned app code from the local control plane:

| Layer | Location | Git strategy |
|---|---|---|
| User-owned components | `src/components/anchor-ui/` | Commit |
| Design tokens | `src/design-tokens/tokens.json` and generated CSS under `src/styles/` | Commit |
| Anchor control plane | `.anchor/` | Do not commit |

Business code should import installed components from `@design` or `@/components/anchor-ui`, never from `.anchor/` or `node_modules/design-anchor/` deep paths.

## Existing Product Governance

When the target project already has substantial pages, components, and styles, the skill does not automatically normalize code. It first explains the risk and offers:

- `只读审计`: scan and report only.
- `生成治理计划`: produce a phased plan only.
- `开始第一阶段治理`: make limited low-risk changes after explicit confirmation.

This protects existing products from broad component rewrites, token renames, style remapping, or import changes without consent.

## Prompt Pool

As the skill maintainer, add custom style prompts as markdown files under:

```text
design-anchor/references/b2b-design-prompts/
```

Each file should start with the standard frontmatter shown in `_template.md`, especially `best_for`, `keywords`, `density`, `tone`, and `mode`. The skill uses those fields internally to match incomplete end-user requests, then turns the selected prompt into Design Anchor tokens. End users do not manage this pool during normal product use.

## Package For Upload

From this repository root:

```bash
zip -r design-anchor.zip design-anchor -x "*/.DS_Store"
```

The zip must contain `design-anchor/SKILL.md` at the top level.
