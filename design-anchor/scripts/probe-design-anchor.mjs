#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const target = resolve(process.argv[2] || process.cwd());

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
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

function dependencyVersion(pkg) {
  return pkg?.dependencies?.["design-anchor"]
    || pkg?.devDependencies?.["design-anchor"]
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

const pkg = readJson(join(target, "package.json"));
const pm = packageManager();
const isSourceRepo = pkg?.name === "design-anchor"
  && has("bin/anchor.mjs")
  && has("src/anchor-portal");

const result = {
  target,
  packageManager: pm,
  hasPackageJson: Boolean(pkg),
  packageName: pkg?.name || null,
  isDesignAnchorSourceRepo: isSourceRepo,
  designAnchorDependency: dependencyVersion(pkg),
  designAnchorNodeModuleVersion: nodeModuleVersion(),
  hasAnchorControlPlane: has(".anchor/src/anchor-portal/vite.config.ts"),
  hasAnchorComponents: has("src/components/anchor-ui/index.ts"),
  hasTokenSource: has("src/design-tokens/tokens.json"),
  hasGeneratedTokenCss: has("src/styles/design-tokens.generated.css"),
  hasDesignAlias: hasDesignAlias(),
  hasAgentsRules: has("AGENTS.md"),
  hasClaudeRules: has("CLAUDE.md"),
  hasCursorAlwaysRules: has(".cursor/rules/anchor.mdc"),
  hasCursorSelfcheckRule: has(".cursor/rules/anchor-selfcheck.mdc"),
  hasMcpConfig: has(".mcp.json") || has(".cursor/mcp.json"),
  hasActivePromptStyle: has(".anchor/src/anchor/rules/ACTIVE_PROMPT_STYLE.md"),
  scripts: {
    syncAnchor: pkg?.scripts?.["sync:anchor"] || null,
    anchorAudit: pkg?.scripts?.["anchor:audit"] || null,
  },
  recommendedNextSteps: [],
};

if (isSourceRepo) {
    result.recommendedNextSteps.push("This is the Design Anchor source repo; do not run `anchor start` here.");
} else {
  if (!result.designAnchorDependency && !result.designAnchorNodeModuleVersion) {
    result.recommendedNextSteps.push(`Install with ${pm === "npm" ? "npm install design-anchor" : `${pm} add design-anchor`}.`);
  }
  if (!result.hasAnchorControlPlane || !result.hasAnchorComponents || !result.hasTokenSource) {
    result.recommendedNextSteps.push(pm === "npm"
      ? "Run `npx design-anchor start` to activate runtime governance: components, tokens, AI rules, MCP, audit hooks, and Portal."
      : `Run \`${pm} exec anchor start\` to activate runtime governance: components, tokens, AI rules, MCP, audit hooks, and Portal.`);
  } else {
    result.recommendedNextSteps.push("Design Anchor runtime appears initialized; use `npx design-anchor theme <prompt.md>`, `npx design-anchor sync`, `npx design-anchor audit`, or `npx design-anchor portal tokens` as needed.");
  }
  if (!result.hasAgentsRules || !result.hasClaudeRules || !result.hasCursorAlwaysRules) {
    result.recommendedNextSteps.push("AI coding rules are incomplete; rerun `npx design-anchor start` or `npx design-anchor sync`.");
  }
  if (!result.hasDesignAlias) {
    result.recommendedNextSteps.push("Check `@design` path alias before writing UI.");
  }
}

console.log(JSON.stringify(result, null, 2));
