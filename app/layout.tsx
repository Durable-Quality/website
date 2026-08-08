import type { Metadata } from "next"
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        "dark scroll-smooth antialiased",
        plexSans.variable,
        plexMono.variable,
        "font-sans"
      )}
    >
      <body>{children}</body>
    </html>
  )
}
