# DESIGN.md — Darkforge Design System

> A portable design spec for AI coding agents (Stitch, Cursor, Claude Code, Windsurf, etc.). Read this before generating UI in any project that ships with Darkforge. Dark is default. Neon is the brand. Glass is the surface.

---

## Brand identity

Darkforge is an AMOLED-dark, neon-glow, glassmorphism design system for products that want to look like a senior frontend engineer at a top-tier startup built them. The page background is true `#000000` so the OLED pixels switch off and the neon accents — violet, cyan, pink — feel like they emit light rather than sit on a surface. Every panel is a translucent glass plate with a hairline white-alpha border and a measured backdrop blur. Motion is restrained, eased on a slow-out cubic, and always guarded behind `prefers-reduced-motion`. Nothing about this system is generic.

---

## Mood & vibe

What it IS:

- **Premium.** The first impression should read "expensive" — not "loud," not "Bootstrap demo."
- **Animated, but disciplined.** Entrances on a 0.5s slow-out, micro-interactions on 0.18s, staggers on 0.06s. Never a Lottie explosion.
- **AMOLED-friendly.** True-black backgrounds, neon-saturated foregrounds. Looks alive on phone OLEDs and pro displays alike.
- **Senior-engineer-grade.** Typed components, accessible by default, mobile-first, no hardcoded hex outside the token block.
- **Confident.** Strong typographic hierarchy, generous spacing, opinionated radii, intentional glow.

What it is NOT:

- Not a Bootstrap aesthetic. No flat blue buttons, no Helvetica headings, no rounded-2xl-on-everything.
- Not purple-on-white. Light is opt-in only, never the brand surface.
- Not generic Tailwind defaults. No `bg-blue-500`, no `text-gray-700`, no `shadow-md` on a card.
- Not skeuomorphic. No drop shadows pretending to be physical depth.
- Not "glassmorphism applied to everything" — glass is for floating surfaces, not page backgrounds.

---

## Color system

### Dark theme (default)

Every component generated against this spec MUST use these CSS variables. No raw hex outside the `:root` block. Drop the block below into your `globals.css` (or equivalent) and you have the full system.

```css
/* ============================================
   DARKFORGE DARK TOKEN SYSTEM v1.0
   Inject into :root in your global CSS
   ============================================ */

:root {
  /* --- Backgrounds (AMOLED black scale) --- */
  --df-bg-base:       #000000;  /* true OLED black — page background */
  --df-bg-surface:    #080808;  /* cards, panels, containers */
  --df-bg-elevated:   #111111;  /* dropdowns, tooltips, popovers */
  --df-bg-overlay:    #1a1a1a;  /* modals, drawers, sheets */
  --df-bg-muted:      #222222;  /* disabled, placeholder areas */
  --df-bg-hover:      #2a2a2a;  /* hover state for interactive items */

  /* --- Neon Accents --- */
  --df-neon-violet:   #a78bfa;  /* primary — CTAs, active, focus */
  --df-neon-cyan:     #22d3ee;  /* secondary — links, info, data */
  --df-neon-pink:     #f472b6;  /* highlight — badges, notifications */
  --df-neon-green:    #4ade80;  /* success — online, confirmed */
  --df-neon-amber:    #fbbf24;  /* warning — pending, caution */
  --df-neon-red:      #f87171;  /* error — destructive, danger */

  /* --- Neon Glow Shadows (apply with box-shadow) --- */
  --df-glow-violet:    0 0 20px rgba(167, 139, 250, 0.35);
  --df-glow-violet-lg: 0 0 40px rgba(167, 139, 250, 0.25);
  --df-glow-cyan:      0 0 20px rgba(34, 211, 238, 0.35);
  --df-glow-cyan-lg:   0 0 40px rgba(34, 211, 238, 0.25);
  --df-glow-pink:      0 0 20px rgba(244, 114, 182, 0.35);
  --df-glow-green:     0 0 20px rgba(74, 222, 128, 0.35);

  /* --- Glassmorphism --- */
  --df-glass-bg:        rgba(255, 255, 255, 0.04);
  --df-glass-bg-md:     rgba(255, 255, 255, 0.07);
  --df-glass-bg-lg:     rgba(255, 255, 255, 0.10);
  --df-glass-border:    rgba(255, 255, 255, 0.08);
  --df-glass-border-md: rgba(255, 255, 255, 0.12);

  /* --- Text --- */
  --df-text-primary:   #ffffff;
  --df-text-secondary: #a1a1aa;
  --df-text-muted:     #52525b;
  --df-text-inverse:   #000000;
  --df-text-accent:    #a78bfa;

  /* --- Borders --- */
  --df-border-subtle:  rgba(255, 255, 255, 0.05);
  --df-border-default: rgba(255, 255, 255, 0.09);
  --df-border-strong:  rgba(255, 255, 255, 0.16);
  --df-border-focus:   rgba(167, 139, 250, 0.5);

  /* --- Border Radius --- */
  --df-radius-xs:   4px;
  --df-radius-sm:   6px;
  --df-radius-md:   10px;
  --df-radius-lg:   16px;
  --df-radius-xl:   24px;
  --df-radius-2xl:  32px;
  --df-radius-full: 9999px;

  /* --- Spacing (8px base) --- */
  --df-space-1:  4px;
  --df-space-2:  8px;
  --df-space-3:  12px;
  --df-space-4:  16px;
  --df-space-5:  20px;
  --df-space-6:  24px;
  --df-space-8:  32px;
  --df-space-10: 40px;
  --df-space-12: 48px;
  --df-space-16: 64px;

  /* --- Typography --- */
  --df-font-sans:    'Inter', 'Geist', system-ui, sans-serif;
  --df-font-mono:    'JetBrains Mono', 'Fira Code', monospace;
  --df-font-display: 'Cal Sans', 'Inter', sans-serif;

  /* --- Transitions --- */
  --df-ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --df-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --df-ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --df-duration-fast:   150ms;
  --df-duration-base:   250ms;
  --df-duration-slow:   400ms;
  --df-duration-slower: 600ms;

  /* --- Skeleton --- */
  --df-skeleton-base:  #111111;
  --df-skeleton-shine: #1e1e1e;
  --df-skeleton-glow:  rgba(167, 139, 250, 0.04);

  /* --- Z-index Scale --- */
  --df-z-base:     0;
  --df-z-raised:   10;
  --df-z-dropdown: 100;
  --df-z-sticky:   200;
  --df-z-overlay:  300;
  --df-z-modal:    400;
  --df-z-toast:    500;
}
```

### Light theme (opt-in, runtime-flippable)

Light is opt-in only — for accessibility, regulated/healthcare/fintech contexts, and explicit stakeholder asks. Activate by setting `[data-theme="light"]` on `<html>`. Dark stays the brand. Same components, same animations, same accessibility — different palette.

**Architecture (v1.1.1+).** One namespace, two themes. The block below overrides the *same* token names declared in dark `:root` — components only ever reference `var(--df-bg-base)` and flip automatically at runtime. There is no separate `--df-light-*` namespace. (The pre-v1.1.1 `--df-light-*` tokens are deprecated; legacy components reading them will need a one-line find/replace.)

```css
/* ============================================
   DARKFORGE LIGHT THEME OVERRIDE (opt-in)
   Activate with [data-theme="light"] on <html>.
   Dark remains the default in :root.
   ============================================ */

:root[data-theme="light"] {
  /* --- Backgrounds (white scale) --- */
  --df-bg-base:       #ffffff;
  --df-bg-surface:    #fafafa;
  --df-bg-elevated:   #f4f4f5;
  --df-bg-overlay:    #e4e4e7;
  --df-bg-muted:      #d4d4d8;
  --df-bg-hover:      #ececef;

  /* --- Neon Accents: hues unchanged across themes (keep brand DNA) --- */

  /* --- Glow Shadows (alpha halved — softer on white) --- */
  --df-glow-violet:    0 0 20px rgba(167, 139, 250, 0.18);
  --df-glow-violet-lg: 0 0 40px rgba(167, 139, 250, 0.14);
  --df-glow-cyan:      0 0 20px rgba(34, 211, 238, 0.18);
  --df-glow-cyan-lg:   0 0 40px rgba(34, 211, 238, 0.14);
  --df-glow-pink:      0 0 20px rgba(244, 114, 182, 0.18);
  --df-glow-green:     0 0 20px rgba(74, 222, 128, 0.18);

  /* --- Glassmorphism (black-alpha tints on white) --- */
  --df-glass-bg:        rgba(0, 0, 0, 0.04);
  --df-glass-bg-md:     rgba(0, 0, 0, 0.06);
  --df-glass-bg-lg:     rgba(0, 0, 0, 0.08);
  --df-glass-border:    rgba(0, 0, 0, 0.08);
  --df-glass-border-md: rgba(0, 0, 0, 0.12);

  /* --- Text --- */
  --df-text-primary:   #0a0a0a;
  --df-text-secondary: #52525b;
  --df-text-muted:     #a1a1aa;
  --df-text-inverse:   #ffffff;  /* flips: white text over violet bg passes AA */
  --df-text-accent:    #7c3aed;  /* violet-600 — deeper for AA on white */

  /* --- Borders --- */
  --df-border-subtle:  rgba(0, 0, 0, 0.06);
  --df-border-default: rgba(0, 0, 0, 0.10);
  --df-border-strong:  rgba(0, 0, 0, 0.18);
  --df-border-focus:   rgba(167, 139, 250, 0.5);

  /* --- Skeleton (flipped so shimmer reads on white) --- */
  --df-skeleton-base:  #e4e4e7;
  --df-skeleton-shine: #f4f4f5;
  --df-skeleton-glow:  rgba(167, 139, 250, 0.06);

  /* Radii, spacing, typography, transitions, z-index unchanged across themes. */
}
```

### Accent palette

Six semantic neons. Use the role, not the hue.

- **Violet** `#a78bfa` — primary CTAs, focus rings, active nav items. Glow: `0 0 20px rgba(167, 139, 250, 0.35)`.
- **Cyan** `#22d3ee` — secondary actions, links, info states, data viz primary. Glow: `0 0 20px rgba(34, 211, 238, 0.35)`.
- **Pink** `#f472b6` — highlights, badges, notification dots, "new" markers. Glow: `0 0 20px rgba(244, 114, 182, 0.35)`.
- **Emerald** `#4ade80` — success, online, confirmed, positive trend. Glow: `0 0 20px rgba(74, 222, 128, 0.35)`.
- **Amber** `#fbbf24` — warning, pending, caution. Glow: `0 0 20px rgba(251, 191, 36, 0.35)`.
- **Rose** `#f87171` — error, destructive, danger, negative trend. Glow: `0 0 20px rgba(248, 113, 113, 0.35)`.

---

## Typography

- **Sans (body, UI):** `'Inter', 'Geist', system-ui, sans-serif`.
- **Mono (code, eyebrows, data):** `'JetBrains Mono', 'Fira Code', monospace`.
- **Display (h1, hero):** `'Cal Sans', 'Inter', sans-serif`.

Hierarchy:

| Role     | Size                    | Weight | Letter spacing | Line height |
|----------|-------------------------|--------|----------------|-------------|
| h1       | `clamp(40px, 6vw, 72px)`| 700    | -0.02em        | 1.05        |
| h2       | `clamp(28px, 3.5vw, 44px)` | 600 | -0.02em        | 1.15        |
| h3       | 20-24px                 | 600    | -0.01em        | 1.3         |
| body     | 15-16px                 | 400    | normal (0)     | 1.5         |
| caption  | 12-13px                 | 500    | normal         | 1.4         |
| eyebrow  | 11-12px mono UPPERCASE  | 500    | 0.1-0.12em     | 1           |

Headings get tightened tracking. Body never does. Eyebrows are mono uppercase with positive tracking — they are the only place a positive letter-spacing is allowed.

---

## Spacing scale

8px base. Use the token, not raw px.

`4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64` (px) — corresponding to `--df-space-1` through `--df-space-16`.

For section-level rhythm in landing pages, scale further with multiples: `80px` (between major sections on mobile), `120px` (between major sections on desktop).

---

## Border radius

Four canonical radii. Pick by role, not by aesthetic preference.

- `--df-radius-sm` **6px** — pills, tags, small badges, input chips.
- `--df-radius-md` **10px** — buttons, inputs, dropdown items, toasts.
- `--df-radius-lg` **16px** — cards, panels, glass surfaces, modals.
- `--df-radius-xl` **24px** — hero containers, pricing tiers, feature cards on landing pages.

Avatars and pure circles use `--df-radius-full` (`9999px`). Never mix radii within a card — pick one and let nested elements step down by one tier at most.

---

## Glow shadows

Glow is the brand. Use it sparingly so it stays meaningful.

- `--df-glow-violet` `0 0 20px rgba(167, 139, 250, 0.35)` — primary CTA hover, focus rings, the "this is the action" element.
- `--df-glow-violet-lg` `0 0 40px rgba(167, 139, 250, 0.25)` — hero ambient halos, behind-the-element wash on featured cards.
- `--df-glow-cyan` `0 0 20px rgba(34, 211, 238, 0.35)` — secondary action hover, info chips, link underline glow.
- `--df-glow-pink` `0 0 20px rgba(244, 114, 182, 0.35)` — notification badges, "new" pills, highlight chips.
- `--df-glow-green` `0 0 20px rgba(74, 222, 128, 0.35)` — live status dots, success toast halos.

One glow per viewport at any time. Two if one is ambient and one is active. Never three.

---

## Glass surfaces

Glassmorphism is the floating-surface treatment. It belongs on cards, panels, modals, and navbars over a contented page background — never on the page itself.

- **Background alpha:** `rgba(255, 255, 255, 0.04)` for resting, `0.07` for hovered/elevated, `0.10` for top-of-stack overlays. On light theme, invert to `rgba(0, 0, 0, ...)` at the same alpha rungs.
- **Border alpha:** `rgba(255, 255, 255, 0.08)` default, `0.12` for emphasized panels and modals.
- **Backdrop blur:** `10-12px` default (cards, navbars), `16-20px` for elevated panels, `32px` only on full-screen overlays. Always pair with a `saturate(180%)` (or `140%` on light theme) so the underlying color survives the blur.
- **Always set both `backdrop-filter` and `-webkit-backdrop-filter`.** Safari still needs the prefix.

---

## Motion

Motion is restrained, eased, and accessible. Defaults:

- **Default ease:** `cubic-bezier(0.16, 1, 0.3, 1)` — a slow-out cubic. Feels expensive. Use for entrances and most UI transitions.
- **Spring ease (sparingly):** `cubic-bezier(0.34, 1.56, 0.64, 1)` — overshoots. Reserve for playful confirmations.
- **Smooth ease:** `cubic-bezier(0.4, 0, 0.2, 1)` — Material's standard. Use for state changes that should feel neutral.
- **Default durations:** `0.5s` for entrance animations, `0.18-0.25s` for micro-interactions (hover, press, focus), `0.4s` for state changes.
- **Stagger:** `0.06s` between sibling items (cards in a grid, list rows). Never more than `0.1s` — staggers should feel intentional, not slow.
- **Always guard motion behind `prefers-reduced-motion`.** Use Framer Motion's `useReducedMotion()` or a CSS `@media (prefers-reduced-motion: reduce)` block. If the user opts out, set `initial={false}` and zero out non-essential transforms — keep opacity transitions for state clarity.

---

## Accessibility

Non-negotiable. Darkforge components ship accessible by default; generated UI must preserve that.

- **Contrast:** Body text against its background must clear **4.5:1** (WCAG AA). Large text (18px+ or 14px+ bold) must clear **3:1**. The token system is calibrated to pass — `#ffffff` on `#000000` is 21:1, `#a1a1aa` on `#000000` is 8.5:1.
- **Focus ring:** **2px** ring in `--df-neon-violet` with a 3px offset glow `0 0 0 3px rgba(167, 139, 250, 0.1)`. Visible on every interactive element. Do not remove `:focus-visible` outlines.
- **ARIA:** Every interactive non-native element gets `role`, `aria-label` (or `aria-labelledby`), and `aria-describedby` where relevant. Toasts get `role="status"` + `aria-live="polite"`. Modals get `role="dialog"` + `aria-modal="true"` + focus trap.
- **Keyboard:** Every interactive element is reachable and operable by keyboard. Tab order matches visual order. Escape closes overlays. Enter/Space activates buttons.
- **Hit area:** Minimum **44x44px** touch target on any interactive element below the fold or on mobile.

---

## Component patterns

Darkforge ships ten canonical patterns. Each is a recipe — composition, motion, and accessibility — not a single component.

- **Hero** — full-bleed first impression: eyebrow + display headline (often shimmer gradient) + supporting copy + primary/secondary CTAs, frequently over a mesh-gradient or 3D backdrop.
- **Navbar** — sticky glass bar with logo, primary nav, optional command-k trigger, and a violet CTA on the right; collapses to a sheet drawer below `md`.
- **Pricing** — three-tier card grid with one highlighted tier (violet border + ambient glow), monthly/annual toggle, and feature lists aligned to a checkmark column.
- **Dashboard** — sidebar + top bar + content grid: stat row, primary chart card, secondary table or activity feed; built mobile-first with a collapsible sidebar.
- **Features** — alternating-side image/copy rows or a 3-column icon grid; each tile is a glass card with a single neon accent and a 0.06s stagger on view.
- **Testimonials** — quote cards in a marquee or grid, with avatar, name, role/company, and a subtle violet glow on the featured quote.
- **Footer** — multi-column link directory over `--df-bg-surface`, divider, copyright row with social icons; never the loudest element on the page.
- **CTA** — a tightly-scoped section with a strong headline, one primary action, optional eyebrow, often over an ambient violet or cyan halo.
- **3D-scene** — a React Three Fiber + Drei composition (floating product, particle field, distorted plane) layered behind hero copy, lazy-loaded and reduced-motion aware.
- **Scroll-story** — GSAP ScrollTrigger or Framer Motion scroll-driven sequence: pinned section, progress-driven transforms, cleanup-on-unmount required.

---

## DON'Ts

- **No hardcoded hex outside the token definitions.** If you need a color, it goes in `:root` first, then gets used as `var(--df-...)`.
- **No `bg-blue-500` defaults.** Tailwind's stock palette is forbidden for brand colors — only the `nx` extension or `var(--df-*)` is allowed.
- **No purple-on-white.** That is the marketing aesthetic of every cookie-cutter SaaS landing. In light theme, `--df-text-accent` flips to a deeper violet (`#7c3aed`, violet-600) for AA contrast, and violet is never the brand surface.
- **No Bootstrap aesthetics.** No flat blue primary buttons, no rounded-full pills on every CTA, no Helvetica-on-light.
- **No light theme as default.** Light is opt-in via `[data-theme="light"]` or `--light` flag only. Dark is the brand.
- **No removing `prefers-reduced-motion` guards.** Even if you "just want it to feel nice." Accessibility is non-negotiable.
- **No glow on more than one element per viewport** (one ambient + one active is the maximum). Glow loses meaning fast.
- **No mixed radii within a single card.** Pick one, step down nested elements by one tier at most.
- **No `backdrop-filter` without `-webkit-backdrop-filter`** alongside it. Safari users exist.
- **No skeumorphic shadows pretending to be physical depth.** Use glow and elevation tokens, not `0 4px 8px rgba(0,0,0,0.2)`.

---

## How to use this file in your AI tool

`DESIGN.md` lives at the repo root. Most modern AI coding agents will pick it up automatically when generating UI in the project.

- **Stitch** — drop `DESIGN.md` in the repo root and enable "Use DESIGN.md" in workspace settings. Stitch will read this spec on every UI generation.
- **Cursor** — agents auto-read `DESIGN.md` from the repo root. No configuration needed; it gets pulled into context for any UI-related prompt.
- **Claude Code** — install the Darkforge plugin for the richer experience: a 35-file reference library, intent-routed `/darkforge:forge` command, stack-aware library detection, and the full pattern catalog covering 25 libraries across React, Vue, Svelte, and plain HTML.
  ```bash
  /plugin marketplace add Karannnnn614/Darkforge
  /plugin install darkforge@darkforge
  ```
  Then `/forge glassmorphism pricing card with violet hover glow` — or just describe what you want in plain English.
- **Windsurf, Cline, Aider, GitHub Copilot Workspace, and other tools** — drop `DESIGN.md` in the repo root and prompt with "follow `DESIGN.md`" or "use the Darkforge design system from `DESIGN.md`."

The point of this file is portability. Your design system shouldn't be locked to one AI tool. If a new agent appears tomorrow, point it at `DESIGN.md` and the aesthetic survives the migration.
