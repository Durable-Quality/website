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
| CI | GitHub Actions with `oven-sh/setup-bun` | The repo is on GitHub and has no CI yet. |

Tests live in `tests/`. Run them with `bun run test` (routing and build output).

There are no browser tests. Diagrams drawing and the theme toggle are low risk and visible on any visit, so they don't justify a browser dependency.

## How to use this checklist

When an item is done, tick it and replace `Proof: _pending_` with a link to the evidence: the test file, the PR, or a CI run.

```md
- [x] Clean URLs load the page
  Proof: [tests/routing.test.ts](tests/routing.test.ts), [#12](https://github.com/…/pull/12)
```

## 1. Routing

Check that the guide's URLs behave correctly on a running server. The tests start `next start` on the production build, so run `bun run build` first. The rules are patterns, so the tests use one page of each kind (the index and a guide page) rather than every page.

- [x] Clean URLs load the page
  Proof: [tests/routing.test.ts](tests/routing.test.ts) (`describe("clean URLs")`)
- [x] Old `.html` URLs redirect to the clean URL
  Proof: [tests/routing.test.ts](tests/routing.test.ts) (`describe("redirects")`)
- [x] Agents asking for Markdown get Markdown
  Proof: [tests/routing.test.ts](tests/routing.test.ts) (`describe("Markdown negotiation")`)
- [x] The headers are set (`Vary`, `Link`, CORS)
  Proof: [tests/routing.test.ts](tests/routing.test.ts) (`describe("headers")`)
- [x] Unknown pages return 404
  Proof: [tests/routing.test.ts](tests/routing.test.ts) (`describe("404s")`)
- [x] `robots.txt` and `llms.txt` load
  Proof: [tests/routing.test.ts](tests/routing.test.ts) (`describe("robots.txt and llms.txt")`)
- [x] A smoke test checks the live site after each deploy: one request per kind of rule, no build
  Proof: [tests/smoke.test.ts](tests/smoke.test.ts), [.github/workflows/post-deploy.yml](.github/workflows/post-deploy.yml)

## 2. Build output

Check the files the build writes.

- [x] Every link points to a file that exists
  Proof: [tests/build-output.test.ts](tests/build-output.test.ts) (`describe("links")`)
- [x] No unfilled `{{placeholders}}` are left
  Proof: [tests/build-output.test.ts](tests/build-output.test.ts) (`describe("placeholders")`)
- [x] Structured data (JSON-LD) is valid
  Proof: [tests/build-output.test.ts](tests/build-output.test.ts) (`describe("structured data")`)
- [x] Each page's rules are the same everywhere they appear
  Proof: [tests/build-output.test.ts](tests/build-output.test.ts) (`describe("rules")`)
- [x] The Claude skill file is valid
  Proof: [tests/build-output.test.ts](tests/build-output.test.ts) (`describe("Claude skill")`)

## 3. Build checks

Make the build itself fail when:

- [x] A page contains an em dash
  Proof: [durable-testing/build.mjs](durable-testing/build.mjs) (`emDashProblems`)
- [x] A page's `.md` and `.html` versions have different headings
  Proof: [durable-testing/build.mjs](durable-testing/build.mjs) (`headingProblems`)

## 4. CI

- [x] Typecheck, lint and the tests run on every pull request
  Proof: [.github/workflows/ci.yml](.github/workflows/ci.yml)
