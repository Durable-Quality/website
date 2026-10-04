---
title: The 7 testing principles
tab_title: Testing principles
description: The seven principles of software testing (ISTQB), explained with diagrams and turned into rules that developers and AI agents can follow: risk-based testing, early testing, defect clustering and more.
skill_hint: the seven principles in depth, test design techniques (equivalence partitioning, boundary value analysis, pairwise, decision tables), defect clustering, verification vs validation.
order: 1
---

# The 7 testing principles

Codified by the ISTQB, these seven principles hold for any language, framework or methodology. Treat them as constraints: a test strategy that ignores one of them will fail in a predictable way.

| # | Principle | In one line |
|---|---|---|
| 1 | Testing shows the presence of defects, not their absence | Passing tests reduce risk; they never prove correctness. |
| 2 | Exhaustive testing is impossible | Prioritise by risk and use test design techniques. |
| 3 | Early testing saves time and money | Shift left: test requirements and designs, not just code. |
| 4 | Defects cluster together | A few modules hold most defects; focus there. |
| 5 | Tests wear out | Repeated tests stop finding new bugs; refresh them. |
| 6 | Testing is context dependent | Rigour and technique depend on the product's risk. |
| 7 | Absence-of-errors fallacy | Bug-free software can still be the wrong software. |

## 1. Testing shows the presence of defects, not their absence

Testing lowers the probability that defects remain. A green suite proves the tested paths work under the tested conditions. It never proves the software is correct.

**Example:** "42 checks passed, covering checkout and three payment errors. Refunds were not tested."

## 2. Exhaustive testing is impossible

Inputs, states, orderings and environments multiply. A form with five fields of ten values each has 100,000 combinations (10^5) before you consider timing, browsers or data.

**Techniques:** equivalence partitioning, boundary value analysis, pairwise testing and decision tables.

## 3. Early testing saves time and money

A defect caught in a requirement costs a conversation. The same defect caught in production costs a hotfix, a rollback and user trust. Testing activities should start as soon as there is something to review ("shift left").

**In practice:** testability reviews, acceptance criteria before code, and static analysis plus unit tests on every commit.

Note: the often-quoted 1x → 100x cost multipliers come from older studies and vary widely. The direction is reliable; the exact ratios are not.

## 4. Defects cluster together

A small number of modules usually hold most of the defects, often close to the Pareto split of roughly 80% of defects in 20% of modules.

**Where to look:** modules with high complexity, recent churn, unclear ownership or a history of defects.

## 5. Tests wear out

Running the same tests over and over finds fewer new defects each time. They still catch regressions, but they stop discovering anything. Older syllabi call this the "pesticide paradox".

**Techniques:** property-based testing, exploratory sessions, and mutation testing to find tests that no longer catch anything.

## 6. Testing is context dependent

A medical device, a banking API and a mobile game need different techniques, rigour and coverage. There is no single correct test strategy.

**Inputs to the strategy:** risk, regulation, users and release cadence.

## 7. Absence-of-errors fallacy

Software that passes every test can still fail if it solves the wrong problem or is hard to use. Verification asks "did we build it right?". Validation asks "did we build the right thing?".

**Techniques:** stakeholder acceptance testing, usability checks, beta feedback and product analytics.

## Rules for agents

- Never claim software is bug-free. Report what was tested, how, and what was out of scope.
- Rank areas by risk before writing tests. Use partitions and boundaries instead of enumerating inputs.
- Write or update tests in the same change as the code they cover.
- When you find a defect, search the same module and similar code for siblings.
- Refresh stale suites: vary inputs, add tests for new risks, remove redundant tests.
- Match rigour to context, and state the context you assumed.
- Confirm the feature meets the user's actual need, not only its spec.
