# Token Contract

Read this before creating, editing, or binding visual tokens.

Design Anchor supports two token paths:

1. GenDesignSystem / Theme Lab contract when present or requested.
2. `design-tokens.json` as the compact Design Anchor fallback.

`design-tokens.json` is not required when Theme Lab is already the source of truth. If Theme Lab is absent, `design-tokens.json` is the user's theme contract. It does not need to use Design Anchor's exact internal names, but it must let the skill emit predictable CSS variables. Use direct semantic keys for new projects, or add mapping profiles for projects with existing token names.

The goal is a compact token layer that component systems can consume: page surfaces, text, primary actions, borders, focus rings, status colors, charts, sidebar surfaces, and radius. Do not expand the contract into hundreds of derived tokens.

Token is one of the two Design Anchor cores. It solves style consistency: shared surfaces, typography color, actions, borders, status, focus, radius, and component-library theme inputs. It does not decide the interaction model or page framework; `functional-ux.md` does that through task diagnosis and UX prompt routing.

## Priorities

1. Use existing Theme Lab artifacts when `theme-lab.json`, `theme-lab:runtime`, or `theme-lab:agents` exists.
2. Use an existing custom/user token system when it has a clear mapping path.
3. Use an existing `design-tokens.json` when Theme Lab is absent.
4. If all token sources are missing and implementation is requested, create a compact Design Anchor semantic token file.
5. Bind tokens into the project's existing global CSS file.
6. Make components consume semantic variables/classes, not raw structural colors.
7. Add component-library mappings only for the libraries the project actually uses.
8. Keep decorative richness outside the structural token system when it is intentional.

## GenDesignSystem / Theme Lab

Read `references/gendesignsystem-token-bridge.md` when the project mentions GenDesignSystem, Design System Lab, Theme Lab, or contains Theme Lab artifacts.

Theme Lab source signals:

- `theme-lab.json` with `kind: "theme-lab-manifest"`,
- global CSS marker `/* theme-lab:runtime:start */`,
- `AGENTS.md` marker `<!-- theme-lab:agents:start -->`,
- `theme.preset.json`, `vibe.json`, `vibe.manifest.json`, or a theme algorithm handoff.

When detected:

- Treat Theme Lab runtime CSS variables as the styling source of truth.
- Do not create `design-tokens.json` just to satisfy Design Anchor.
- Do not run the Design Anchor baseline writer unless the user explicitly wants a fallback token file.
- Update only Theme Lab marker blocks when they exist.
- Use Theme Lab shadcn adapter variables for normal shadcn classes.
- Use extended semantic variables for density, elevation, surfaces, content hierarchy, motion, and richer B2B state styling.
- If the theme direction should change, update the Theme Lab seed and regenerate through Theme Lab or the available local theme pipeline; do not hand-edit generated semantic values.

For Theme Lab projects, report `token source: theme_lab` in the final self-check.

## Standard Shape

Use this direct shape only when creating a new `design-tokens.json` fallback:

```json
{
  "name": "enterprise-neutral",
  "format": "design-anchor-semantic-tokens/v1",
  "cssVariables": true,
  "radius": "0.625rem",
  "light": {
    "background": "oklch(1 0 0)",
    "foreground": "oklch(0.145 0 0)",
    "card": "oklch(1 0 0)",
    "card-foreground": "oklch(0.145 0 0)",
    "popover": "oklch(1 0 0)",
    "popover-foreground": "oklch(0.145 0 0)",
    "primary": "oklch(0.205 0 0)",
    "primary-foreground": "oklch(0.985 0 0)",
    "secondary": "oklch(0.97 0 0)",
    "secondary-foreground": "oklch(0.205 0 0)",
    "muted": "oklch(0.97 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    "accent": "oklch(0.97 0 0)",
    "accent-foreground": "oklch(0.205 0 0)",
    "destructive": "oklch(0.577 0.245 27.325)",
    "destructive-foreground": "oklch(0.985 0 0)",
    "border": "oklch(0.922 0 0)",
    "input": "oklch(0.922 0 0)",
    "ring": "oklch(0.708 0 0)",
    "chart-1": "oklch(0.646 0.222 41.116)",
    "chart-2": "oklch(0.6 0.118 184.704)",
    "chart-3": "oklch(0.398 0.07 227.392)",
    "chart-4": "oklch(0.828 0.189 84.429)",
    "chart-5": "oklch(0.769 0.188 70.08)",
    "sidebar": "oklch(0.985 0 0)",
    "sidebar-foreground": "oklch(0.145 0 0)",
    "sidebar-primary": "oklch(0.205 0 0)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-accent": "oklch(0.97 0 0)",
    "sidebar-accent-foreground": "oklch(0.205 0 0)",
    "sidebar-border": "oklch(0.922 0 0)",
    "sidebar-ring": "oklch(0.708 0 0)",
    "success": "oklch(0.55 0.17 142)",
    "success-foreground": "oklch(0.985 0 0)",
    "warning": "oklch(0.75 0.16 85)",
    "warning-foreground": "oklch(0.205 0 0)"
  },
  "dark": {
    "background": "oklch(0.145 0 0)",
    "foreground": "oklch(0.985 0 0)",
    "card": "oklch(0.205 0 0)",
    "card-foreground": "oklch(0.985 0 0)",
    "primary": "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)"
  }
}
```

The baseline may include additional B2B tokens when a project needs them, but keep names semantic and human-readable.

## Custom Names With Mapping

If the user already has a token structure, preserve it and add mappings instead of renaming everything.

Example:

```json
{
  "name": "acme-admin",
  "format": "design-anchor-token-map/v1",
  "radius": "8px",
  "brand": {
    "blue": "oklch(0.55 0.2 260)",
    "blueText": "oklch(0.99 0 0)"
  },
  "surfaces": {
    "light": {
      "app": "oklch(0.99 0 0)",
      "panel": "oklch(1 0 0)",
      "text": "oklch(0.16 0 0)"
    },
    "dark": {
      "app": "oklch(0.14 0 0)",
      "panel": "oklch(0.2 0 0)",
      "text": "oklch(0.98 0 0)"
    }
  },
  "mappings": {
    "cssVariables": {
      "background": {
        "light": "surfaces.light.app",
        "dark": "surfaces.dark.app"
      },
      "foreground": {
        "light": "surfaces.light.text",
        "dark": "surfaces.dark.text"
      },
      "card": {
        "light": "surfaces.light.panel",
        "dark": "surfaces.dark.panel"
      },
      "primary": "brand.blue",
      "primary-foreground": "brand.blueText",
      "radius": "radius"
    },
    "componentLibraries": {
      "antd": {
        "cssVariables": {
          "ant-color-primary": "brand.blue",
          "ant-color-text": {
            "light": "surfaces.light.text",
            "dark": "surfaces.dark.text"
          }
        }
      },
      "mui": {
        "cssVariables": {
          "mui-palette-primary-main": "brand.blue",
          "mui-palette-background-default": {
            "light": "surfaces.light.app",
            "dark": "surfaces.dark.app"
          }
        }
      },
      "customRegistry": {
        "cssVariables": {
          "app-sidebar-bg": {
            "light": "surfaces.light.panel",
            "dark": "surfaces.dark.panel"
          }
        }
      }
    }
  }
}
```

Mapping rules:

- Keys under `mappings.cssVariables` are Design Anchor semantic CSS variable names to emit.
- Keys under `mappings.componentLibraries.<library>.cssVariables` are additional CSS variable names required by that component library or local registry.
- Mapping values can be strings or `{ "light": "...", "dark": "..." }` objects.
- A string path without `light.` or `dark.` is first resolved as mode-relative (`light.<path>` / `dark.<path>`), then as an absolute top-level path.
- Use `{mode}` in paths when helpful, such as `"themes.{mode}.surface"`.
- Missing mapped keys fall back to direct `light` / `dark` semantic keys, then to the default baseline.

## Write Baseline

When a Design Anchor fallback baseline is missing or incomplete, prefer the bundled writer:

```bash
node "${CLAUDE_SKILL_DIR:-skills/design-anchor}/scripts/write-token-baseline.mjs" .
```

The script:

- detects Theme Lab artifacts and exits without writing a Design Anchor baseline unless forced,
- creates root `design-tokens.json` when missing,
- preserves existing token files as the user's source of truth,
- supports `mappings.cssVariables` for custom token names,
- supports `mappings.componentLibraries.<library>.cssVariables` for library-specific variables,
- writes a marked semantic CSS variable block into the detected global CSS file,
- exposes Design Anchor semantic variables through `@theme inline` for Tailwind v4 utilities,
- exits safely if no global CSS file is found.

If the script path cannot resolve, manually apply the same structure.

Do not use this writer to overwrite a GenDesignSystem / Theme Lab contract.

## User Ownership Rules

- Do not delete unknown keys.
- Existing token values win over defaults.
- Do not change locked/user-provided values unless the user explicitly asks.
- If the project has an obvious primary color, use it as `light.primary` instead of inventing a new brand.
- If no visual identity exists, use restrained B2B defaults: compact density, 0.625rem radius, neutral surfaces, clear primary.
- `design-tokens.json` should stay small enough for users to read. Do not expand it into hundreds of derived tokens.
- Prefer direct semantic names for new projects; prefer mappings for existing projects with meaningful token names.
- Add library-specific mapping profiles only for libraries already present or explicitly approved.

## CSS Variable Binding

Find the global CSS file in this order:

1. CSS path in `components.json` or another component registry config
2. `app/globals.css`
3. `src/app/globals.css`
4. `src/index.css`
5. `src/styles/globals.css`
6. `src/styles/global.css`

Regardless of internal JSON names, write semantic CSS variables:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
```

For Tailwind v4, expose Design Anchor semantic variables with `@theme inline`:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
}
```

For Tailwind v3 or non-Tailwind styling, use the project's existing theme/config pattern. Do not add a second styling system.

## Component Library Profiles

When a component library already exists:

- Keep its existing theme entry points.
- Prefer feeding it CSS variables derived from `design-tokens.json`.
- Add a `mappings.componentLibraries.<library>` profile only when the library needs variable names beyond the Design Anchor semantic set.
- Do not rename a user's existing token system just to fit the library.
- Do not install or switch component libraries without confirmation.

Use semantic classes or variables in components/pages:

```text
bg-background text-foreground
bg-card text-card-foreground border-border
bg-primary text-primary-foreground
focus-visible:ring-ring
```

Equivalent non-Tailwind styles should still read from the same emitted CSS variables.

## Structural Vs Decorative

Replace structural styles:

- primary buttons, links, active navigation, selected rows, toggles, checkboxes,
- focus rings and interactive states,
- form fields, cards, tables, popovers, modals,
- success/warning/error/info status colors,
- base text, muted text, borders, page/card surfaces.

Preserve intentional decorative styles:

- chart series colors when the chart has its own palette,
- illustrations and logos,
- product-specific gradients,
- one-off accent tints that communicate hierarchy,
- shadows/textures not used as semantic state.

When in doubt, preserve and note it in the final self-check.
