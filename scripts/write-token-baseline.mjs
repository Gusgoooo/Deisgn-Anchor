#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const target = resolve(process.argv[2] || process.cwd());
const markerStart = "/* design-anchor: semantic token baseline:start */";
const markerEnd = "/* design-anchor: semantic token baseline:end */";
const semanticKeys = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground"
];

const defaultTokens = {
  name: "enterprise-neutral",
  format: "design-anchor-semantic-tokens/v1",
  cssVariables: true,
  radius: "0.625rem",
  light: {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    card: "oklch(1 0 0)",
    "card-foreground": "oklch(0.145 0 0)",
    popover: "oklch(1 0 0)",
    "popover-foreground": "oklch(0.145 0 0)",
    primary: "oklch(0.205 0 0)",
    "primary-foreground": "oklch(0.985 0 0)",
    secondary: "oklch(0.97 0 0)",
    "secondary-foreground": "oklch(0.205 0 0)",
    muted: "oklch(0.97 0 0)",
    "muted-foreground": "oklch(0.556 0 0)",
    accent: "oklch(0.97 0 0)",
    "accent-foreground": "oklch(0.205 0 0)",
    destructive: "oklch(0.577 0.245 27.325)",
    "destructive-foreground": "oklch(0.985 0 0)",
    border: "oklch(0.922 0 0)",
    input: "oklch(0.922 0 0)",
    ring: "oklch(0.708 0 0)",
    "chart-1": "oklch(0.646 0.222 41.116)",
    "chart-2": "oklch(0.6 0.118 184.704)",
    "chart-3": "oklch(0.398 0.07 227.392)",
    "chart-4": "oklch(0.828 0.189 84.429)",
    "chart-5": "oklch(0.769 0.188 70.08)",
    sidebar: "oklch(0.985 0 0)",
    "sidebar-foreground": "oklch(0.145 0 0)",
    "sidebar-primary": "oklch(0.205 0 0)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-accent": "oklch(0.97 0 0)",
    "sidebar-accent-foreground": "oklch(0.205 0 0)",
    "sidebar-border": "oklch(0.922 0 0)",
    "sidebar-ring": "oklch(0.708 0 0)",
    success: "oklch(0.55 0.17 142)",
    "success-foreground": "oklch(0.985 0 0)",
    warning: "oklch(0.75 0.16 85)",
    "warning-foreground": "oklch(0.205 0 0)"
  },
  dark: {
    background: "oklch(0.145 0 0)",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.205 0 0)",
    "card-foreground": "oklch(0.985 0 0)",
    popover: "oklch(0.205 0 0)",
    "popover-foreground": "oklch(0.985 0 0)",
    primary: "oklch(0.922 0 0)",
    "primary-foreground": "oklch(0.205 0 0)",
    secondary: "oklch(0.269 0 0)",
    "secondary-foreground": "oklch(0.985 0 0)",
    muted: "oklch(0.269 0 0)",
    "muted-foreground": "oklch(0.708 0 0)",
    accent: "oklch(0.269 0 0)",
    "accent-foreground": "oklch(0.985 0 0)",
    destructive: "oklch(0.704 0.191 22.216)",
    "destructive-foreground": "oklch(0.985 0 0)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.556 0 0)",
    "chart-1": "oklch(0.488 0.243 264.376)",
    "chart-2": "oklch(0.696 0.17 162.48)",
    "chart-3": "oklch(0.769 0.188 70.08)",
    "chart-4": "oklch(0.627 0.265 303.9)",
    "chart-5": "oklch(0.645 0.246 16.439)",
    sidebar: "oklch(0.205 0 0)",
    "sidebar-foreground": "oklch(0.985 0 0)",
    "sidebar-primary": "oklch(0.488 0.243 264.376)",
    "sidebar-primary-foreground": "oklch(0.985 0 0)",
    "sidebar-accent": "oklch(0.269 0 0)",
    "sidebar-accent-foreground": "oklch(0.985 0 0)",
    "sidebar-border": "oklch(1 0 0 / 10%)",
    "sidebar-ring": "oklch(0.556 0 0)",
    success: "oklch(0.62 0.17 142)",
    "success-foreground": "oklch(0.145 0 0)",
    warning: "oklch(0.82 0.16 85)",
    "warning-foreground": "oklch(0.145 0 0)"
  }
};

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function readText(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function has(rel) {
  return existsSync(join(target, rel));
}

function findGlobalCssPath() {
  const componentsJson = readJson(join(target, "components.json"));
  const candidates = [
    componentsJson?.tailwind?.css,
    "app/globals.css",
    "src/app/globals.css",
    "src/index.css",
    "src/styles/globals.css",
    "src/styles/global.css",
    "styles/globals.css",
    "styles/global.css"
  ].filter(Boolean);
  return candidates.find(has) || null;
}

function detectThemeLab(cssRel) {
  const manifest = readJson(join(target, "theme-lab.json"));
  const pkg = readJson(join(target, "package.json"));
  const css = cssRel ? readText(join(target, cssRel)) : "";
  const agents = readText(join(target, "AGENTS.md"));
  const hasSourcePipeline = pkg?.name === "gen-design-system"
    || (has("lib/theme/schema.ts")
      && has("lib/theme/derive-theme.ts")
      && has("lib/theme/shadcn-adapter.ts")
      && has("lib/theme/export-json.ts"));
  return {
    detected: Boolean(manifest)
      || has("theme.preset.json")
      || has("vibe.json")
      || has("vibe.manifest.json")
      || css.includes("theme-lab:runtime:start")
      || agents.includes("theme-lab:agents:start")
      || hasSourcePipeline,
    hasManifest: Boolean(manifest),
    manifestKind: manifest?.kind || null,
    sourceOfTruth: manifest?.theme?.sourceOfTruth || null,
    hasRuntimeMarker: css.includes("theme-lab:runtime:start"),
    hasAgentsMarker: agents.includes("theme-lab:agents:start"),
    hasSourcePipeline
  };
}

function mergeTokens(existing) {
  if (!existing) return defaultTokens;
  return existing;
}

function getPath(root, path) {
  if (!path) return undefined;
  return String(path)
    .split(".")
    .reduce((value, part) => value?.[part], root);
}

function mappedPathCandidates(path, mode) {
  const raw = String(path);
  if (raw.includes("{mode}")) return [raw.replaceAll("{mode}", mode)];
  if (raw.startsWith("light.") || raw.startsWith("dark.")) return [raw];
  if (raw === "radius") return ["radius"];
  return [`${mode}.${raw}`, raw];
}

function resolveMappedValue(tokens, mode, key) {
  const mapping = cssVariableMappings(tokens)[key];
  if (!mapping) return undefined;
  const paths = typeof mapping === "string"
    ? mappedPathCandidates(mapping, mode)
    : mappedPathCandidates(mapping[mode] || mapping.default, mode);

  for (const path of paths) {
    const value = getPath(tokens, path);
    if (value !== undefined) return value;
  }

  return undefined;
}

function cssVariableMappings(tokens) {
  const libraryMappings = Object.values(tokens.mappings?.componentLibraries || {})
    .reduce((merged, profile) => ({
      ...merged,
      ...(profile?.cssVariables || {})
    }), {});

  return {
    ...libraryMappings,
    ...(tokens.mappings?.cssVariables || {})
  };
}

function resolveTokenValue(tokens, mode, key) {
  if (key === "radius") {
    return resolveMappedValue(tokens, mode, key)
      ?? tokens.radius
      ?? defaultTokens.radius;
  }

  return resolveMappedValue(tokens, mode, key)
    ?? tokens[mode]?.[key]
    ?? defaultTokens[mode]?.[key];
}

function cssValues(tokens, mode) {
  const values = {
    radius: resolveTokenValue(tokens, mode, "radius"),
    ...Object.fromEntries(
      semanticKeys.map((key) => [key, resolveTokenValue(tokens, mode, key)])
    )
  };

  for (const key of Object.keys(cssVariableMappings(tokens))) {
    values[key] = resolveMappedValue(tokens, mode, key) ?? values[key];
  }

  return values;
}

function varLines(values) {
  return Object.entries(values)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");
}

function themeInlineLines(keys) {
  const colorLines = keys
    .filter((key) => key !== "radius" && semanticKeys.includes(key))
    .map((key) => `  --color-${key}: var(--${key});`);
  return [
    ...colorLines,
    "  --radius-sm: calc(var(--radius) * 0.6);",
    "  --radius-md: calc(var(--radius) * 0.8);",
    "  --radius-lg: var(--radius);",
    "  --radius-xl: calc(var(--radius) * 1.4);",
    "  --radius-2xl: calc(var(--radius) * 1.8);",
    "  --radius-3xl: calc(var(--radius) * 2.2);",
    "  --radius-4xl: calc(var(--radius) * 2.6);"
  ].join("\n");
}

function cssBlock(tokens) {
  const light = cssValues(tokens, "light");
  const dark = cssValues(tokens, "dark");
  const keys = Object.keys(light);
  return `${markerStart}
@theme inline {
${themeInlineLines(keys)}
}

:root {
${varLines(light)}
}

.dark {
${varLines(dark)}
}
${markerEnd}`;
}

const forceDesignAnchor = process.argv.includes("--force-design-anchor");
const cssRel = findGlobalCssPath();
const themeLab = detectThemeLab(cssRel);

if (themeLab.detected && !forceDesignAnchor) {
  console.log(JSON.stringify({
    ok: true,
    skipped: true,
    tokenSource: "theme-lab",
    designTokens: null,
    globalCss: cssRel,
    themeLab,
    message: "GenDesignSystem / Theme Lab artifacts detected. Skipped Design Anchor baseline to avoid creating a parallel token source. Use Theme Lab runtime CSS variables or rerun with --force-design-anchor only if the user explicitly wants a fallback design-tokens.json."
  }, null, 2));
  process.exit(0);
}

const tokenPath = join(target, "design-tokens.json");
const existingTokens = readJson(tokenPath);
const tokens = mergeTokens(existingTokens);
writeFileSync(tokenPath, `${JSON.stringify(tokens, null, 2)}\n`);

if (!cssRel) {
  console.log(JSON.stringify({
    ok: true,
    designTokens: "design-tokens.json",
    globalCss: null,
    message: "Wrote design-tokens.json. No global CSS file found; bind the token CSS manually."
  }, null, 2));
  process.exit(0);
}

const cssPath = join(target, cssRel);
const currentCss = readText(cssPath);
const nextBlock = cssBlock(tokens);
const blockPattern = new RegExp(`${markerStart.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${markerEnd.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
const nextCss = blockPattern.test(currentCss)
  ? currentCss.replace(blockPattern, nextBlock)
  : `${currentCss.trimEnd()}\n\n${nextBlock}\n`;

writeFileSync(cssPath, nextCss);

console.log(JSON.stringify({
  ok: true,
  designTokens: "design-tokens.json",
  globalCss: cssRel,
  tokenFormat: tokens.format,
  message: "Wrote semantic UI tokens and bound them to global CSS variables."
}, null, 2));
