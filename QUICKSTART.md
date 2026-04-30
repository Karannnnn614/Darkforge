# Quick Start

Install Darkforge in 30 seconds, generate your first dark UI in 60.

## 1. Install

In any Claude Code session:

```bash
/plugin marketplace add Karannnnn614/Darkforge
/plugin install darkforge@darkforge
```

Verify it loaded:

```bash
/plugin list
```

You should see `darkforge` in the enabled list.

## 2. First prompt

The canonical command form is namespaced — always works regardless of other plugins:

```bash
/darkforge:forge glassmorphism pricing card with violet hover glow
```

`/forge` works as a shortcut when there's no naming conflict. You can also describe what you want in plain English and Claude will auto-invoke the skill:

```text
Make me a dark hero section with a violet gradient and animated text reveal.
```

## 3. What you should see

On the **first** call in a session, Darkforge maps your codebase before generating:

```
📦 Stack profile
Framework:  Next.js 14 (App Router)
Styling:    Tailwind v4
Animation:  framer-motion
3D:         @react-three/fiber + drei
Components: shadcn/ui (12 components in src/components/ui/)
Aliases:    @/components, @/lib
Tokens:     6 existing CSS vars (will extend, not replace)
```

Then it generates a complete TSX file with imports, types, DF tokens via CSS variables, `useReducedMotion` guards, `aria-*` attributes, and mobile-first responsive layout.

On subsequent calls, the profile stays cached — no re-mapping.

## 4. Common first prompts

```bash
# Sections
/darkforge:forge hero glass split with violet gradient
/darkforge:forge dashboard agent interface with chat
/darkforge:forge pricing three-tier glass cards

# Components
/darkforge:forge animated stats grid with number counters
/darkforge:forge dark sidebar with icon navigation
/darkforge:forge skeleton blog card

# Full pages
/darkforge:forge page saas landing
```

See `examples/` in this repo for full reference outputs (`landing-saas`, `dashboard-agent`, `product-showcase`).

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Unknown command: /forge` | Plugin not installed yet. Run the two install commands above and `/plugin list` to verify. |
| Skill loads but ignores intent | Phrase the request with one of the keywords from `skills/forge/SKILL.md` (e.g. "hero", "dashboard", "skeleton"). |
| Generated code uses libraries you don't have | Phase 1 (Map) failed to read `package.json`. Tell Claude "rescan" and try again. |
| Light theme leaked in | Tell Claude "AMOLED dark only" — it should have, but rare regressions on long sessions. |

## Next steps

- Read `README.md` for the full library coverage list and architecture.
- Read `skills/forge/SKILL.md` for the intent-routing table (which keywords load which references).
- Read `docs/inspiration-research.md` for positioning context.
