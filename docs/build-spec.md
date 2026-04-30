# Darkforge — Claude Code Plugin
## Complete Technical Documentation & Build Prompt
### Version 1.0 | Author: Karan | Status: Launch-ready draft

---

## 1. What Is Darkforge?

Darkforge is a Claude Code plugin (SKILL.md-based) that teaches Claude the complete arsenal of modern UI libraries and dark design systems — so instead of generating generic purple-gradient-on-white UIs, Claude generates **AMOLED dark, neon-glow, glassmorphism, animated, production-ready UI** using whatever libraries exist in the user's project.

**One-line pitch:** "The shadcn for dark UI generation — give Claude Code the full design arsenal, get jaw-dropping UIs every time."

**Install command:**
```
/plugin marketplace add Karannnnn614/Darkforge
/plugin install darkforge@darkforge
```

---

## 2. The Gap This Fills

### What already exists (competition):
| Plugin | What it does | What it misses |
|--------|-------------|----------------|
| UI/UX Pro Max | 67 styles, 161 palettes | No library-specific code. Just style rules. |
| claudedesignskills | 23 separate animation skills | No unified dark system. Not opinionated. |
| Anthropic frontend-design | Generic aesthetic variety | Not AMOLED. Not library-aware. |
| greensock/gsap-skills | Official GSAP only | Only one library. No dark tokens. |
| glassmorphism-advanced | Glass effects only | Single technique, no animation. |

### What Darkforge does differently:
1. **Stack detection** — reads `package.json` first, generates code for libraries the user ACTUALLY has installed
2. **Opinionated dark system** — AMOLED tokens are the default, not an option
3. **Cross-library combos** — GSAP + Framer Motion + Three.js together in one output
4. **First-mover libraries** — Aceternity, MagicUI, Skiper UI, ReactBits have ZERO existing skills
5. **Skeleton generation** — the single `/forge` command routes skeleton requests to the skeleton system
6. **Multi-framework** — React, Next.js, Vue, Svelte all supported with the same commands

---

## 3. Libraries Darkforge Covers

### Tier 1 — Animation & Motion
| Library | Key Features | Why Include |
|---------|-------------|-------------|
| Framer Motion / Motion | Spring physics, scroll sequences, shared layouts, gestures | Industry standard for React animation |
| GSAP + ScrollTrigger | Timelines, pin sections, SplitText, scrub animations | Most powerful animation library |
| React Spring | Physics-based micro-interactions, drag, parallax | Best for gesture-driven UI |
| Anime.js | Lightweight timeline, SVG morphing, stagger | Zero-dependency alternative |

### Tier 2 — Component Libraries (Dark-focused)
| Library | Key Features | Why Include |
|---------|-------------|-------------|
| Aceternity UI | TracingBeam, GlowingCard, WavyBackground, Spotlight, BackgroundBeams | Hottest library — ZERO skills exist |
| Magic UI | AnimatedBorder, MeteorShower, GridPattern, ShimmerButton, BlurFade | Viral on Twitter — ZERO skills exist |
| Skiper UI | 73+ shadcn-based scroll + animation components | Premium, ZERO skills exist |
| ReactBits | Animated text, rotating elements, scroll effects | New and trending — ZERO skills exist |
| shadcn/ui (dark) | Radix primitives, custom dark themes, animated variants | Most popular, but dark extension missing |

### Tier 3 — Full UI Frameworks (Dark Themes)
| Library | Key Features | Why Include |
|---------|-------------|-------------|
| DaisyUI | 30+ themes including dark, component classes | Huge Tailwind community |
| Flowbite | 600+ components, dark mode first | Enterprise-friendly |
| Ant Design (dark) | Complete design system, dark algorithm | Most popular in Asian market |
| Materialize CSS | Material design components | Legacy but huge user base |

### Tier 4 — 3D & Visual
| Library | Key Features | Why Include |
|---------|-------------|-------------|
| Three.js | 3D scenes, particles, shader effects | WebGL standard |
| React Three Fiber | Three.js in React declaratively | R3F ecosystem is massive |
| Vanta.js | Animated WebGL backgrounds | Easiest 3D backgrounds |
| Spline | Interactive 3D, embeds | Fastest 3D for landing pages |

### Tier 5 — Styling Foundations
| Library | Key Features | Why Include |
|---------|-------------|-------------|
| Tailwind v4 | Latest utilities, container queries, CSS layers | Foundation of modern React UI |
| CSS Modern | View transitions, scroll-driven animations, @starting-style | Native browser power |
| Lottie | JSON-based animations from After Effects | Designer handoff standard |

---

## 4. AMOLED Dark Token System

These tokens are the backbone of every component Darkforge generates:

```css
/* === DARKFORGE DARK TOKENS === */

/* Backgrounds — true AMOLED black scale */
--df-bg-base:      #000000;   /* pure OLED black */
--df-bg-surface:   #080808;   /* cards, panels */
--df-bg-elevated:  #111111;   /* dropdowns, tooltips */
--df-bg-overlay:   #1a1a1a;   /* modals, drawers */
--df-bg-muted:     #222222;   /* disabled, placeholder */

/* Neon accent palette */
--df-neon-violet:  #a78bfa;   /* primary accent */
--df-neon-cyan:    #22d3ee;   /* secondary accent */
--df-neon-pink:    #f472b6;   /* highlight / CTA */
--df-neon-green:   #4ade80;   /* success states */
--df-neon-amber:   #fbbf24;   /* warning states */

/* Glow shadows (use on neon-colored elements) */
--df-glow-violet:  0 0 20px rgba(167, 139, 250, 0.4);
--df-glow-cyan:    0 0 20px rgba(34, 211, 238, 0.4);
--df-glow-pink:    0 0 20px rgba(244, 114, 182, 0.4);

/* Glassmorphism */
--df-glass-bg:     rgba(255, 255, 255, 0.04);
--df-glass-border: rgba(255, 255, 255, 0.08);
--df-glass-blur:   backdrop-filter: blur(12px) saturate(180%);

/* Text */
--df-text-primary:   #ffffff;
--df-text-secondary: #a1a1aa;
--df-text-muted:     #52525b;
--df-text-inverse:   #000000;

/* Borders */
--df-border-subtle:  rgba(255, 255, 255, 0.06);
--df-border-default: rgba(255, 255, 255, 0.10);
--df-border-strong:  rgba(255, 255, 255, 0.18);

/* Radius */
--df-radius-sm:  6px;
--df-radius-md:  10px;
--df-radius-lg:  16px;
--df-radius-xl:  24px;
--df-radius-full: 9999px;
```

---

## 5. Plugin File Structure

```
darkforge/
│
├── SKILL.md                          ← Claude's brain. Loaded first every session.
├── plugin.json                       ← Marketplace metadata + slash commands
├── README.md                         ← User-facing docs
│
├── references/                       ← Loaded on-demand via routing table
│   ├── 00-dark-tokens.md            ← Full AMOLED system + mixins + utilities
│   ├── 01-framer-motion.md          ← Spring recipes, scroll, shared layouts
│   ├── 02-gsap.md                   ← ScrollTrigger, SplitText, timelines
│   ├── 03-threejs-r3f.md            ← Particles, shaders, 3D hero scenes
│   ├── 04-aceternity.md             ← All Aceternity components dark-customized
│   ├── 05-magicui.md                ← All MagicUI components + dark tokens
│   ├── 06-skiper-ui.md              ← Skiper scroll + animation components
│   ├── 07-reactbits.md              ← ReactBits animated text + effects
│   ├── 08-shadcn-dark.md            ← Extended dark shadcn theming + animation
│   ├── 09-daisyui-dark.md           ← DaisyUI dark theme + custom extensions
│   ├── 10-flowbite-dark.md          ← Flowbite dark mode patterns
│   ├── 11-antdesign-dark.md         ← Ant Design dark algorithm + customization
│   ├── 12-tailwind-v4.md            ← Latest Tailwind utilities + dark patterns
│   ├── 13-react-spring.md           ← Physics animations + gesture interactions
│   ├── 14-animejs.md                ← Lightweight timelines + SVG morphing
│   ├── 15-lottie.md                 ← JSON animations + React integration
│   ├── 16-vanta-spline.md           ← WebGL backgrounds + 3D embeds
│   ├── 17-skeleton-system.md        ← Skeleton loading patterns for every component
│   │
│   └── patterns/                    ← Full page section recipes
│       ├── hero.md                  ← 6 hero variants (3D, particle, glass, split, video, minimal)
│       ├── navbar.md                ← Sticky, blur, animated, mobile drawer
│       ├── pricing.md               ← Cards, toggle, animated comparison
│       ├── dashboard.md             ← Agent UI, stats, sidebar, data tables
│       ├── features.md              ← Bento grid, icon cards, timeline
│       ├── testimonials.md          ← Carousel, masonry, avatars
│       ├── footer.md                ← Multi-column, minimal, animated
│       ├── cta.md                   ← Full-width, card, floating
│       ├── 3d-scene.md              ← Product showcase, floating objects
│       └── scroll-story.md          ← Pin sections, scrub, parallax
│
└── examples/                        ← Real working code Claude references
    ├── landing-saas/                ← Complete SaaS landing page
    ├── dashboard-agent/             ← Full agent dashboard
    └── product-showcase/            ← 3D product page
```

---

## 6. Slash Command Surface

Darkforge ships one canonical namespaced skill command plus an optional short alias:

| Command | What It Does | Example |
|---------|-------------|---------|
| `/darkforge:forge [description]` | Generate any UI component, section, skeleton, dashboard, 3D scene, or full page | `/darkforge:forge glassmorphism pricing card with hover glow` |
| `/forge [description]` | Short alias when no other installed plugin owns `/forge` | `/forge hero 3D floating product with particles` |

Intent routing inside `skills/forge/SKILL.md` replaces the older colon-style subcommand plan. Users describe the target in plain English, and the routing table loads the right reference files.

---

## 7. SKILL.md Architecture

The SKILL.md follows the **Progressive Disclosure Pattern** from claude-skills:

```
SKILL.md (lean — ~100 lines)
├── Role definition
├── Stack detection instructions (read package.json first)
├── AMOLED token quick reference
├── Routing table → which reference to load per request
└── Output rules (always dark, always use tokens, always working code)
```

### Stack Detection Logic (in SKILL.md):
```
Before generating any UI:
1. Read package.json dependencies
2. Identify installed libraries from the library map
3. ONLY use libraries that are installed
4. If no UI library detected → use pure Tailwind + CSS
5. If multiple animation libs → prefer: Framer Motion > GSAP > CSS
```

### Routing Table (in SKILL.md):
```
User asks about...          → Load reference file
─────────────────────────────────────────────────
animation / motion          → 01-framer-motion.md
scroll animation / pin      → 02-gsap.md
3D / particles / WebGL      → 03-threejs-r3f.md
aceternity / tracing beam   → 04-aceternity.md
magic ui / meteor / shimmer → 05-magicui.md
skiper / scroll component   → 06-skiper-ui.md
reactbits / animated text   → 07-reactbits.md
shadcn / radix              → 08-shadcn-dark.md
daisy / daisyui             → 09-daisyui-dark.md
flowbite                    → 10-flowbite-dark.md
ant design / antd           → 11-antdesign-dark.md
tailwind / utility          → 12-tailwind-v4.md
spring / gesture / drag     → 13-react-spring.md
anime / lightweight anim    → 14-animejs.md
lottie / json animation     → 15-lottie.md
vanta / spline / background → 16-vanta-spline.md
skeleton / loading state    → 17-skeleton-system.md
hero section                → patterns/hero.md
navbar / header             → patterns/navbar.md
pricing                     → patterns/pricing.md
dashboard                   → patterns/dashboard.md
```

---

## 8. Skeleton System

The single `/darkforge:forge` command routes skeleton requests to `references/17-skeleton-system.md` and generates loading states for any component.

### What it generates:
- Pulse animation variant (CSS `@keyframes pulse`)
- Shimmer wave variant (gradient sweep)
- Exact shape match to the real component
- AMOLED dark skeleton tokens

### Dark skeleton tokens:
```css
--df-skeleton-base:    #111111;
--df-skeleton-shine:   #1f1f1f;
--df-skeleton-glow:    rgba(167, 139, 250, 0.05);
```

### Example output for `/darkforge:forge skeleton for a blog card`:
```tsx
// BlogCardSkeleton.tsx
export function BlogCardSkeleton() {
  return (
    <div className="rounded-xl bg-[#111] border border-white/5 p-5 space-y-3 animate-pulse">
      <div className="h-40 rounded-lg bg-[#1a1a1a]" />
      <div className="h-3 w-3/4 rounded bg-[#1a1a1a]" />
      <div className="h-3 w-1/2 rounded bg-[#1a1a1a]" />
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-16 rounded-full bg-[#1a1a1a]" />
        <div className="h-6 w-20 rounded-full bg-[#1a1a1a]" />
      </div>
    </div>
  )
}
```

---

## 9. Output Rules (Claude Always Follows)

Every time Darkforge generates UI, Claude must:

1. **Always AMOLED dark** — background starts at `#000000` or `#080808`, never white
2. **Always use DF tokens** — CSS variables not hardcoded hex values
3. **Always working code** — no pseudocode, no `// add your logic here`, fully functional
4. **Always stack-aware** — only use installed libraries from package.json
5. **Always include imports** — every generated file includes all necessary imports
6. **Always TypeScript** — unless user's project uses plain JS
7. **Always accessible** — `aria-*` attributes, keyboard navigation, `prefers-reduced-motion`
8. **Always comment animation values** — explain spring configs, timing choices
9. **Never generic** — no Inter font, no purple-on-white, no Bootstrap aesthetics
10. **Never placeholder content** — real copy, real data shapes, real components

---

## 10. LinkedIn Launch Strategy

### Post 1 — The demo video (Week 1)
Record 60-second screen recording:
- Start in Claude Code terminal
- Type `/forge hero section for a SaaS product`
- Watch Claude generate a full 3D hero with Framer Motion + Three.js + AMOLED dark tokens
- Show the live browser result
- Caption: "I got tired of Claude generating boring UI. So I built a plugin that gives it the full design arsenal."

### Post 2 — The skeleton reveal (Week 2)
Show `/darkforge:forge skeleton for this dashboard` turning a real dashboard into a matching loading state in 10 seconds.

### Post 3 — The stack detection magic (Week 3)
Show two different projects — one with Framer Motion, one with GSAP — same `/darkforge:forge animate this card` request generating different but correct code for each stack.

### GitHub README must include:
- Live demo GIF at the top
- Before/after screenshots (generic Claude output vs Darkforge output)
- One-command install
- Library support badges
- Star count goal callout

---

## 11. Build Order (Day by Day Plan)

### Day 1 — Foundation
- [ ] `SKILL.md` — full brain with stack detection + routing table
- [ ] `plugin.json` — marketplace config
- [ ] `references/00-dark-tokens.md` — complete token system

### Day 2 — Core Animation Libraries
- [ ] `references/01-framer-motion.md`
- [ ] `references/02-gsap.md`
- [ ] `references/13-react-spring.md`

### Day 3 — First-Mover Libraries (The Differentiation)
- [ ] `references/04-aceternity.md`
- [ ] `references/05-magicui.md`
- [ ] `references/06-skiper-ui.md`
- [ ] `references/07-reactbits.md`

### Day 4 — Component Frameworks
- [ ] `references/08-shadcn-dark.md`
- [ ] `references/09-daisyui-dark.md`
- [ ] `references/10-flowbite-dark.md`
- [ ] `references/11-antdesign-dark.md`

### Day 5 — 3D & Visual
- [ ] `references/03-threejs-r3f.md`
- [ ] `references/16-vanta-spline.md`

### Day 6 — Skeleton System + Patterns
- [ ] `references/17-skeleton-system.md`
- [ ] `references/patterns/hero.md`
- [ ] `references/patterns/dashboard.md`
- [ ] `references/patterns/pricing.md`

### Day 7 — Polish + Launch
- [ ] Remaining pattern files
- [ ] `examples/` directory with real demos
- [ ] README with GIFs
- [ ] GitHub repo setup
- [ ] LinkedIn post draft

---

## 12. Master Build Prompt

Use this prompt in Claude Code to generate the entire plugin:

---

```
You are a senior frontend engineer and design systems architect with 10+ years 
of experience building production UIs. You are building Darkforge — a Claude Code 
plugin (SKILL.md-based) that teaches Claude to generate AMOLED dark, 
neon-glow, glassmorphism, animated, production-ready UI.

## Your role
Act as the lead architect. Write real, production-quality code in every file.
No pseudocode. No placeholders. Every code snippet must be copy-paste ready.

## Plugin identity
- Name: Darkforge
- Command trigger: /forge
- Theme: AMOLED dark first, neon accents, glassmorphism, cutting-edge animations
- Stack support: React, Next.js, Vue, Svelte, Tailwind v4, TypeScript
- Library coverage: Framer Motion, GSAP, Three.js/R3F, Aceternity UI, 
  Magic UI, Skiper UI, ReactBits, shadcn/ui, DaisyUI, Flowbite, 
  Ant Design dark, Materialize, React Spring, Anime.js, Lottie, Vanta.js

## AMOLED Dark Token System (use these in ALL generated code)
--df-bg-base: #000000
--df-bg-surface: #080808  
--df-bg-elevated: #111111
--df-bg-overlay: #1a1a1a
--df-neon-violet: #a78bfa
--df-neon-cyan: #22d3ee
--df-neon-pink: #f472b6
--df-neon-green: #4ade80
--df-glow-violet: 0 0 20px rgba(167,139,250,0.4)
--df-glass-bg: rgba(255,255,255,0.04)
--df-glass-border: rgba(255,255,255,0.08)
--df-skeleton-base: #111111
--df-skeleton-shine: #1f1f1f

## Build these files in exact order:

### FILE 1: SKILL.md
Write Claude's complete brain. Must include:
- YAML frontmatter with name, description, triggers
- Role: "You are Darkforge, an expert dark UI generation system"
- Stack detection: "Before any output, read package.json. 
  Map dependencies to library capabilities. Never use unlisted libraries."
- Library detection map (package name → capability)
- Full AMOLED token quick reference table
- Routing table: user intent → which reference/md to load
- Slash command surface: `/darkforge:forge` as canonical, `/forge` as optional alias, with intent routing replacing older subcommands
- Output rules (10 rules Claude must always follow)
- Quality bar: "Output must look like it was built by a senior 
  frontend engineer at a top-tier startup"

### FILE 2: plugin.json
Complete marketplace metadata. Include:
- name, version, description, author
- All slash command definitions with argument hints
- Trigger keywords for auto-activation
- Minimum Claude Code version

### FILE 3: references/00-dark-tokens.md
The complete Darkforge design token system. Include:
- All CSS custom properties with hex values and usage notes
- Tailwind v4 config extending these tokens
- Glass effect CSS utility classes (glass-card, glass-input, glass-nav)
- Neon glow utility classes for each accent color
- AMOLED skeleton animation (pulse + shimmer variants)
- Dark gradient utilities (radial, conic, mesh)
- Typography scale for dark UIs (which fonts work on black)
- Border and shadow system
- 10 complete working component examples using only these tokens

### FILE 4: references/01-framer-motion.md
Complete Framer Motion dark UI reference. Include:
- Spring config presets for dark UI (snappy, smooth, bouncy, slow)
- Entrance animations: fadeUp, fadeIn, slideIn, scaleIn, blurIn
- Scroll-driven animations: useScroll, useTransform, useSpring
- Stagger patterns for lists and grids
- Shared element transitions between routes
- Gesture animations: drag, hover tilt, magnetic button
- AnimatePresence patterns for modals and toasts
- Layout animations for expanding cards
- 8 complete dark component examples with full code

### FILE 5: references/04-aceternity.md
Complete Aceternity UI dark reference. Include:
- TracingBeam: dark customization, violet neon variant
- BackgroundBeams: AMOLED black with neon rays
- SpotlightCard: dark bg, colored spotlight
- WavyBackground: dark wave with neon color stops
- GlowingCard: glass card with edge glow effect
- MovingBorder: animated gradient border on dark card
- TextGenerateEffect: typewriter with neon cursor
- HeroParallax: dark product showcase with scroll
- FloatingNav: dark blur navbar with neon active state
- InfiniteMovingCards: dark testimonial marquee
For each: installation, full dark-themed component code, customization options

### FILE 6: references/05-magicui.md  
Complete Magic UI dark reference. Include:
- AnimatedBorderCard: neon gradient rotating border
- MeteorShower: dark sky with neon meteor streaks  
- GridPattern: subtle dark grid with glow intersection
- ShimmerButton: dark button with shimmer sweep effect
- BlurFade: entrance animation with blur
- NumberTicker: animated number counter for stats
- Marquee: infinite scroll logos on dark bg
- DotPattern: dark background dot grid
- Ripple: touch ripple on dark surfaces
For each: full dark component code with DF tokens

### FILE 7: references/17-skeleton-system.md
The skeleton loading system. Include:
- Core skeleton primitives (SkeletonText, SkeletonImage, SkeletonCircle, SkeletonButton)
- Dark skeleton tokens (--df-skeleton-base, --df-skeleton-shine)
- Pulse animation variant
- Shimmer wave variant (left-to-right gradient sweep)  
- Skeleton compositions for: BlogCard, DashboardStat, ProductCard, 
  NavBar, Table, Profile, Chat message, Form, Gallery grid
- React component with TypeScript
- Tailwind utility classes for skeleton
- Framer Motion skeleton with stagger reveal when loaded

### FILE 8: references/patterns/hero.md
6 complete dark hero section patterns:
1. 3D Floating Product (Three.js/R3F + GSAP scroll)
2. Particle Field (Three.js particles + text)
3. Glassmorphism Split (glass card left, visual right)
4. Neon Gradient (mesh gradient bg + Framer entrance)
5. Video Background (dark overlay + animated text)
6. Minimal AMOLED (pure black, typography-led, subtle animation)
Each hero: full working code, mobile responsive, includes CTA, badge, headline

### FILE 9: references/patterns/dashboard.md
Complete dark agent/SaaS dashboard patterns:
1. Three-pane shell (sidebar + main + detail)
2. Stats grid with animated number counters
3. Dark data table with hover states
4. Agent chat interface with streaming indicator
5. Activity feed with timeline
6. Command palette (⌘K) dark variant
Full working code for each, using DF tokens throughout

## Code standards for every file:
- TypeScript with proper types — no `any`
- Named exports for components
- Props interfaces defined
- All imports written out explicitly  
- CSS variables used everywhere — never hardcoded hex
- Comments explain WHY not WHAT
- Mobile-first responsive
- Accessibility: aria-labels, keyboard nav, prefers-reduced-motion respected

## Writing standards for SKILL.md and reference files:
- Direct, imperative voice ("Use X", "Always Y", "Never Z")  
- Tables for reference data — never prose lists for structured info
- Code blocks for every example — no inline code snippets
- Routing table must be exhaustive — cover all possible user requests
- Each reference file: 400-600 lines minimum

Start with FILE 1: SKILL.md. Write it completely before moving on.
After each file, confirm it's done and await instruction to proceed.
```

---

## 13. Future Roadmap (After v1.0)

### v1.1 — Community Libraries
- Chakra UI dark extension
- Mantine dark patterns  
- Radix UI dark theming
- PrimeReact dark

### v1.2 — Advanced Patterns
- Micro-interaction library (hover sounds, haptics via vibration API)
- CSS Houdini paint worklets
- View Transitions API patterns
- Web Animations API

### v1.3 — Tools Integration
- Figma token sync (import Figma dark tokens → DF tokens)
- Storybook dark theme stories generator
- Chromatic visual regression for dark mode

### v2.0 — Darkforge Studio
- Web UI to preview all components live
- One-click copy with stack detection
- Community component submissions
- Figma plugin companion

---

## 14. Success Metrics

| Metric | Target (Month 1) | Target (Month 3) |
|--------|-----------------|-----------------|
| GitHub Stars | 200 | 1,000 |
| LinkedIn impressions | 50,000 | 200,000 |
| Plugin installs | 500 | 5,000 |
| Community contributors | 5 | 25 |
| Reference files | 17 | 30+ |

---

*Built by Karan · Inspired by Kairoz, claude-skills, graphify · MIT License*
