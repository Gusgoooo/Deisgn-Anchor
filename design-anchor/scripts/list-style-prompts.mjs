#!/usr/bin/env node
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const defaultPromptDir = resolve(scriptDir, "../references/b2b-design-prompts");
const promptDir = resolve(process.argv[2] || defaultPromptDir);

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return {};

  const meta = {};
  let currentKey = null;

  for (const rawLine of match[1].split("\n")) {
    const line = rawLine.trimEnd();
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (pair) {
      currentKey = pair[1];
      const value = pair[2].trim();
      meta[currentKey] = value ? value.replace(/^["']|["']$/g, "") : [];
      continue;
    }

    const item = line.match(/^\s*-\s+(.+)$/);
    if (item && currentKey) {
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = [];
      meta[currentKey].push(item[1].trim().replace(/^["']|["']$/g, ""));
    }
  }

  return meta;
}

function listPrompts() {
  return readdirSync(promptDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith(".md") && !name.startsWith("_"))
    .sort()
    .map((name) => {
      const file = join(promptDir, name);
      const text = readFileSync(file, "utf8");
      const meta = parseFrontmatter(text);
      return {
        file,
        slug: meta.slug || name.replace(/\.md$/, ""),
        name: meta.name || null,
        userFacingDirection: meta.user_facing_direction || null,
        bestFor: Array.isArray(meta.best_for) ? meta.best_for : [],
        avoidFor: Array.isArray(meta.avoid_for) ? meta.avoid_for : [],
        keywords: Array.isArray(meta.keywords) ? meta.keywords : [],
        density: meta.density || null,
        tone: meta.tone || null,
        mode: meta.mode || null,
      };
    });
}

console.log(JSON.stringify(listPrompts(), null, 2));
