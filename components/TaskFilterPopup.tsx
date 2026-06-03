"use client"

import { useState, useEffect, useRef } from "react"
import { Label, Priority } from "../types"

type Status = "incomplete" | "completed"

const STATUS_OPTIONS: { label: string; value: Status }[] = [
  { label: "未完了", value: "incomplete" },
  { label: "完了済", value: "completed" },
]

const PRIORITY_OPTIONS: { label: string; value: Priority }[] = [
  { label: "高", value: "high" },
  { label: "中", value: "medium" },
  { label: "低", value: "low" },
]

type Props = {
  labels: Label[]
  selectedCategories: string[]
  selectedPriorities: Priority[]
  selectedStatuses: Status[]
  onApply: (labels: string[], priorities: Priority[], statuses: Status[]) => void
  onClose: () => void
}

export function TaskFilterPopup({
  labels,
  selectedCategories,
  selectedPriorities,
  selectedStatuses,
  onApply,
  onClose,
}: Props) {
  const [pendingCategories, setPendingCategories] = useState(selectedCategories)
  const [pendingPriorities, setPendingPriorities] = useState(selectedPriorities)
  const [pendingStatuses, setPendingStatuses] = useState(selectedStatuses)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  const toggle = <T extends string>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    value: T
  ) => {
    setter(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  const handleReset = () => {
    setPendingCategories([])
    setPendingPriorities([])
    setPendingStatuses([])
  }

  const handleApply = () => {
    onApply(pendingCategories, pendingPriorities, pendingStatuses)
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={ref}
        className="absolute right-0 top-full mt-2 z-50 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-4"
      >
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-2">ラベル</p>
          <div className="flex flex-wrap gap-2">
            {labels.map(label => (
              <button
                key={label.id}
                onClick={() => toggle(setPendingCategories, label.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${pendingCategories.includes(label.id)
                  ? "bg-brand-100 border border-brand-500 text-brand-500"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
              >
                {label.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-2">優先度</p>
          <div className="flex gap-2">
            {PRIORITY_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => toggle(setPendingPriorities, value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${pendingPriorities.includes(value)
                  ? "bg-brand-100 border border-brand-500 text-brand-500"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-2">ステータス</p>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => toggle(setPendingStatuses, value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${pendingStatuses.includes(value)
                  ? "bg-brand-100 border border-brand-500 text-brand-500"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            リセット
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            適用する
          </button>
        </div>
      </div>
    </>
  )
}