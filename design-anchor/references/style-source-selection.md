# Style Source Selection

Read this when the user's request is not complete enough to extract a design system from their own words.

The goal is not to show a preset picker. The goal is to quickly infer a suitable style direction, pull the matching internal prompt file, translate it into Design Anchor tokens, and start building a polished first page.

## Completeness Heuristic

Treat a request as detailed enough when it includes:

- product or workflow goal,
- target screen or page type,
- enough visual direction to infer density, tone, surface style, and hierarchy.

Treat it as incomplete when:

- it only names a product category, such as CRM, dashboard, admin, approval, billing, or SaaS,
- it gives style mood without product workflow,
- it asks for "cool", "advanced", "professional", or "beautiful" without concrete design language,
- it lacks whether the interface should feel compact, trustworthy, friendly, dark, or real-time.

## Heuristic Question

Ask at most one short question before matching. Use user-facing words, not preset names:

`我先给你匹配一个适合的风格方向。你更想要：高效紧凑、稳重可信、清爽友好、深色专注，还是实时指挥感？`

If the user already gave enough product context, you may infer without asking and say:

`我帮你匹配到一个适合这个场景的风格方向，会先转成 token，再生成页面。`

## Prompt Discovery

Prompt files live under `b2b-design-prompts/*.md`. The skill maintainer can add new prompts by adding one markdown file per prompt. Each file must include the standard frontmatter described in `b2b-design-prompt-pool.md`.

List available prompt metadata with:

```bash
node "${CLAUDE_SKILL_DIR:-skills/design-anchor}/scripts/list-style-prompts.mjs"
```

If the script path is unavailable, inspect `references/b2b-design-prompts/*.md` and read only each file's frontmatter before selecting.

## Matching Rule

Choose the prompt whose `best_for`, `keywords`, `density`, `tone`, and `mode` best match:

- the user's product category,
- the workflow,
- the target screen type,
- the user-facing style direction,
- and any constraints in `avoid_for`.

The existing prompt files are starter examples. New maintainer-added files are equally valid when their metadata is a better match.

## After Matching

1. Load only the selected prompt file.
2. Save the prompt into the target project, usually `.anchor/design-prompt-source.md`.
3. Run `npx design-anchor theme <prompt.md>`.
4. Sync rules with `npx design-anchor sync`.
5. Generate the first page with `@design` components and semantic tokens.
6. Run audit when UI changed.

Never expose the internal prompt filename unless the user explicitly asks how matching works.
