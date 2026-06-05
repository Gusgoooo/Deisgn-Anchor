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

function countFiles(rel, extensions, options = {}) {
  const root = join(target, rel);
  const maxDepth = options.maxDepth ?? 4;
  const ignored = new Set([
    "node_modules",
    ".git",
    ".next",
    ".nuxt",
    ".anchor",
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
      if (options.exclude?.some((part) => path.includes(part))) return count;
      return extensions.some((ext) => entry.name.endsWith(ext)) ? count + 1 : count;
    }, 0);
  }

  return walk(root, 0);
}

function packageManager() {
  if (has("pnpm-lock.yaml")) return "pnpm";
  if (has("yarn.lock")) return "yarn";
  if (has("bun.lockb") || has("bun.lock")) return "bun";
  if (has("package-lock.json")) return "npm";
  return "npm";
}

function dependencyVersion(pkg) {
  return pkg?.devDependencies?.["design-anchor"]
    || pkg?.dependencies?.["design-anchor"]
    || pkg?.optionalDependencies?.["design-anchor"]
    || null;
}

function nodeModuleVersion() {
  return readJson(join(target, "node_modules/design-anchor/package.json"))?.version || null;
}

function hasDesignAlias() {
  const configs = ["tsconfig.json", "tsconfig.app.json", "jsconfig.json"];
  return configs.some((config) => {
    const json = readJson(join(target, config));
    const paths = json?.compilerOptions?.paths;
    return Boolean(paths?.["@design"] || paths?.["@design/*"]);
  });
}

function gitignoreHasAnchor() {
  const gitignore = readText(join(target, ".gitignore"));
  return /(^|\n)\s*\.anchor\/?\s*(\n|$)/.test(gitignore);
}

function mcpConfigFiles() {
  return [".mcp.json", ".cursor/mcp.json"].filter(has);
}

function hasPortableMcpConfig() {
  return mcpConfigFiles().some((rel) => {
    const json = readJson(join(target, rel));
    const servers = json?.mcpServers || json?.servers || {};
    return Object.values(servers).some((server) => {
      const command = String(server?.command || "");
      const args = Array.isArray(server?.args) ? server.args.map(String) : [];
      const commandLine = [command, ...args].join(" ");
      return command.includes("npx")
        && commandLine.includes("design-anchor")
        && commandLine.includes("mcp")
        && commandLine.includes("./.anchor");
    });
  });
}

function installCommand(pm) {
  if (pm === "pnpm") return "pnpm add -D design-anchor";
  if (pm === "yarn") return "yarn add -D design-anchor";
  if (pm === "bun") return "bun add -d design-anchor";
  return "npm install -D design-anchor";
}

function syncCommand(pm) {
  if (pm === "pnpm") return "pnpm exec design-anchor sync";
  if (pm === "yarn") return "yarn design-anchor sync";
  if (pm === "bun") return "bunx design-anchor sync";
  return "npx design-anchor sync";
}

function hydrateCommand(pm) {
  if (pm === "pnpm") return "pnpm exec design-anchor hydrate";
  if (pm === "yarn") return "yarn design-anchor hydrate";
  if (pm === "bun") return "bunx design-anchor hydrate";
  return "npx design-anchor hydrate";
}

function addCommand(pm) {
  if (pm === "pnpm") return "pnpm exec design-anchor add <component>";
  if (pm === "yarn") return "yarn design-anchor add <component>";
  if (pm === "bun") return "bunx design-anchor add <component>";
  return "npx design-anchor add <component>";
}

function dependencyNames(pkg) {
  return new Set([
    ...Object.keys(pkg?.dependencies || {}),
    ...Object.keys(pkg?.devDependencies || {}),
    ...Object.keys(pkg?.optionalDependencies || {}),
  ]);
}

function hasKnownUiDependency(pkg) {
  const names = dependencyNames(pkg);
  return [
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@mui/material",
    "@chakra-ui/react",
    "antd",
    "react-aria-components",
    "next-themes",
    "class-variance-authority",
    "tailwind-variants",
    "lucide-react",
  ].some((name) => names.has(name));
}

const KNOWN_ICON_LIBRARIES = [
  "lucide-react",
  "@heroicons/react",
  "react-icons",
  "@fortawesome/react-fontawesome",
  "@fortawesome/free-solid-svg-icons",
  "@fortawesome/free-regular-svg-icons",
  "@phosphor-icons/react",
  "@tabler/icons-react",
  "@mui/icons-material",
  "@ant-design/icons",
];

function detectIconLibraries(pkg) {
  const names = dependencyNames(pkg);
  return KNOWN_ICON_LIBRARIES.filter((lib) => names.has(lib));
}

function detectLayoutSignals(pkg) {
  const names = dependencyNames(pkg);
  const hasLayoutComponents = has("src/components/layout")
    || has("src/components/Layout")
    || has("src/layouts")
    || has("src/app/layout.tsx")
    || has("src/app/layout.jsx")
    || has("app/layout.tsx")
    || has("app/layout.jsx");
  const hasSidebarComponent = has("src/components/Sidebar.tsx")
    || has("src/components/sidebar.tsx")
    || has("src/components/Sidebar/index.tsx")
    || has("src/components/sidebar/index.tsx")
    || has("src/components/layout/Sidebar.tsx")
    || has("src/components/layout/sidebar.tsx");
  const hasShellComponent = has("src/components/Shell.tsx")
    || has("src/components/shell.tsx")
    || has("src/components/AppShell.tsx")
    || has("src/components/app-shell.tsx");
  const hasGridLibrary = names.has("react-grid-layout")
    || names.has("@dnd-kit/core")
    || names.has("react-resizable-panels");

  return {
    hasLayoutComponents,
    hasSidebarComponent,
    hasShellComponent,
    hasGridLibrary,
  };
}

function detectFormLibrary(pkg) {
  const names = dependencyNames(pkg);
  if (names.has("react-hook-form")) return "react-hook-form";
  if (names.has("formik")) return "formik";
  if (names.has("@tanstack/react-form")) return "@tanstack/react-form";
  return null;
}

function detectTableLibrary(pkg) {
  const names = dependencyNames(pkg);
  if (names.has("@tanstack/react-table")) return "@tanstack/react-table";
  if (names.has("react-table")) return "react-table";
  if (names.has("ag-grid-react")) return "ag-grid-react";
  if (names.has("@mui/x-data-grid")) return "@mui/x-data-grid";
  return null;
}

function detectFramework(pkg) {
  const names = dependencyNames(pkg);
  if (names.has("next")) return "next";
  if (names.has("nuxt")) return "nuxt";
  if (names.has("@remix-run/react") || names.has("remix")) return "remix";
  if (names.has("vite") && names.has("react")) return "vite-react";
  if (names.has("@sveltejs/kit")) return "sveltekit";
  if (names.has("svelte")) return "svelte";
  if (names.has("vue")) return "vue";
  if (names.has("astro")) return "astro";
  if (names.has("react")) return "react";
  return null;
}

function detectComponentLibrary(pkg) {
  const names = dependencyNames(pkg);
  const libs = [];
  if (names.has("@radix-ui/react-dialog") || names.has("@radix-ui/react-slot")) libs.push("radix-ui");
  if (names.has("@mui/material")) libs.push("mui");
  if (names.has("@chakra-ui/react")) libs.push("chakra-ui");
  if (names.has("antd")) libs.push("antd");
  if (names.has("@mantine/core")) libs.push("mantine");
  if (names.has("@headlessui/react")) libs.push("headless-ui");
  if (names.has("react-aria-components")) libs.push("react-aria");
  if (has("components.json")) libs.push("shadcn-ui");
  return libs;
}

function detectStateManagement(pkg) {
  const names = dependencyNames(pkg);
  if (names.has("zustand")) return "zustand";
  if (names.has("@reduxjs/toolkit") || names.has("redux")) return "redux";
  if (names.has("jotai")) return "jotai";
  if (names.has("recoil")) return "recoil";
  if (names.has("mobx")) return "mobx";
  if (names.has("valtio")) return "valtio";
  return null;
}

function detectValidationLibrary(pkg) {
  const names = dependencyNames(pkg);
  if (names.has("zod")) return "zod";
  if (names.has("yup")) return "yup";
  if (names.has("joi")) return "joi";
  if (names.has("@sinclair/typebox")) return "typebox";
  return null;
}

function detectCssStrategy(pkg) {
  const names = dependencyNames(pkg);
  const strategies = [];
  if (names.has("tailwindcss")) strategies.push("tailwind");
  if (names.has("styled-components")) strategies.push("styled-components");
  if (names.has("@emotion/react") || names.has("@emotion/styled")) strategies.push("emotion");
  if (names.has("sass") || names.has("node-sass")) strategies.push("sass");
  if (names.has("@vanilla-extract/css")) strategies.push("vanilla-extract");
  if (names.has("@stitches/react")) strategies.push("stitches");
  if (strategies.length === 0 && has("src")) strategies.push("css-modules-or-plain");
  return strategies;
}

function projectSignals(pkg) {
  const uiExtensions = [".tsx", ".jsx", ".vue", ".svelte"];
  const styleExtensions = [".css", ".scss", ".sass", ".less"];
  const appFiles = countFiles("src/app", uiExtensions)
    + countFiles("src/pages", uiExtensions)
    + countFiles("app", uiExtensions)
    + countFiles("pages", uiExtensions);
  const componentFiles = countFiles("src/components", uiExtensions, {
    exclude: [`${join("src", "components", "anchor-ui")}`],
  });
  const routeFiles = countFiles("src/routes", uiExtensions) + countFiles("routes", uiExtensions);
  const styleFiles = countFiles("src", styleExtensions) + countFiles("styles", styleExtensions);
  const hasTailwindConfig = has("tailwind.config.js")
    || has("tailwind.config.cjs")
    || has("tailwind.config.mjs")
    || has("tailwind.config.ts");
  const hasUiDependency = hasKnownUiDependency(pkg) || has("components.json");
  const score = appFiles * 2
    + routeFiles * 2
    + componentFiles
    + Math.min(styleFiles, 8)
    + (hasUiDependency ? 6 : 0)
    + (hasTailwindConfig ? 3 : 0);
  const projectMaturity = score >= 24
    ? "complete"
    : score >= 10
      ? "established"
      : "new-or-small";

  return {
    appFiles,
    routeFiles,
    componentFiles,
    styleFiles,
    hasTailwindConfig,
    hasUiDependency,
    score,
    projectMaturity,
  };
}

const pkg = readJson(join(target, "package.json"));
const pm = packageManager();
const isSourceRepo = pkg?.name === "design-anchor"
  && has("bin/anchor.mjs")
  && has("src/anchor-portal");
const signals = projectSignals(pkg);
const iconLibraries = detectIconLibraries(pkg);
const layoutSignals = detectLayoutSignals(pkg);
const framework = detectFramework(pkg);
const componentLibraries = detectComponentLibrary(pkg);
const formLibrary = detectFormLibrary(pkg);
const tableLibrary = detectTableLibrary(pkg);
const stateManagement = detectStateManagement(pkg);
const validationLibrary = detectValidationLibrary(pkg);
const cssStrategies = detectCssStrategy(pkg);

const result = {
  target,
  packageManager: pm,
  hasPackageJson: Boolean(pkg),
  packageName: pkg?.name || null,
  isDesignAnchorSourceRepo: isSourceRepo,
  projectMaturity: isSourceRepo ? "source-package" : signals.projectMaturity,
  recommendedMode: isSourceRepo
    ? "source-package"
    : signals.projectMaturity === "complete"
      ? "offer-existing-product-governance"
      : "first-page-or-incremental-ui",
  governanceRequiresExplicitConsent: signals.projectMaturity === "complete" && !isSourceRepo,
  projectSignals: signals,
  designAnchorDependency: dependencyVersion(pkg),
  designAnchorNodeModuleVersion: nodeModuleVersion(),
  hasAnchorControlPlane: has(".anchor/package.json")
    || has(".anchor/src/anchor-portal/vite.config.ts")
    || has(".anchor/src/anchor/schema"),
  anchorIsGitignored: gitignoreHasAnchor(),
  hasInstalledComponents: has("src/components/anchor-ui/index.ts")
    || has("src/components/anchor-ui"),
  hasTokenSource: has("src/design-tokens/tokens.json"),
  hasGeneratedTokenCss: has("src/styles/design-tokens.generated.css"),
  hasDesignAlias: hasDesignAlias(),
  hasAgentsRules: has("AGENTS.md"),
  hasClaudeRules: has("CLAUDE.md"),
  hasCursorAlwaysRules: has(".cursor/rules/anchor.mdc"),
  hasCursorSelfcheckRule: has(".cursor/rules/anchor-selfcheck.mdc"),
  mcpConfigFiles: mcpConfigFiles(),
  hasPortableMcpConfig: hasPortableMcpConfig(),
  framework,
  componentLibraries,
  cssStrategies,
  formLibrary,
  tableLibrary,
  stateManagement,
  validationLibrary,
  iconLibraries,
  hasMultipleIconLibraries: iconLibraries.length > 1,
  layoutSignals,
  scripts: {
    syncAnchor: pkg?.scripts?.["sync:anchor"] || null,
    anchorAudit: pkg?.scripts?.["anchor:audit"] || null,
  },
  recommendedNextSteps: [],
};

if (isSourceRepo) {
  result.recommendedNextSteps.push("This is the Design Anchor source repo; do not run consumer `design-anchor start` here.");
  result.recommendedNextSteps.push("Use package scripts such as `npm run sync:anchor`, `npm run anchor:audit`, `npm run lint`, `npm run typecheck`, or `npm publish --dry-run` as relevant.");
} else {
  if (!result.hasPackageJson) {
    result.recommendedNextSteps.push("No package.json found; confirm the app root before installing Design Anchor.");
  }

  if (result.recommendedMode === "offer-existing-product-governance") {
    result.recommendedNextSteps.push("This looks like an existing product. Offer `布局重构`（recommended）, `渐进优化`, or `只读审计`; do not modify files until the user explicitly confirms the governance mode.");
  }

  if (result.hasMultipleIconLibraries) {
    result.recommendedNextSteps.push(`Multiple icon libraries detected: ${iconLibraries.join(", ")}. Recommend consolidating to a single library (preferably lucide-react).`);
  }

  if (!result.designAnchorDependency && !result.designAnchorNodeModuleVersion) {
    result.recommendedNextSteps.push(`Install Design Anchor as a dev dependency with \`${installCommand(pm)}\`.`);
  }

  const needsBackgroundSync = !result.hasTokenSource
    || !result.hasGeneratedTokenCss
    || !result.hasAgentsRules
    || !result.hasCursorAlwaysRules
    || !result.hasPortableMcpConfig;

  if (needsBackgroundSync) {
    result.recommendedNextSteps.push(`Run \`${syncCommand(pm)}\` for background governance: tokens, generated CSS, AI rules, MCP config, and local .anchor hydration.`);
  }

  if (!result.hasAnchorControlPlane && (result.hasTokenSource || result.hasAgentsRules || result.hasPortableMcpConfig)) {
    result.recommendedNextSteps.push(`.anchor/ is local and rebuildable; run \`${hydrateCommand(pm)}\` if Portal, specs, or MCP runtime files are missing after clone.`);
  }

  if (!result.anchorIsGitignored) {
    result.recommendedNextSteps.push("Add `.anchor/` to .gitignore so the local control plane stays rebuildable and out of source control.");
  }

  if (!result.hasInstalledComponents) {
    result.recommendedNextSteps.push(`No Anchor UI source components are installed yet; add only what the current screen needs with \`${addCommand(pm)}\`.`);
  }

  if (result.hasInstalledComponents && !result.hasDesignAlias) {
    result.recommendedNextSteps.push("Check the `@design` path alias before writing app UI; business code should import from `@design` or `@/components/anchor-ui`.");
  }

  if (!needsBackgroundSync && result.hasInstalledComponents) {
    result.recommendedNextSteps.push("Design Anchor appears ready; continue with `@design` components, semantic tokens, `sync`, and `audit` after UI changes.");
  }

  if (componentLibraries.length > 1) {
    result.recommendedNextSteps.push(`Multiple component libraries detected: ${componentLibraries.join(", ")}. Consider consolidating to reduce bundle size and ensure consistent styling.`);
  }

  if (cssStrategies.length > 1 && cssStrategies.includes("tailwind")) {
    const others = cssStrategies.filter((s) => s !== "tailwind");
    result.recommendedNextSteps.push(`Mixed CSS strategies: Tailwind + ${others.join(", ")}. Prefer Tailwind with semantic token classes for Design Anchor governed components.`);
  }

  if (signals.projectMaturity !== "new-or-small" && !formLibrary) {
    result.recommendedNextSteps.push("No form library detected in an established project. Recommend react-hook-form + zod for governed form components.");
  }

  if (signals.projectMaturity !== "new-or-small" && !tableLibrary && signals.componentFiles > 5) {
    result.recommendedNextSteps.push("No table library detected. Recommend @tanstack/react-table for governed data tables with sort, filter, and pagination.");
  }

  if (layoutSignals.hasLayoutComponents && !layoutSignals.hasSidebarComponent && !layoutSignals.hasShellComponent) {
    result.recommendedNextSteps.push("Layout components exist but no sidebar or app shell detected. The product may lack a consistent navigation structure.");
  }
}

console.log(JSON.stringify(result, null, 2));
