# Design Anchor Skill

Design Anchor Skill is the AI gateway for the `design-anchor` npm runtime.

The skill routes a user prompt or built-in style source into Design Anchor, activates the npm runtime in the target project, and keeps future AI-written UI governed through tokens, `@design` components, component specs, sync, audit, Portal, and generated AI coding rules.

## Install Locally

Copy the skill folder into your Codex skills directory:

```bash
mkdir -p ~/.codex/skills
cp -R design-anchor ~/.codex/skills/design-anchor
```

Then use `$design-anchor` in Codex.

## Runtime Relationship

- Skill: intent router, style source selection, prompt-to-system workflow.
- `design-anchor` npm package: project activation, AI coding rules, tokens, components, specs, Portal, MCP, sync, and audit.

In a consumer project, the skill installs and activates the runtime with:

```bash
npm install design-anchor
npx design-anchor start
```

