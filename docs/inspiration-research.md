# Inspiration Research — what comparable Claude Code plugins do well

Survey conducted 2026-04-30 of five reference repos cloned to `/tmp/nexus-research/`. Goal: identify positioning, README conventions, install UX, and structural patterns that Darkforge should adopt before launch.

---

## 1. `jeffallan/claude-skills` — closest comparable

**What it is:** 66-skill marketplace plugin spanning languages, frameworks, infra, APIs, testing, DevOps, security. Most directly comparable plugin in the ecosystem because it ships skills (not raw commands) under a single `/plugin install` flow.

**Install UX:**
```
/plugin marketplace add jeffallan/claude-skills
/plugin install fullstack-dev-skills@jeffallan
```
Two-step (marketplace add → install). Mirror this exactly in Darkforge's README so users hit the same muscle memory.

**README conventions worth stealing:**
- Header banner via `capsule-render.vercel.app` (animated SVG gradient with title + subtitle). Cheap polish.
- Trendshift badge + "Mentioned in Awesome Claude Code" badge cluster. Social proof up top.
- `<!-- SKILL_COUNT -->66<!-- /SKILL_COUNT -->` HTML-comment markers so a CI script can update counts without a human touching the README.
- "Context-Aware Activation" section with copy-pasteable example prompts that map → skill name → loaded reference. Show, don't tell.
- "Multi-Skill Workflows" section: literal arrow chains (`Feature Forge → Architecture Designer → Fullstack Guardian`). Demonstrates composition.

**Structural patterns:**
- `skills/<category>/<skill-name>/SKILL.md` + `skills/<category>/<skill-name>/references/*.md`. Categorized directory layout — Darkforge is currently flat (`skills/forge/references/...`); if we ever expand to `/forge:scan` etc, follow this layout.
- Top-level docs: `QUICKSTART.md`, `ROADMAP.md`, `CHANGELOG.md`, `CONTRIBUTING.md`. Darkforge now has the core set; a dedicated skill guide can wait until the reference library grows beyond UI.
- GitHub Pages doc site at `jeffallan.github.io/claude-skills` with per-skill pages. Worth doing post-launch.

**What NOT to copy:** Atlassian MCP integration scope-creep — they bolted on Jira/Confluence workflow commands. Darkforge should stay focused on UI generation.

---

## 2. `safishamsi/graphify` — multi-platform packaging gold standard

**What it is:** Single-skill plugin (`/graphify`) that runs an AST + LLM pipeline to build knowledge graphs. PyPI package + Claude Code skill + 14 other AI tool integrations.

**Positioning lessons:**
- Tagline: "An AI coding assistant skill" — not "a Python tool that also works with Claude". Frames the skill as primary, package as delivery mechanism.
- "Andrej Karpathy keeps a /raw folder..." — a real-name use-case anchor in the README intro. Darkforge could open with "Every dev who's tried to build a dark, animated landing page knows the pain..."
- Receipts callout: "**71.5x fewer tokens per query vs reading raw files**" — a concrete number, not vibes. Darkforge should measure something similar: e.g. "one /forge call generates ~2000 lines of production-ready code that would take 4 hours to compose manually."

**Install UX:**
```
uv tool install graphifyy && graphify install
```
Auto-detects which AI tool is running, writes correct config for each. Darkforge's install is simpler (no PyPI package), but the **auto-detection idea** could apply to detecting React vs Vue vs Svelte vs Astro in the user's package.json — which the SKILL.md already does in Phase 1 (Map). Lean into that more heavily in marketing.

**Translation strategy:** 26+ language READMEs in `docs/translations/`. Overkill for v1.0. Consider top-3 (zh-CN, ja-JP, ko-KR) post-launch if there's traction.

**Honesty markers:** `EXTRACTED` / `INFERRED` / `AMBIGUOUS` tags on every relationship — transparent about what's source-of-truth vs guessed. **Darkforge's "Source-of-truth caveat" callouts and `// VERIFY:` comments are the same idea.** This is the right pattern; keep it.

---

## 3. `tirth8205/code-review-graph` — install-everywhere + diagram-driven README

**What it is:** Tree-sitter + MCP-based code review accelerator. Plugin manifest includes `.mcp.json` + a VSCode extension + 7 skills.

**README pattern that works:**
- 6 inline diagrams (`diagrams/diagram1_before_vs_after.png` etc) that visually explain the value prop. Darkforge desperately needs **one before/after screenshot** showing "default Tailwind hero" vs "/forge hero" output. Animated GIF would be even better.
- "8.2x average token reduction across 6 real repositories" — specific, measurable, prominent in hero image.
- One-command auto-config across 11 platforms: `code-review-graph install` writes MCP config for whichever AI tool is detected. Not directly applicable to Darkforge (no MCP needed) but shows users want zero-config install flows.

**MCP composition:** Their plugin is multi-modal — skills + MCP server + IDE extension. Darkforge v1 doesn't need this, but if v2 ships `/forge:scan` as a separate read-only audit command, packaging as an MCP tool might give better activation outside Claude Code.

---

## 4. `VoltAgent/awesome-design-md` — adjacent positioning

**What it is:** Curated list of 69 `DESIGN.md` files (Google Stitch's design-system-as-markdown spec). Not a plugin, but adjacent in problem space.

**Critical positioning insight:** They distinguish:
- `AGENTS.md` — how to BUILD the project (read by coding agents)
- `DESIGN.md` — how the project should LOOK (read by design agents)

Darkforge is closer to a *design agent* than a coding agent. The README should adopt this framing: "When you ask Claude to build UI, it reads code conventions but has no aesthetic anchor. Darkforge is the design anchor — drop it in, get cohesive AMOLED-dark output every time."

**Action:** Consider shipping a `DESIGN.md` template alongside Darkforge that codifies the AMOLED token system in DESIGN.md format. Cross-ecosystem compatibility win — works in Stitch, Cursor, etc.

---

## 5. `linuxhardened-org/open-server-inventory` — full-app architecture (less relevant)

**What it is:** Full-stack monitoring app (client/server/sdk/sync scripts), not a plugin. Skimmed for completeness; not directly comparable. Skipping detailed notes.

---

## Synthesis — what Darkforge should ship before LinkedIn launch

**MUST (before launch):**
1. **One before/after screenshot or 5-second GIF** in the README hero. This is the single highest-leverage missing asset. (Karan's job — record demo.)
2. **Concrete metric in the tagline.** Pick one: "7 reference libraries, 17 dark-token patterns, ~25k lines of production code in one /forge call." Front-load the receipts.
3. **`QUICKSTART.md`** — done. Keep it short, and update only when install flow changes.
4. **GitHub topics + About description.** (Karan's web UI task; topics already drafted in handoff.)

**SHOULD (week 1 post-launch):**
5. **`CHANGELOG.md`** seeded with v1.0.0 entry — done.
6. **`CONTRIBUTING.md`** — done. Keep the `// VERIFY:` convention visible.
7. **One real example prompt → output pair** in README. Use the existing `examples/landing-saas/` — show "I asked /forge for a SaaS landing page → got this 2069-line file."
8. **`DESIGN.md`** stub at repo root encoding the AMOLED token system in Stitch-compatible format. Cross-ecosystem distribution channel.

**NICE (month 1):**
9. GitHub Pages doc site (`Karannnnn614.github.io/Darkforge`) with per-reference pages. Improves SEO + gives library coverage a polished surface.
10. Top-3 README translations (zh-CN, ja-JP, ko-KR) IF v1 gets >100 stars in week 1. Skip otherwise.
11. Trendshift submission + Awesome Claude Code PR — both are passive social-proof channels jeffallan and graphify both leveraged.

**SKIP:**
- MCP server packaging (overhead > value for a generation skill)
- Multi-platform install detection (Darkforge is Claude-Code-only by design)
- Atlassian/external integrations (scope creep)

---

## README moves already adopted

Pull from `jeffallan/claude-skills` style:
- Keep the HTML metric markers so future updates are mechanical.
- Keep the "Context-Aware Activation" section with prompts mapped to loaded references.
- Keep the "Multi-skill workflows" arrow-chain pattern for building a full landing page incrementally.

Pull from `safishamsi/graphify` style:
- Open with a real-name anchor scenario instead of a generic feature list.
- Adopt the EXTRACTED / INFERRED honesty tagging in reference files (already partially done via Source-of-truth caveats — formalize into a single conventional comment style across all references).
