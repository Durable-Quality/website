# Test plan

This is a static marketing site, so it needs only light testing.

Most of the risk is in two places:

- The guide's routing, in `next.config.ts`
- The guide's build script, `durable-testing/build.mjs`

## Tools

| For | Tool | Why |
| --- | --- | --- |
| Routing, build output | `bun test` | Built into Bun, which the repo already uses. No new dependency. |
| Build checks | `durable-testing/build.mjs` | The build already stops on errors. These are a few more of those checks. |
| Browser smoke tests | Playwright (`@playwright/test`) | Starts the server for us and records a trace when a test fails. `playwright-core` is already installed. |
| CI | GitHub Actions with `oven-sh/setup-bun` | The repo is on GitHub and has no CI yet. |

Tests live in `tests/`. Run them with `bun run test` (routing and build output) and `bun run test:e2e` (browser).

## How to use this checklist

When an item is done, tick it and replace `Proof: _pending_` with a link to the evidence: the test file, the PR, or a CI run.

```md
- [x] Clean URLs load the page
  Proof: [tests/routing.test.ts](tests/routing.test.ts), [#12](https://github.com/…/pull/12)
```

## 1. Routing

Check that the guide's URLs behave correctly on a running server.

- [ ] Clean URLs load the page
  Proof: _pending_
- [ ] Old `.html` URLs redirect to the clean URL
  Proof: _pending_
- [ ] Agents asking for Markdown get Markdown
  Proof: _pending_
- [ ] The headers are set (`Vary`, `Link`, CORS)
  Proof: _pending_
- [ ] Unknown pages return 404
  Proof: _pending_
- [ ] `robots.txt` and `llms.txt` load
  Proof: _pending_
- [ ] The routing tests also run against the live site after each deploy
  Proof: _pending_

## 2. Build output

Check the files the build writes.

- [ ] Every link points to a file that exists
  Proof: _pending_
- [ ] No unfilled `{{placeholders}}` are left
  Proof: _pending_
- [ ] Structured data (JSON-LD) is valid
  Proof: _pending_
- [ ] Each page's rules are the same everywhere they appear
  Proof: _pending_
- [ ] The Claude skill file is valid
  Proof: _pending_

## 3. Build checks

Make the build itself fail when:

- [x] A page contains an em dash
  Proof: [durable-testing/build.mjs](durable-testing/build.mjs) (`emDashProblems`)
- [x] A page's `.md` and `.html` versions have different headings
  Proof: [durable-testing/build.mjs](durable-testing/build.mjs) (`headingProblems`)

## 4. Browser smoke tests

- [ ] The home page loads without errors and links to the guide
  Proof: _pending_
- [ ] The guide's diagrams draw
  Proof: _pending_
- [ ] The light/dark toggle remembers its setting
  Proof: _pending_

## 5. CI

- [x] Typecheck, lint and the tests run on every pull request
  Proof: [.github/workflows/ci.yml](.github/workflows/ci.yml)
