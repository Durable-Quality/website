import type { Metadata } from "next"
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"

// Only the weights the site actually renders: sans at 400 (body) and 500
// (shadcn Button/Card), mono at 400 (labels), 500 (card titles, wordmark), and
// 600 (headings). Every extra weight is another font file to fetch.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Durable Quality",
  description:
    "An independent software studio building Burn, OmniLens, and SpecProof. Quality assured software, built through a different lens.",
  openGraph: {
    title: "Durable Quality",
    images: ["/icon.png"],
  },
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
        plexSans.variable,
        plexMono.variable,
        "font-sans"
      )}
    >
      <body>{children}</body>
    </html>
  )
}
