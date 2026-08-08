import { cn } from "@/lib/utils"

/*
  The mark: a double-line infinity tube with a woven crossing, pierced by
  vertical dashes. Drawn with a luminance mask so the hollow centerline and
  weave gaps stay transparent on any background.
*/
const LOOP =
  "M48 48C39 24 12 24 12 48C12 72 39 72 48 48C57 24 84 24 84 48C84 72 57 72 48 48Z"
// Central portion of the lower-left → upper-right strand (the "over" strand
// at the crossing), split out of LOOP via de Casteljau at t = 0.75 / 0.25.
const OVER =
  "M38.58 61.5C42.38 58.5 45.75 54 48 48C50.25 42 53.63 37.5 57.42 34.5"

function LogoMark({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      className={cn("size-6", className)}
      {...props}
    >
      <mask
        id="dq-mark-mask"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="96"
        height="96"
      >
        <rect width="96" height="96" fill="black" />
        {/* full tube silhouette */}
        <path d={LOOP} stroke="white" strokeWidth="8" />
        {/* hollow centerline */}
        <path d={LOOP} stroke="black" strokeWidth="2.8" />
        {/* weave: cut everything around the over strand, then redraw it */}
        <path d={OVER} stroke="black" strokeWidth="14" />
        <path d={OVER} stroke="white" strokeWidth="8" />
        <path d={OVER} stroke="black" strokeWidth="2.8" />
      </mask>
      <rect
        width="96"
        height="96"
        fill="currentColor"
        mask="url(#dq-mark-mask)"
      />
      <path
        d="M48 24.7V33.2"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M48 62.8V71.3"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Wordmark({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-mono text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      Durable&nbsp;Quality
    </span>
  )
}

export { LogoMark, Wordmark }
