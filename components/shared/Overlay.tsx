"use client"

import { useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

type Props = {
  children: ReactNode
  dim?: boolean
  onBackdropClick?: () => void
  level?: "base" | "above"
  bottomSheetOnMobile?: boolean
}

const LEVEL_Z = { base: "z-40", above: "z-50" }

export function Overlay({
  children,
  dim = false,
  onBackdropClick,
  level = "base",
  bottomSheetOnMobile = false,
}: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const alignment = bottomSheetOnMobile ? "items-end md:items-center" : "items-center"

  return createPortal(
    <div
      className={`fixed inset-0 ${LEVEL_Z[level]} flex ${alignment} justify-center ${dim ? "bg-black/50" : ""}`}
      onClick={onBackdropClick ? (e) => {
        if (e.target === e.currentTarget) onBackdropClick()
      } : undefined}
    >
      {children}
    </div>,
    document.body
  )
}