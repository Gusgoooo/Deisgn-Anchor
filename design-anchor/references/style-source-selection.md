# Style Source Selection Reference

Read this when the user gives a vague product need and the skill should choose a built-in style source before code generation.

Do not treat presets as product templates. Presets and user-provided prompts are both style sources. The skill chooses a style source, then Design Anchor extracts token/style signals with `npx design-anchor theme <prompt.md>`.

## Intake Goal

Ask enough to choose a style source, not enough to slow the user down. Use at most three questions. If the user's request already implies a style source, infer it and continue.

## Three Heuristic Questions

Ask in the user's language. Prefer compact choices plus an open escape hatch.

1. Product type:
   `这页更像哪类体验？A 高频克制 / B 高信任商务 / C 现代 SaaS / D 友好易上手 / E 暗色专注 / F 高信号指挥舱`

2. Primary job:
   `用户主要在这里做什么？扫数据、处理表单、配置设置、监控风险、转化注册，还是别的？`

3. Density and mood:
   `你希望整体密度和氛围是：紧凑克制、平衡清爽、宽松可信、柔和易上手、暗色专注？`

If the user gives a loose product requirement, ask only the missing question. If the user says "你决定", choose the safest style source and explain why.

## Style Source Mapping

| Source | Choose when the user wants | Avoids |
|---|---|---|
| `linear` | compact, sharp, quiet, high-frequency, dark-capable product rhythm | decorative heroes, oversized cards, gradients |
| `stripe` | polished, generous, credible, trust-heavy business rhythm | excessive decoration, shadow-heavy card stacks |
| `saas-style-01` | clean, confident, product-led baseline | playful decoration, landing-page patterns inside app screens |
| `google-style` | soft, rounded, familiar, easy to learn | cartoonish UI, oversized pills, low-density operational screens |
| `minimal-dark` | dark, focused, premium, calm workspace | cinematic dark effects, glowing panels, low-contrast controls |
| `hud-dark-style` | high-signal, controlled, command-center feel | fake sci-fi ornament, overdramatic metrics |

Default to `saas-style-01` for a general new SaaS page. Default to `linear` for dense existing-product dashboards. Default to `stripe` for money, billing, compliance, or account flows.

## Using The Style Source

State the chosen source before extraction:

`我会用 Linear style source：它会提供紧凑、克制、适合高频扫描的风格输入，随后交给 Design Anchor 提取 token 和规则。`

Then run the Design Anchor runtime:

```bash
npx design-anchor theme <style-source.md>
npx design-anchor sync
```

The resulting style guidance must remain subordinate to component specs and semantic tokens.
