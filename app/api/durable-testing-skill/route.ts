import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { Databuddy } from "@databuddy/sdk/node"
import { after } from "next/server"

// Serves the Durable Testing Claude skill, which next.config.ts rewrites
// /durable-testing/skills/durable-testing/SKILL.md to, and records each
// download in Databuddy as `skill_install`. The install command fetches the
// file with curl, so the browser script never sees it; this is the only way
// to count installs alongside the `copy_skill_install` clicks.
const skillPath = join(
  process.cwd(),
  "public/durable-testing/skills/durable-testing/SKILL.md"
)

// Without a key (local dev, tests, CI) downloads still work but aren't sent.
const apiKey = process.env.DATABUDDY_API_KEY
const databuddy = apiKey
  ? new Databuddy({
      apiKey,
      // The same client ID as the browser script in app/layout.tsx.
      websiteId: "e7c719eb-7a7e-4c0e-9544-e6f7e9d9d4d4",
      source: "backend",
      enableBatching: false,
    })
  : undefined

async function GET(request: Request) {
  const skill = await readFile(skillPath)

  if (databuddy && request.method === "GET") {
    const userAgent = request.headers.get("user-agent") ?? ""
    after(() =>
      databuddy.track({
        name: "skill_install",
        properties: {
          // "curl", "Mozilla", "Wget", ... from e.g. "curl/8.7.1".
          client: userAgent.split("/")[0] || "unknown",
          user_agent: userAgent,
          country: request.headers.get("x-vercel-ip-country") ?? "unknown",
        },
      })
    )
  }

  // No s-maxage, so the CDN never caches it and every download is counted.
  return new Response(skill, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}

export { GET }
