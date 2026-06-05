# Design Anchor Skill

[English](./README.en.md)

让 AI 写的第 100 个页面和第 1 个页面遵守同一套设计规则。

---

## 问题

AI 写 UI 有一个被严重低估的问题：**它没有记忆**。

第一个页面可以写得很好——布局合理、组件规范、配色统一。但到了第十个页面，token 开始硬编码；到了第二十个页面，icon 库混用；到了第五十个页面，每个开发者的 AI 助手都在用不同的方式构建相同类型的组件。

最终结果：一个看起来像是十个不同的人做的产品。因为事实上确实是——十个不同的 AI 会话做的。

Design Anchor Skill 解决这个问题。它是 [`design-anchor`](https://www.npmjs.com/package/design-anchor) npm 包的 AI 入口层，在 AI 写任何代码之前先读取项目的 token、组件约束和布局质量原则，然后在写完之后用 audit 验证合规。

适用于所有需要长期维护的产品界面：SaaS、管理后台、AI 助手、数据平台、开发者工具、创意工具——任何用户反复使用的界面。

## 工作方式

Skill 激活后做三件事：

```
1. 预检  →  判断项目成熟度、技术栈、已有组件状态
2. 分类  →  决定走「生成首页」还是「治理已有产品」
3. 执行  →  每一步都绑定 token / 组件 / 布局 / audit 约束
```

| 项目状态 | Skill 行为 |
|---|---|
| 新项目 + 详细设计方向 | 提取 token → 根据页面用途自由设计最佳布局 → 生成首页 |
| 新项目 + 模糊需求 | 自动匹配内置风格方向 → 转 token → 生成首页 |
| 成熟已有产品 | 默认推荐**布局重构** → 逐页分析 → 重构布局 → 替换不达标组件 → 统一 icon |

## 核心能力

### 布局治理

大多数 AI 生成的界面失败不是因为颜色不对或组件缺失，而是因为**空间决策错误**——重要信息被埋在滚动区域，高频操作没有放在触手可及的位置，内容密度和任务需求不匹配。

Design Anchor 用 7 条质量原则治理布局，而非固定模板：

| 原则 | 检验 |
|---|---|
| 目的–布局适配 | 向设计师描述页面用途，他们会期望这个布局吗？ |
| 信息层级 | 用户 2 秒扫一眼，能看到最重要的东西吗？ |
| 操作层级 | 最频繁的操作，一次点击能完成吗？ |
| 密度–任务适配 | 密度服务的是任务还是美感？ |
| 空间效率 | 去掉这个元素，用户会注意到吗？ |
| 导航清晰度 | 用户被传送到这个页面，知道自己在哪吗？ |
| 状态完整性 | 数据为空、加载中、出错时页面什么样？ |

AI 根据每个页面的用途自由设计布局，然后用这些原则检验。Skill 内置了 8 类页面参考案例（数据工作台、详情页、Dashboard、表单、聊天界面、Canvas 工作区、Agent 工作流、配置页）作为灵感，但不强制匹配。

### 组件强制替换

不报告问题，直接替换。

当 AI 遇到不达标的组件时，不会输出一份「建议替换清单」然后等你确认——它直接用 `npx design-anchor add` 安装标准组件并替换。所有组件操作统一通过 Design Anchor，不引入外部 UI 库作为直接依赖。

被强制执行的组件标准：

| 组件 | 不达标表现 | 动作 |
|---|---|---|
| Sidebar 导航 | 无折叠、无分组、icon 混用、无 active 状态 | `design-anchor add sidebar` 替换 |
| 数据表格 | 行内 icon 泛滥、无空状态、无排序、状态用纯文本 | `design-anchor add table` 替换 |
| 表单 | 占位符代替 label、无分组、提交按钮滚出视野 | `design-anchor add input select ...` 替换 |
| 弹窗 | 无焦点陷阱、无 Escape 关闭、"确定/取消" 通用按钮 | `design-anchor add dialog` 替换 |
| Tab 组件 | 无键盘导航、无 ARIA 角色 | `design-anchor add tabs` 替换 |
| 命令面板 | 纯 input + 手动下拉，无快捷键 | `design-anchor add command` 替换 |
| App Shell | 每个页面自定义 header/sidebar，无统一结构 | 写入 `anchor-ui/app-shell.tsx` |

### AI 生成物反模式拦截

10 条绝对禁令 + 二阶检测。

AI 在 2025-2026 年有一组高度可预测的 UI 默认行为——四宫格指标卡开头、渐变文字标题、磨砂玻璃装饰、彩虹状态色、满屏圆角。这些模式一眼就能看出「这是 AI 做的」。Design Anchor 明确禁止这 10 种模式，并在已有产品治理中主动检测和移除。

更进一步：当所有人都学会避免这些初代默认行为后，又会出现「二阶默认」——用 bento grid 替代卡片网格、用动态渐变边框替代渐变文字、用极端极简主义反向对抗「AI 感」。Skill 也会拦截这些。

### 设计宪法

每一个 UI 产出在交付前必须通过：

- **色彩**：所有文本 WCAG AA 对比度，语义化 token，状态色限 4 类
- **排版**：正文行宽 55-75 字符，标题层级视觉可辨，最小 12px
- **交互**：所有可点击元素有 hover/focus 状态，破坏性操作需确认
- **可访问性**：表单 label 必须可见，键盘可达，焦点环不可移除
- **产出质量门槛**：10 项硬性检查，任何一项不通过都不能标记任务完成

### 风格 Prompt 系统

内置多套风格方向（紧凑高效型、稳重可信型、清爽友好型、深色专注型、实时指挥型等），通过 frontmatter 元数据自动匹配用户场景。

用户永远看不到内部 preset 名称。他们看到的是：

> 我帮你匹配到一个适合这个场景的风格方向，会先转成 token，再生成页面。

风格 prompt 只影响视觉层（密度、配色、圆角、字体氛围），不覆盖布局结构和组件规范——当两者冲突时，结构优先。

## 快速开始

### Claude Code（项目级安装）

```bash
# 将 skill 复制到项目的 .claude/skills 目录
mkdir -p .claude/skills
cp -R design-anchor .claude/skills/design-anchor
```

### Claude Code（个人全局安装）

```bash
cp -R design-anchor ~/.claude/skills/design-anchor
```

### Claude.ai 上传

```bash
# 从仓库根目录打包
zip -r design-anchor.zip design-anchor -x "*/.DS_Store"
# 上传 zip 文件即可
# zip 内顶层必须是 design-anchor/SKILL.md，不能是裸的 SKILL.md
```

安装 Skill 后，在目标项目中安装运行时：

```bash
npm install -D design-anchor    # 或 pnpm add -D / yarn add -D / bun add -d
npx design-anchor sync          # 后台激活：生成 token CSS、AI 规则、MCP 配置
```

## 架构

```
design-anchor/
├── SKILL.md                        # AI 入口 — 路由、规则、宪法
├── scripts/
│   ├── probe-design-anchor.mjs     # 确定性项目预检
│   └── list-style-prompts.mjs      # 风格 prompt 池元数据
├── references/
│   ├── govern-existing-product.md  # 已有产品治理（自包含执行手册）
│   ├── layout-governance.md        # 布局质量原则 + 参考案例 + 组件标准
│   ├── b2b-product-context.md      # 产品上下文 + 页面用途分类 + 反模式
│   ├── project-contract.md         # 文件边界 + 命令参考
│   ├── style-source-selection.md   # 风格匹配决策树
│   ├── style-prompt-guidance.md    # 风格 prompt → token 提取指南
│   ├── b2b-design-prompt-pool.md   # prompt 池格式规范
│   ├── portal-routing.md           # Portal 路由意图判定
│   └── b2b-design-prompts/         # 内置风格 prompt 池（可扩展）
│       └── *.md
└── agents/
    └── openai.yaml                 # OpenAI agent 适配器
```

**设计原则**：关键执行文件（如 `govern-existing-product.md`）是自包含的——内联了所有执行所需的布局原则、组件标准和审计标准，AI 加载一个文件就能完成整个治理流程，不需要跨文件查找。

## 运行时模型

Skill 是 AI 指令层；实际运行时由 `design-anchor` npm 包提供。

| 层 | 位置 | Git 策略 | 说明 |
|---|---|---|---|
| 组件源码 | `src/components/anchor-ui/` | 提交 | 用户拥有的源码级组件 |
| Design Token | `src/design-tokens/tokens.json` | 提交 | 产品 token 源 |
| Token CSS | `src/styles/design-tokens.generated.css` | 提交 | 从 token 生成，保证团队和 CI 一致 |
| 控制面 | `.anchor/` | 不提交 | 本地 Portal / Schema / MCP，可用 `hydrate` 重建 |
| AI 规则 | `AGENTS.md` / `CLAUDE.md` / `.cursor/rules/` | 按需提交 | `sync` 生成的编码约束 |

业务代码统一从 `@design` 或 `@/components/anchor-ui` 导入。永远不从 `.anchor/` 或 `node_modules/design-anchor/` 深路径导入。

## 已有产品治理

当预检脚本检测到成熟产品时，Skill 默认推荐**布局重构**：

```
布局重构（推荐）→ 逐页分析 → 整页重构 UI 层 → 保留全部业务逻辑
渐进优化        → 只修 token / import / 组件替换 → 保留现有布局
只读审计        → 仅扫描报告 → 不改文件
```

布局重构的执行方式：

1. 读取整个页面源码，理解每个组件、数据绑定和事件处理
2. 识别页面的主要用户任务，用质量原则评估当前布局
3. 设计更好的布局，呈现重构方案（当前 vs 目标）
4. **等待用户逐页确认**后才执行修改
5. 重构 UI 层：替换不达标组件、统一 icon、移除 AI slop 模式
6. 运行 `sync` + `audit` 验证合规
7. 输出 Design Anchor 自检报告

### 预检脚本检测的信号

预检脚本（`probe-design-anchor.mjs`）在不解析 AST 的前提下，通过文件存在性和依赖分析提取：

- 项目成熟度评分（页面文件数、组件数、样式文件数、UI 依赖）
- 框架检测（Next / Remix / Vite / SvelteKit / Vue / Astro 等）
- 组件库检测（是否使用多个 UI 库）
- CSS 策略检测（Tailwind / CSS-in-JS / Sass / CSS Modules 等）
- icon 库混用检测（10+ 主流 icon 库）
- 布局信号检测（是否有 layout 组件、sidebar、app shell）
- 表单 / 表格 / 状态管理 / 验证库检测
- Design Anchor 自身安装状态（依赖、控制面、token、规则、MCP）

所有检测结果输出为结构化 JSON，供 Skill 做路由决策。

## 扩展风格 Prompt 池

在 `references/b2b-design-prompts/` 下新增 `.md` 文件即可。文件必须包含标准 frontmatter：

```yaml
---
name: "内部名称（用户不可见）"
slug: "stable-slug"
user_facing_direction: "用户可理解的风格方向"
best_for:
  - "适用场景"
keywords:
  - "匹配关键词"
density: "compact | balanced | spacious | command-center"
tone: "focused, trustworthy, friendly"
mode: "light | dark | mixed | either"
---
```

Skill 根据 `best_for`、`keywords`、`density`、`tone`、`mode` 自动匹配用户请求。新增文件无需额外注册。

## 命令速查

```bash
npm install -D design-anchor          # 安装运行时
npx design-anchor sync                # 后台激活（token CSS + AI 规则 + MCP + .anchor）
npx design-anchor theme <prompt.md>   # 风格 prompt → token 提取
npx design-anchor add <component>     # 按需安装源码级组件
npx design-anchor audit               # 合规检查
npx design-anchor hydrate             # 重建本地 .anchor（clone 后）
npx design-anchor portal tokens       # 检视 token 状态
npx design-anchor portal components   # 检视组件库
npx design-anchor portal specs        # 检视组件 spec
npx design-anchor upgrade             # 升级本地组件包
```

## 需要 npm 包配合

以下能力需要 `design-anchor` npm 包支持，Skill 层无法独立完成：

- `audit` 增加布局和 icon 检查规则
- `sync` 生成的 AI 规则模板中包含布局约束

这些不阻塞 Skill 层的治理能力——Skill 自身的指令已经能指导 AI 完成布局分析、组件替换和 icon 统一。

## 设计思路来源

Design Anchor Skill 的设计借鉴了以下思路：

**确定性预检优于运行时猜测。** 用 Node 脚本在 AI 会话开始前扫描项目状态（依赖、文件结构、成熟度），输出结构化 JSON 供路由决策。AI 不需要猜项目是什么类型——脚本已经告诉它了。这种「先探测后行动」的模式源自对 AI agent 可靠性的观察：让 AI 做判断容易出错，让脚本做检测然后 AI 做决策更可靠。

**反 AI 默认行为的显式禁令。** AI 代码生成工具在 2025-2026 年形成了一组高度可预测的 UI 模式（四宫格指标卡、渐变文字、磨砂玻璃等）。与其期望 AI 自觉避免，不如写成明确的禁令列表。这个思路受到 [Impeccable](https://github.com/pbakaus/impeccable) skill 的启发——它首创了「绝对禁令」+ 「二阶 slop 检测」的模式，用宪法级规则拦截 AI 的本能输出倾向。

**自包含执行文件。** 关键执行手册（如已有产品治理）内联了所有必要知识，AI 加载一个文件就能跑完整个流程。这减少了跨文件引用带来的上下文丢失风险。同样受 Impeccable 启发——它将 anti-patterns、detection rules 和 fixes 放在同一个自包含的 reference 文件中。

**原则驱动而非模板匹配。** 布局治理基于 7 条质量原则而非固定的屏幕类型模板。AI 自由设计最佳布局，然后用原则验证。这比模板匹配更灵活，因为真实产品的页面往往不完全匹配任何预设类型。

**产出质量门槛作为硬性要求。** 10 项可验证的质量检查（对比度、hover/focus 状态、空状态、键盘导航等）作为 AI 交付前的必过关卡。不是建议，是要求——任何一项不通过就不能标记完成。

## License

MIT
