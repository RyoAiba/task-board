"use client"

import { useRef, useState } from "react"
import { Tag } from "lucide-react"

import { type Label } from "@/types"
import { Chip } from "@/components/shared/Chip"
import { Popover } from "@/components/shared/Popover"

type Props = {
  labels: Label[]
  value: string
  onChange: (labelId: string) => void
}

export function LabelChip({ labels, value, onChange }: Props) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const selected = labels.find(l => l.id === value)

  return (
    <>
      <div ref={triggerRef} className="inline-block">
        <Chip
          icon={Tag}
          iconClassName={selected ? "text-gray-600" : "text-gray-400"}
          label={selected ? selected.name : "ラベル"}
          labelClassName={selected ? "text-gray-600" : "text-gray-400"}
          onClick={() => setOpen(prev => !prev)}
        />
      </div>

      <Popover triggerRef={triggerRef} open={open} onClose={() => setOpen(false)}>
        <div className="bg-white rounded-lg shadow-modal p-1 min-w-40">
          <button
            type="button"
            onClick={() => { onChange(""); setOpen(false) }}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm text-left transition-colors ${!value ? "bg-gray-50" : "hover:bg-gray-50"}`}
          >
            <Tag size={14} className="text-gray-300" />
            <span className="text-gray-600">なし</span>
          </button>
          {labels.map(label => (
            <button
              key={label.id}
              type="button"
              onClick={() => { onChange(label.id); setOpen(false) }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm text-left transition-colors ${value === label.id ? "bg-gray-50" : "hover:bg-gray-50"}`}
            >
              <Tag size={14} className="text-gray-600" />
              <span className={`text-gray-600 ${value === label.id ? "font-medium" : ""}`}>{label.name}</span>
            </button>
          ))}
        </div>
      </Popover>
    </>
  )
}