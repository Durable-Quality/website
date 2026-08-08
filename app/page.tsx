import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LogoMark } from "@/components/site/logo"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export default function Page() {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <main className="mx-auto max-w-6xl border-x">
        <Hero />
        <Ticker />
        <Products />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  )
}

function Crosshair({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute font-mono text-sm text-muted-foreground/60 select-none",
        className
      )}
    >
      +
    </span>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-blueprint [mask-image:linear-gradient(to_bottom,black_0%,transparent_85%)] opacity-50"
      />
      <Crosshair className="top-6 left-6" />
      <Crosshair className="top-6 right-6" />
      <div className="relative grid items-center gap-10 px-6 pt-20 pb-16 md:px-10 md:pt-28 md:pb-24 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div className="flex max-w-2xl flex-col items-start gap-8">
          <h1 className="font-mono text-4xl leading-[1.08] font-semibold tracking-tight text-balance uppercase md:text-6xl">
            Quality assured{" "}
            <span className="text-muted-foreground">software.</span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Most software is built, then checked. We build through a different
            lens where quality is the starting principle, not a gate at the end.
          </p>
        </div>
        {/* Centered above the headline on small screens, beside it from `lg`
            up; `w-fit` keeps the crosshairs hugging the mark instead of
            stretching to the full column width on mobile. */}
        <div className="relative order-first mx-auto w-fit p-8 lg:order-none lg:mx-0 lg:p-12">
          <Crosshair className="top-0 left-0" />
          <Crosshair className="top-0 right-0" />
          <Crosshair className="bottom-0 left-0" />
          <Crosshair className="right-0 bottom-0" />
          <LogoMark className="size-40 md:size-56 lg:size-72 xl:size-80" />
        </div>
      </div>
    </section>
  )
}

// Logos are the same opaque square PNGs the product cards use, with the
// same `zoom` crops to even out the padding baked into the source art.
const products = [
  { name: "Burn", logo: { src: "/burn.png", zoom: "" } },
  { name: "OmniLens", logo: { src: "/omnilens.png", zoom: "scale-140" } },
  { name: "SpecProof", logo: { src: "/SpecProof.png", zoom: "scale-165" } },
]

function Ticker() {
  return (
    <section className="overflow-hidden border-b py-4" aria-hidden="true">
      <div className="flex w-max animate-ticker">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex items-center gap-12 pr-12">
            {[0, 1, 2].map((repeat) =>
              products.map((product) => (
                <li
                  key={`${repeat}-${product.name}`}
                  // Tight gap inside the pair; the `gap-12` on the list is
                  // what separates one product from the next.
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <span className="size-5 overflow-hidden rounded-sm border">
                    {/* Above the fold: eager so the tiles are painted with the
                        first frame instead of popping in after it. */}
                    <Image
                      src={product.logo.src}
                      alt=""
                      width={40}
                      height={40}
                      priority
                      className={cn(
                        "size-full object-cover",
                        product.logo.zoom
                      )}
                    />
                  </span>
                  <span className="font-mono text-base">{product.name}</span>
                </li>
              ))
            )}
          </ul>
        ))}
      </div>
    </section>
  )
}

// Each product's logo is an opaque square PNG that carries its own
// background, so it fills the tile rather than sitting on a tinted box.
// `zoom` crops the dead padding baked into the source art, so all three
// marks read at roughly the same visual weight.
const productCards = [
  {
    logo: { src: "/burn.png", zoom: "" },
    title: "Burn",
    href: "https://burnusage.xyz/",
    // A macOS download rather than something you can open in the browser, so
    // it takes a "Notify Me" badge where the live products say "Try Now".
    badge: "Notify Me",
    // Burn's brand accent: burnt clay #d97757
    accent: {
      box: "border-[#d97757]/40",
      card: "group-hover:ring-[#d97757]/60",
      arrow: "text-[#d97757]",
      badge: "border-[#d97757]/40 text-[#d97757]",
    },
    description:
      "Your Claude usage, always visible. A macOS menu bar app that tracks sessions and weekly limits in real time, so a rate limit never catches you off guard.",
  },
  {
    logo: { src: "/omnilens.png", zoom: "scale-140" },
    title: "OmniLens",
    href: "https://www.omnilens.xyz/",
    badge: "Try Now",
    // Neutral tile border; accent is blue #4d9fff
    accent: {
      box: "border-border",
      card: "group-hover:ring-[#4d9fff]/60",
      arrow: "text-[#4d9fff]",
      badge: "border-[#4d9fff]/40 text-[#4d9fff]",
    },
    description:
      "Workflow health, finally visible. An open-source dashboard for GitHub Actions: success rates, runtimes, and stability trends across every repository.",
  },
  {
    logo: { src: "/SpecProof.png", zoom: "scale-165" },
    title: "SpecProof",
    href: "https://specproofoss.vercel.app/",
    badge: "Try Now",
    // Neutral tile border; accent is SpecProof's verified-green #00e5a0
    accent: {
      box: "border-border",
      card: "group-hover:ring-[#00e5a0]/60",
      arrow: "text-[#00e5a0]",
      badge: "border-[#00e5a0]/40 text-[#00e5a0]",
    },
    description:
      "Proof that your tests cover your spec. Audits every OpenAPI operation against real test assertions, and fails the build when coverage drifts.",
  },
]

function Products() {
  return (
    <section
      id="products"
      className="scroll-mt-16 border-b px-6 py-20 md:px-10"
    >
      <div className="mb-12 flex flex-col gap-4">
        <h2 className="font-mono text-3xl font-semibold tracking-tight uppercase md:text-4xl">
          Three tools.
          <br className="md:hidden" /> One standard.
        </h2>
        <p className="text-base leading-relaxed text-pretty text-muted-foreground">
          Tools that make the invisible parts of engineering visible. Take
          control of your usage limits, workflow health and test coverage.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {productCards.map((product) => {
          const card = (
            <Card
              className={cn(
                "h-full transition-shadow duration-200",
                product.accent?.card ?? "group-hover:ring-foreground/25"
              )}
            >
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={cn(
                      "size-12 overflow-hidden rounded-md border",
                      product.accent ? product.accent.box : "border-border"
                    )}
                  >
                    <Image
                      src={product.logo.src}
                      alt=""
                      width={96}
                      height={96}
                      className={cn(
                        "size-full object-cover",
                        product.logo.zoom
                      )}
                    />
                  </div>
                  {product.badge && (
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 font-mono text-[10px] leading-none font-medium tracking-[0.15em] uppercase",
                        product.accent?.badge ??
                          "border-border text-muted-foreground"
                      )}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
                <CardTitle className="flex items-center gap-2 font-mono text-sm font-medium tracking-[0.15em]">
                  {product.title}
                  {product.href && (
                    <>
                      {/* The arrow is the sighted cue that the card opens a new
                          tab; this is the same information for screen readers,
                          folded into the link's accessible name. */}
                      <span className="sr-only">(opens in a new tab)</span>
                      <ArrowUpRight
                        className={cn(
                          "size-3.5",
                          product.accent?.arrow ?? "text-foreground"
                        )}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  {product.description}
                </CardDescription>
              </CardHeader>
            </Card>
          )
          return product.href ? (
            <a
              key={product.title}
              href={product.href}
              target="_blank"
              rel="noreferrer"
              className="group block h-full"
            >
              {card}
            </a>
          ) : (
            <div key={product.title} className="group h-full">
              {card}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-16 px-6 py-24 md:px-10 md:py-32"
    >
      <Crosshair className="top-6 left-6" />
      <Crosshair className="top-6 right-6" />
      <Crosshair className="bottom-6 left-6" />
      <Crosshair className="right-6 bottom-6" />
      {/* No `max-w-2xl` here: it wrapped the headline at every width. The logo
          and buttons are centered regardless. */}
      <div className="mx-auto flex flex-col items-center gap-8 text-center">
        <LogoMark className="size-20 md:size-24" />
        {/* The heading is monospace, so its width is a fixed multiple of the
            font size (~12.6em for these 22 characters). Scaling with `vw`
            therefore keeps it on one line at a steady share of the section's
            inner width, and the `clamp` ceiling stops it growing once `main`
            hits `max-w-6xl`. It still wraps to two balanced lines on phones,
            where a single line would be unreadably small. */}
        <h2 className="font-mono text-[clamp(1.875rem,5vw,3.75rem)] font-semibold tracking-tight text-balance uppercase">
          Build with confidence.
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={
              <a
                href="https://x.com/DurableQA"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            Follow us on X<span className="sr-only">(opens in a new tab)</span>
            <ArrowUpRight data-icon="inline-end" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={
              <a
                href="https://x.com/chriszeuch"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            Message the Founder
            <span className="sr-only">(opens in a new tab)</span>
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </section>
  )
}
