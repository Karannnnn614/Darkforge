# Darkforge v1.0 — Launch Assets

Drafts for the v1.0 announcement. Two LinkedIn variants (long form + short form), a reusable X / Twitter thread, and a one-line bio for plugin marketplaces.

Replace `{{GIF_URL}}` and `{{REPO_LINK}}` before posting.

---

## LinkedIn — long form (~280 words)

> Built a Claude Code plugin that turns "make me a dark UI" into 2,000 lines of senior-grade React.
>
> 👇
>
> Every dev who's tried to ask Claude for a landing page knows the trap: you describe a hero section and get back generic Tailwind purple-on-white. Bootstrap aesthetics. `bg-blue-500` defaults. The output looks like 2018.
>
> So I built **Darkforge**.
>
> One command — `/darkforge:forge` — and Claude generates AMOLED-dark, neon-glow, glassmorphism, animated, production-ready interfaces using whatever libraries are already in your `package.json`.
>
> Stack-aware. Reads your code first. Never imports something you don't have.
>
> The plugin ships with:
>
> ▸ **35 reference files** covering 25 libraries — Framer Motion, GSAP + ScrollTrigger, Three.js + R3F, Aceternity, Magic UI, Skiper UI, ReactBits, shadcn dark, DaisyUI, Flowbite, Ant Design, Tailwind v4, React Spring, Anime.js, Lottie, Vanta + Spline, Once UI, Mantine, HeroUI, Nyxhora UI, Animata, Inspira UI (Vue), Float UI (multi-framework), Lenis, Locomotive Scroll, ScrollReveal, AOS, Motion (motion.dev), Mo.js, Moving Letters, LDRS, and a custom skeleton system.
>
> ▸ **10 pattern recipes** for hero, navbar, pricing, dashboard, features, testimonials, footer, CTA, 3D scene, and scroll-story sections.
>
> ▸ **3 complete working examples** — a SaaS landing page, a logged-in product UI with an AI agent pane, and a product showcase with R3F.
>
> ▸ **A full AMOLED token system** (`--df-bg-base: #000000`, `--df-neon-violet`, `--df-glow-violet`, etc.) — every component uses CSS variables, never hardcoded hex.
>
> Install:
>
> ```
> /plugin marketplace add Karannnnn614/Darkforge
> /plugin install darkforge@darkforge
> ```
>
> Then type `/darkforge:forge hero glass split with violet glow` and ship it.
>
> {{GIF_URL}}
>
> Free, MIT, open source: {{REPO_LINK}}
>
> Star it if it saved you a weekend. ★
>
> #ClaudeCode #AI #Frontend #Design #DarkMode #DesignSystems #OpenSource

---

## LinkedIn — short form (~110 words)

> Built a Claude Code plugin that ends generic AI-generated UI.
>
> One command, every dark UI library, jaw-dropping output.
>
> **Darkforge** reads your `package.json`, picks the right libraries (Framer Motion vs GSAP, shadcn vs DaisyUI, R3F vs Vanta), and generates AMOLED-dark, animated, accessible, production-grade React.
>
> 35 reference files. 25 libraries. 10 pattern recipes. 3 complete working examples. A custom skeleton system. AMOLED tokens via CSS vars — never hardcoded hex.
>
> ```
> /plugin marketplace add Karannnnn614/Darkforge
> /plugin install darkforge@darkforge
> ```
>
> {{GIF_URL}}
>
> MIT, open source: {{REPO_LINK}}
>
> #ClaudeCode #AI #Frontend #DarkMode

---

## X / Twitter thread (5 posts)

**1/** Built a Claude Code plugin that ends generic AI-generated UI forever.
Darkforge generates AMOLED-dark, animated, production-grade React from one command — using whatever libraries are already in your package.json.
{{GIF_URL}}

**2/** The trap with AI UI gen: you ask for a landing page, you get Tailwind purple-on-white. Bootstrap aesthetics. `bg-blue-500`. Looks like 2018.
Darkforge ships 35 reference files covering 25 libraries (Framer, GSAP, R3F, Aceternity, MagicUI, shadcn, Mantine, HeroUI, Lenis, AOS, Mo.js, LDRS, +13 more) and 10 pattern recipes. Stack-aware. Senior-grade.

**3/** Every component uses an AMOLED token system via CSS variables. Never hardcoded hex.
- `--df-bg-base: #000000` (true OLED)
- `--df-neon-violet: #a78bfa`
- `--df-glow-violet: 0 0 20px rgba(167,139,250,0.35)`
- `--df-glass-bg: rgba(255,255,255,0.04)`
- 30+ tokens covering bg, neon, glass, glow, borders, radii.

**4/** Three working examples ship with the plugin:
• SaaS landing page (~2k lines)
• Logged-in product UI with AI agent pane (~1.2k)
• R3F product showcase (~1.5k)
All TypeScript, all `useReducedMotion`-guarded, all responsive at 375px and 1440px.

**5/** Install:
```
/plugin marketplace add Karannnnn614/Darkforge
/plugin install darkforge@darkforge
```
Then `/darkforge:forge hero glass split` or just describe what you want in plain English.
MIT, open source: {{REPO_LINK}}
Star it if it saves you a weekend ★

---

## One-line bio (for awesome lists, plugin marketplaces)

> Darkforge — the dark UI arsenal for Claude Code. AMOLED-first, stack-aware, production-grade React UI from one command.

---

## Hashtag list (reuse across platforms)

#ClaudeCode #ClaudePlugin #AICoding #AI #Frontend #ReactJS #NextJS #Design #DesignSystems #DarkMode #AMOLED #Glassmorphism #Tailwind #FramerMotion #ThreeJS #OpenSource #DevTools

---

## Pre-launch checklist

- [ ] Push branch to origin (`git push origin main`)
- [ ] Set GitHub repo description: "The dark UI arsenal for Claude Code. AMOLED-first, stack-aware, production-grade UI generation in one /darkforge:forge command."
- [ ] Add GitHub topics: `claude-code` `claude-plugin` `dark-ui` `design-system` `tailwind` `framer-motion` `amoled` `glassmorphism` `shadcn` `aceternity`
- [ ] Record before/after GIF (default Tailwind hero → /darkforge:forge hero) — 6–10 seconds, ~1080p
- [ ] Take 1 hero screenshot of `examples/landing-saas` rendered at 1440px
- [ ] (Optional) Deploy `examples/landing-saas` to Vercel and add the live URL to README
- [ ] Verify `/plugin install` works in a clean Claude Code session
- [ ] Run `node scripts/validate.mjs` — must exit 0
- [ ] Submit to [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code) (PR)
- [ ] (Optional) Submit to Trendshift for badge

Once the GIF + screenshot land, post the long-form LinkedIn first, wait ~4 hours, then drop the X thread. Cross-post the short LinkedIn to Hacker News "Show HN" if Karan wants the engineer audience.
