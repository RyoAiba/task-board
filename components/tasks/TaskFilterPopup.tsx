"use client"

import { useRef, useState } from "react"

import { useClickOutside } from "@/hooks/useClickOutside"
import {
  type DateFilter,
  DATE_FILTER_LABELS,
  type Label,
  type Priority,
  type Status,
  STATUS_LABELS,
} from "@/types"
import { FilterChip } from "./FilterChip"

const DATE_FILTER_OPTIONS: { label: string; value: DateFilter }[] = [
  { label: DATE_FILTER_LABELS.overdue, value: "overdue" },
  { label: DATE_FILTER_LABELS.today, value: "today" },
  { label: DATE_FILTER_LABELS.thisWeek, value: "thisWeek" },
  { label: DATE_FILTER_LABELS.noDueDate, value: "noDueDate" },
]

const STATUS_OPTIONS: { label: string; value: Status }[] = [
  { label: STATUS_LABELS.incomplete, value: "incomplete" },
  { label: STATUS_LABELS.completed, value: "completed" },
]

const PRIORITY_OPTIONS: { label: string; value: Priority }[] = [
  { label: "高", value: "high" },
  { label: "中", value: "medium" },
  { label: "低", value: "low" },
]

type Props = {
  labels: Label[]
  selectedLabels: string[]
  selectedPriorities: Priority[]
  selectedStatuses: Status[]
  selectedDateFilters: DateFilter[]
  onApply: (
    labelIds: string[],
    priorities: Priority[],
    statuses: Status[],
    dateFilters: DateFilter[],
  ) => void
  onClose: () => void
}

export function TaskFilterPopup({
  labels,
  selectedLabels,
  selectedPriorities,
  selectedStatuses,
  selectedDateFilters,
  onApply,
  onClose,
}: Props) {
  const [pendingLabels, setPendingLabels] = useState(selectedLabels)
  const [pendingPriorities, setPendingPriorities] = useState(selectedPriorities)
  const [pendingStatuses, setPendingStatuses] = useState(selectedStatuses)
  const [pendingDateFilters, setPendingDateFilters] = useState(selectedDateFilters)
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(ref, onClose)

  const toggle = <T extends string>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    value: T,
  ) => {
    setter(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  const handleReset = () => {
    setPendingLabels([])
    setPendingPriorities([])
    setPendingStatuses([])
    setPendingDateFilters([])
  }

  const handleApply = () => {
    onApply(pendingLabels, pendingPriorities, pendingStatuses, pendingDateFilters)
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={ref}
        className="absolute right-0 top-full mt-2 z-50 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-4"
      >
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-2 cursor-default">期限</p>
          <div className="flex flex-wrap gap-2">
            {DATE_FILTER_OPTIONS.map(({ label, value }) => (
              <FilterChip
                key={value}
                selected={pendingDateFilters.includes(value)}
                onClick={() => toggle(setPendingDateFilters, value)}
              >
                {label}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-2 cursor-default">ラベル</p>
          <div className="flex flex-wrap gap-2">
            {labels.map(label => (
              <FilterChip
                key={label.id}
                selected={pendingLabels.includes(label.id)}
                onClick={() => toggle(setPendingLabels, label.id)}
              >
                {label.name}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-2 cursor-default">優先度</p>
          <div className="flex gap-2">
            {PRIORITY_OPTIONS.map(({ label, value }) => (
              <FilterChip
                key={value}
                selected={pendingPriorities.includes(value)}
                onClick={() => toggle(setPendingPriorities, value)}
              >
                {label}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-2 cursor-default">ステータス</p>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map(({ label, value }) => (
              <FilterChip
                key={value}
                selected={pendingStatuses.includes(value)}
                onClick={() => toggle(setPendingStatuses, value)}
              >
                {label}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
          >
            リセット
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            適用する
          </button>
        </div>
      </div>
    </>
  )
}