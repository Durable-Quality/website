// Checks the guide's routing in next.config.ts on a running server: clean
// URLs, redirects from .html, Markdown negotiation, headers and 404s.
//
// By default it starts `next start` on the production build, so run
// `bun run build` first. Set ROUTING_BASE_URL to test a deployed site
// instead, e.g. ROUTING_BASE_URL=https://durableqa.xyz bun test tests/routing.test.ts

import { afterAll, beforeAll, describe, expect, test } from "bun:test"
import { spawn, type ChildProcess } from "node:child_process"
import { existsSync, statSync } from "node:fs"
import { join } from "node:path"

import { basePath, baseUrl, guideSlugs, read } from "./guide"

const root = join(import.meta.dir, "..")
const live = process.env.ROUTING_BASE_URL?.replace(/\/+$/, "")

let server: ChildProcess | undefined
let origin = live ?? ""

// Starts `next start` on a free port and waits until it answers.
async function startServer() {
  const buildId = join(root, ".next", "BUILD_ID")
  if (!existsSync(buildId)) {
    throw new Error("No production build. Run `bun run build` first.")
  }
  if (
    statSync(join(root, "next.config.ts")).mtimeMs > statSync(buildId).mtimeMs
  ) {
    throw new Error(
      "next.config.ts changed since the last build. Run `bun run build` again."
    )
  }

  const probe = Bun.serve({ port: 0, fetch: () => new Response() })
  const port = probe.port
  probe.stop(true)

  server = spawn(
    join(root, "node_modules", ".bin", "next"),
    ["start", "-H", "127.0.0.1", "-p", String(port)],
    { cwd: root, stdio: "ignore" }
  )
  origin = `http://127.0.0.1:${port}`

  for (let i = 0; i < 100; i++) {
    try {
      await fetch(origin, { redirect: "manual" })
      return
    } catch {
      await Bun.sleep(100)
    }
  }
  throw new Error("next start did not answer within 10 seconds")
}

beforeAll(async () => {
  if (!live) await startServer()
}, 30_000)

afterAll(() => {
  server?.kill()
})

const get = (path: string, headers: Record<string, string> = {}) =>
  fetch(origin + path, { headers, redirect: "manual" })

const markdown = { Accept: "text/markdown" }
// What a browser sends for a page.
const browser = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
}

// Every page, as its clean URL and the file behind it.
const pages = [
  { url: basePath, file: "index" },
  ...guideSlugs.map((slug) => ({ url: `${basePath}/${slug}`, file: slug })),
]

describe("clean URLs", () => {
  test.each(pages)("$url serves its HTML page", async ({ url, file }) => {
    const res = await get(url, browser)
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toStartWith("text/html")
    expect(await res.text()).toBe(read(`${file}.html`))
  })
})

describe("Claude skill", () => {
  // The install command curls this; a route handler serves it to count installs.
  test("SKILL.md serves the skill as Markdown, uncached", async () => {
    const res = await get(`${basePath}/skills/durable-testing/SKILL.md`, {
      "User-Agent": "curl/8.7.1",
    })
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toStartWith("text/markdown")
    expect(res.headers.get("cache-control") ?? "").not.toContain("s-maxage")
    expect(await res.text()).toBe(read("skills/durable-testing/SKILL.md"))
  })
})

describe("redirects", () => {
  const cases = [
    { from: `${basePath}/index`, to: basePath },
    { from: `${basePath}/index.html`, to: basePath },
    ...guideSlugs.map((slug) => ({
      from: `${basePath}/${slug}.html`,
      to: `${basePath}/${slug}`,
    })),
  ]

  test.each(cases)("$from redirects to $to", async ({ from, to }) => {
    const res = await get(from)
    expect(res.status).toBe(308)
    const location = res.headers.get("location") ?? ""
    expect(new URL(location, origin).pathname).toBe(to)
  })
})

describe("Markdown negotiation", () => {
  test.each(pages)(
    "$url with Accept: text/markdown serves its Markdown twin",
    async ({ url, file }) => {
      const res = await get(url, markdown)
      expect(res.status).toBe(200)
      expect(res.headers.get("content-type")).toStartWith("text/markdown")
      expect(await res.text()).toBe(read(`${file}.md`))
    }
  )

  test("Accept listing Markdown among other types still gets Markdown", async () => {
    const res = await get(basePath, {
      Accept: "text/markdown, text/html;q=0.9, */*;q=0.8",
    })
    expect(res.headers.get("content-type")).toStartWith("text/markdown")
  })

  test.each(pages)(
    "$url's Markdown twin is served at its own URL",
    async ({ file }) => {
      const res = await get(`${basePath}/${file}.md`)
      expect(res.status).toBe(200)
      expect(res.headers.get("content-type")).toStartWith("text/markdown")
      expect(await res.text()).toBe(read(`${file}.md`))
    }
  )
})

describe("headers", () => {
  test.each(pages)("$url varies on Accept", async ({ url }) => {
    for (const headers of [browser, markdown]) {
      const res = await get(url, headers)
      expect(res.headers.get("vary") ?? "").toMatch(/\bAccept\b/i)
    }
  })

  test.each(pages)(
    "$url's Markdown twin links to it as canonical",
    async ({ url, file }) => {
      const res = await get(`${basePath}/${file}.md`)
      const canonical = baseUrl + url.slice(basePath.length)
      expect(res.headers.get("link")).toBe(`<${canonical}>; rel="canonical"`)
    }
  )

  const crossOrigin = [
    ...pages.map((p) => p.url),
    `${basePath}/index.md`,
    `${basePath}/rules.md`,
    `${basePath}/llms.txt`,
    `${basePath}/skills/durable-testing/SKILL.md`,
  ]

  test.each(crossOrigin)("%s allows any origin", async (path) => {
    const res = await get(path)
    expect(res.headers.get("access-control-allow-origin")).toBe("*")
  })
})

describe("404s", () => {
  const missing = [
    `${basePath}/no-such-page`,
    `${basePath}/no-such-page.md`,
    `${basePath}/Test-Pyramid`,
    `${basePath}/test-pyramid/extra`,
  ]

  test.each(missing)("%s returns 404", async (path) => {
    expect((await get(path, browser)).status).toBe(404)
  })

  test("an unknown page requested as Markdown returns 404", async () => {
    expect((await get(`${basePath}/no-such-page`, markdown)).status).toBe(404)
  })

  test("an unknown .html page redirects, then returns 404", async () => {
    const res = await fetch(`${origin}${basePath}/no-such-page.html`)
    expect(res.redirected).toBe(true)
    expect(res.status).toBe(404)
  })
})

describe("robots.txt and llms.txt", () => {
  test("robots.txt allows crawlers and points to the sitemap", async () => {
    const res = await get("/robots.txt")
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toStartWith("text/plain")
    const text = await res.text()
    expect(text).toContain("Allow: /")
    expect(text).toContain(`Sitemap: ${baseUrl}/sitemap.xml`)
  })

  test("the root llms.txt loads and links to the guide's", async () => {
    const res = await get("/llms.txt")
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toStartWith("text/plain")
    expect(await res.text()).toContain(`${baseUrl}/llms.txt`)
  })

  test.each(["llms.txt", "llms-full.txt"])(
    "the guide's %s loads",
    async (file) => {
      const res = await get(`${basePath}/${file}`)
      expect(res.status).toBe(200)
      expect(res.headers.get("content-type")).toStartWith("text/plain")
      expect(await res.text()).toBe(read(file))
    }
  )
})
