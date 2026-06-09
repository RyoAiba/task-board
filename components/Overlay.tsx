"use client"

import type { ReactNode } from "react"

type Props = {
  children: ReactNode
  dim?: boolean
  onBackdropClick?: () => void
  level?: "base" | "above"
}

const LEVEL_Z = {
  base: "z-40",
  above: "z-50",
} as const

export function Overlay({ children, dim = false, onBackdropClick, level = "base" }: Props) {
  return (
    <div
      className={`fixed inset-0 ${LEVEL_Z[level]} flex items-center justify-center ${dim ? "bg-black/50" : ""}`}
      onClick={onBackdropClick}
    >
      {children}
    </div>
  )
}