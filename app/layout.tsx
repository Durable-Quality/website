import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"

import "./globals.css"
import { cn } from "@/lib/utils"

// The same type as Durable Testing. Only the weights the site actually
// renders: sans at 400 (body), 500 (shadcn Button/Card), 600 (wordmark) and
// 700 (headings), mono at 400 (labels) and 500 (card titles). Every extra
// weight is another font file to fetch.
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  // Required so relative metadata URLs (the openGraph image below) resolve to
  // absolute ones; without it Next falls back to localhost and warns.
  metadataBase: new URL("https://durableqa.xyz"),
  title: "Durable Quality",
  description:
    "An independent software studio building Burn, OmniLens, and SpecProof. Quality assured software, built through a different lens.",
  openGraph: {
    title: "Durable Quality",
    images: ["/icon.png"],
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark antialiased",
        geist.variable,
        geistMono.variable,
        "font-sans"
      )}
    >
      <body>{children}</body>
      <Script
        src="https://cdn.databuddy.cc/databuddy.js"
        data-client-id="e7c719eb-7a7e-4c0e-9544-e6f7e9d9d4d4"
        data-track-web-vitals="true"
        crossOrigin="anonymous"
        async
      />
    </html>
  )
}
