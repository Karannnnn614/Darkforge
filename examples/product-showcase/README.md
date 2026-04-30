# Product Showcase — `Nexus Aura`

A Darkforge demo page for a fictional pair of AMOLED-dark wireless earbuds.
Five sections — `<Hero3D />`, `<FeaturesSpotlight />`, `<SpecsTable />`,
`<Pricing />`, `<CTA />` — composed inside a single `<ProductShowcase />`
component using React Three Fiber, framer-motion, and the DF dark token
system.

## What this demo shows

- **R3F hero canvas** with a placeholder earbud (icosahedron + sphere stem),
  slow auto-rotate, pointer parallax, violet emissive material, and a Bloom +
  ChromaticAberration + Vignette postprocessing stack.
- **Three feature rows**, each with its own small R3F canvas (orb, rings,
  torus knot) and matching neon hue (violet / cyan / pink).
- **Responsive AMOLED spec table** that stacks on mobile and switches to a
  three-column grid above 720 px.
- **Pricing grid** with a primary product card (DF violet hover glow) and
  three accessories that share the same hover-glow treatment.
- **Closing pre-order CTA** wrapped in a glassmorphism card with a violet
  radial-gradient backdrop.

All DOM colors come from `var(--df-*)` tokens (no hardcoded hex). Three.js
hex literals are intentional inside scene code — Three has its own color
pipeline.

## Drop into Next.js App Router

1. Install the peer deps (see below).
2. Copy `page.tsx` to `app/product-showcase/page.tsx` (the `'use client'`
   directive is already at the top).
3. The file injects the DF token CSS once on mount via `useDfTokens()`.
   If your project already ships the tokens globally (recommended), delete
   the `useDfTokens()` call and the `NX_TOKEN_CSS` constant.
4. For best LCP, lazy-load the page through `next/dynamic({ ssr: false })`
   if you embed the showcase inside a larger route — R3F's `Canvas` is
   client-only and pulls ~150 kB gzipped of three.js.

## Peer deps

```bash
npm i three @react-three/fiber @react-three/drei @react-three/postprocessing framer-motion
npm i -D @types/three typescript
```

Tailwind is **not required** — the demo uses inline styles + DF CSS
variables. If you want Tailwind utilities alongside the tokens, install
`tailwindcss` and merge the `nx-*` color extensions from
`skills/forge/references/00-dark-tokens.md`.

## Source caveat

This file was authored from training-data recall (Jan 2026 cutoff). The
`context7` and `WebFetch` tools were denied in the sandbox, so every
uncertain prop is tagged inline with `// VERIFY:`. Cross-check against:

- `r3f.docs.pmnd.rs` — `Canvas`, `useFrame`, `frameloop` semantics
- `drei.docs.pmnd.rs` — `Float`, `MeshDistortMaterial` prop names
  (`distort`, `speed` may rename across drei minors)
- `@react-three/postprocessing` README — `Bloom mipmapBlur`, the
  `ChromaticAberration` offset prop type (`Vector2` vs tuple)
- `framer-motion` v11+ docs — `useReducedMotion`, `Variants`

R3F v9 is in beta as of cutoff; the code targets v8 (`@react-three/fiber@8.17+`,
`@react-three/drei@9.114+`). Pin to v8 unless you know v9 is stable in your
toolchain.

## Production swap — real model

The earbud is an icosahedron + sphere placeholder. For ship-quality
visuals, export a real glTF from your DCC and load via drei's `useGLTF`:

```tsx
import { useGLTF } from '@react-three/drei'

function EarbudModel() {
  const { scene } = useGLTF('/models/nexus-aura.glb')
  return <primitive object={scene} dispose={null} />
}
useGLTF.preload('/models/nexus-aura.glb')
```

Drop a `.glb` under `public/models/` and replace the body of `EarbudModel`
in `page.tsx`. Keep the `<Float>`, `<Bloom>`, and `<PulseRimLight>` wrapping
intact so the DF glow treatment carries over.

## Accessibility

- Every R3F `<Canvas>` is `aria-hidden="true"` — content is purely
  decorative and the headline copy lives in the DOM overlay.
- `prefers-reduced-motion` is honoured: rotation halts in `useFrame`,
  `frameloop` switches to `'demand'`, and pulse lights freeze.
- Focus rings on cards rely on `tabIndex={0}` + `outline: none` plus the
  hover-glow shadow, which doubles as the focus indicator. Replace with a
  proper `:focus-visible` outline if your design system requires it.
