"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowUpDown, ChevronDown, Search, SlidersHorizontal } from "lucide-react"

import { FilterChip } from "@/components/shared/FilterChip"
import { SortPopup } from "@/components/tasks/SortPopup"
import { TaskFilterPopup } from "@/components/tasks/TaskFilterPopup"
import { type TaskFiltering } from "@/hooks/useTaskFiltering"
import {
  type DateFilter,
  type Label,
  type Priority,
  type Status,
  DATE_FILTER_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "@/types"
import { truncate } from "@/utils/string"

type Props = {
  filtering: TaskFiltering
  labels: Label[]
  onResetPage: () => void
}

export function TaskListHeader({ filtering, labels, onResetPage }: Props) {
  const searchParams = useSearchParams()
  const [filterPopupOpen, setFilterPopupOpen] = useState(false)
  const [sortPopupOpen, setSortPopupOpen] = useState(false)
  const [searchOpenSP, setSearchOpenSP] = useState(true)

  useEffect(() => {
    setFilterPopupOpen(false)
    setSortPopupOpen(false)
  }, [searchParams])

  const {
    searchText, setSearchText,
    selectedLabels, setSelectedLabels,
    selectedPriorities, setSelectedPriorities,
    selectedStatuses, setSelectedStatuses,
    selectedDateFilters, setSelectedDateFilters,
    sortKey, setSortKey,
    sortOrder, setSortOrder,
    activeFilterCount,
    hasActiveFilters,
    resetAllFilters,
  } = filtering

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    onResetPage()
  }

  const handleSortSelect = (key: typeof sortKey, order: typeof sortOrder) => {
    setSortKey(key)
    setSortOrder(order)
    onResetPage()
  }

  const handleFilterApply = (
    labelIds: string[],
    priorities: Priority[],
    statuses: Status[],
    dateFilters: DateFilter[],
  ) => {
    setSelectedLabels(labelIds)
    setSelectedPriorities(priorities)
    setSelectedStatuses(statuses)
    setSelectedDateFilters(dateFilters)
    setFilterPopupOpen(false)
    onResetPage()
  }

  const handleResetAll = () => {
    resetAllFilters()
    onResetPage()
  }

  return (
    <div className="flex-shrink-0 bg-white border-b border-gray-200 relative">
      <div className={`grid md:!grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out ${searchOpenSP ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}>
        <div className="overflow-hidden">
          <div className="p-4 md:p-5">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative md:flex-1">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="タスクを検索..."
                  value={searchText}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div className="flex gap-3 items-stretch">
                <div className="relative">
                  <button
                    onClick={() => setSortPopupOpen(prev => !prev)}
                    className={`h-full flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${sortKey
                      ? "border-brand-500 bg-brand-100 text-brand-500"
                      : "border-gray-300 text-gray-400 hover:border-gray-400"
                      }`}
                  >
                    <ArrowUpDown size={16} />
                    並び替え
                  </button>
                  {sortPopupOpen && (
                    <SortPopup
                      currentKey={sortKey}
                      currentOrder={sortOrder}
                      onSelect={handleSortSelect}
                      onClose={() => setSortPopupOpen(false)}
                    />
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setFilterPopupOpen(prev => !prev)}
                    className={`h-full flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${activeFilterCount > 0
                      ? "border-brand-500 bg-brand-100 text-brand-500"
                      : "border-gray-300 text-gray-400 hover:border-gray-400"
                      }`}
                  >
                    <SlidersHorizontal size={16} />
                    フィルタ
                    {activeFilterCount > 0 && (
                      <span className="bg-brand-500 text-white text-xs px-1.5 py-0.5 rounded-full leading-none">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                  {filterPopupOpen && (
                    <TaskFilterPopup
                      labels={labels}
                      selectedLabels={selectedLabels}
                      selectedPriorities={selectedPriorities}
                      selectedStatuses={selectedStatuses}
                      selectedDateFilters={selectedDateFilters}
                      onApply={handleFilterApply}
                      onClose={() => setFilterPopupOpen(false)}
                    />
                  )}
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex gap-2 flex-wrap items-center pt-3">
                {selectedDateFilters.map(f => (
                  <FilterChip key={f} selected removable
                    onClick={() => { setSelectedDateFilters(prev => prev.filter(v => v !== f)); onResetPage() }}
                  >
                    {DATE_FILTER_LABELS[f]}
                  </FilterChip>
                ))}
                {selectedLabels.map(labelId => {
                  const label = labels.find(l => l.id === labelId)
                  if (!label) return null
                  return (
                    <FilterChip key={labelId} selected removable
                      onClick={() => { setSelectedLabels(prev => prev.filter(id => id !== labelId)); onResetPage() }}
                    >
                      {truncate(label.name, 6)}
                    </FilterChip>
                  )
                })}
                {selectedPriorities.map(p => (
                  <FilterChip key={p} selected removable
                    onClick={() => { setSelectedPriorities(prev => prev.filter(v => v !== p)); onResetPage() }}
                  >
                    {PRIORITY_LABELS[p]}
                  </FilterChip>
                ))}
                {selectedStatuses.map(s => (
                  <FilterChip key={s} selected removable
                    onClick={() => { setSelectedStatuses(prev => prev.filter(v => v !== s)); onResetPage() }}
                  >
                    {STATUS_LABELS[s]}
                  </FilterChip>
                ))}
                {activeFilterCount > 0 && (
                  <button onClick={handleResetAll} className="text-xs text-gray-400 hover:text-gray-600 underline px-1 cursor-pointer">
                    すべて解除
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden h-3" />

      <button
        type="button"
        onClick={() => setSearchOpenSP(prev => !prev)}
        className="md:hidden absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 bg-white border border-gray-200 rounded-full px-5 py-0.5 z-10 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label={searchOpenSP ? "検索を閉じる" : "検索を開く"}
      >
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ease-in-out ${searchOpenSP ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  )
}