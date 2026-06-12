"use client"

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react"
import { createPortal } from "react-dom"

type Props = {
  triggerRef: RefObject<HTMLElement | null>
  open: boolean
  onClose: () => void
  children: ReactNode
  centerOnMobile?: boolean
}

export function Popover({
  triggerRef,
  open,
  onClose,
  children,
  centerOnMobile = false,
}: Props) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const isMobile = window.innerWidth < 768

    setPos({
      top: isMobile
        ? rect.top - 4
        : rect.bottom + 4,
      left: rect.left,
    })
  }, [open, triggerRef])

  useEffect(() => {
    if (!open) return

    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current?.contains(e.target as Node)) return
      if (triggerRef.current?.contains(e.target as Node)) return
      onClose()
    }

    document.addEventListener("mousedown", handleClick)

    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [open, onClose, triggerRef])

  if (!open || !pos) return null

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        top: pos.top,
        left:
          centerOnMobile && window.innerWidth < 768
            ? window.innerWidth / 2
            : pos.left,
        zIndex: 60,
        transform:
          centerOnMobile && window.innerWidth < 768
            ? "translate(-50%, -100%)"
            : window.innerWidth < 768
              ? "translateY(-100%)"
              : undefined,
      }}
    >
      {children}
    </div>,
    document.body
  )
}