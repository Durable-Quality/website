import type { MetadataRoute } from "next"

import durableTesting from "@/durable-testing/site.config.json"

// Search engines, AI crawlers, and AI agents are all welcome. The AI crawlers
// are named so the invitation is explicit to each of them, not just implied by
// the wildcard. Durable Testing at /durable-testing is written for exactly these readers.
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
]

function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiCrawlers, allow: "/" },
    ],
    sitemap: `${durableTesting.baseUrl}/sitemap.xml`,
  }
}

export default robots
