import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Wordmark } from "@/components/site/logo"

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between border-x px-6 md:px-10">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Durable Quality home"
        >
          <Wordmark />
        </Link>
        <div className="flex items-center gap-3">
          {/* A plain anchor, not next/link: /durable-testing is the static Durable Testing
              guide in public/durable-testing, not a route of this app. Hidden on phones,
              where the header has no room; the footer link and the landing
              section still reach it there. */}
          <Button
            size="sm"
            variant="outline"
            nativeButton={false}
            render={<a href="/durable-testing" />}
            className="hidden sm:inline-flex"
          >
            Durable Testing
          </Button>
          <Button size="sm" nativeButton={false} render={<a href="#contact" />}>
            Get in touch
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
