<div align="center">

# Design Anchor

**已有项目 UI/UX 重构 Skill**

<br/>

<p>
  <img src="https://img.shields.io/badge/Claude_Code-Agent_Skill-6B5CE7?style=flat-square" alt="Claude Code" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square&color=0a0a0a" alt="MIT" />
</p>

<h3>保留业务逻辑，重组 UI/UX；用 design-tokens.json 统一视觉，用 UX prompt routing 选择正确交互策略。</h3>

[English](./README.en.md)

</div>

---

## 核心定位

Design Anchor 不依赖同名 npm 包。它面向已有项目做 UI/UX 重构，不主打展示型/营销型页面。

它的基本结构是：

- 先把原页面当作业务逻辑来源，保留路由、数据绑定、状态管理、权限判断、API 调用和事件处理。
- 再识别页面的真实任务、交互问题、状态缺口和信息层级，选择合适的 UX 策略。
- 简单页面优先保留布局并局部修复；复杂页面可以重组为表格、分栏、抽屉、模态框、工作流步骤、批量操作等更合适的交互结构。
- 先建立或尊重用户自己的 `design-tokens.json`，形成美观且一致的样式基座。
- 基于 token 重新组装页面和组件，让不同页面在颜色、状态、边框、焦点、radius、密度和组件语义上保持一致。
- Tailwind 项目默认用 shadcn 作为组件执行层，合适时使用 shadcn blocks 做功能页面骨架；非 Tailwind 项目映射到已有组件库主题入口。

## 为什么需要它

已有项目通常不是不能用，而是页面越做越散：按钮颜色漂移、表格没有筛选和状态、表单反馈弱、危险操作不安全、弹窗每页一套、移动端路径断裂。

Design Anchor 的基本判断是：

| 基础问题 | 处理方式 |
|---|---|
| 原页面逻辑不能丢 | 把旧页面作为逻辑来源，只重构呈现、交互和组件结构 |
| 样式不统一 | 建立/复用 `design-tokens.json`，绑定 CSS variables 和组件库主题 |
| 任务路径不清 | 识别用户任务、决策点、主次动作和反馈路径 |
| 页面结构不适合功能 | 根据复杂度选择保留、局部修复或结构性重组 |
| 状态反馈缺失 | 补 loading/empty/error/saving/success/selected/disabled |
| 组件不统一 | 基于 token 使用同一套组件语义重新组装页面 |

## 工作流

```text
确认范围和回退方式
  -> 读取已有页面、组件、样式和业务逻辑
  -> 建立/复用 design-tokens.json 作为样式基座
  -> 绑定全局 CSS variables 和组件库主题入口
  -> 识别用户任务、交互问题和状态缺口
  -> 复杂问题先启发式追问产品目标和用户目标实现轨迹
  -> 选择合适的 UX 策略
  -> 基于 token 和组件体系重新组装页面
  -> 按用户路径做状态/响应式/可访问性自检
  -> 必要时通过备份、分支或 diff 回退
```

## 改动提醒

Design Anchor 会尽量保留已有逻辑，但 UI/UX 重构可能会带来较大的页面结构变化，尤其是复杂表格、长表单、审批流、配置页和工作台页面。

遇到复杂、高风险或业务目标不清的问题时，Skill 不应幻想一个完整方案，而是先基于已读代码和界面信号做启发式追问，帮助用户补充这个页面、组件或板块主要解决什么问题，以及产品用户从进入页面到完成目标的实现轨迹。小的局部问题不需要触发这一步。

在成熟项目里使用时，建议先创建 git 分支、提交当前状态或做好备份。这样即使某次重组不符合预期，也可以通过 diff、revert 或分支切换回退到原页面。

## 组件策略

默认顺序：

1. 复用已有 token-compatible 组件。
2. React + Tailwind 默认使用 shadcn components。
3. 如果 shadcn blocks 的结构匹配功能页面，就先用 blocks 做骨架，再接回业务逻辑。
4. 如果已有 MUI / Ant / Chakra / Mantine 等套件库，将 token 映射进它们的主题入口。
5. 只有现有层覆盖不了交互时，才补 headless primitive 或小型 wrapper。

常用 B 端组件：

```text
button input textarea label select checkbox switch
card badge table tabs dialog dropdown-menu popover sheet tooltip
breadcrumb pagination skeleton toast/sonner
```

## UX 规则

每个功能页面先回答：

```text
用户要完成什么任务？
他们需要先看到什么信息才能行动？
主动作、次动作、危险动作分别在哪里？
页面有哪些 loading / empty / error / saving / success / disabled 状态？
重复使用时能不能更快？
移动端和键盘操作有没有断点？
```

Blocks 和组件只能承载体验，不能替代 UX 判断；UX prompt 决定交互方向，token 决定视觉一致性。

简单页面优先保留原有布局，只做必要修复；复杂页面才引入抽屉、模态框、分栏、批量操作、工作流步骤等结构性改造。

`references/ux-prompt-capsules.md` 是交互问题的 prompt 范式库：例如密集数据、上下文编辑、危险操作、长表单、工作流状态、分栏工作台等。

设计师补充 UX 知识时，使用 `references/ux-rule-cards.md` 的一行规则格式：只写稳定的判断信号、推荐动作和保护边界，不写像素级细节或临时审美偏好。

复杂问题需要外部范式时，参考 `references/ux-pattern-sources.md` 的权威设计系统路由。它只提示去哪看，例如 Salesforce、IBM、SAP Fiori、GOV.UK、W3C，不要求每次都查。

## Token 规则

`design-tokens.json` 是用户拥有的主题契约，也是样式统一的核心。Skill 可以创建、补全、建议修改，但不能静默覆盖用户锁定的主题值。新项目默认使用 Design Anchor 的精简语义 token；已有项目可以保留自己的 token 命名，只要通过 `mappings.cssVariables` 和 `mappings.componentLibraries.<library>` 映射到组件需要的 CSS variables。

结构色必须走 token：

```text
primary / primary-foreground
background / foreground
card / card-foreground
muted / muted-foreground
border / input / ring
destructive / success / warning
```

装饰渐变、图表色、插图色和页面氛围色可以保留，只要它们不是结构性状态或主操作色。

## 安装 Skill

```bash
mkdir -p .claude/skills/design-anchor
cp -R SKILL.md scripts references agents .claude/skills/design-anchor/
```

或全局安装：

```bash
mkdir -p ~/.claude/skills/design-anchor
cp -R SKILL.md scripts references agents ~/.claude/skills/design-anchor/
```

## 目录结构

```text
design-anchor/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── scripts/
│   ├── probe-design-anchor.mjs
│   ├── probe-functional-ux.mjs
│   └── write-token-baseline.mjs
└── references/
    ├── token-contract.md
    ├── functional-ux.md
    ├── ux-prompt-capsules.md
    ├── ux-rule-cards.md
    ├── ux-pattern-sources.md
    ├── component-system.md
    ├── b2b-page-patterns.md
    ├── page-rendering-pipeline.md
    ├── project-contract.md
    ├── visual-craft.md
    └── quality-bar.md
```
