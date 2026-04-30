# Contributing to Darkforge

Thanks for considering a contribution. Darkforge is a Claude Code plugin for AMOLED-dark UI generation, and the project benefits from real-world references, new pattern recipes, and bug fixes from people actually shipping with it. This guide covers how to contribute productively.

## How to contribute

1. **File an issue first** for anything non-trivial — new references, new patterns, behavior changes, or anything that touches `skills/forge/SKILL.md`. A two-line issue beats a 300-line PR that gets bounced because the scope was wrong.
2. **Fork → branch → PR**. Branch off `main`, name the branch after the change (`add-solid-reference`, `fix-magicui-glow-token`), and open a PR against `main`. Keep PRs scoped to one concern.
3. **Run `node scripts/validate.mjs` before pushing.** It must exit 0. The validator is the deterministic gate — if it fails, the PR isn't ready.

## What we're looking for

- **New pattern recipes** under `skills/forge/references/patterns/` — hero variants, dashboard layouts, sidebar shells, multi-step forms, empty states, error states.
- **New library references** when a library is genuinely worth adding — e.g. Solid.js, Qwik, Mantine, or a notable new motion/3D library. The bar is "Claude generates better output with it loaded than without it".
- **Bug fixes in existing references** — wrong prop signatures, broken `useReducedMotion` guards, missing `aria-*` attributes, hardcoded hex that snuck in, dead VERIFY markers.
- **Real-world site additions to `skills/forge/references/inspiration-tour.md`** — short writeups of public sites that exemplify a pattern (with links). Concrete sites teach Claude better than abstract descriptions.

## What we're NOT looking for

- **Light-default themes.** Dark stays the default and the brand. The opt-in light theme already exists at `skills/forge/references/18-light-theme.md` for users who explicitly ask.
- **Generic shadcn ports.** If it's a stock shadcn snippet without an AMOLED-dark, neon, or glass treatment, it doesn't belong here.
- **Scope creep into business logic.** No auth flows, payment integrations, analytics SDKs, or backend code. Darkforge is a UI generator, not a fullstack starter.

## Quality bar

Every reference and pattern file must:

- Use `var(--df-*)` tokens for all colors, glows, glass surfaces, borders, and radii. **Never hardcoded hex.** The `00-dark-tokens.md` reference is the source of truth.
- Include `'use client'` on any snippet that uses hooks or browser APIs (the project assumes Next.js App Router as the default surface; the directive is harmless elsewhere).
- Include a `useReducedMotion` guard wherever motion is used — Framer Motion, GSAP, React Spring, Anime.js, anything. Accessibility is not optional.
- Include relevant `aria-*` attributes on interactive elements, semantic landmarks, and focus-visible styling.
- Be **mobile-first responsive** — show the 375px layout, then scale up. Snippets that break below 768px will be rejected.
- The hardcoded-hex rule has narrow exceptions enforced by `scripts/validate.mjs`: lines containing `THREE.Color`, `color={0x...}`, or `new Color(...)` are skipped (Three.js needs literal hex), and the shorthand black/white values `#000`, `#fff`, `#000000`, `#ffffff` are allowed. Everything else must be a `var(--df-*)` token.

## Coding style

Match the existing files. If you're rewriting a section:

- Preserve `// VERIFY:` markers — don't silently delete them. If you've verified the underlying claim, replace the marker with a docs URL citation.
- Preserve source-of-truth caveats. They're load-bearing for the project's honesty posture.
- Preserve existing structure (frontmatter, headings, code-block ordering). Reviewers can diff faster when shape is consistent.

## Source-of-truth honesty

When a reference claims a library prop signature, an API surface, or a version-specific behavior:

- **Either** cite the canonical docs URL inline (e.g. `// docs: https://framer.com/motion/...`),
- **or** add a `// VERIFY:` comment flagging that the claim came from training-data recall and hasn't been re-checked against upstream.

We prefer honest uncertainty over false confidence. A snippet with three `// VERIFY:` markers is more useful than the same snippet pretending to be authoritative when it isn't.

## Adding a new reference

1. Create the file at `skills/forge/references/<NN>-<name>.md` where `NN` is the next available two-digit number.
2. Add the file to the routing table in `skills/forge/SKILL.md` so Claude knows when to load it. The validator warns if a reference exists on disk but isn't routed.
3. Include the standard sections: frontmatter / scope / when to load / token mapping / minimal example / common variants / accessibility notes.
4. Run `node scripts/validate.mjs` and confirm zero errors.

## Adding a new pattern

Same flow as above, but the file lives at `skills/forge/references/patterns/<name>.md` and the SKILL.md routing entry points there. Patterns compose — make sure your recipe references the underlying library files (e.g. `01-framer-motion.md`) rather than re-inlining the snippets.

## Reporting bugs

Preferred format:

- **Minimal repro** — the exact `/forge` prompt you typed.
- **Expected vs actual** — what you wanted, what you got.
- **Package versions** — `react`, `next`, `framer-motion`, `tailwindcss`, etc. from the project where the issue surfaced.
- **Claude Code version** — output of `claude --version` or whatever the CLI exposes.

Bug reports without a repro will be closed with a request for one.

## License

Darkforge is MIT-licensed. By submitting a contribution, you agree that your contribution is licensed under MIT and may be redistributed under those terms.
