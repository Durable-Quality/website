# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **bun** (`bun.lock`).

```bash
bun dev          # builds Durable Testing, then next dev
bun run build    # builds Durable Testing, then next build
bun run testing:build # rebuild Durable Testing into public/durable-testing
bun start        # serve production build
bun run lint     # eslint (flat config, next core-web-vitals + typescript)
bun run typecheck # tsc --noEmit
bun run format   # prettier --write "**/*.{ts,tsx}"
bun run test     # bun test: rebuilds Durable Testing, checks its output and routing (needs `bun run build`)
bun run test:routing # routing only
bun run test:smoke # live smoke test; needs SMOKE_BASE_URL=https://durableqa.xyz
```

Tests live in `tests/` and use `bun test` (see `TEST_PLAN.md` for what's covered and what's left). `tests/guide.ts` rebuilds Durable Testing once per run and exposes its output; `tests/build-output.test.ts` checks links, placeholders, JSON-LD, rules and the Claude skill; `tests/routing.test.ts` starts `next start` on the production build and checks clean URLs, redirects, Markdown negotiation, headers and 404s, using one page of each kind since the rules are patterns. CI (`.github/workflows/ci.yml`) runs build, typecheck, lint and tests on every pull request, and `.github/workflows/post-deploy.yml` runs `tests/smoke.test.ts`, five requests with no build, against durableqa.xyz after each production deploy on Vercel. The build itself also fails on em dashes and on `.md`/`.html` section mismatches in the guide.

## Next.js version warning

See `AGENTS.md`: this is Next.js 16 (with React 19) and **differs from training data**. Before writing Next-specific code (routing, config, caching, APIs), read the relevant guide in `node_modules/next/dist/docs/` rather than relying on memory. Heed deprecation notices.

## Architecture

Single-page marketing site for the Durable Quality studio (products: Burn, OmniLens, SpecProof).

- `app/page.tsx` — the entire landing page. Each section (Hero, Ticker, Products, Contact) is a local component in this one file, with its content defined as a module-level array (`products`, `productCards`) directly above its component. Edit content by editing those arrays, not by rewriting JSX.
- `components/site/` — site-level composites (header, footer, logo).
- `components/ui/` — shadcn components (style `base-nova`, built on `@base-ui/react`, not Radix). Add via the shadcn CLI; aliases are in `components.json`.
- `app/layout.tsx` — loads Geist and Geist Mono (the same type as Durable Testing) via `next/font/google` into `--font-sans` / `--font-mono`, and hardcodes `className="dark"` on `<html>`.
- `app/robots.ts` — allows every crawler, names the AI crawlers explicitly, and points to Durable Testing's sitemap.
- `durable-testing/` — Durable Testing at `/durable-testing`, a static site that `durable-testing/build.mjs` writes into `public/durable-testing/` (gitignored) before every `dev` and `build`. Its routing (clean URLs, `Accept: text/markdown` negotiation, headers) lives in `next.config.ts`. See `durable-testing/README.md`.

### Durable Testing is deliberately separate

It keeps its own look, its own light/dark/system toggle, and its own browser script (copy buttons, hand-drawn diagrams). The brand rules and the conventions below apply to the Next app, not to the guide: don't port it into React, and don't restyle it to match the landing page unless asked. Edit it in `durable-testing/src/`, never in `public/durable-testing/`, which is overwritten on every build.

## Brand system (`app/globals.css`)

- **Monochrome and dark-only.** `:root` and `.dark` share identical token values; there is no theme toggle or `next-themes` (deliberately removed, see CHANGELOG). Do not reintroduce light/dark switching. Durable Testing keeps its own toggle; that does not apply here.
- **`.inverted`** is the mechanism for light sections: apply it to a section element alongside `bg-background text-foreground` and every shadcn token flips to the light palette within that subtree. No section currently uses it, but prefer it over one-off light-colored classes when one needs to.
- **The logo is the supplied image, shown as delivered** (white mark on black, `public/icon.png`, with a 512px copy at `app/icon.png`). Render it with `LogoMark` from `components/site/logo.tsx`, which wraps that PNG; never redraw it as SVG or tint it with theme colors (`currentColor`, `--foreground`, etc.). Durable Testing uses the same file, which `durable-testing/build.mjs` copies to `/durable-testing/assets/logo.png`. This applies to every page, including future ones.
- Headings use `--font-heading`, which is aliased to the **sans** font, set bold with tight tracking as on Durable Testing. Card titles are sans, semibold. Mono is for labels and badges.
- Custom utility: `animate-ticker` (marquee; already no-ops under `prefers-reduced-motion`).

## Conventions

- Prettier: no semicolons, double quotes, 80 cols, with `prettier-plugin-tailwindcss` sorting classes in `cn`/`cva`.
- Components are exported at the bottom via `export { Name }`, not inline `export function`.
- **Every component is a server component.** There is no `"use client"` anywhere in the repo, and the site ships no interactive JS of its own. Keep it that way unless a feature genuinely needs the client.
- `components/ui/` holds only `button` and `card`. Unused shadcn components were deleted rather than kept on the shelf; add them back via the CLI when something actually needs one.
- **Base UI `nativeButton`:** to render a shadcn `Button` as an anchor, pass both `nativeButton={false}` and `render={<a href="…" />}`. It defaults to `true`; leaving it set while rendering an `<a>` still works and still navigates, but logs a dev-only `console.error` and merges a meaningless `type="button"` onto the anchor. Setting it `false` swaps that for `role="button"` — which also means the element announces as a button rather than a link, so it's a semantic choice, not just boilerplate. It additionally governs `disabled` handling (`disabled` attribute vs. `aria-disabled` + `tabIndex={-1}`), which matters if a disabled anchor-button is ever added.
- **Analytics is Databuddy**, loaded in `app/layout.tsx` and `durable-testing/src/layout.html` with the same client ID and options. Its `data-track-attributes` option turns a click on any element with `data-track="event_name"` into a named event, with the element's other `data-*` attributes as properties (`data-location="header"` arrives as `location`). Tag new buttons and links worth measuring this way, in snake_case, reusing an existing event name with a different `data-location` where one fits. This needs no client JS of our own. Databuddy ignores localhost, so events only appear from the deployed site. The one server-side event is `skill_install`: `app/api/durable-testing-skill/route.ts` serves the Claude skill's `SKILL.md` (rewritten to it in `next.config.ts`) and sends the event via `@databuddy/sdk/node`, only when `DATABUDDY_API_KEY` is set.
- New scroll targets need `scroll-mt-16` to clear the fixed header.
- **Do not set `scroll-behavior: smooth` (or `scroll-smooth`) on `html`.** It was removed because Next 16 no longer neutralizes it around the router's own scroll handling, which made page loads animate instead of jump. Anchor jumps are instant, which is the browser default.
- **No entrance animations.** Content renders in its final state; the reveal-on-scroll `Reveal` component was deliberately removed because the staggered fade was visible on every load. The ticker marquee is the only motion on the site.
- Any animation added in future must respect `prefers-reduced-motion`, via a `motion-reduce:` variant or a media query as `animate-ticker` does.
- `CHANGELOG.md` follows Keep a Changelog; update it when committing meaningful changes.
