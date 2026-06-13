#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const target = resolve(process.argv[2] || process.cwd());
const parsedMaxFiles = Number(process.env.DESIGN_ANCHOR_MAX_UX_FILES || 120);
const maxFiles = Number.isFinite(parsedMaxFiles) && parsedMaxFiles > 0 ? parsedMaxFiles : 120;
const extensions = new Set([".tsx", ".jsx", ".ts", ".js", ".mjs"]);
const ignoredDirs = new Set(["node_modules", ".git", ".next", ".nuxt", "dist", "build", "coverage"]);

function readText(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function extname(name) {
  const match = name.match(/\.[^.]+$/);
  return match ? match[0] : "";
}

function collectFiles(path, depth = 0) {
  if (!existsSync(path) || depth > 8) return [];
  const stats = statSync(path);
  if (stats.isFile()) return extensions.has(extname(path)) ? [path] : [];
  if (!stats.isDirectory()) return [];

  let entries = [];
  try {
    entries = readdirSync(path, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    if (files.length >= maxFiles) break;
    if (entry.isDirectory() && ignoredDirs.has(entry.name)) continue;
    files.push(...collectFiles(join(path, entry.name), depth + 1));
  }
  return files.slice(0, maxFiles);
}

function count(regex, text) {
  return (text.match(regex) || []).length;
}

function has(regex, text) {
  return regex.test(text);
}

function fileSignals(file) {
  const text = readText(file);
  return {
    file,
    name: basename(file),
    table: has(/\b(Table|DataTable|<table|TanStack|ColumnDef)\b/i, text),
    form: has(/\b(form|useForm|FormField|<form|zodResolver|Controller)\b/i, text),
    filters: has(/\b(filter|filters|faceted|search|query|Input.*placeholder=.*search)\b/i, text),
    bulkActions: has(/\b(bulk|selectedRows|rowSelection|selectAll|selectedIds)\b/i, text),
    pagination: has(/\b(pagination|pageSize|pageIndex|nextPage|previousPage|Load more)\b/i, text),
    dialog: has(/\b(Dialog|AlertDialog|Sheet|Drawer|Modal)\b/i, text),
    dropdown: has(/\b(DropdownMenu|Menu|Popover|Command)\b/i, text),
    tabs: has(/\b(Tabs|TabList|TabPanel)\b/i, text),
    sidebar: has(/\b(Sidebar|AppSidebar|Navigation|NavMain)\b/i, text),
    chart: has(/\b(Chart|AreaChart|LineChart|BarChart|PieChart|recharts)\b/i, text),
    loadingState: has(/\b(loading|isLoading|pending|isPending|Skeleton|Spinner|Loader)\b/i, text),
    emptyState: has(/\b(empty|no data|no results|No results|Nothing yet|暂无|无数据)\b/i, text),
    errorState: has(/\b(error|isError|try again|retry|failed|失败|错误)\b/i, text),
    successState: has(/\b(success|saved|toast|sonner|完成|成功)\b/i, text),
    disabledState: has(/\b(disabled|aria-disabled|isDisabled|canSubmit|canSave)\b/i, text),
    destructiveAction: has(/\b(delete|remove|destroy|cancel subscription|danger|destructive|删除|移除)\b/i, text),
    validation: has(/\b(validate|validation|errors\.|fieldState|zod|yup|required|required:)\b/i, text),
    accessibility: has(/\b(aria-|role=|htmlFor|sr-only|VisuallyHidden)\b/i, text),
    keyboard: has(/\b(onKeyDown|shortcut|hotkey|kbd|KeyboardEvent|Command)\b/i, text),
    hardcodedColors: count(/\b(bg|text|border|ring|from|to|via)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g, text),
    buttons: count(/\b(Button|<button)\b/g, text),
    inputs: count(/\b(Input|Textarea|Select|Checkbox|Switch|RadioGroup|<input|<textarea|<select)\b/g, text)
  };
}

function summarize(files) {
  const perFile = files.map(fileSignals);
  const totals = perFile.reduce((merged, item) => {
    for (const [key, value] of Object.entries(item)) {
      if (key === "file" || key === "name") continue;
      if (typeof value === "boolean") merged[key] = (merged[key] || 0) + (value ? 1 : 0);
      if (typeof value === "number") merged[key] = (merged[key] || 0) + value;
    }
    return merged;
  }, {});

  const likelyPatterns = [];
  if (totals.table) likelyPatterns.push("list/table");
  if (totals.form) likelyPatterns.push("form/settings");
  if (totals.chart) likelyPatterns.push("dashboard/monitoring");
  if (totals.sidebar && totals.table) likelyPatterns.push("workspace/split");
  if (totals.dialog || totals.tabs) likelyPatterns.push("detail/workflow");

  const missingStateRisks = [];
  if ((totals.table || totals.form || totals.chart) && !totals.loadingState) missingStateRisks.push("loading");
  if ((totals.table || totals.filters) && !totals.emptyState) missingStateRisks.push("empty");
  if ((totals.form || totals.table || totals.chart) && !totals.errorState) missingStateRisks.push("error");
  if (totals.form && !totals.validation) missingStateRisks.push("validation");
  if (totals.destructiveAction && !totals.dialog) missingStateRisks.push("destructive-confirmation");
  if ((totals.dialog || totals.dropdown || totals.tabs) && !totals.accessibility) missingStateRisks.push("accessibility-hooks");

  const recommendedUxQuestions = [
    "What is the primary user task and shortest successful path?",
    "If the page is complex or product intent is unclear, what problem does this page/section mainly solve and what user-goal trajectory is expected?",
    "Which existing UI areas should be kept, modified, removed, added, or restructured?",
    "Which UX prompt capsule fits the problem: dense records, contextual edit, risky action, long form, workflow state, split workspace, settings configuration, dashboard triage, detail review, AI workspace, permission/empty gate, or mobile fallback?",
    "Which information must appear before the primary action?",
    "Which actions are primary, secondary, row-level, bulk, or destructive?",
    "Which states are reachable but not designed?",
    "What should become faster for repeat users?",
    "What breaks on mobile or keyboard navigation?"
  ];

  return {
    target,
    scannedFiles: perFile.length,
    truncated: files.length >= maxFiles,
    likelyPatterns: [...new Set(likelyPatterns)],
    totals,
    missingStateRisks,
    recommendedUxQuestions,
    files: perFile
  };
}

const files = collectFiles(target);
console.log(JSON.stringify(summarize(files), null, 2));
