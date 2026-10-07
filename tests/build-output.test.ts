// Checks the files durable-testing/build.mjs writes to public/durable-testing.
// Each test collects every problem it finds, so one run lists them all.

import { describe, expect, test } from "bun:test"

import {
  basePath,
  baseUrl,
  exists,
  guideSlugs,
  origin,
  read,
  slugs,
  textFiles,
  titleOf,
} from "./guide"

const decode = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")

// Rule text with its formatting removed, so the Markdown source and the
// rendered HTML compare equal.
const plain = (s: string) =>
  decode(s.replace(/<[^>]+>/g, ""))
    .replace(/\*\*|`/g, "")
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim()

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// The bullets under `heading`, up to the next heading of the same or a higher level.
function bulletsUnder(markdown: string, heading: string) {
  const level = heading.match(/^#+/)![0].length
  const lines = markdown.split("\n")
  const start = lines.indexOf(heading)
  if (start === -1) return undefined
  const end = lines.findIndex(
    (line, i) => i > start && new RegExp(`^#{1,${level}} `).test(line)
  )
  return lines
    .slice(start + 1, end === -1 ? undefined : end)
    .filter((line) => line.startsWith("- "))
    .map((line) => plain(line.slice(2)))
}

const scriptById = (html: string, id: string) =>
  html.match(
    new RegExp(`<script[^>]*\\sid="${id}"[^>]*>([\\s\\S]*?)</script>`)
  )?.[1]

describe("links", () => {
  const siteUrl = new RegExp(`${escapeRegExp(origin)}[^\\s)<>"'\`\\]]*`, "g")

  // Every same-site link in a file: href and src attributes in HTML, plus any
  // absolute URL on the site, in any file (Markdown, llms.txt, the sitemap,
  // and the Markdown the HTML embeds for its copy buttons).
  function linksIn(file: string) {
    const text = read(file)
    const links = [...text.matchAll(siteUrl)].map((m) =>
      m[0].replace(/[.,:;]+$/, "")
    )
    if (file.endsWith(".html")) {
      for (const m of text.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
        links.push(decode(m[1]))
      }
    }
    return links
  }

  // The output file a link resolves to, or why it doesn't resolve.
  function check(link: string, from: string) {
    if (link.startsWith("#")) {
      return read(from).includes(`id="${link.slice(1)}"`)
        ? undefined
        : `no id="${link.slice(1)}" on the page`
    }
    const url = new URL(link, `${baseUrl}/`)
    if (url.origin !== origin) return undefined
    // The landing page, served by the Next app rather than the guide.
    if (url.pathname === "/") return undefined
    if (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) {
      return "points outside the guide"
    }
    const rest = url.pathname.slice(basePath.length).replace(/^\//, "")
    const target =
      rest === "" ? "index.html" : /\.\w+$/.test(rest) ? rest : `${rest}.html`
    if (!exists(target)) return `no file ${target}`
    const id = url.hash.slice(1)
    if (
      id &&
      target.endsWith(".html") &&
      !read(target).includes(`id="${id}"`)
    ) {
      return `no id="${id}" in ${target}`
    }
    return undefined
  }

  test("every link points to a file that exists", () => {
    const problems: string[] = []
    let checked = 0
    for (const file of textFiles.filter((f) => !/\.(css|js)$/.test(f))) {
      for (const link of linksIn(file)) {
        checked++
        const problem = check(link, file)
        if (problem) problems.push(`${file}: ${link} (${problem})`)
      }
    }
    expect(checked).toBeGreaterThan(0)
    expect(problems).toEqual([])
  })
})

describe("placeholders", () => {
  test("no unfilled {{placeholders}} are left", () => {
    const problems = textFiles.flatMap((file) =>
      read(file)
        .split("\n")
        .flatMap((line, i) =>
          [...line.matchAll(/\{\{\s*[\w.]+\s*\}\}/g)].map(
            (m) => `${file}:${i + 1}: ${m[0]}`
          )
        )
    )
    expect(problems).toEqual([])
  })
})

describe("structured data", () => {
  // Every page uses one template, so check the parse and the per-page fields.
  test.each(slugs)("%s.html has valid JSON-LD", (slug) => {
    const html = read(`${slug}.html`)
    const blocks = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
      ),
    ]
    expect(blocks).toHaveLength(1)

    const data = JSON.parse(blocks[0][1])
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1]
    expect(data["@context"]).toBe("https://schema.org")
    expect(data.url).toBe(canonical)

    if (slug === "index") {
      expect(data["@type"]).toBe("WebSite")
      return
    }

    expect(data["@type"]).toBe("TechArticle")
    expect(data.headline).toBe(titleOf(slug))
    expect(data.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe("rules", () => {
  const rulesMd = read("rules.md")
  const skillMd = read("skills/durable-testing/SKILL.md")
  const llmsFull = read("llms-full.txt")

  // The page's own Markdown is the source of its rules.
  const rulesOf = (slug: string) =>
    bulletsUnder(read(`${slug}.md`), "## Rules for agents") ?? []

  test.each(guideSlugs)("%s has rules", (slug) => {
    expect(rulesOf(slug).length).toBeGreaterThan(0)
  })

  test.each(guideSlugs)("%s's rules are the same everywhere", (slug) => {
    const rules = rulesOf(slug)
    const title = titleOf(slug)
    const html = read(`${slug}.html`)
    const checklist =
      html.match(/<aside class="checklist"[\s\S]*?<\/aside>/)?.[0] ?? ""
    const llmsChunk =
      llmsFull
        .split("\n---\n")
        .find((chunk) => chunk.includes(`Source: ${baseUrl}/${slug}\n`)) ?? ""

    expect({
      "HTML checklist": [...checklist.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(
        (m) => plain(m[1])
      ),
      "rules.md": bulletsUnder(rulesMd, `## ${title}`),
      "SKILL.md": bulletsUnder(skillMd, `### ${title}`),
      "llms-full.txt": bulletsUnder(llmsChunk, "## Rules for agents"),
    }).toEqual({
      "HTML checklist": rules,
      "rules.md": rules,
      "SKILL.md": rules,
      "llms-full.txt": rules,
    })
  })

  // The copy buttons copy Markdown embedded in each page, which must match
  // the files agents fetch.
  test.each(slugs)("%s.html embeds the current Markdown", (slug) => {
    const html = read(`${slug}.html`)
    expect(scriptById(html, "md-page")?.trim()).toBe(read(`${slug}.md`).trim())
    expect(scriptById(html, "md-rules")?.trim()).toBe(rulesMd.trim())
  })

  test("the rule counts match the rules", () => {
    const total = guideSlugs.reduce((n, s) => n + rulesOf(s).length, 0)
    expect(rulesMd.split("\n").filter((l) => l.startsWith("- "))).toHaveLength(
      total
    )
    expect(read("index.html")).toContain(`All ${total} rules`)
    expect(read("llms.txt")).toContain(`all ${total} rules`)
  })
})

describe("Claude skill", () => {
  const file = "skills/durable-testing/SKILL.md"
  const text = read(file)
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

  test("has front matter that parses as YAML", () => {
    expect(match).not.toBeNull()
    expect(() => Bun.YAML.parse(match![1])).not.toThrow()
  })

  test("name and description meet the skill format's limits", () => {
    const meta = Bun.YAML.parse(match![1]) as Record<string, unknown>
    const { name, description } = meta

    expect(typeof name).toBe("string")
    expect(name).toMatch(/^[a-z0-9-]{1,64}$/)
    expect(name).not.toMatch(/anthropic|claude/)
    // The skill is installed into a folder named after it.
    expect(file.split("/").at(-2)).toBe(name as string)

    expect(typeof description).toBe("string")
    expect((description as string).length).toBeGreaterThan(0)
    expect((description as string).length).toBeLessThanOrEqual(1024)
    expect(description).not.toMatch(/[<>]/)
  })

  test("has a body with every page's rules", () => {
    const body = match![2]
    expect(body).toContain("## Rules")
    for (const slug of guideSlugs) {
      expect(body).toContain(`### ${titleOf(slug)}`)
    }
  })
})
