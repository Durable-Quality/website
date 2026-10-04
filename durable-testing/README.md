# Durable Testing

Durable Quality's public reference on testing fundamentals, served at [durableqa.xyz/durable-testing](https://durableqa.xyz/durable-testing). It covers the 7 testing principles, the SDLC and STLC, and the test pyramid, and it's written for developers and the AI agents that work alongside them.

It's a static site with its own look, separate from the Next app. `build.mjs` (plain Node, no dependencies) turns `src/` into `public/durable-testing/`, which Next serves as static files. The build runs before `bun dev` and `bun run build`. Run `bun run testing:build` to rebuild while the dev server is running. `public/durable-testing/` is gitignored.

| URL | For |
| --- | --- |
| `/durable-testing`, `/durable-testing/testing-principles`, `/durable-testing/sdlc-stlc`, `/durable-testing/test-pyramid` | People, and search engines (title, description, canonical, Open Graph, JSON-LD) |
| `/durable-testing/<page>.md`, or any page URL requested with `Accept: text/markdown` | Agents that fetch a page |
| `/durable-testing/rules.md` | All agent rules in one block, for `AGENTS.md` / `CLAUDE.md` |
| `/durable-testing/skills/durable-testing/SKILL.md` | The Claude skill |
| `/durable-testing/llms.txt`, `/durable-testing/llms-full.txt` | Tools that look for llms.txt (the site's root `/llms.txt` links here) |
| `/durable-testing/sitemap.xml` | Crawlers. `app/robots.ts` points to it and explicitly allows the AI crawlers |

Routing lives in the site's `next.config.ts`: clean URLs (`/durable-testing/x` serves `public/durable-testing/x.html`), redirects from `.html`, Markdown negotiation, and headers. Pages are matched by pattern, so a new page needs no routing change.

## Edit content

Each page is a pair in `src/pages/`:

- `<slug>.md` holds the front matter (title, SEO title, description, skill hint, order) and the Markdown that agents receive. Its `## Rules for agents` list is the single source for that page's rules: the build puts them into the HTML page, `rules.md`, `llms-full.txt` and the skill.
- `<slug>.html` holds the visual page. `{{rules}}` marks where the rules list goes, and `{{base}}` is the guide's path (`/durable-testing`). Diagrams are `<svg data-d="name">` placeholders, drawn by `src/assets/site.js`.

When you change prose, change it in both files. The build checks this: it stops if a page's `.md` and `.html` have different `##` sections (an `<h2>`, or an `<aside>`, `<nav>` or `<section>` whose `aria-label` names the section, such as the "Rules for agents" checklist). It also stops if any page or `src/layout.html` contains an em dash. To add a page, add a new pair with the next `order`. Navigation, the sitemap, `llms.txt` and the skill all pick it up.

`site.config.json` holds `baseUrl`. Canonical URLs, the sitemap, the skill and the `public/` folder the guide builds into all come from it. `SITE_URL=… bun run testing:build` overrides it.

## After deploying

- Submit `https://durableqa.xyz/durable-testing/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- Link to the guide from the landing page, @DurableQA and a Substack post. Pages need inbound links before they rank.
- Install the skill yourself and check that Claude picks it up on a testing question:

  ```sh
  curl -fsSL https://durableqa.xyz/durable-testing/skills/durable-testing/SKILL.md --create-dirs -o ~/.claude/skills/durable-testing/SKILL.md
  ```
