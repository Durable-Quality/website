import Link from "next/link"

import { LogoMark, Wordmark } from "@/components/site/logo"

const columns = [
  {
    heading: "Products",
    links: [
      { label: "Burn", href: "https://burnusage.xyz/" },
      { label: "OmniLens", href: "https://www.omnilens.xyz/" },
      {
        label: "SpecProof",
        href: "https://github.com/Durable-Quality/specproof",
      },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Process", href: "#process" },
      { label: "Journal", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Release notes", href: "#" },
      { label: "Status", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
]

function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl border-x px-6 md:px-10">
        <div className="grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="Durable Quality — home"
            >
              <LogoMark className="size-5" />
              <Wordmark className="text-xs" />
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              An independent software studio building tools with one standard:
              they keep working.
            </p>
          </div>
          {columns.map((column) => (
            <nav
              key={column.heading}
              className="flex flex-col gap-4"
              aria-label={column.heading}
            >
              <h3 className="font-mono text-xs font-medium tracking-[0.25em] uppercase">
                {column.heading}
              </h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      className="text-muted-foreground hover:text-foreground font-mono text-xs tracking-[0.15em] uppercase transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="flex flex-col items-start justify-between gap-4 border-t py-6 sm:flex-row sm:items-center">
          <p className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">
            © MMXXVI Durable Quality
          </p>
          <div
            className="flex items-end gap-1.5"
            aria-hidden="true"
            title="Built on an 8pt grid."
          >
            <span className="bg-muted-foreground size-0.5" />
            <span className="bg-muted-foreground size-1" />
            <span className="bg-muted-foreground size-1.5" />
            <span className="bg-muted-foreground size-2" />
            <span className="bg-muted-foreground size-2.5" />
          </div>
          <p className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">
            Engineered to endure
          </p>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
