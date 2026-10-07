// A few requests against the live site after each production deploy, one per
// kind of rule in next.config.ts. The routing tests cover the rules in full
// before merge; this only confirms Vercel applies them. It builds nothing, so
// it can't fail over differences between this machine and Vercel's build.
//
// Skipped unless SMOKE_BASE_URL is set:
// SMOKE_BASE_URL=https://durableqa.xyz bun run test:smoke

import { describe, expect, test } from "bun:test"

const origin = process.env.SMOKE_BASE_URL?.replace(/\/+$/, "")
const page = "/durable-testing/test-pyramid"

const get = (path: string, headers: Record<string, string> = {}) =>
  fetch(origin + path, { headers, redirect: "manual" })

describe.skipIf(!origin)("live site", () => {
  test("a guide page serves HTML", async () => {
    const res = await get(page, { Accept: "text/html" })
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toStartWith("text/html")
  })

  test("the same page serves Markdown to agents", async () => {
    const res = await get(page, { Accept: "text/markdown" })
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toStartWith("text/markdown")
    expect(await res.text()).toStartWith("# ")
  })

  test("its .html URL redirects to the clean URL", async () => {
    const res = await get(`${page}.html`)
    expect(res.status).toBe(308)
    expect(new URL(res.headers.get("location") ?? "", origin).pathname).toBe(
      page
    )
  })

  test("the Claude skill installs", async () => {
    const res = await get("/durable-testing/skills/durable-testing/SKILL.md")
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toStartWith("text/markdown")
    expect(await res.text()).toStartWith("---\nname: durable-testing\n")
  })

  test("an unknown page returns 404", async () => {
    const res = await get("/durable-testing/no-such-page")
    expect(res.status).toBe(404)
  })
})
