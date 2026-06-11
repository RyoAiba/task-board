"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { CalendarDays } from "lucide-react"

import { Chip } from "../Chip"
import { DatePickerModal } from "./DatePickerModal"

type Props = {
  value: string
  onChange: (value: string) => void
}

export function DueDateChip({ value, onChange }: Props) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<React.CSSProperties | null>(null)

  const formatted = value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("ja-JP", {
      month: "numeric",
      day: "numeric",
    })
    : "期限"

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    const isMobile = window.innerWidth < 768

    setPosition(
      isMobile
        ? {
          position: "fixed",
          top: rect.top - 4,
          left: window.innerWidth / 2,
          transform: "translate(-50%, -100%)",
          zIndex: 60,
        }
        : {
          position: "fixed",
          left: rect.right + 8,
          top: rect.top + rect.height / 2,
          transform: "translateY(-50%)",
          zIndex: 60,
        },
    )
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current?.contains(e.target as Node)) return
      if (triggerRef.current?.contains(e.target as Node)) return

      setOpen(false)
    }

    document.addEventListener("mousedown", handleClick)

    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [open])

  return (
    <>
      <div ref={triggerRef} className="inline-block">
        <Chip
          icon={CalendarDays}
          iconClassName={value ? "text-gray-600" : "text-gray-400"}
          label={formatted}
          labelClassName={value ? "text-gray-600" : "text-gray-400"}
          onClick={() => setOpen(prev => !prev)}
          className="min-w-22"
        />
      </div>

      {open && position &&
        createPortal(
          <div
            ref={popoverRef}
            style={position}
          >
            <DatePickerModal
              selectedDate={value}
              onSelect={date => {
                onChange(date)
                setOpen(false)
              }}
              onClose={() => setOpen(false)}
            />
          </div>,
          document.body,
        )}
    </>
  )
}