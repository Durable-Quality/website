---
title: SDLC & STLC
tab_title: SDLC & STLC
description: The software development life cycle (SDLC) and software testing life cycle (STLC) phase by phase, with entry and exit criteria, deliverables and the V-model that links them.
skill_hint: SDLC and STLC phases, entry and exit criteria, deliverables per phase, and the V-model that pairs each build phase with a test level.
order: 2
---

# SDLC & STLC

The **Software Development Life Cycle (SDLC)** describes how software is planned, built, released and maintained. The **Software Testing Life Cycle (STLC)** describes how it is tested. STLC runs inside SDLC, and it starts when requirements exist, not when code is finished.

| Aspect | SDLC | STLC |
|---|---|---|
| Focus | Building the product | Verifying and validating the product |
| Owner | The whole team: product, design, engineering | QA and test engineers, together with developers |
| Starts | With a business need or idea | As soon as requirements exist |
| Output | Working software | Evidence of quality: results, defects, a closure report |

## SDLC: the six phases

```text
Requirements → Design → Implementation → Testing → Deployment → Maintenance
     ▲                                                               │
     └────────────────────────── next release ───────────────────────┘
```

| # | Phase | Goal | Key outputs | Quality activities |
|---|---|---|---|---|
| 1 | Requirements | Decide what to build and why | User stories, acceptance criteria | Review for ambiguity, testability and missing edge cases |
| 2 | Design | Decide how to build it | Architecture, data models, API contracts | Design reviews, threat modelling, testable interfaces |
| 3 | Implementation | Build it | Source code, unit tests | Code review, static analysis, unit tests, TDD |
| 4 | Testing | Verify and validate it | Test results, defect reports | Integration, system, regression and acceptance testing |
| 5 | Deployment | Release it to users | Release build, release notes | Smoke tests, canary checks, a tested rollback plan |
| 6 | Maintenance | Operate and improve it | Patches, enhancements | Monitoring, incident analysis, regression tests for fixes |

Every SDLC model uses these phases. Waterfall runs them once, in order. Agile runs the whole loop every sprint. The V-model pairs each build phase with a test level. DevOps compresses the loop with CI/CD so it can run many times a day.

## STLC: the six phases

```text
1. Requirement analysis
2. Test planning
3. Test case development ─┐ often in parallel
4. Environment setup     ─┘
5. Test execution  ⇄  defect → fix → retest
6. Test cycle closure
```

**Entry criteria** say when a phase may start. **Exit criteria** say when it is done. Write both down and check them before moving on.

| # | Phase | Entry criteria | Activities | Deliverables |
|---|---|---|---|---|
| 1 | Requirement analysis | Requirements or stories are available | Identify testable requirements, raise questions, define scope, assess automation | Requirements traceability matrix (RTM), clarified questions |
| 2 | Test planning | Requirements analysed | Choose strategy, scope, tools, roles, schedule; assess risks; estimate effort | Test plan, effort estimate |
| 3 | Test case development | Test plan approved | Write test cases and automation scripts, prepare test data, peer review | Reviewed test cases, test data, scripts |
| 4 | Environment setup | Architecture known; often parallel to phase 3 | Provision environments, seed data and accounts, smoke-test the environment | Ready environment, smoke-test results |
| 5 | Test execution | Test cases, environment and a testable build are ready | Run tests, log defects, retest fixes, run regression | Execution report, defect reports, updated RTM |
| 6 | Test cycle closure | Execution done or exit criteria met | Evaluate coverage against exit criteria, collect metrics, hold a retrospective | Test closure report, lessons learned |

## How they fit together: the V-model

The V-model makes the link between the two lifecycles explicit. Each build phase on the left produces the basis for a test level on the right. Tests for a level are designed when its partner phase finishes, long before they run.

```text
Requirements .......................... Acceptance testing
  System design ..................... System testing
    Architecture design ........... Integration testing
      Module design ............. Unit testing
                    Coding
  (left arm: build / verification ↓)   (right arm: test / validation ↑)
```

- **During requirements**, analyse testability and draft acceptance tests.
- **During design**, plan system and integration tests against the contracts.
- **During implementation**, write unit tests with the code, and prepare environments and data.
- **During testing**, execute, log defects and retest. **At release**, smoke test and close the cycle.

## Rules for agents

- Identify the current SDLC phase before choosing a testing activity.
- For every requirement or story, write acceptance criteria and test conditions before writing code.
- Do not start execution until entry criteria are met: a testable build, a ready environment, defined test cases.
- Link every test to a requirement so coverage gaps are visible.
- Log defects with steps to reproduce, expected and actual results, environment, severity and priority.
- Close every cycle with a report: what ran, what passed, open defects and remaining risks.
