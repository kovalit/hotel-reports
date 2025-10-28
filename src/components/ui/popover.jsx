"use client"

import { forwardRef } from "react"

export const Popover = forwardRef(({ children }, ref) => {
  return (
    <div ref={ref} className="relative inline-block">
      {children}
    </div>
  )
})

Popover.displayName = "Popover"

export function PopoverTrigger({ children, asChild, onClick }) {
  if (asChild) {
    return <div onClick={onClick}>{children}</div>
  }
  return <button onClick={onClick}>{children}</button>
}

export function PopoverContent({ children, align = "center", className = "" }) {
  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div
      className={`absolute top-full mt-2 z-50 rounded-md border border-border bg-popover p-0 text-popover-foreground shadow-md outline-none ${alignmentClasses[align]} ${className}`}
    >
      {children}
    </div>
  )
}
