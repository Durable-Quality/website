---
title: The testing triangle
tab_title: Test pyramid
description: The test pyramid (testing triangle): how many unit, integration and end-to-end tests to write, why the shape works, anti-patterns like the ice-cream cone, and variants like the testing trophy.
skill_hint: unit, integration and E2E scope, speed and tools; why the pyramid shape works; anti-patterns (ice-cream cone, hourglass, duplicate coverage); variants (testing trophy, honeycomb).
order: 3
---

# The testing triangle (test pyramid)

Popularised by Mike Cohn in *Succeeding with Agile* (2009). Write many small, fast, isolated tests at the bottom and a few broad, slow, realistic tests at the top. The higher a test sits, the more it costs to write, run and debug.

```text
          /\
         /  \         UI / E2E       few  · slow · costly
        /----\
       /      \       Integration    some
      /--------\
     /          \     Unit           many · fast · cheap
    /------------\

 Anti-pattern: the ice-cream cone
 ( manual + E2E )  ← most tests
  \ integration/
   \  unit    /
    \        /
     \      /
      \____/
```

The shares (often quoted as ~70% unit, ~20% integration, ~10% E2E) are a rule of thumb, not a target. What matters is the direction: push each check down to the lowest level that can catch the defect.

## The three layers

| Layer | Scope | Speed | Catches | Example tools |
|---|---|---|---|---|
| Unit | One function or class; dependencies faked | Milliseconds | Logic errors, edge cases, regressions in isolated code | Vitest, Jest, pytest, JUnit |
| Integration | Several components, or code plus a real dependency (database, HTTP, queue) | Seconds | Contract mismatches, wiring, serialisation and query bugs | Testcontainers, Supertest, Pact |
| UI / E2E | The whole system through the UI or public API, as a user would | Seconds to minutes | Broken user journeys, configuration and deployment problems | Playwright, Cypress, Selenium |

## Why the shape works

- **Feedback speed.** Thousands of unit tests run in seconds, so developers run them on every save.
- **Cost.** Lower tests are cheaper to write and survive refactors of unrelated code.
- **Reliability.** Fewer moving parts mean fewer flaky failures from timing, network or test data.
- **Diagnosis.** A failing unit test points at one function. A failing E2E test points at the whole stack.

## Anti-patterns

- **The ice-cream cone** inverts the pyramid: most effort goes into manual and E2E tests, with few unit tests underneath. The pipeline is slow, failures are flaky and hard to locate, and teams start ignoring red builds.
- **The hourglass** has plenty of unit and E2E tests but almost no integration tests, so the seams between components, where many real bugs live, go untested.
- **Duplicate coverage** asserts the same rule at every layer. It triples the maintenance cost without adding confidence.

## Variants

- **Testing trophy** (Kent C. Dodds) adds static analysis as the base and makes integration tests the largest layer. It suits front-end apps, where most bugs appear when components work together.
- **Test honeycomb** (Spotify) centres microservice testing on integration tests of each service through its real interfaces, with few implementation-detail tests.

The right shape follows your architecture. The underlying rule does not change: prefer the fastest, most isolated test that can still catch the defect.

## Rules for agents

- Test at the lowest layer that can catch the defect.
- Give new logic unit tests, new boundaries (database, HTTP, queue) integration tests, and only critical user journeys E2E tests.
- Keep unit tests fast and deterministic: no network, no real clock, no shared state.
- When an E2E test fails, reproduce the cause with a lower-level test before fixing it.
- Quarantine and fix flaky tests. Never retry them into green silently.
- Do not assert the same behaviour at multiple layers.
