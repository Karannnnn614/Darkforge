# Dashboard + Agent — Darkforge Example

A single-file Next.js 14 App Router page that demonstrates **the logged-in product UI** — what a user sees after signing into a Darkforge-generated SaaS. Brand: **Nexus Email Analytics** (same fictional product as the `landing-saas` example).

This is the killer demo for the plugin: a real working dashboard with a streaming AI agent on the right that can reason about the user's data, not a static screenshot.

## What this demo shows

| Region | Pattern source |
|---|---|
| Top bar | `patterns/navbar.md` — Minimal App variant |
| Sidebar | `patterns/dashboard.md` — Sidebar with `layoutId` active rail |
| Stats grid | `patterns/dashboard.md` — StatsGrid with rAF count-up + sparkline |
| Campaign table | `patterns/dashboard.md` — sortable headers, hover violet glow, status pills |
| Agent chat | `patterns/dashboard.md` — AgentChatInterface (4-message seed convo, typing dots, suggestion chips) |
| ⌘K palette | `patterns/dashboard.md` — CommandPalette (grouped, keyboard-driven) |
| Mobile drawer | Right pane collapses to a bottom drawer below `lg`, with a FAB to open it |

All sections use DF tokens (no hardcoded hex outside the WebGL-only contexts), `'use client'` directive, `useReducedMotion` guards, `aria-*` attributes, `Esc` to close any modal, `⌘K` / `Ctrl+K` to toggle the palette, and mobile-first responsive layout.

## How to use

1. Drop `page.tsx` into your Next.js 14+ App Router app at e.g. `app/dashboard/page.tsx`.
2. Install peer deps:
   ```bash
   npm i framer-motion
   ```
3. Inject the DF token system into your `globals.css` (copy the `:root` block from `skills/forge/references/00-dark-tokens.md`).
4. Ensure Tailwind v3.4+ or v4 is configured.
5. Visit `/dashboard`. You should see the full dark dashboard with the agent pane on the right (or a FAB on mobile).

## Source-of-truth caveat

This demo was generated from training-data recall (Jan 2026 cutoff) — `context7` and `WebFetch` were denied at generation time. `// VERIFY:` markers in the code flag prop signatures that may have shifted between minor versions of `framer-motion`. Cross-check before shipping.

## Customization hints

- **Brand swap**: search-and-replace `Nexus Email Analytics` → your product name. The `BRAND` const at the top centralizes name and tagline.
- **Seed conversation**: edit `SEED_CONVO` and `SUGGESTIONS` near the top to demo your own agent. Each message can be a string or JSX (the seed includes inline `<code>` and ordered lists).
- **Stats / table data**: `STATS` and `CAMPAIGNS` const arrays at the top — edit in place.
- **Agent backend**: `AgentChatInterface.send()` currently has a `setTimeout` stub for the agent reply. Swap it for a real streaming `fetch('/api/agent', { method: 'POST', body: ... })` and pipe tokens into a single message via `setMessages` updates.
- **Command palette actions**: `COMMANDS` is a flat array grouped by `group`. Hook real handlers in the palette's row `onClick` (currently a no-op + close).
- **Sidebar sections**: each placeholder pane returns `<PlaceholderPane label="…" />`. Replace one at a time — the routing is just a `useState<SectionKey>`.
- **Icon library**: simple text glyphs are used (`◇ ◈ ◉ ✦ ⚙`); swap to `lucide-react` for production polish (`npm i lucide-react`).

## File stats

- `page.tsx` — 1,242 lines, 11 named sub-components (`TopBar`, `Sidebar`, `Sparkline`, `StatCard`, `StatsGrid`, `CampaignTable`, `TypingDots`, `AgentChatInterface`, `CommandPalette`, `OverviewPane`, `RightPane` + page).
- All DF tokens via CSS variables; zero hardcoded hex outside the avatar gradient (`#4ea2ff → #a78bfa`, kept as inline brand accent).
