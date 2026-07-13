import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { LogoMark, Wordmark } from "@/components/site/logo"

const navItems = [
  { label: "Products", href: "#products" },
  { label: "Metrics", href: "#metrics" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
]

function SiteHeader() {
  return (
    <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between border-x px-6 md:px-10">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Durable Quality — home"
        >
          <LogoMark className="size-5" />
          <Wordmark className="text-xs" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground font-mono text-xs tracking-[0.2em] uppercase transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Button size="sm" nativeButton={false} render={<a href="#contact" />}>
          Get in touch
          <ArrowUpRight data-icon="inline-end" />
        </Button>
      </div>
    </header>
  )
}

export { SiteHeader }
