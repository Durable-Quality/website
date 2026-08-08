# Changelog

## [0.2.0] - 2026-08-08

### Added
- Product cards and the product ticker now show each product's real logo instead of a generic lucide icon.
- Added `CLAUDE.md` with repository guidance for AI coding agents.

### Changed
- Rewrote the hero headline and description around "quality assured software".
- The contact section now links to X for the studio and the founder, replacing the newsletter signup form.
- Product card accents: OmniLens is blue and SpecProof is green.
- The product card link arrow is now always visible in the product's accent color, rather than fading in on hover, so the cards read as clickable at rest.
- SpecProof now links to its live site rather than its GitHub repository.
- Reduced the footer to a single copyright line and shortened the page title and meta description.
- The footer copyright year now follows the current date instead of being hardcoded, and the line is no longer set in all caps.
- Rewrote the products section intro, which now spans the full section width instead of being capped at just over half of it.
- Enlarged the ticker labels to match body copy and dropped their wide letter-spacing; enlarged the footer copyright line.
- Removed em dashes from all site copy and metadata.

### Fixed
- Links that open a new tab now say so to screen readers. The product cards and the two contact buttons carry a visually hidden "(opens in a new tab)" next to their label; the arrow icon that conveyed this visually stays `aria-hidden`.
- Tightened the gap between a ticker logo and its label from `gap-12` to `gap-3`. It matched the gap between products, so the row read as evenly spaced items rather than logo-and-label pairs.
- The ticker logos are marked `priority` instead of lazy-loading. They sit above the fold, so they now paint with the first frame rather than popping in after it. The product card logos below the fold stay lazy.
- Declared `color-scheme: dark` on `html`, so the browser paints a dark canvas, scrollbars, and form controls to match the dark-only palette instead of defaulting to light.
- Dropped the two font weights nothing renders (sans 600, mono 700), cutting the fonts fetched on load.
- Downscaled the three product logos from 1254px (and 512px for Burn) to 256px, which is ample for a 48px tile. Together they went from 1.56MB to 90KB. `public/icon.png` is left at full size because it is the Open Graph image.
- Refreshing the page no longer animates a slow scroll from the restored position up to the top. Removed the global `scroll-smooth` from `html`: Next.js 16 stopped neutralizing `scroll-behavior: smooth` around its own scroll handling, so it applied to page loads as well as to anchor clicks. Scrolling is now the browser default everywhere.

### Removed
- Removed the unused `accordion`, `badge`, `input`, and `separator` UI components. `separator` was the last `"use client"` file, so the repo now has no client components at all.
- Removed the reveal-on-scroll fade and the `Reveal` component. Sections rendered hidden and faded in as you scrolled, with the hero's headline, copy, and logo staggered so they visibly arrived one after another on load. Content now renders in its final state, and the site has no client components left.
- Removed the metrics, process, pull-quote, and FAQ sections from the landing page.
- Removed the header navigation, which no longer had sections to point at.
- Removed the `SectionLabel` component along with the sections that used it.

## [0.1.0] — 2026-07-13

### Added
- Built the full landing page: hero, product ticker, metrics, product cards, process steps, pull quote, FAQ, and contact/subscribe sections.
- Introduced the Durable Quality monochrome brand system with IBM Plex Sans/Mono typography and a dedicated inverted (light) section style.
- Added site header, footer, logo mark, reveal-on-scroll, and section label components.
- Added accordion, badge, card, input, and separator UI components.
- Added app and site icons.

### Changed
- Switched the site to a fixed dark theme instead of a user-toggleable light/dark theme.

### Removed
- Removed the theme provider and the `next-themes` dependency along with its dark-mode hotkey toggle.
- Removed the old placeholder favicon.
