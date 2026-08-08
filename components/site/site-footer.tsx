function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl border-x px-6 md:px-10">
        <div className="py-6">
          <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground">
            © {new Date().getFullYear()} Durable Quality
          </p>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
