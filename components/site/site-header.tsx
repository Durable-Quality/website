import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LogoMark, Wordmark } from "@/components/site/logo"

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between border-x px-6 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Durable Quality home"
        >
          <LogoMark className="size-5" />
          <Wordmark className="text-xs" />
        </Link>
        <Button size="sm" nativeButton={false} render={<a href="#contact" />}>
          Get in touch
          <ArrowUpRight data-icon="inline-end" />
        </Button>
      </div>
    </header>
  )
}

export { SiteHeader }
