# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **bun** (`bun.lock`).

```bash
bun dev          # next dev
bun run build    # next build
bun start        # serve production build
bun run lint     # eslint (flat config, next core-web-vitals + typescript)
bun run typecheck # tsc --noEmit
bun run format   # prettier --write "**/*.{ts,tsx}"
```

There is no test suite.

## Next.js version warning

See `AGENTS.md`: this is Next.js 16 (with React 19) and **differs from training data**. Before writing Next-specific code (routing, config, caching, APIs), read the relevant guide in `node_modules/next/dist/docs/` rather than relying on memory. Heed deprecation notices.

## Architecture

Single-page marketing site for the Durable Quality studio (products: Burn, OmniLens, SpecProof).

- `app/page.tsx` — the entire landing page. Each section (Hero, Ticker, Products, Contact) is a local component in this one file, with its content defined as a module-level array (`products`, `productCards`) directly above its component. Edit content by editing those arrays, not by rewriting JSX.
- `components/site/` — site-level composites (header, footer, logo, `Reveal`).
- `components/ui/` — shadcn components (style `base-nova`, built on `@base-ui/react`, not Radix). Add via the shadcn CLI; aliases are in `components.json`.
- `app/layout.tsx` — loads IBM Plex Sans/Mono via `next/font/google` into `--font-sans` / `--font-mono`, and hardcodes `className="dark"` on `<html>`.

## Brand system (`app/globals.css`)

- **Monochrome and dark-only.** `:root` and `.dark` share identical token values; there is no theme toggle or `next-themes` (deliberately removed — see CHANGELOG). Do not reintroduce light/dark switching.
- **`.inverted`** is the mechanism for light sections: apply it to a section element alongside `bg-background text-foreground` and every shadcn token flips to the light palette within that subtree. No section currently uses it, but prefer it over one-off light-colored classes when one needs to.
- Headings use `--font-heading`, which is aliased to the **mono** font.
- Custom utilities: `bg-blueprint` (grid backdrop), `animate-ticker` (marquee; already no-ops under `prefers-reduced-motion`).

## Conventions

- Prettier: no semicolons, double quotes, 80 cols, with `prettier-plugin-tailwindcss` sorting classes in `cn`/`cva`.
- Components are exported at the bottom via `export { Name }`, not inline `export function`.
- Server components by default; only `Reveal` is `"use client"`.
- **Base UI `nativeButton`:** to render a shadcn `Button` as an anchor, pass both `nativeButton={false}` and `render={<a href="…" />}`. It defaults to `true`; leaving it set while rendering an `<a>` still works and still navigates, but logs a dev-only `console.error` and merges a meaningless `type="button"` onto the anchor. Setting it `false` swaps that for `role="button"` — which also means the element announces as a button rather than a link, so it's a semantic choice, not just boilerplate. It additionally governs `disabled` handling (`disabled` attribute vs. `aria-disabled` + `tabIndex={-1}`), which matters if a disabled anchor-button is ever added.
- New scroll targets need `scroll-mt-16` to clear the fixed header (`html` has `scroll-smooth`).
- Animations should respect `motion-reduce:` variants, as `Reveal` does.
- `CHANGELOG.md` follows Keep a Changelog; update it when committing meaningful changes.
