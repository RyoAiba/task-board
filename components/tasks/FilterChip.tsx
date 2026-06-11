"use client"

import { X } from "lucide-react"

type FilterChipProps = {
  selected: boolean
  onClick: () => void
  removable?: boolean
  children: React.ReactNode
}

export function FilterChip({ selected, onClick, removable = false, children }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${selected
          ? "bg-brand-100 border border-brand-500 text-brand-500 hover:bg-brand-150"
          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
        }`}
    >
      {children}
      {removable && <X size={11} />}
    </button>
  )
}