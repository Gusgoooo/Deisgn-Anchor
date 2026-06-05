# Design Prompt Pool

This folder is an extensible internal prompt pool for Design Anchor Skill. Use it when the user's own design prompt is incomplete. The prompts cover all product types — B2B, SaaS, AI tools, developer tools, and creative tools.

The skill maintainer can expand this pool by dropping markdown files into:

```text
references/b2b-design-prompts/
```

Each prompt is one file. The file must start with standard frontmatter that explains when the prompt is appropriate. The skill uses that metadata internally to match the end user's request, then loads only the selected prompt and translates it into Design Anchor tokens. End users are not asked to manage or choose files from this pool.

## Required File Format

```markdown
---
name: "Efficient Workbench"
slug: "efficient-workbench"
user_facing_direction: "高效紧凑"
best_for:
  - "operations workbench"
  - "project management"
  - "dense admin table"
avoid_for:
  - "marketing landing page"
keywords:
  - "ops"
  - "task"
  - "filter"
density: "compact"
tone: "focused, precise, calm"
mode: "light"
---

# Internal Style Prompt: Efficient Workbench

Write the actual style prompt here.
```

## Field Meaning

| Field | Required | Meaning |
|---|---|---|
| `name` | Yes | Human-readable internal name. Do not show it to the user unless asked. |
| `slug` | Yes | Stable id for matching/logging. |
| `user_facing_direction` | Yes | Plain-language direction that can be used in heuristic questions. |
| `best_for` | Yes | Scenarios, products, workflows, or page types where this prompt fits. |
| `avoid_for` | Recommended | Scenarios where this prompt is a poor fit. |
| `keywords` | Recommended | Extra matching words. |
| `density` | Recommended | Compact, balanced, spacious, command-center, etc. |
| `tone` | Recommended | Trustworthy, friendly, technical, premium, calm, etc. |
| `mode` | Recommended | Light, dark, mixed, either. |

## Matching Flow

1. Run `scripts/list-style-prompts.mjs` to inspect available metadata.
2. Pick the best file by matching `best_for`, `keywords`, `density`, `tone`, and `mode` to the user's product context.
3. Do not expose the internal file name or slug.
4. Tell the user: `我帮你匹配到一个适合这个场景的风格方向，会先转成 token，再生成页面。`
5. Save the selected prompt into the target project as `.anchor/design-prompt-source.md` or `design-prompt.md`.
6. Run `npx design-anchor theme <prompt.md>`.
7. Use the resulting tokens with the user's product context to generate the first page.

Component specs and semantic tokens remain stronger than the prompt.
