# Changelog

All notable changes to Darkforge are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] — 2026-05-01

Rebrand from NexusUI to Darkforge — structural rename plus a small set of design-quality additions to SKILL.md and the dark-tokens reference. No example apps or reference content rewritten beyond the rename.

### Changed (rebrand — structural rename, no content changes)

- **Brand**: `NexusUI` → `Darkforge` across all docs, READMEs, manifests, examples (68 files, 4817 replacements, 4817 deletions — perfectly balanced rename).
- **CSS variable prefix**: `--nx-*` → `--df-*` everywhere (every token, every component snippet, every example).
- **Slash command**: `/ui` → `/forge`. Namespaced form `/nexusui:ui` → `/darkforge:forge`.
- **Skill directory**: `skills/ui/` → `skills/forge/` (`git mv`, history preserved). SKILL.md frontmatter `name: ui` → `name: forge`.
- **Plugin manifests**: `.claude-plugin/plugin.json` and `marketplace.json` updated with new name, repo URL, command name.
- **External library refs left intact**: `shadcn/ui`, `src/components/ui/`, `daisyui` — those aren't our brand and stay literal.

### Added (design-quality, separate from the rename)

- **`skills/forge/SKILL.md` — Humanized UI Principles section** (8 principles between AMOLED Token Reference and Phase 2): breathing room, hierarchy via weight + color + scale, fluid type, motion-with-purpose, color-as-intent, dark-as-elevation-scale, micro-interactions, real content.
- **`skills/forge/SKILL.md` — Inner monologue self-check** added to Phase 3: four-question pass (goal → eye-path → motion-purpose → simplest expensive version) before generating.
- **`skills/forge/SKILL.md` — Output Rule #11**: explicit "no inter-component dependencies" — every generated component must drop into a fresh project standalone.
- **`skills/forge/SKILL.md` — Graceful Fallback Chain** section: a 6-row table mapping requested capabilities (3D, motion, smooth scroll, component lib, particle BG, loaders) to first-choice → fallback 1 → fallback 2 → last resort, plus the rule to tell the user what was substituted and how to upgrade.
- **`skills/forge/references/00-dark-tokens.md` — smooth-scroll defaults**: `html { scroll-behavior: smooth; scroll-padding-top: var(--df-nav-h, 4rem); }` plus `prefers-reduced-motion` override. New layout tokens `--df-nav-h: 64px` and `--df-section-y: 96px` added to the spacing block.

### Heads-up for v1.1.1 users

- **Reinstall required.** `/plugin install nexusui@nexusui` will fail once the GitHub repo is renamed. New install command: `/plugin marketplace add Karannnnn614/Darkforge` then `/plugin install darkforge@darkforge`.
- **Generated code referencing `--nx-*` will silently fall back to undefined CSS variables.** Migrate with `sed -i 's/--nx-/--df-/g'` on your `globals.css` and component files. Same one-line treatment as the `--nx-light-*` deprecation in v1.1.1.
- **Hook renames in `references/18-light-theme.md`**: `useNxTheme()` → `useDfTheme()` and `useNxTokens()` → `useDfTokens()`. Same one-line treatment as the token migration: `sed -i 's/useNxTheme/useDfTheme/g; s/useNxTokens/useDfTokens/g'` on your component code.
- **CHANGELOG history preserves "NexusUI"** for v1.0/v1.1/v1.1.1 entries — release notes describe what those versions actually shipped as, with original `--nx-*` tokens, `useNxTheme()` hook, `skills/ui/` paths, and `Karannnnn614/NexusUI` URLs intact. The rebrand pipeline initially swept those too, then was reverted to honest archaeology before this commit.

### Notes

- **Validator passes**: 45 routing-table refs resolved, 0 warnings.
- **No example app regeneration.** All three examples (`landing-saas`, `dashboard-agent`, `product-showcase`) use `--df-*` tokens after the rename and still render byte-identically modulo brand strings.
- **v1.1.1's runtime theme-switching architecture is intact.** `:root[data-theme="light"]` override pattern preserved.

[1.2.0]: https://github.com/Karannnnn614/Darkforge/releases/tag/v1.2.0

## [1.1.1] — 2026-04-30

Runtime theme-switching fix. Replaces the separate `--nx-light-*` token namespace with a single set of token names whose values override under `:root[data-theme="light"]`. Components written for dark now flip to light at runtime — no regenerate, no crash, no FOUC when the SSR-safe `<head>` script pattern is used.

### Fixed

- **Crash / blank-render bug when switching themes.** Reported by users testing dark → light handoff. Root cause: the v1.1.0 architecture declared light values under a separate `--nx-light-*` namespace inside `:root[data-theme="light"]`, while components referenced `var(--nx-bg-base)` (dark namespace). Toggling the attribute was a no-op, and asking the plugin to "make it light" produced files referencing `--nx-light-*` tokens that were undefined outside the attribute scope → no background, broken render. Fix: same token names in both themes, theme-scoped value overrides.

### Changed

- **`skills/ui/references/00-dark-tokens.md`** — token block now includes a `:root[data-theme="light"]` override that re-declares the same `--nx-*` names with light-theme values. Single namespace, two themes.
- **`skills/ui/references/18-light-theme.md`** — full rewrite around the override architecture. New sections: SSR-safe ThemeProvider for Next.js App Router (head-script pattern, `suppressHydrationWarning`, no FOUC), `useNxTheme()` hook with localStorage persistence, theme-toggle button, migration guide for the deprecated `--nx-light-*` namespace, common pitfalls.
- **`DESIGN.md`** — light-theme block rewritten to match. Portable `DESIGN.md` consumers (Stitch, Cursor, Windsurf) now get the same architecture.
- **`skills/ui/SKILL.md`** — Output Rule #2 updated: components must use `var(--nx-bg-base)` etc. for both themes; `--nx-light-*` is forbidden in generated code; the `--light` flag emits `<html data-theme="light">` rather than swapping token names.
- **`skills/ui/references/19-once-ui.md`**, **`skills/ui/references/21-heroui.md`** — cross-references to `18-light-theme.md` updated.
- **README.md** — light-theme call-out and intent-routing example updated to describe the runtime-flip behavior.

### Deprecated

- **`--nx-light-*` token namespace.** No longer declared in `:root[data-theme="light"]`. Existing code referencing `var(--nx-light-bg-base)` etc. will silently fall back to undefined CSS variables (transparent backgrounds, etc.). Migrate via the one-line sed in `references/18-light-theme.md`. Deprecation period: removed entirely in v2.0.

### Notes

- **Example apps untouched.** All three examples (`landing-saas`, `dashboard-agent`, `product-showcase`) used `--nx-*` tokens already, so they automatically gain runtime light-theme support without code changes.
- **No SKILL.md routing-table additions** — `light theme` already routed to `references/18-light-theme.md` in v1.0.

[1.1.1]: https://github.com/Karannnnn614/NexusUI/releases/tag/v1.1.1

## [1.1.0] — 2026-04-30

Library coverage expansion — 17 → 25 libraries via 15 new reference files. First Vue ecosystem support. Smooth-scroll coverage previously zero, now four references. Multi-framework section recipes via Float UI cover Svelte and plain HTML for the first time.

### Added

- **15 new reference files** under `skills/ui/references/`:
  - **Design systems & component libraries** — `19-once-ui.md`, `20-mantine.md`, `21-heroui.md`, `22-nyxhora-ui.md`, `23-animata.md`, `24-inspira-ui.md` (Vue), `25-float-ui.md` (multi-framework).
  - **Scroll engines** — `26-lenis-smooth-scroll.md`, `27-locomotive-scroll.md`, `28-scrollreveal.md`, `29-aos-scroll.md`.
  - **Motion, loaders, typography** — `30-motion-universal.md` (Motion / motion.dev), `31-mojs-bursts.md`, `32-moving-letters.md`, `33-ldrs-loaders.md`.
- **Vue ecosystem support** via `24-inspira-ui.md` — first Vue-targeted reference. Confirms the NX token system is framework-agnostic; CSS vars work identically in React, Vue, Svelte, and plain HTML.
- **Multi-framework section recipes** via `25-float-ui.md` — per-framework code snippets for hero, pricing, testimonial, feature grid, and CTA blocks in React, Vue, Svelte, and plain HTML.
- **Smooth-scroll coverage** — Lenis, Locomotive Scroll, ScrollReveal, AOS. Previously zero references; v1.1 ships canonical Lenis + GSAP ScrollTrigger combo recipe.
- **Routing-table extension** in `skills/ui/SKILL.md` — 15 new intent-to-reference mappings (`once ui`, `mantine`, `heroui`, `nyxhora`, `animata`, `inspira ui`, `float ui`, `lenis`, `locomotive scroll`, `scrollreveal`, `aos`, `motion library`, `mojs`, `moving letters`, `ldrs`).
- **Library Capability Map extension** — `package.json` keys for `lenis`, `locomotive-scroll`, `scrollreveal`, `aos`, `@mantine/core`, `@heroui/react`, `@once-ui-system/core`, `motion`, `@mojs/core`, `ldrs` now route to the right reference automatically.

### Changed

- **README METRICS markers** — `REF_COUNT` 20 → 35, `LIB_COUNT` 17 → 25.
- **Library coverage section** in `README.md` — reorganized into Animation, Components, Scroll engines, 3D / Visual, Loaders, Styling categories to fit 25 libraries cleanly.
- **DESIGN.md** — Claude Code install section updated to reflect 35-file reference library and 25-library coverage.
- **docs/LAUNCH.md** — long-form, short-form, and X/Twitter copy updated to reference the new counts and call out Vue + multi-framework support.

### Notes

- **Source-of-truth caveat (still in force)**: every new file ships with the same `// VERIFY:` marker convention. Subagent doc access (`context7`, `WebFetch`) was denied at generation time, so all 15 files were written from training-data recall (Jan 2026 cutoff). Cross-check upstream docs before relying on prop signatures, especially for younger libraries (Inspira UI, Nyxhora UI, Animata).
- **Vue support is partial.** Only `24-inspira-ui.md` targets Vue directly. The rest of the plugin remains React-first; Inspira UI exists to open the Vue ecosystem, not to convert NexusUI to a multi-framework brand.

[1.1.0]: https://github.com/Karannnnn614/NexusUI/releases/tag/v1.1.0

## [1.0.0] — 2026-04-30

First public release. Single `/ui` command, map-first stack detection, AMOLED-dark by default, plus a complete reference and pattern library shipped under `skills/ui/`.

### Added

- **Single `/ui` slash command** with intent-routing — namespaced canonical form `/nexusui:ui` (always works), short form `/ui` when no plugin conflicts. Auto-invokes via natural-language triggers ("dark hero", "glassmorphism card", etc.) per the Claude Code skills spec.
- **Map-first behavior** — Phase 1 of every fresh session reads `package.json`, scans `src/components/**`, parses `tailwind.config.*`, reads the project's `globals.css`, and extracts path aliases from `tsconfig.json` / `jsconfig.json` before generating anything. Stack profile is cached in context for the rest of the session.
- **19 numbered reference files** under `skills/ui/references/` — `00-dark-tokens.md`, `01-framer-motion.md`, `02-gsap.md` (with ScrollTrigger), `03-threejs-r3f.md` (Three.js + React Three Fiber + Drei), `04-aceternity.md`, `05-magicui.md`, `06-skiper-ui.md`, `07-reactbits.md`, `08-shadcn-dark.md`, `09-daisyui-dark.md`, `10-flowbite-dark.md`, `11-antdesign-dark.md`, `12-tailwind-v4.md`, `13-react-spring.md`, `14-animejs.md`, `15-lottie.md`, `16-vanta-spline.md` (Vanta.js + Spline), `17-skeleton-system.md`, and `18-light-theme.md` — plus an `inspiration-tour.md` curated real-site walkthrough.
- **10 pattern recipes** under `skills/ui/references/patterns/` — `hero.md`, `navbar.md`, `pricing.md`, `dashboard.md`, `features.md`, `testimonials.md`, `footer.md`, `cta.md`, `3d-scene.md`, and `scroll-story.md`. Each recipe is composable so multi-section pages can be assembled from a single `/ui page` call.
- **NX token system** in `00-dark-tokens.md` — `--nx-bg-base` (`#000000` true OLED), `--nx-neon-violet` / `--nx-neon-cyan` / `--nx-neon-pink`, `--nx-glass-bg`, `--nx-glow-violet`, plus borders, radii, spacing, transitions, and skeleton states. Every generated component uses `var(--nx-*)` — never hardcoded hex.
- **Opt-in light theme reference** (`18-light-theme.md`) — for projects that explicitly request light mode. Dark stays default; light is generated only when the user asks.
- **Skeleton loading system** (`17-skeleton-system.md`) — pulse + shimmer variants, exact-shape match, dark-tuned skeleton tokens. Triggered by `/ui skeleton ...`.
- **Three working examples** — `examples/landing-saas/` (Nexus Email Analytics SaaS landing, 2069 lines), `examples/dashboard-agent/` (logged-in product UI with AI agent pane, 1242 lines), and `examples/product-showcase/` (Nexus Aura earbuds R3F showcase, 1482 lines). All TypeScript, all `useReducedMotion`-guarded, responsive at 375px and 1440px.
- **Plugin manifests** — `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` configured for two-step install (`/plugin marketplace add Karannnnn614/NexusUI` then `/plugin install nexusui@nexusui`).
- **CI gate** — `scripts/validate.mjs` (`node scripts/validate.mjs`, exit 0 = ship). Validates plugin/marketplace JSON, SKILL.md frontmatter against recognized Claude Code keys, every routing-table reference resolves to a real file, and `examples/*/page.tsx` contain no hardcoded hex outside Three.js color calls and `#000` / `#fff` shorthand.
- **Documentation** — `README.md` with install + usage + architecture, `QUICKSTART.md` for first-run, `docs/inspiration-research.md` competitive analysis, `docs/build-spec.md`, and `docs/LAUNCH.md` launch checklist.

### Notes

- **Source-of-truth caveat**: most reference files were generated from training-data recall (Claude knowledge cutoff January 2026). Where prop signatures, version-specific APIs, or library internals were uncertain, files include a `// VERIFY:` marker so contributors and users can spot-check against upstream docs before relying on the snippet. Honest uncertainty is preferred over false confidence — see `CONTRIBUTING.md` for the convention.
- **Plugin install**: `/plugin marketplace add Karannnnn614/NexusUI` then `/plugin install nexusui@nexusui`. The canonical command form is `/nexusui:ui` (namespaced per Claude Code skills spec); the short form `/ui` works when no other plugin defines a `/ui` command.
- **License**: MIT.

[1.0.0]: https://github.com/Karannnnn614/NexusUI/releases/tag/v1.0.0
