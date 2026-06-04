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
    result.recommendedNextSteps.push("This looks like an existing product. Offer `只读审计`, `生成治理计划`, or `开始第一阶段治理`; do not modify files until the user explicitly confirms the governance mode and acknowledges risk.");
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
}

console.log(JSON.stringify(result, null, 2));
