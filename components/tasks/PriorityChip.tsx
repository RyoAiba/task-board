"use client"

import { useRef, useState } from "react"
import { Flame } from "lucide-react"

import { type Priority, PRIORITY_LABELS, PRIORITY_TEXT } from "@/types"
import { Chip } from "@/components/shared/Chip"
import { Popover } from "@/components/shared/Popover"

type Props = {
  value: Priority | undefined
  onChange: (priority: Priority | undefined) => void
}

const OPTIONS: { value: Priority | undefined; label: string }[] = [
  { value: undefined, label: "なし" },
  { value: "high", label: PRIORITY_LABELS.high },
  { value: "medium", label: PRIORITY_LABELS.medium },
  { value: "low", label: PRIORITY_LABELS.low },
]

export function PriorityChip({ value, onChange }: Props) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <div ref={triggerRef} className="inline-block">
        <Chip
          icon={Flame}
          iconClassName={value ? PRIORITY_TEXT[value] : "text-gray-400"}
          label={value ? PRIORITY_LABELS[value] : "優先度"}
          labelClassName={value ? "text-gray-600" : "text-gray-400"}
          onClick={() => setOpen(prev => !prev)}
          className="min-w-22"
        />
      </div>

      <Popover triggerRef={triggerRef} open={open} onClose={() => setOpen(false)}>
        <div className="bg-white rounded-lg shadow-modal p-1 min-w-32">
          {OPTIONS.map(opt => {
            const selected = value === opt.value
            return (
              <button
                key={opt.value ?? "none"}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm text-left transition-colors ${selected ? "bg-gray-50" : "hover:bg-gray-50"}`}
              >
                <Flame size={14} className={opt.value ? PRIORITY_TEXT[opt.value] : "text-gray-300"} />
                <span className={`text-gray-600 ${selected ? "font-medium" : ""}`}>{opt.label}</span>
              </button>
            )
          })}
        </div>
      </Popover>
    </>
  )
}