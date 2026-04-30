# Darkforge

> **The dark UI arsenal for Claude Code.** One command. Every library. Jaw-dropping output.

<!-- METRICS:START -->
**<!-- REF_COUNT -->35<!-- /REF_COUNT --> reference files** · **<!-- PATTERN_COUNT -->10<!-- /PATTERN_COUNT --> pattern recipes** · **<!-- EXAMPLE_COUNT -->3<!-- /EXAMPLE_COUNT --> working examples** · **<!-- LIB_COUNT -->25<!-- /LIB_COUNT --> libraries covered** · **AMOLED-first, light-theme opt-in**
<!-- METRICS:END -->

```
/darkforge:forge glassmorphism pricing card with violet hover glow
```

Darkforge gives Claude Code the complete arsenal of modern UI libraries and a strict AMOLED-dark design system — so every component you generate looks like a senior frontend engineer at a top-tier startup built it. Not a template. Not a tutorial. Not generic.

> *"Every dev who's tried to ask Claude for a landing page knows the trap: you describe a hero section and get back generic Tailwind purple-on-white. Bootstrap aesthetics. `bg-blue-500` defaults. The output looks like 2018."* Darkforge exists to end that.

---

## What it does

You type `/forge` followed by what you want. Darkforge:

1. **Maps your codebase** on the first call — reads `package.json`, your existing components, your Tailwind config, your CSS variables, your import aliases.
2. **Picks the right libraries** from what you actually have installed (Framer Motion vs GSAP, Three.js vs Vanta, shadcn vs DaisyUI).
3. **Generates** AMOLED dark, neon-glow, glassmorphism, animated, production-ready code that matches your existing project conventions.

No generic purple-on-white. No `bg-blue-500` defaults. No half-finished snippets. Every output is complete, typed, accessible, and responsive.

---

## Context-aware activation

Darkforge activates by intent, not just slash commands. Each phrase below loads exactly the right reference material:

| You say… | Darkforge loads… | You get… |
|---|---|---|
| `/darkforge:forge hero glass split with violet glow` | `references/patterns/hero.md` + `00-dark-tokens.md` | Full hero TSX with glass card, gradient text, framer-motion entrance |
| `make it look like Linear` | `references/inspiration-tour.md` + `references/02-gsap.md` | Scroll-driven gradient mesh hero, mix-blend-mode layered, AMOLED backdrop |
| `dashboard with AI agent on the right` | `references/patterns/dashboard.md` + `references/01-framer-motion.md` | Three-pane shell + StatsGrid + sortable table + AgentChatInterface with seed conversation |
| `R3F floating product showcase` | `references/03-threejs-r3f.md` + `references/patterns/3d-scene.md` | Canvas with `useGLTF`, `MeshTransmissionMaterial`, dynamic-import + Suspense fallback |
| `/darkforge:forge --light dashboard` | `references/18-light-theme.md` + `references/patterns/dashboard.md` | Same dashboard, layout root pre-rendered with `<html data-theme="light">` so the same `var(--df-*)` tokens flip at runtime |

## Multi-skill workflows

Compose pattern files for full pages. Each arrow loads more context, but the stack profile stays cached:

```
/darkforge:forge hero  →  /darkforge:forge features  →  /darkforge:forge testimonials  →  /darkforge:forge pricing  →  /darkforge:forge cta  →  /darkforge:forge footer
```

Or skip the chain entirely:

```
/darkforge:forge page saas landing
```

— and Darkforge composes all six sections in one shot. See `examples/landing-saas/` for the actual output of that command (2,069 lines).

---

## Install

```bash
/plugin marketplace add Karannnnn614/Darkforge
/plugin install darkforge@darkforge
```

That's it. Then type `/darkforge:forge` (the namespaced form, always works) — or just `/forge` when there's no conflict with other plugins. You can also describe what you want in plain English ("dark hero with violet glow") and Claude will auto-invoke the skill.

> **First time?** Run `/plugin list` to confirm `darkforge` is enabled. If `/forge` returns "Unknown command", the plugin isn't loaded yet — restart Claude Code or run `/plugin marketplace list` to verify the marketplace was added.

---

## Usage

```bash
# Generate anything dark UI
/forge glassmorphism pricing card with hover glow
/forge animated stats grid with number counters
/forge dark sidebar with icon navigation

# Hero sections
/forge hero glass split with violet gradient
/forge hero 3D floating product
/forge hero particle field with neon text

# Convert light components to AMOLED dark
/forge dark this navbar [paste component]

# Add motion to existing components
/forge animate this card with spring entrance

# Skeleton loading states
/forge skeleton for the dashboard stats grid
/forge skeleton blog card

# Full pages
/forge dashboard agent interface with chat
/forge page saas landing
```

The single `/forge` command routes intent automatically based on what you ask for. No syntax to memorize.

---

## What you get

### AMOLED-first design tokens

```css
--df-bg-base:      #000000;   /* true OLED black */
--df-neon-violet:  #a78bfa;   /* primary accent */
--df-neon-cyan:    #22d3ee;   /* secondary accent */
--df-neon-pink:    #f472b6;   /* highlights */
--df-glass-bg:     rgba(255, 255, 255, 0.04);
--df-glow-violet:  0 0 20px rgba(167, 139, 250, 0.35);
```

A complete dark token system covering backgrounds, neons, glass, glows, borders, radii, spacing, transitions, and skeleton states. Every generated component uses these CSS variables — never hardcoded hex.

### Library coverage

**Animation** — Framer Motion · GSAP + ScrollTrigger · React Spring · Anime.js · Lottie · Motion (motion.dev) · Mo.js · Moving Letters · Animata snippets

**Components** — Aceternity UI · Magic UI · Skiper UI · ReactBits · shadcn/ui · DaisyUI · Flowbite · Ant Design · Mantine · HeroUI · Once UI · Nyxhora UI · Inspira UI (Vue) · Float UI (multi-framework)

**Scroll engines** — Lenis (smooth) · Locomotive Scroll (smooth + parallax) · ScrollReveal · AOS

**3D / Visual** — Three.js · React Three Fiber + Drei · Vanta.js · Spline

**Loaders** — LDRS Web Components (40+ styles) · Skeleton system

**Styling** — Tailwind v4 · Modern CSS (View Transitions, scroll-driven animations, container queries) · AMOLED dark default · runtime-flippable light theme via `[data-theme="light"]` (single `--df-*` namespace, no separate light tokens)

**Inspiration anchors** — Linear · Stripe · Vercel · Raycast · Framer · Arc · Resend · Anthropic — say "make it look like X" and the right technique loads.

Darkforge reads your `package.json` and only uses what you actually have. If you have nothing, it falls back to pure Tailwind + CSS.

### Skeleton loading system

Every component can be turned into a matching skeleton in seconds:

```bash
/forge skeleton for this blog card
```

You get pulse + shimmer variants, exact-shape match to the real component, and dark skeleton tokens nobody else ships.

---

## Why Darkforge

Every existing UI plugin does **one** thing — a single library, a single style, generic light defaults. Darkforge is the first plugin that:

- Covers **25 libraries in one install** — Framer Motion, GSAP, Three.js + R3F, Aceternity, Magic UI, Skiper UI, ReactBits, shadcn/ui, DaisyUI, Flowbite, Ant Design, Tailwind v4, React Spring, Anime.js, Lottie, Vanta, Spline, Once UI, Mantine, HeroUI, Lenis, Locomotive Scroll, AOS, Motion (motion.dev), Mo.js, LDRS
- Is **stack-aware** — reads your `package.json` so it never imports something you don't have
- Is **opinionated** — AMOLED dark by default, light theme opt-in via `/darkforge:forge --light`
- Is the **first to cover** Aceternity, Magic UI, Skiper UI, and ReactBits in one place
- Ships a **named-site inspiration tour** — say "make it look like Linear" or "make it look like Stripe" and Darkforge routes to the right technique
- Includes a **skeleton system** no other plugin has
- Maps your codebase on first call so generated UI **matches your conventions** — your aliases, your existing tokens, your component naming
- Ships **3 working examples** (~5,000 lines of real production code), a CI gate (`scripts/validate.mjs`), a `DESIGN.md` for cross-tool reach (Stitch, Cursor), and a portable `--df-*` token system you can ship to non-Claude tools

---

## Architecture

```
darkforge/
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── skills/
│   └── ui/
│       ├── SKILL.md              ← the brain
│       └── references/
│           ├── 00-dark-tokens.md
│           ├── 01-framer-motion.md
│           ├── 02-gsap.md
│           ├── 03-threejs-r3f.md
│           ├── 04-aceternity.md
│           ├── 05-magicui.md
│           ├── 06-skiper-ui.md
│           ├── 07-reactbits.md
│           ├── 08-shadcn-dark.md
│           ├── 09-daisyui-dark.md
│           ├── 10-flowbite-dark.md
│           ├── 11-antdesign-dark.md
│           ├── 12-tailwind-v4.md
│           ├── 13-react-spring.md
│           ├── 14-animejs.md
│           ├── 15-lottie.md
│           ├── 16-vanta-spline.md
│           ├── 17-skeleton-system.md
│           ├── 18-light-theme.md
│           ├── 19-once-ui.md
│           ├── 20-mantine.md
│           ├── 21-heroui.md
│           ├── 22-nyxhora-ui.md
│           ├── 23-animata.md
│           ├── 24-inspira-ui.md
│           ├── 25-float-ui.md
│           ├── 26-lenis-smooth-scroll.md
│           ├── 27-locomotive-scroll.md
│           ├── 28-scrollreveal.md
│           ├── 29-aos-scroll.md
│           ├── 30-motion-universal.md
│           ├── 31-mojs-bursts.md
│           ├── 32-moving-letters.md
│           ├── 33-ldrs-loaders.md
│           ├── inspiration-tour.md
│           └── patterns/
│               ├── hero.md
│               ├── navbar.md
│               ├── pricing.md
│               ├── dashboard.md
│               ├── features.md
│               ├── testimonials.md
│               ├── footer.md
│               ├── cta.md
│               ├── 3d-scene.md
│               └── scroll-story.md
├── examples/
│   ├── landing-saas/        ← Nexus Email Analytics SaaS landing (2069 lines)
│   ├── dashboard-agent/     ← Logged-in product UI with AI agent (1242 lines)
│   └── product-showcase/    ← Nexus Aura earbuds R3F showcase (1482 lines)
├── docs/
│   ├── build-spec.md
│   └── inspiration-research.md
├── README.md
└── LICENSE
```

The skill loads `SKILL.md` first (lean brain — stack detection, token reference, intent routing). Reference and pattern files are loaded on demand based on what you ask for, keeping every interaction fast and token-efficient.

---

## Roadmap

**v1.0** — Single `/forge` command, map-first behavior, 17 reference files covering every major library, 10 pattern files, AMOLED dark token system, skeleton system, three working examples (`examples/landing-saas`, `examples/dashboard-agent`, `examples/product-showcase`).

**v1.1 (now)** — 15 new reference files (Once UI, Mantine, HeroUI, Nyxhora UI, Animata, Inspira UI (Vue), Float UI, Lenis, Locomotive Scroll, ScrollReveal, AOS, Motion, Mo.js, Moving Letters, LDRS). 17 → 25 libraries. First Vue ecosystem support. Smooth-scroll coverage previously zero, now four references.

**v1.2** — Demo GIFs in this README, runnable example harness, prompt gallery, live-doc verification sweep for the highest-risk references.

**v2.0** — Explicit `/darkforge:forge rescan` workflow, Figma token sync, Storybook dark theme generator, Darkforge Studio (web preview of all components).

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the expanded feature backlog.

---

## Author

Built by **[Karan](https://github.com/Karannnnn614)**.

If Darkforge saved you hours, drop a star on the repo. Issues and PRs welcome.

## License

MIT — do whatever you want with it.
