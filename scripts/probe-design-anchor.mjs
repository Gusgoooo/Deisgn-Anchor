#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const target = resolve(process.argv[2] || process.cwd());

function readText(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function readJson(path) {
  try {
    return JSON.parse(readText(path));
  } catch {
    return null;
  }
}

function has(rel) {
  return existsSync(join(target, rel));
}

function packageManager() {
  if (has("pnpm-lock.yaml")) return "pnpm";
  if (has("yarn.lock")) return "yarn";
  if (has("bun.lockb") || has("bun.lock")) return "bun";
  if (has("package-lock.json")) return "npm";
  return "npm";
}

function dependencyNames(pkg) {
  return new Set([
    ...Object.keys(pkg?.dependencies || {}),
    ...Object.keys(pkg?.devDependencies || {}),
    ...Object.keys(pkg?.optionalDependencies || {}),
  ]);
}

function countFiles(rel, extensions, options = {}) {
  const root = join(target, rel);
  const maxDepth = options.maxDepth ?? 5;
  const ignored = new Set([
    "node_modules",
    ".git",
    ".next",
    ".nuxt",
    "dist",
    "build",
    "coverage",
    ...(options.ignored || []),
  ]);

  function walk(dir, depth) {
    if (depth > maxDepth) return 0;
    let entries = [];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return 0;
    }

    return entries.reduce((count, entry) => {
      if (ignored.has(entry.name)) return count;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return count + walk(path, depth + 1);
      if (!entry.isFile()) return count;
      return extensions.some((ext) => entry.name.endsWith(ext)) ? count + 1 : count;
    }, 0);
  }

  return walk(root, 0);
}

function countDirectFiles(rel, extensions) {
  let entries = [];
  try {
    entries = readdirSync(join(target, rel), { withFileTypes: true });
  } catch {
    return 0;
  }

  return entries.filter((entry) => {
    return entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext));
  }).length;
}

function detectFramework(pkg) {
  const names = dependencyNames(pkg);
  if (names.has("next")) return "next";
  if (names.has("@vitejs/plugin-react") || names.has("vite")) return "vite-or-vite-react";
  if (names.has("@remix-run/react")) return "remix";
  if (names.has("react-router") || names.has("react-router-dom")) return "react-router";
  if (names.has("react")) return "react";
  if (names.has("vue") || names.has("nuxt")) return "vue-or-nuxt";
  if (names.has("svelte") || names.has("@sveltejs/kit")) return "svelte";
  if (names.has("@angular/core")) return "angular";
  return pkg ? "unknown-js" : "unknown";
}

function detectCssStrategy(pkg) {
  const names = dependencyNames(pkg);
  const strategies = [];
  if (names.has("tailwindcss") || has("tailwind.config.js") || has("tailwind.config.ts")) strategies.push("tailwind");
  if (names.has("sass") || names.has("sass-embedded")) strategies.push("sass");
  if (names.has("styled-components")) strategies.push("styled-components");
  if (names.has("@emotion/react")) strategies.push("emotion");
  if (countFiles("src", [".css", ".scss", ".sass"]) > 0) strategies.push("local-css");
  return [...new Set(strategies)];
}

function detectComponentSystem(pkg) {
  const names = dependencyNames(pkg);
  const systems = [];
  if (has("components.json") || has("src/components/ui") || has("components/ui")) systems.push("shadcn");
  if ([...names].some((name) => name.startsWith("@radix-ui/"))) systems.push("headless-primitives");
  if (names.has("@headlessui/react")) systems.push("headless-primitives");
  if (names.has("react-aria-components") || names.has("@react-aria/focus")) systems.push("headless-primitives");
  if (names.has("@mui/material")) systems.push("mui");
  if (names.has("antd")) systems.push("antd");
  if (names.has("@chakra-ui/react")) systems.push("chakra");
  if (names.has("@mantine/core")) systems.push("mantine");
  if (has("src/components")) systems.push("custom-components");
  return [...new Set(systems)];
}

function detectIconLibraries(pkg) {
  const names = dependencyNames(pkg);
  return [
    "lucide-react",
    "@heroicons/react",
    "react-icons",
    "@tabler/icons-react",
    "@phosphor-icons/react",
    "@mui/icons-material",
    "@ant-design/icons",
  ].filter((name) => names.has(name));
}

function detectGlobalCssPath() {
  const componentsJson = readJson(join(target, "components.json"));
  const candidates = [
    componentsJson?.tailwind?.css,
    "app/globals.css",
    "src/app/globals.css",
    "src/index.css",
    "src/styles/globals.css",
    "src/styles/global.css",
    "styles/globals.css",
    "styles/global.css",
  ].filter(Boolean);
  return candidates.find((rel) => has(rel)) || null;
}

function hasSemanticTokenCss(cssPath) {
  if (!cssPath) return false;
  const css = readText(join(target, cssPath));
  return /--primary\s*:/.test(css)
    && /--background\s*:/.test(css)
    && /--foreground\s*:/.test(css)
    && /--border\s*:/.test(css);
}

function detectThemeLab(cssPath) {
  const manifest = readJson(join(target, "theme-lab.json"));
  const pkg = readJson(join(target, "package.json"));
  const css = cssPath ? readText(join(target, cssPath)) : "";
  const agents = readText(join(target, "AGENTS.md"));
  const hasRuntimeMarker = css.includes("theme-lab:runtime:start");
  const hasAgentsMarker = agents.includes("theme-lab:agents:start");
  const hasManifest = Boolean(manifest);
  const hasPreset = has("theme.preset.json");
  const hasVibe = has("vibe.json") || has("vibe.manifest.json");
  const hasSourcePipeline = pkg?.name === "gen-design-system"
    || (has("lib/theme/schema.ts")
      && has("lib/theme/derive-theme.ts")
      && has("lib/theme/shadcn-adapter.ts")
      && has("lib/theme/export-json.ts"));
  return {
    detected: hasManifest || hasRuntimeMarker || hasAgentsMarker || hasPreset || hasVibe || hasSourcePipeline,
    hasManifest,
    manifestKind: manifest?.kind || null,
    sourceOfTruth: manifest?.theme?.sourceOfTruth || null,
    algorithmVersion: manifest?.theme?.algorithmVersion || null,
    hasRuntimeMarker,
    hasAgentsMarker,
    hasPreset,
    hasVibe,
    hasSourcePipeline,
  };
}

function detectComponentRegistryConfig() {
  const json = readJson(join(target, "components.json"));
  if (!json) return null;
  return {
    style: json.style || null,
    cssPath: json.tailwind?.css || null,
    cssVariables: json.tailwind?.cssVariables ?? null,
    iconLibrary: json.iconLibrary || null,
    aliases: json.aliases || null,
  };
}

function projectSignals() {
  const uiExtensions = [".tsx", ".jsx", ".ts", ".js"];
  const appFiles = countFiles("src/app", uiExtensions)
    + countFiles("app", uiExtensions)
    + countFiles("src/pages", uiExtensions)
    + countFiles("pages", uiExtensions);
  const routeFiles = countFiles("src/routes", uiExtensions) + countFiles("routes", uiExtensions);
  const componentFiles = countFiles("src/components", uiExtensions) + countFiles("components", uiExtensions);
  const topLevelComponentFiles = countDirectFiles("src/components", uiExtensions);
  const styleFiles = countFiles("src", [".css", ".scss", ".sass"]) + countFiles("styles", [".css", ".scss", ".sass"]);
  const score = appFiles * 2 + routeFiles * 2 + componentFiles + Math.min(styleFiles, 8);
  return {
    appFiles,
    routeFiles,
    componentFiles,
    topLevelComponentFiles,
    styleFiles,
    score,
    projectMaturity: score >= 24 ? "complete" : score >= 10 ? "established" : "new-or-small",
  };
}

function shadcnCommand(pm, args) {
  if (pm === "pnpm") return `pnpm dlx shadcn@latest ${args}`;
  if (pm === "yarn") return `yarn dlx shadcn@latest ${args}`;
  if (pm === "bun") return `bunx shadcn@latest ${args}`;
  return `npx shadcn@latest ${args}`;
}

const pkg = readJson(join(target, "package.json"));
const pm = packageManager();
const framework = detectFramework(pkg);
const cssStrategies = detectCssStrategy(pkg);
const componentSystems = detectComponentSystem(pkg);
const iconLibraries = detectIconLibraries(pkg);
const globalCssPath = detectGlobalCssPath();
const themeLab = detectThemeLab(globalCssPath);
const componentRegistryConfig = detectComponentRegistryConfig();
const signals = projectSignals();

const isReactTailwind = ["next", "vite-or-vite-react", "remix", "react-router", "react"].includes(framework)
  && cssStrategies.includes("tailwind");
const hasShadcn = componentSystems.includes("shadcn");
const hasSuiteLibrary = ["mui", "antd", "chakra", "mantine"].some((system) => componentSystems.includes(system));
const preferredComponentLayer = isReactTailwind
  ? "shadcn"
  : hasSuiteLibrary
    ? "existing-suite"
    : componentSystems.includes("custom-components")
      ? "custom-components"
      : "inspect-first";

const result = {
  target,
  packageManager: pm,
  hasPackageJson: Boolean(pkg),
  packageName: pkg?.name || null,
  framework,
  cssStrategies,
  isReactTailwind,
  projectMaturity: signals.projectMaturity,
  recommendedMode: signals.projectMaturity === "complete"
    ? "existing-product-ui-ux-refactor"
    : "token-foundation-and-ux-strategy-first",
  tokenSourcePriority: themeLab.detected
    ? "theme-lab"
    : has("design-tokens.json")
      ? "design-tokens"
      : has("src/design-tokens/tokens.json")
        ? "legacy-design-tokens"
        : "none",
  themeLab,
  projectSignals: signals,
  hasDesignTokens: has("design-tokens.json"),
  hasLegacyTokens: has("src/design-tokens/tokens.json"),
  globalCssPath,
  hasSemanticTokenCss: hasSemanticTokenCss(globalCssPath),
  componentSystems,
  hasShadcn,
  hasComponentRegistry: hasShadcn,
  componentRegistryConfig,
  hasHeadlessPrimitives: componentSystems.includes("headless-primitives"),
  preferredComponentLayer,
  shadcnBlockCandidates: isReactTailwind
    ? ["dashboard-01", "sidebar-07", "login-03", "login-04"]
    : [],
  iconLibraries,
  hasMultipleIconLibraries: iconLibraries.length > 1,
  suggestedCommands: {
    writeTokenBaseline: themeLab.detected
      ? null
      : "node ${CLAUDE_SKILL_DIR:-skills/design-anchor}/scripts/write-token-baseline.mjs .",
    shadcnInit: isReactTailwind && !hasShadcn ? shadcnCommand(pm, "init") : null,
    shadcnAddCore: isReactTailwind ? shadcnCommand(pm, "add button input textarea label card badge table tabs dialog dropdown-menu select popover sheet tooltip skeleton sonner") : null,
    shadcnAddDashboardBlock: isReactTailwind ? shadcnCommand(pm, "add dashboard-01") : null,
    shadcnAddSidebarBlock: isReactTailwind ? shadcnCommand(pm, "add sidebar-07") : null,
  },
  recommendedNextSteps: [],
};

if (!result.hasPackageJson) {
  result.recommendedNextSteps.push("No package.json found. Confirm the frontend app root before making token or component changes.");
}

if (!isReactTailwind) {
  result.recommendedNextSteps.push(`Stack is ${framework} with CSS strategies: ${cssStrategies.join(", ") || "none detected"}. Use token/UX guidance first; prefer the existing suite or local components before adopting shadcn.`);
} else {
  result.recommendedNextSteps.push("React + Tailwind detected. Default component layer is shadcn; use shadcn blocks when a block matches the functional page pattern.");
}

if (themeLab.detected) {
  result.recommendedNextSteps.push("GenDesignSystem / Theme Lab artifacts detected. Treat Theme Lab runtime CSS and theme-lab.json as the token source of truth; do not create a parallel design-tokens.json baseline.");
  if (themeLab.hasRuntimeMarker) {
    result.recommendedNextSteps.push(`Theme Lab runtime marker found in ${globalCssPath || "global CSS"}. Update only the marker block when changing theme variables.`);
  }
  if (!themeLab.hasAgentsMarker) {
    result.recommendedNextSteps.push("Consider adding or updating the AGENTS.md Theme Lab marker only if the user wants a persistent project contract.");
  }
} else if (!result.hasDesignTokens) {
  result.recommendedNextSteps.push(`Create root design-tokens.json as the user-owned semantic theme contract before broad UI cleanup. Suggested bundled writer: ${result.suggestedCommands.writeTokenBaseline}`);
}

if (!result.globalCssPath) {
  result.recommendedNextSteps.push("No obvious global CSS file detected. Locate the app's Tailwind/global CSS entry before binding token variables.");
} else if (!result.hasSemanticTokenCss && !themeLab.detected) {
  result.recommendedNextSteps.push(`Bind design tokens into ${result.globalCssPath} with semantic variables such as --background, --foreground, --primary, --border, and --ring.`);
} else if (themeLab.detected) {
  result.recommendedNextSteps.push("Use Theme Lab shadcn adapter classes and extended semantic variables for structural UI. Avoid raw Tailwind palette classes and hardcoded hex values.");
}

if (result.hasShadcn) {
  if (componentRegistryConfig?.cssVariables === false) {
    result.recommendedNextSteps.push("shadcn config is present but CSS variables are disabled. Convert carefully before token-driven UX work because generated components may need updates.");
  } else {
    result.recommendedNextSteps.push("shadcn/local ui folder is present. Standardize pages around token-bound shadcn components and consider blocks for page scaffolds.");
  }
} else if (isReactTailwind) {
  result.recommendedNextSteps.push(`No shadcn baseline detected. For implementation work, initialize shadcn and add only the components/blocks needed for the current functional page. Candidate command: ${result.suggestedCommands.shadcnInit}`);
}

if (result.hasHeadlessPrimitives && !result.hasComponentRegistry) {
  result.recommendedNextSteps.push("Headless primitives are present. Prefer local token-bound wrappers around them for complex interactions.");
}

if (result.hasMultipleIconLibraries) {
  result.recommendedNextSteps.push(`Multiple icon libraries detected: ${iconLibraries.join(", ")}. Consolidate to one icon library when touching shared components.`);
}

if (signals.projectMaturity !== "new-or-small") {
  result.recommendedNextSteps.push("Existing product detected. Confirm branch/backup/rollback path, then start with token foundation, component foundation, and one high-impact page refactor.");
}

if (signals.topLevelComponentFiles >= 16) {
  result.recommendedNextSteps.push("Many top-level component files detected. Avoid adding one-off presentational components; consolidate repeated primitives into the chosen component system.");
}

console.log(JSON.stringify(result, null, 2));
