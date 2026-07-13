import {
  Aperture,
  ArrowRight,
  ArrowUpRight,
  Flame,
  ShieldCheck,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogoMark } from "@/components/site/logo"
import { Reveal } from "@/components/site/reveal"
import { SectionLabel } from "@/components/site/section-label"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export default function Page() {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <main className="mx-auto max-w-6xl border-x">
        <Hero />
        <Ticker />
        <Metrics />
        <Products />
        <Process />
        <Voice />
        <Faq />
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
      className={`text-muted-foreground/60 absolute font-mono text-sm select-none ${className}`}
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
        className="bg-blueprint absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black_0%,transparent_85%)]"
      />
      <Crosshair className="top-6 left-6" />
      <Crosshair className="top-6 right-6" />
      <div className="relative grid items-center gap-16 px-6 pt-20 pb-16 md:px-10 md:pt-28 md:pb-24 lg:grid-cols-[1fr_auto]">
        <div className="flex max-w-2xl flex-col items-start gap-8">
          <Reveal>
            <Badge
              variant="outline"
              className="font-mono text-[10px] tracking-[0.25em] uppercase"
            >
              <span
                aria-hidden="true"
                className="bg-foreground size-1.5 rounded-full"
              />
              Independent software studio
            </Badge>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-mono text-4xl leading-[1.08] font-semibold tracking-tight text-balance uppercase md:text-6xl">
              We build software{" "}
              <span className="text-muted-foreground">that lasts.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-muted-foreground max-w-md text-base leading-relaxed">
              Durable Quality builds developer tools with a single standard:
              they keep working. Usage you can see. Workflows you can trust.
              Specs you can prove.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                nativeButton={false}
                render={<a href="#products" />}
              >
                See the products
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<a href="#process" />}
              >
                How we work
              </Button>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <p className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
              Est. MMXXVI&ensp;·&ensp;Three products&ensp;·&ensp;One standard
            </p>
          </Reveal>
        </div>
        <Reveal delay={200} className="hidden lg:block">
          <div className="relative p-12">
            <Crosshair className="top-0 left-0" />
            <Crosshair className="top-0 right-0" />
            <Crosshair className="bottom-0 left-0" />
            <Crosshair className="bottom-0 right-0" />
            <LogoMark className="size-72 xl:size-80" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const products = ["Burn", "OmniLens", "SpecProof"]

function Ticker() {
  return (
    <section className="overflow-hidden border-b py-4" aria-hidden="true">
      <div className="animate-ticker flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex items-center gap-12 pr-12">
            {[0, 1, 2].map((repeat) =>
              products.map((product) => (
                <li
                  key={`${repeat}-${product}`}
                  className="text-muted-foreground flex items-center gap-12"
                >
                  <span className="font-mono text-xs tracking-[0.3em] uppercase">
                    {product}
                  </span>
                  <LogoMark className="size-4 opacity-40" />
                </li>
              ))
            )}
          </ul>
        ))}
      </div>
    </section>
  )
}

const metrics = [
  {
    value: "3",
    label: "Products maintained",
    detail: "Burn, OmniLens, SpecProof. Nothing abandoned.",
  },
  {
    value: "0",
    label: "Trackers shipped",
    detail: "Your data is yours. We don't want it.",
  },
  {
    value: "100%",
    label: "Built in-house",
    detail: "Designed, built, and supported by the same engineers.",
  },
  {
    value: "∞",
    label: "Support horizon",
    detail: "We maintain what we ship. No sunset dates.",
  },
]

function Metrics() {
  return (
    <section id="metrics" className="scroll-mt-16 border-b px-6 py-20 md:px-10">
      <SectionLabel index="02" label="Metrics" className="mb-12" />
      <div className="bg-border grid gap-px border sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <Reveal key={metric.label} delay={i * 60}>
            <div className="bg-background flex h-full flex-col gap-3 p-8">
              <span className="font-mono text-4xl font-semibold tracking-tight">
                {metric.value}
              </span>
              <span className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">
                {metric.label}
              </span>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {metric.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const productCards = [
  {
    icon: Flame,
    index: "01",
    title: "Burn",
    href: "https://burnusage.xyz/",
    description:
      "Your Claude usage, always visible. A macOS menu bar app that tracks sessions and weekly limits in real time — so a rate limit never catches you off guard.",
  },
  {
    icon: Aperture,
    index: "02",
    title: "OmniLens",
    href: "https://www.omnilens.xyz/",
    description:
      "Workflow health, finally visible. An open-source dashboard for GitHub Actions — success rates, runtimes, and stability trends across every repository.",
  },
  {
    icon: ShieldCheck,
    index: "03",
    title: "SpecProof",
    href: "https://github.com/Durable-Quality/specproof",
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
      <SectionLabel index="03" label="Products" className="mb-12" />
      <div className="mb-12 flex max-w-2xl flex-col gap-4">
        <h2 className="font-mono text-2xl font-semibold tracking-tight uppercase md:text-3xl">
          Three tools. One standard.
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          Tools that make the invisible parts of engineering visible — usage
          limits, workflow health, test coverage. Each one does one job and
          keeps doing it. Built in-house, maintained in-house.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {productCards.map((product, i) => (
          <Reveal key={product.title} delay={i * 60}>
            <a
              href={product.href}
              target="_blank"
              rel="noreferrer"
              className="group block h-full"
            >
              <Card className="group-hover:border-input h-full transition-colors duration-200">
                <CardHeader>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="border-border flex size-10 items-center justify-center rounded-md border">
                      <product.icon className="size-4" strokeWidth={2} />
                    </div>
                    <span className="text-muted-foreground font-mono text-[10px] tracking-[0.25em]">
                      {product.index}
                    </span>
                  </div>
                  <CardTitle className="flex items-center gap-2 font-mono text-sm font-medium tracking-[0.15em] uppercase">
                    {product.title}
                    <ArrowUpRight
                      className="text-muted-foreground group-hover:text-foreground size-3.5 opacity-0 transition-all duration-200 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {product.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const steps = [
  {
    index: "01",
    title: "Specify",
    detail:
      "Write down what the thing must do, and agree on it before a line of code exists.",
  },
  {
    index: "02",
    title: "Build",
    detail:
      "Small, deliberate releases on boring technology — chosen on purpose, documented as we go.",
  },
  {
    index: "03",
    title: "Prove",
    detail:
      "Test past the point of comfort. If it hasn't been stressed, it isn't done.",
  },
  {
    index: "04",
    title: "Maintain",
    detail:
      "Shipping is the start. We keep products sharp for years, not quarters.",
  },
]

function Process() {
  return (
    <section
      id="process"
      className="scroll-mt-16 border-b px-6 py-20 md:px-10"
    >
      <SectionLabel index="04" label="Process" className="mb-12" />
      <div className="flex flex-col">
        {steps.map((step, i) => (
          <Reveal key={step.index} delay={i * 60}>
            <a
              href="#contact"
              className="group hover:bg-muted/40 grid items-baseline gap-2 border-b py-8 transition-colors duration-200 md:grid-cols-[96px_1fr_1.5fr_auto] md:gap-8"
            >
              <span className="text-muted-foreground font-mono text-2xl font-medium">
                {step.index}
              </span>
              <h3 className="font-mono text-lg font-medium tracking-[0.1em] uppercase">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.detail}
              </p>
              <ArrowUpRight
                className="text-muted-foreground group-hover:text-foreground hidden size-4 self-center opacity-0 transition-all duration-200 group-hover:opacity-100 md:block"
                aria-hidden="true"
              />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Voice() {
  return (
    <section className="relative border-b px-6 py-24 md:px-10 md:py-32">
      <Crosshair className="bottom-6 left-6" />
      <Crosshair className="right-6 bottom-6" />
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <LogoMark className="size-8" />
        <blockquote className="font-mono text-2xl leading-snug font-medium tracking-tight text-balance uppercase md:text-4xl">
          “We write like engineers. Clear. Direct. Honest. No hype. No fluff.
          Built to last.”
        </blockquote>
        <cite className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase not-italic">
          — Durable Quality, Operating Principles
        </cite>
      </Reveal>
    </section>
  )
}

const faqs = [
  {
    value: "item-1",
    question: "What does Durable Quality make?",
    answer:
      "Three products: Burn, a macOS menu bar app that keeps your Claude usage visible; OmniLens, an open-source dashboard for GitHub Actions workflow health; and SpecProof, which proves your API tests actually cover your OpenAPI spec.",
  },
  {
    value: "item-2",
    question: "Do the products work together?",
    answer:
      "Each one stands alone and works alone. Burn is free, OmniLens is open source. They share a design system and a standard of care — not a bundle requirement.",
  },
  {
    value: "item-3",
    question: "What does “engineered to endure” mean in practice?",
    answer:
      "Boring technology, few dependencies, documented decisions, and a ten-year support horizon on every release.",
  },
  {
    value: "item-4",
    question: "Do you offer support contracts?",
    answer:
      "Every license includes support from the engineers who wrote the code. No tiers, no ticket roulette.",
  },
  {
    value: "item-5",
    question: "Can we request features?",
    answer:
      "Yes — write to us. If it makes the product more durable, it gets built. If it adds noise, it doesn't.",
  },
]

function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 border-b px-6 py-20 md:px-10">
      <SectionLabel index="05" label="FAQ" className="mb-12" />
      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <div className="flex flex-col gap-4">
          <h2 className="font-mono text-2xl font-semibold tracking-tight uppercase md:text-3xl">
            Straight answers.
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            If your question isn't here, write to us. A person answers — the
            same one who can fix the thing.
          </p>
        </div>
        <Accordion multiple={false} className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.value} value={faq.value}>
              <AccordionTrigger className="font-mono text-sm tracking-[0.1em] uppercase">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section
      id="contact"
      className="inverted bg-background text-foreground relative scroll-mt-16 px-6 py-24 md:px-10 md:py-32"
    >
      <Crosshair className="top-6 left-6" />
      <Crosshair className="top-6 right-6" />
      <Crosshair className="bottom-6 left-6" />
      <Crosshair className="right-6 bottom-6" />
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
        <LogoMark className="size-10" />
        <h2 className="font-mono text-3xl font-semibold tracking-tight text-balance uppercase md:text-5xl">
          Build on something solid.
        </h2>
        <p className="text-muted-foreground max-w-md text-base leading-relaxed">
          Release notes and engineering write-ups from the workshop. One email
          a month, at most. Unsubscribe in one click.
        </p>
        <form className="flex w-full max-w-md items-center gap-2">
          <Input
            type="email"
            placeholder="you@company.com"
            aria-label="Email address"
            className="font-mono text-sm"
          />
          <Button type="submit">
            Subscribe
            <ArrowRight data-icon="inline-end" />
          </Button>
        </form>
        <p className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
          No hype&ensp;·&ensp;No fluff&ensp;·&ensp;Built to last
        </p>
      </Reveal>
    </section>
  )
}
