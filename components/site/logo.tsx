import Image from "next/image"

import { cn } from "@/lib/utils"

/*
  The mark is the supplied artwork, public/icon.png (white on black), shown
  exactly as delivered. Never redraw it or tint it with theme colors: it must
  look the same in light and dark, here and on Durable Testing, which ships a
  copy of the same file (see durable-testing/build.mjs).

  The source has wide black padding around the mark, so at small sizes the
  thin strokes came out hairline. `scale-140` crops into that padding (the
  background is solid black, so nothing visible is lost) until the mark
  nearly fills the tile. Durable Testing applies the same crop.
*/
function LogoMark({
  className,
  sizes = "24px",
  loading,
}: {
  className?: string
  /** Rendered width, for next/image's srcset; pass the largest breakpoint. */
  sizes?: string
  /** "eager" for any instance above the fold; the hero one is the LCP. */
  loading?: "eager" | "lazy"
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative block size-6 shrink-0 overflow-hidden",
        className
      )}
    >
      <Image
        src="/icon.png"
        alt=""
        fill
        sizes={sizes}
        loading={loading}
        className="scale-140"
      />
    </span>
  )
}

function Wordmark({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-base font-semibold tracking-[-0.01em]", className)}
      {...props}
    >
      Durable&nbsp;Quality
    </span>
  )
}

export { LogoMark, Wordmark }
