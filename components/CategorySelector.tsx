"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { Category, CATEGORY_DOT_CLASSES } from "../types"

type Props = {
  categories: Category[]
  value: string
  onChange: (categoryId: string) => void
}

export function CategorySelector({ categories, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = categories.find(c => c.id === value)

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
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary hover:border-gray-400"
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${CATEGORY_DOT_CLASSES[selected.color]}`} />
            <span className="text-gray-600">{selected.name}</span>
          </span>
        ) : (
          <span className="text-gray-400">カテゴリを選択...</span>
        )}
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 w-full bg-white rounded-xl shadow-xl p-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => { onChange(cat.id); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${value === cat.id
                ? "bg-orange-50 text-orange-600 font-medium"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${CATEGORY_DOT_CLASSES[cat.color]}`} />
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}