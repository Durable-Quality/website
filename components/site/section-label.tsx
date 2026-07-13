import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

function SectionLabel({
  index,
  label,
  className,
}: {
  index: string
  label: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-6", className)}>
      <span className="text-muted-foreground font-mono text-xs font-medium tracking-[0.25em] uppercase">
        {index}.&nbsp;&nbsp;{label}
      </span>
      <Separator className="flex-1" />
    </div>
  )
}

export { SectionLabel }
