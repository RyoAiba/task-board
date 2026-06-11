"use client"

import { useRef } from "react"
import { Check } from "lucide-react"

import { useClickOutside } from "@/hooks/useClickOutside"

export type SortKey = "label" | "priority" | "status" | "dueDate"
export type SortOrder = "asc" | "desc"

export type SortOption = {
  label: string
  key: SortKey
  order: SortOrder
}

export const SORT_OPTIONS: SortOption[] = [
  { label: "ラベル：昇順", key: "label", order: "asc" },
  { label: "ラベル：降順", key: "label", order: "desc" },
  { label: "優先度：高い順", key: "priority", order: "asc" },
  { label: "優先度：低い順", key: "priority", order: "desc" },
  { label: "未完了を先に", key: "status", order: "asc" },
  { label: "完了済を先に", key: "status", order: "desc" },
  { label: "期限:古い順", key: "dueDate", order: "asc" },
  { label: "期限:新しい順", key: "dueDate", order: "desc" },
]

type Props = {
  currentKey: SortKey | null
  currentOrder: SortOrder
  onSelect: (key: SortKey | null, order: SortOrder) => void
  onClose: () => void
}

export function SortPopup({ currentKey, currentOrder, onSelect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(ref, onClose)

  const handleSelect = (key: SortKey, order: SortOrder) => {
    onSelect(key, order)
    onClose()
  }

  const handleClear = () => {
    onSelect(null, "asc")
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={ref}
        className="absolute right-0 top-full mt-2 z-50 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2"
      >
        <button
          onClick={handleClear}
          className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${currentKey === null ? "text-brand-500 font-semibold" : "text-gray-600"
            }`}
        >
          並び替えなし
          {currentKey === null && <Check size={14} />}
        </button>
        <div className="my-1 border-t border-gray-100" />
        {SORT_OPTIONS.map(({ label, key, order }) => {
          const isActive = currentKey === key && currentOrder === order
          return (
            <button
              key={`${key}_${order}`}
              onClick={() => handleSelect(key, order)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${isActive ? "text-brand-500 font-semibold" : "text-gray-600"
                }`}
            >
              {label}
              {isActive && <Check size={14} />}
            </button>
          )
        })}
      </div>
    </>
  )
}