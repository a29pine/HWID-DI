import type * as React from "react"

import { cn } from "@/lib/utils"

interface GaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max: number
  segments?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  label?: string
  unit?: string
}

export function Gauge({
  value,
  max,
  segments = 10,
  size = "md",
  showValue = true,
  label,
  unit,
  className,
  ...props
}: GaugeProps) {
  const percentage = (value / max) * 100
  const segmentPercentage = 100 / segments

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)} {...props}>
      <div className="relative flex items-center justify-center">
        <svg
          className={cn(
            "transform -rotate-90",
            size === "sm" && "h-24 w-24",
            size === "md" && "h-32 w-32",
            size === "lg" && "h-40 w-40",
          )}
          viewBox="0 0 100 100"
        >
          {Array.from({ length: segments }).map((_, i) => {
            const segmentValue = segmentPercentage * (i + 1)
            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r="40"
                strokeDasharray={`${segmentPercentage} ${100 - segmentPercentage}`}
                strokeDashoffset={i * -segmentPercentage}
                stroke={percentage >= segmentValue ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                strokeWidth="8"
                fill="none"
              />
            )
          })}
        </svg>
        {showValue && (
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl font-bold">{value.toFixed(1)}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
        )}
      </div>
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  )
}

