function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl border-x px-6 md:px-10">
        <div className="flex items-center justify-between gap-4 py-6 font-mono text-sm">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Durable Quality
          </p>
          {/* A plain anchor, not next/link: /durable-testing is the static Durable Testing guide
              in public/durable-testing, not a route of this app. */}
          <a
            href="/durable-testing"
            className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Durable Testing
          </a>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
