# Darkforge Roadmap

Darkforge should stay focused: it is the design intelligence layer for Claude Code UI generation. Add features that make generated interfaces more trustworthy, easier to preview, and easier to adapt to real projects.

## Shipped in v1.1.1 — Runtime Theme-Switching Fix

- **Same-name override architecture** replaces the deprecated `--df-light-*` namespace. Components flip dark↔light at runtime via `[data-theme="light"]` on `<html>` — no regenerate, no crash, no FOUC.
- **SSR-safe ThemeProvider** pattern documented in `references/18-light-theme.md` (head-script + `suppressHydrationWarning` + `useDfTheme()` hook + theme-toggle button).
- **`SKILL.md` Output Rule #2** updated to forbid `--df-light-*` in generated code.
- **CHANGELOG v1.1.1 entry** with deprecation timeline (`--df-light-*` removed in v2.0).

## Shipped in v1.1 — Library Expansion

- **15 new reference files** — Once UI, Mantine, HeroUI, Nyxhora UI, Animata, Inspira UI (Vue), Float UI, Lenis, Locomotive Scroll, ScrollReveal, AOS, Motion (motion.dev), Mo.js, Moving Letters, LDRS.
- **17 → 25 libraries covered.**
- **First Vue ecosystem support** via Inspira UI; multi-framework section recipes via Float UI (React, Vue, Svelte, HTML).
- **Smooth-scroll coverage** previously zero, now four references (Lenis canonical + GSAP ScrollTrigger combo).
- **CHANGELOG.md** v1.1.0 entry, **README** METRICS markers updated (REF_COUNT 35, LIB_COUNT 25), **DESIGN.md** + **docs/LAUNCH.md** count strings updated.

## v1.2 - Trust and Launch Polish

- **Before/after demo assets**: Add one GIF and two screenshots to the README showing default AI UI versus Darkforge output.
- **Example app harness**: Add a minimal Next.js demo app that can mount `examples/landing-saas`, `examples/dashboard-agent`, and `examples/product-showcase` for screenshot testing.
- **Reference verification sweep**: Replace top-priority `// VERIFY:` markers for Framer Motion, GSAP, R3F/Drei, shadcn/ui, Magic UI, Aceternity, plus the v1.1 newcomers (Lenis, Mantine, HeroUI, AOS, Mo.js, LDRS) with docs links.
- **Prompt gallery**: Add `docs/prompts.md` with 30+ copy-paste prompts mapped to the references they load — extended to cover the 15 new libraries.
- **README receipts**: Add concrete validation output, line counts, and a small "what changed in the generated UI" section.

## v1.3 - Project Adaptation

- **UI audit mode**: Support prompts like `/darkforge:forge audit this page` to inspect an existing component and return token, accessibility, responsiveness, and motion fixes.
- **Theme adapter recipes**: Add focused references for converting existing shadcn, DaisyUI, Flowbite, and Ant Design themes into DF tokens.
- **Token export snippets**: Ship ready-to-paste token blocks for `globals.css`, Tailwind v4 `@theme`, shadcn `components.json`, and plain CSS modules.
- **Install-aware fallbacks**: Add clearer guidance for when a requested library is missing, including pure-CSS alternatives and exact install commands.
- **Component migration patterns**: Add references for upgrading generic cards, tables, navbars, forms, and empty states into Darkforge-styled versions.

## v1.4 - Verification and Preview

- **Visual regression scripts**: Add Playwright screenshot checks for the example app at 375px, 768px, and 1440px.
- **Accessibility checks**: Add an axe or Lighthouse workflow for examples and document expected exceptions for decorative 3D canvases.
- **Token linting**: Extend `scripts/validate.mjs` to scan reference snippets for raw hex and common Tailwind color classes such as `bg-blue-500`.
- **Bundle notes**: Add performance guidance for R3F, GSAP, Lottie, Vanta, and Spline so generated pages do not ship unnecessary weight.
- **SSR safety notes**: Add explicit Next.js App Router recipes for dynamic imports, client boundaries, and hydration-safe animated components.

## v2.0 - Darkforge Studio

- **Preview gallery**: A small web gallery for every pattern recipe with prompt, generated code, screenshot, and dependency list.
- **Prompt-to-pattern explorer**: Search prompts like "agent dashboard" or "3D hero" and see which reference files Darkforge will load.
- **Token playground**: Live-edit DF accent hues, glow strength, radii, and glass opacity, then export CSS variables.
- **Verified component packs**: Curated, tested outputs for common product surfaces: SaaS landing, admin dashboard, AI chat, product page, pricing page, docs site, and onboarding flow.
- **Community pattern intake**: A contribution template that requires screenshot, prompt, dependencies, accessibility notes, and validator output.

## Keep Out of Scope

- Backend scaffolding, auth, payments, analytics SDK setup, and database logic.
- Full clone requests for private or copyrighted product UIs.
- New dependencies that only make demos prettier but do not improve generated code quality.
