# Changelog

## [0.2.0] - 2026-08-08

### Added
- Product cards and the product ticker now show each product's real logo instead of a generic lucide icon.
- Added `CLAUDE.md` with repository guidance for AI coding agents.

### Changed
- Rewrote the hero headline and description around "quality assured software".
- The contact section now links to X for the studio and the founder, replacing the newsletter signup form.
- Product card hover accents: OmniLens is blue and SpecProof is green.
- SpecProof now links to its live site rather than its GitHub repository.
- Reduced the footer to a single copyright line and shortened the page title and meta description.
- Removed em dashes from all site copy and metadata.

### Removed
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
