# Style Prompt Guidance

Read this when the user gives a design prompt, brand style, mood direction, visual recipe, or asks to extract design tokens from language.

## Role Of A Style Prompt

A style prompt is source material for extracting an aesthetic layer into Design Anchor tokens and AI rules. It can come directly from the user, or from the skill's internal prompt pool when the user's request is incomplete.

Use it for:

- density and spacing rhythm,
- typography scale and hierarchy,
- surface contrast and border/radius tone,
- interaction/state language,
- overall atmosphere suitable for the product,
- layout density preference (compact vs balanced vs spacious),
- sidebar and navigation tone (heavy vs minimal),
- content area rhythm (dense grid vs open flow).

Do not let it override:

- component specs,
- semantic tokens,
- accessibility,
- product usability,
- data workflow clarity,
- user-owned component boundaries,
- screen type layout patterns from `layout-governance.md`,
- information architecture decisions driven by workflow analysis.

## Detailed User Prompt Flow

Use this when the user already gives enough design language to infer token direction.

1. Save the user's prompt into a project-local markdown file, such as `design-prompt.md` or `.anchor/design-prompt-source.md`.
2. Run:

```bash
npx design-anchor theme <prompt.md>
```

3. Sync generated rules and token CSS:

```bash
npx design-anchor sync
```

4. If UI changed, run:

```bash
npx design-anchor audit
```

5. Generate the first page with the extracted style, product context, `@design` components, and semantic tokens.
6. Open `npx design-anchor portal tokens` only when the user wants to inspect or tune the result.

## Internal Prompt Flow

Use this when the user asks for a page or product but does not provide enough style language.

1. Read `style-source-selection.md`.
2. Ask one concise heuristic question if needed.
3. Select one prompt from `b2b-design-prompt-pool.md`.
4. Do not reveal the internal prompt name.
5. Tell the user: `我帮你匹配到一个适合这个场景的风格方向，会先转成 token，再生成页面。`
6. Save the selected prompt into `.anchor/design-prompt-source.md` or `design-prompt.md`.
7. Run `npx design-anchor theme <prompt.md>`, then sync and continue page generation.

## Product Restraint

Most Design Anchor users are building functional products (B2B, SaaS, AI tools, internal tools). Apply prompt aesthetics conservatively:

- favor quiet hierarchy over decorative drama,
- keep density appropriate for repeat workflows,
- use brand tone through semantic token choices,
- avoid marketing-style hero layouts unless requested,
- keep component composition predictable.

Apply prompt layout preferences within the screen type pattern:

- a prompt that says "spacious" adjusts spacing tokens, not the section structure of a list page,
- a prompt that says "dark" applies dark surface tokens, not a fundamentally different layout,
- a prompt that says "compact" increases density within sections, not by removing necessary sections,
- a prompt that says "friendly" adjusts radius, color warmth, and copy tone, not the information hierarchy.

The style prompt shapes the look; `layout-governance.md` shapes the structure. When they conflict, structure wins.

The first generated UI should still feel exciting and product-grade, but the excitement should come from hierarchy, density, meaningful data, state design, and confident composition rather than decorative excess.
