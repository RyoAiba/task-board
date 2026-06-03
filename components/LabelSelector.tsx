"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { Label, CATEGORY_DOT_CLASSES } from "../types"

type Props = {
  labels: Label[]
  value: string
  onChange: (labelId: string) => void
}

export function LabelSelector({ labels, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = labels.find(c => c.id === value)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 hover:border-gray-400"
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${CATEGORY_DOT_CLASSES[selected.color]}`} />
            <span className="text-gray-600">{selected.name}</span>
          </span>
        ) : (
          <span className="text-gray-400">ラベルを選択...</span>
        )}
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 w-full bg-white rounded-xl shadow-xl p-2">
          {labels.map(label => (
            <button
              key={label.id}
              type="button"
              onClick={() => { onChange(label.id); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${value === label.id
                ? "bg-brand-100 text-orange-600 font-medium"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${CATEGORY_DOT_CLASSES[label.color]}`} />
              {label.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}