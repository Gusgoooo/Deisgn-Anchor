<div align="center">

# Design Anchor

**全流程设计 Skill——适合长期项目的设计 skill**

<br/>

<p>
  <img src="https://img.shields.io/npm/v/design-anchor?style=flat-square&color=0a0a0a" alt="npm" />
  <img src="https://img.shields.io/badge/Claude_Code-Agent_Skill-6B5CE7?style=flat-square" alt="Claude Code" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square&color=0a0a0a" alt="MIT" />
</p>

<h3>面向 React + Tailwind 产品应用，从第一个页面的设计落地，到第一百个页面的设计一致性，<br/>Design Anchor 像设计负责人一样主动判断阶段、引导下一步，并覆盖设计的完整生命周期。</h3>

[English](./README.en.md)

</div>

---

## 为什么需要它

AI 做 UI 的问题不在第一页，在第十页：按钮颜色开始偏移、hover 状态各写各的、icon 库混了三套、布局越来越像默认模板。

Design Anchor 给 AI 加一层设计判断力：

| 问题 | 怎么解决 |
|---|---|
| 没有设计基座 | 先装 runtime，建立 `design-tokens.json`，所有结构色走 token |
| 风格说不清 | 从 26 套内置风格方向自动匹配，转成 token |
| 页面越做越散 | 主色、状态色、交互态统一走 token；decorative 色自由 |
| 已有产品不敢动 | 先预检，推荐整页重构，逐页确认后才改 |
| 做完不知道下一步 | 像设计负责人一样判断阶段，主动给建议 |
| Token 合规但不好看 | 继续做视觉打磨，直到像专业设计的页面 |

---

## 工作流

```
用户需求 → 预检脚本 → 分类路由 → 执行
```

| 场景 | Skill 做什么 |
|---|---|
| **有设计方向** | 保存 prompt → `theme` 抽 token → 生成页面 |
| **只有产品想法** | 匹配内置风格 → 转 token → 生成首页 |
| **已有产品** | 预检 → 推荐布局重构 / 渐进优化 / 只读审计 |
| **不确定下一步** | 判断阶段，主动建议该做什么 |
| **检查设计系统** | 按需打开 Portal |

---

## 治理边界

**Token 管结构，不管个性。**

| 必须走 token | 自由发挥 |
|---|---|
| 主按钮、链接、active、focus → `primary` | 装饰渐变、插图色、页面氛围 |
| 成功 / 警告 / 错误 / 信息 → 语义 token | 数据可视化配色 |
| hover / disabled → 从 token 派生 | 阴影、质感、signature elements |

**功能型组件走 runtime，展示型自由设计。**

| 类型 | 策略 |
|---|---|
| **功能型** (dialog, command, select, popover, sheet, tooltip, tabs) | `npx design-anchor add <component>` — 可访问性、键盘交互、ARIA |
| **展示型** (卡片、导航、表格、hero、表单排布……) | AI 根据风格 prompt 自由设计，无强制库 |

**布局靠原则，不靠模板。** 7 条质量原则：目的-布局匹配、信息层级、操作层级、密度适配、空间效率、导航清晰、状态完整。

---

## 快速开始

**安装 Skill：**

```bash
# 项目级
mkdir -p .claude/skills/design-anchor
cp -R SKILL.md scripts references agents .claude/skills/design-anchor/

# 或全局
mkdir -p ~/.claude/skills/design-anchor
cp -R SKILL.md scripts references agents ~/.claude/skills/design-anchor/
```

**安装 Runtime（在目标项目里）：**

```bash
npm install -D design-anchor && npx design-anchor sync
```

<details>
<summary>其他包管理器</summary>

```bash
pnpm add -D design-anchor && pnpm exec design-anchor sync
yarn add -D design-anchor && yarn design-anchor sync
bun add -d design-anchor && bunx design-anchor sync
```

</details>

> Runtime 面向 React + Tailwind 项目。其他技术栈可用 Skill 的设计诊断和布局原则，但 runtime / 组件安装需先确认适配。

---

## 命令速查

| 命令 | 作用 |
|---|---|
| `npx design-anchor sync` | 激活治理：token CSS、`.anchor`、规则镜像 |
| `npx design-anchor theme <prompt.md>` | 风格 prompt → token |
| `npx design-anchor add <component>` | 按需安装功能型组件 |
| `npx design-anchor audit` | 13 项设计合规审查 |
| `npx design-anchor govern` | 可选：注入 AI bridge（AGENTS / CLAUDE / Cursor / MCP） |
| `npx design-anchor hydrate` | clone 后重建 `.anchor/` |
| `npx design-anchor portal` | 按需查看设计系统 |

---

## 质量门槛

每次 UI 改动后自检 13 项：

| # | 门槛 |
|---|---|
| 1 | 视觉完成度高，不是线框图 |
| 2 | 文本 WCAG AA 对比度 |
| 3 | 交互元素有 hover / focus |
| 4 | 空、加载、错误状态完整 |
| 5 | 320 / 768 / 1024 / 1440px 不破版 |
| 6 | 结构色走语义 token |
| 7 | 主色全产品一致 |
| 8 | hover / focus / disabled 派生一致 |
| 9 | 单一 icon 库 |
| 10 | 表单有可见 label |
| 11 | 破坏性操作有确认 |
| 12 | 键盘可达 |
| 13 | 无布局跳动 |

---

## 交付物

| 产物 | 路径 | 提交 |
|---|---|---|
| Token 源 | `design-tokens.json` | ✓ |
| 生成 CSS | `.anchor/design-tokens.generated.css` | ✗ 可重建 |
| 功能型组件 | `src/components/` | 按需 |
| AI bridge | `AGENTS.md` / `CLAUDE.md` / `.cursor/rules/` | 团队决定 |
| 控制面 | `.anchor/` | ✗ 可重建 |

---

## 目录结构

```
design-anchor/
├── SKILL.md                        # AI 入口：分类、路由、执行规则
├── agents/
│   └── openai.yaml                 # OpenAI agent metadata
├── scripts/
│   ├── probe-design-anchor.mjs     # 项目预检
│   └── list-style-prompts.mjs      # 风格池 metadata
└── references/
    ├── govern-existing-product.md   # 已有产品治理
    ├── layout-governance.md         # 布局原则与组件策略
    ├── page-rendering-pipeline.md   # 三阶段页面渲染
    ├── visual-craft.md              # 视觉打磨手册
    ├── quality-bar.md               # 质量门槛
    ├── component-decision.md        # 组件安装决策
    ├── product-context.md           # 产品类型与页面目的
    ├── style-source-selection.md    # 风格来源选择
    ├── style-prompt-guidance.md     # 风格 prompt → token
    ├── project-contract.md          # 文件边界
    ├── design-prompt-pool.md        # 风格池格式
    ├── portal-routing.md            # Portal 路由
    └── design-prompts/              # 26 套内置风格方向
```

---

## 设计思路

**确定性预检** — 脚本先扫描项目输出结构化 JSON，AI 少猜一点。

**渐进加载** — SKILL.md 只做路由，references 按需读取，不塞满上下文。

**模式觉察** — 受 [Impeccable](https://github.com/pbakaus/impeccable) 启发，拦截无意识默认输出，不禁止有意图的设计选择。

**原则驱动** — 布局治理基于质量原则而非固定模板，AI 自由设计但必须能解释为什么。

---

MIT
