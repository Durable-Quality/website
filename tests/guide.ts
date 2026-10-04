// Builds Durable Testing once per test run and exposes its output, so tests
// check exactly what `bun run build` ships to public/durable-testing.

import { execFileSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

import config from "../durable-testing/site.config.json"

const root = join(import.meta.dir, "..")

execFileSync("node", [join(root, "durable-testing", "build.mjs")], {
  cwd: root,
  stdio: "pipe",
})

const baseUrl = config.baseUrl.replace(/\/+$/, "")
const origin = new URL(baseUrl).origin
const basePath = new URL(baseUrl).pathname
const out = join(root, "public", basePath.slice(1))

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [relative(out, path)]
  })
}

// Every file the build wrote, relative to `out`, e.g. "skills/durable-testing/SKILL.md".
const files = walk(out).sort()
const textFiles = files.filter((f) => /\.(html|md|txt|xml|css|js)$/.test(f))

const read = (file: string) => readFileSync(join(out, file), "utf8")
const exists = (file: string) => existsSync(join(out, file))

// Guide pages, by slug, from the build's own sources.
const slugs = readdirSync(join(root, "durable-testing", "src", "pages"))
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.slice(0, -3))
const guideSlugs = slugs.filter((s) => s !== "index")

// A page's front matter `title`, which heads its section in rules.md and the skill.
function titleOf(slug: string) {
  const source = readFileSync(
    join(root, "durable-testing", "src", "pages", `${slug}.md`),
    "utf8"
  )
  const title = source.match(/^title: (.+)$/m)?.[1]
  if (!title) throw new Error(`${slug}.md has no title`)
  return title.trim()
}

export {
  basePath,
  baseUrl,
  exists,
  files,
  guideSlugs,
  origin,
  out,
  read,
  slugs,
  textFiles,
  titleOf,
}
