"use client"

import type { ReactNode } from "react"

type Props = {
  children: ReactNode
  open: boolean
  className?: string
}

export function Tooltip({ children, open, className = "" }: Props) {
  if (!open) return null
  return (
    <div
      role="tooltip"
      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg z-10 ${className}`}
    >
      {children}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
    </div>
  )
}