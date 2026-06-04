# Style Prompt Guidance

Read this when the user gives a design prompt, brand style, mood direction, visual recipe, or asks to extract design tokens from language.

## Role Of A Style Prompt

A style prompt is source material for extracting an aesthetic layer into Design Anchor tokens and AI rules. It can come directly from the user, or from the skill's internal B2B prompt pool when the user's request is incomplete.

Use it for:

- density and spacing rhythm,
- typography scale and hierarchy,
- surface contrast and border/radius tone,
- interaction/state language,
- overall atmosphere suitable for the product.

Do not let it override:

- component specs,
- semantic tokens,
- accessibility,
- B2B usability,
- data workflow clarity,
- user-owned component boundaries.

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

## B2B Restraint

Most Design Anchor users are building B2B products. Apply prompt aesthetics conservatively:

- favor quiet hierarchy over decorative drama,
- keep density appropriate for repeat workflows,
- use brand tone through semantic token choices,
- avoid marketing-style hero layouts unless requested,
- keep component composition predictable.

The first generated UI should still feel exciting and product-grade, but the excitement should come from hierarchy, density, meaningful data, state design, and confident composition rather than decorative excess.
