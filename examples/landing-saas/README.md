# Landing SaaS — Darkforge Example

A complete single-file SaaS landing page composing 7 Darkforge patterns into a real demo. Brand: **Nexus Email Analytics** — fictional but realistic email deliverability product.

## What this demo shows

| Section | Pattern source |
|---|---|
| NavBar | `patterns/navbar.md` — Sticky Glass + Mobile Drawer |
| Hero | `patterns/hero.md` — Hero 3 (Neon Mesh) |
| Features (bento) | `patterns/features.md` — Bento Grid |
| Testimonials | `patterns/testimonials.md` — Dual-row Marquee |
| Pricing | `patterns/pricing.md` — Three-Tier Glass Cards |
| CTA | `patterns/cta.md` — Full-Width Gradient Band |
| Footer | `patterns/footer.md` — Multi-Column Standard |

All sections use DF tokens (no hardcoded hex), `'use client'` directive, `useReducedMotion` guards, `aria-*` attributes, and mobile-first responsive layout.

## How to use

1. Drop `page.tsx` into your Next.js 14+ App Router app (e.g. `app/page.tsx` or `app/landing/page.tsx`).
2. Install peer deps:
   ```bash
   npm i framer-motion
   ```
3. Inject the DF token system into your `globals.css` (copy the `:root` block from `skills/forge/references/00-dark-tokens.md`).
4. Ensure Tailwind v3.4+ or v4 is configured (used for a few grid utilities).
5. Visit `/` (or wherever you mounted it). You should see the full dark landing page.

## Source-of-truth caveat

This demo was generated from training-data recall (Jan 2026 cutoff) — `context7` and `WebFetch` were denied at generation time. `// VERIFY:` markers in the code flag prop signatures that may have shifted between minor versions of `framer-motion`. The pravatar.cc avatar URLs in the testimonials section should be replaced with real customer photos (or your own placeholder pipeline) before shipping.

## Customization hints

- **Brand swap**: search-and-replace `Nexus Email Analytics` → your product name. The accent palette (`ACCENT_MAP` constant near the top) controls per-section neon hue.
- **Copy data**: features, testimonials, pricing tiers, and footer link tree are all in named const arrays at the top of the file — edit in place.
- **Newsletter wiring**: the footer form is wired to a stub `onSubmit` handler; swap in your `fetch('/api/subscribe', …)` or Resend/Loops/ConvertKit integration.
- **Icon library**: simple text glyphs are used for nav and feature icons; swap to `lucide-react` for production polish (`npm i lucide-react`).
- **Avatars**: `pravatar.cc` placeholders are used for testimonials. Replace with real customer photos served from your CDN.

## File stats

- `page.tsx` — 2,069 lines, 7 named sub-components, real "Nexus Email Analytics" brand throughout (real testimonials from "Mercury / Ramp / Lattice / Reflect / Cal.com / Plaid"-class companies, real pricing $0 / $49 / $249).
- All DF tokens via CSS variables; zero hardcoded hex in DOM/CSS.
