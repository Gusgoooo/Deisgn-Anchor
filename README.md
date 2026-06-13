<div align="center">

# Design Anchor

**基于已有页面业务逻辑重构 UI/UX**

<br/>

<p>
  <img src="https://img.shields.io/badge/Agent_Skill-Design_Anchor-6B5CE7?style=flat-square" alt="Agent Skill" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square&color=0a0a0a" alt="MIT" />
</p>

<h3>读取旧页面的路由、数据、状态、权限和交互意图，保留能用的业务逻辑，重组不合理的 UI/UX，再通过统一组件体系让页面一致、清晰、好用。</h3>

[English](./README.en.md)

</div>

---

## 它解决什么

Design Anchor 面向已经存在的 B 端、SaaS、管理后台和内部工具页面。它把旧页面当作业务逻辑来源，重新组织页面体验、组件结构和视觉系统。

核心动作只有三件：

1. 保留业务逻辑：路由、API、状态管理、权限、表单校验、事件处理不乱动。
2. 重构 UI/UX：识别用户任务、信息层级、状态缺口和交互问题，选择保留、局部修复或结构性重组。
3. 统一视觉：建立或复用 `design-tokens.json`，用 token-bound 组件重装页面。

## 适合的场景

- 页面逻辑能跑，但视觉风格、组件样式和交互方式越来越散。
- 列表、表格、详情、表单、设置页、审批流、工作台、Dashboard 需要重构体验。
- 想保留业务代码，但接近重做前端页面的视觉、布局和交互。
- 需要让多个页面共享同一套颜色、radius、边框、焦点、状态、密度和组件语义。

## 工作方式

```text
读取已有页面
  -> 提取业务逻辑和用户任务
  -> 建立/复用 design-tokens.json
  -> 选择 UX 策略
  -> 用统一组件体系重组页面
  -> 接回原有数据、状态、权限和事件
  -> 补齐状态、响应式、可访问性和视觉细节
```

简单页面优先保留原布局，只修样式、状态和局部交互。

复杂页面可以重组为更合适的结构，例如表格工具栏、筛选区、详情抽屉、编辑模态框、分栏工作台、批量操作、分步流程、确认与撤销反馈。

当业务目标不清、改动风险大或页面任务复杂时，Skill 会先基于代码和界面信号做启发式追问，帮助用户补充页面目标、用户路径和关键约束，再开始重构。

## Token 和组件

`design-tokens.json` 是样式统一的核心契约。Skill 可以创建、补全或映射 token，但不应静默覆盖用户已经定义的主题。

结构性样式必须走 token：

```text
primary / primary-foreground
background / foreground
card / card-foreground
muted / muted-foreground
border / input / ring
destructive / success / warning
```

组件策略：

1. 优先复用项目已有的 token-compatible 组件。
2. Tailwind 项目默认采用 shadcn 组件语义，合适时使用 blocks 做功能页面骨架。
3. 其他组件库通过 mapping 接入主题入口，例如 Ant Design、MUI、Chakra、Mantine、Radix-based 组件体系。
4. 组件只负责统一执行，真正的页面结构由业务任务和 UX 判断决定。

## 质量要求

重构后的页面至少要做到：

- 主任务、次任务、危险动作位置清晰。
- loading、empty、error、saving、success、disabled 状态完整。
- 表格、表单、筛选、详情、批量操作等高频 B 端路径更顺。
- 桌面和移动端都能自适应，不因为内容长度破版。
- hover、focus、transition、elevation、微弱纹理或色彩弥散等视觉细节服务可用性，而不是制造噪音。
- 大改前保留备份、分支或清晰 diff，必要时可以回退。

## 参考资料

- `references/token-contract.md`：token 文件结构、CSS variables 和组件库 mapping。
- `references/functional-ux.md`：业务逻辑识别、交互诊断和重组策略。
- `references/ux-prompt-capsules.md`：复杂交互问题的 prompt 范式。
- `references/ux-rule-cards.md`：设计师补充规则的一行格式。
- `references/ux-pattern-sources.md`：Salesforce、IBM、SAP Fiori、GOV.UK、W3C 等权威 pattern 查阅路径。
- `references/visual-craft.md`：最后一轮视觉细节、动效和自适应打磨。

## 安装

```bash
mkdir -p .claude/skills/design-anchor
cp -R SKILL.md scripts references agents .claude/skills/design-anchor/
```

或全局安装：

```bash
mkdir -p ~/.claude/skills/design-anchor
cp -R SKILL.md scripts references agents ~/.claude/skills/design-anchor/
```

## 目录

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
