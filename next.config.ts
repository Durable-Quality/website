import type { NextConfig } from "next"

import durableTesting from "./durable-testing/site.config.json"

// Durable Testing is a static site that durable-testing/build.mjs writes into
// public/durable-testing (see durable-testing/README.md). These rules give its pages clean
// URLs, and serve each page's Markdown twin to agents that request the page
// with `Accept: text/markdown`.
const testingPage = "/durable-testing/:page([a-z0-9-]+)"
const wantsMarkdown = [
  { type: "header" as const, key: "accept", value: ".*text/markdown.*" },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "substackcdn.com",
        pathname: "/image/fetch/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/durable-testing/index",
        destination: "/durable-testing",
        permanent: true,
      },
      {
        source: "/durable-testing/index.html",
        destination: "/durable-testing",
        permanent: true,
      },
      {
        source: `${testingPage}.html`,
        destination: "/durable-testing/:page",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return {
      // Checked before public/, so a page URL can return its Markdown twin.
      beforeFiles: [
        {
          source: "/durable-testing",
          has: wantsMarkdown,
          destination: "/durable-testing/index.md",
        },
        {
          source: testingPage,
          has: wantsMarkdown,
          destination: "/durable-testing/:page.md",
        },
      ],
      afterFiles: [
        {
          source: "/durable-testing",
          destination: "/durable-testing/index.html",
        },
        { source: testingPage, destination: "/durable-testing/:page.html" },
      ],
      fallback: [],
    }
  },
  async headers() {
    return [
      {
        source: "/durable-testing/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
      {
        source: "/durable-testing",
        headers: [{ key: "Vary", value: "Accept" }],
      },
      { source: testingPage, headers: [{ key: "Vary", value: "Accept" }] },
      // Point search engines from each Markdown twin to its HTML page.
      {
        source: `${testingPage}.md`,
        headers: [
          {
            key: "Link",
            value: `<${durableTesting.baseUrl}/:page>; rel="canonical"`,
          },
        ],
      },
      {
        source: "/durable-testing/index.md",
        headers: [
          {
            key: "Link",
            value: `<${durableTesting.baseUrl}>; rel="canonical"`,
          },
        ],
      },
    ]
  },
}

export default nextConfig
