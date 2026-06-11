"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowUpDown, ChevronDown, Search, SlidersHorizontal } from "lucide-react"

import { useLabels } from "@/contexts/LabelsContext"
import { useTasks } from "@/contexts/TasksContext"
import { useTaskToggle } from "@/hooks/useTaskToggle"
import {
  type DateFilter,
  DATE_FILTER_LABELS,
  type PageSize,
  type Priority,
  PRIORITY_LABELS,
  PRIORITY_ORDER,
  type Status,
  STATUS_LABELS,
} from "@/types"
import { formatDate } from "@/utils/calendar"
import { truncate } from "@/utils/string"
import { Pagination } from "@/components/Pagination"
import { FilterChip } from "@/components/tasks/FilterChip"
import { SortPopup, type SortKey, type SortOrder } from "@/components/tasks/SortPopup"
import { TaskCard } from "@/components/tasks/TaskCard"
import { TaskFilterPopup } from "@/components/tasks/TaskFilterPopup"

function TasksPageContent() {
  const searchParams = useSearchParams()
  const { tasks, isExiting } = useTasks()
  const { labels } = useLabels()
  const { handleToggle } = useTaskToggle()

  const urlLabel = searchParams.get("label") || ""
  const urlPriority = searchParams.get("priority") as Priority | null
  const urlStatus = searchParams.get("status") as Status | null
  const urlDateFilter = searchParams.get("dateFilter") as DateFilter | null

  const [searchText, setSearchText] = useState("")
  const [selectedLabels, setSelectedLabels] = useState<string[]>(urlLabel ? [urlLabel] : [])
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>(urlPriority ? [urlPriority] : [])
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>(urlStatus ? [urlStatus] : ["incomplete"])
  const [selectedDateFilters, setSelectedDateFilters] = useState<DateFilter[]>(urlDateFilter ? [urlDateFilter] : [])
  const [filterPopupOpen, setFilterPopupOpen] = useState(false)
  const [sortPopupOpen, setSortPopupOpen] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey | null>(urlStatus ? null : "dueDate")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(10)
  const [searchOpenSP, setSearchOpenSP] = useState(true)

  useEffect(() => { setSelectedLabels(urlLabel ? [urlLabel] : []) }, [urlLabel])
  useEffect(() => { setSelectedPriorities(urlPriority ? [urlPriority] : []) }, [urlPriority])
  useEffect(() => { setSelectedStatuses(urlStatus ? [urlStatus] : ["incomplete"]) }, [urlStatus])
  useEffect(() => { setSelectedDateFilters(urlDateFilter ? [urlDateFilter] : []) }, [urlDateFilter])
  useEffect(() => {
    setFilterPopupOpen(false)
    setSortPopupOpen(false)
  }, [searchParams])

  const { todayStr, weekEndStr } = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    const w = new Date(t)
    w.setDate(w.getDate() + 6)
    return { todayStr: formatDate(t), weekEndStr: formatDate(w) }
  }, [])

  const resetPage = () => setCurrentPage(1)

  const activeFilterCount =
    selectedLabels.length + selectedPriorities.length + selectedStatuses.length + selectedDateFilters.length

  const hasActiveFilters = searchText !== "" || activeFilterCount > 0

  const resetAllFilters = () => {
    setSelectedLabels([])
    setSelectedPriorities([])
    setSelectedStatuses([])
    setSelectedDateFilters([])
    setSearchText("")
    resetPage()
  }

  const handleSortSelect = (key: SortKey | null, order: SortOrder) => {
    setSortKey(key)
    setSortOrder(order)
    resetPage()
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    resetPage()
  }

  const handlePageSizeChange = (size: PageSize) => {
    setPageSize(size)
    setCurrentPage(1)
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
    resetPage()
  }

  const filteredAndSortedTasks = useMemo(() => {
    const filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchText.toLowerCase())
      const matchesLabel = selectedLabels.length === 0 || selectedLabels.includes(task.labelId)
      const matchesPriority = selectedPriorities.length === 0 ||
        (task.priority !== undefined && selectedPriorities.includes(task.priority))
      const matchesStatus = selectedStatuses.length === 0 ||
        (selectedStatuses.includes("incomplete") && !task.completed) ||
        (selectedStatuses.includes("completed") && task.completed)
      const matchesDateFilter = selectedDateFilters.length === 0 ||
        selectedDateFilters.some(f => {
          if (f === "noDueDate") return !task.dueDate
          if (!task.dueDate) return false
          if (f === "overdue") return task.dueDate < todayStr
          if (f === "today") return task.dueDate === todayStr
          if (f === "thisWeek") return task.dueDate >= todayStr && task.dueDate <= weekEndStr
          return false
        })

      if (matchesSearch && matchesLabel && matchesPriority && matchesStatus && matchesDateFilter) {
        return true
      }
      if (isExiting(task.id) && matchesSearch && matchesLabel && matchesPriority && matchesDateFilter) {
        return true
      }
      return false
    })

    if (!sortKey) return filtered

    return [...filtered].sort((a, b) => {
      let result = 0
      if (sortKey === "label") {
        const orderA = labels.find(l => l.id === a.labelId)?.order ?? 0
        const orderB = labels.find(l => l.id === b.labelId)?.order ?? 0
        result = orderA - orderB
      } else if (sortKey === "priority") {
        const orderA = a.priority ? PRIORITY_ORDER[a.priority] : 99
        const orderB = b.priority ? PRIORITY_ORDER[b.priority] : 99
        result = orderA - orderB
      } else if (sortKey === "status") {
        result = Number(a.completed) - Number(b.completed)
      } else if (sortKey === "dueDate") {
        if (!a.dueDate && !b.dueDate) result = 0
        else if (!a.dueDate) result = 1
        else if (!b.dueDate) result = -1
        else result = a.dueDate.localeCompare(b.dueDate)
      }
      return sortOrder === "asc" ? result : -result
    })
  }, [searchText, selectedLabels, selectedPriorities, selectedStatuses, selectedDateFilters, sortKey, sortOrder, tasks, labels, todayStr, weekEndStr, isExiting])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedTasks.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pagedTasks = filteredAndSortedTasks.slice((safePage - 1) * pageSize, safePage * pageSize)

  const getLabel = (labelId: string) => labels.find(label => label.id === labelId)

  return (
    <div className="flex flex-col h-full">

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
                      onClick={() => { setSelectedDateFilters(prev => prev.filter(v => v !== f)); resetPage() }}
                    >
                      {DATE_FILTER_LABELS[f]}
                    </FilterChip>
                  ))}
                  {selectedLabels.map(labelId => {
                    const label = labels.find(l => l.id === labelId)
                    if (!label) return null
                    return (
                      <FilterChip key={labelId} selected removable
                        onClick={() => { setSelectedLabels(prev => prev.filter(id => id !== labelId)); resetPage() }}
                      >
                        {truncate(label.name, 6)}
                      </FilterChip>
                    )
                  })}
                  {selectedPriorities.map(p => (
                    <FilterChip key={p} selected removable
                      onClick={() => { setSelectedPriorities(prev => prev.filter(v => v !== p)); resetPage() }}
                    >
                      {PRIORITY_LABELS[p]}
                    </FilterChip>
                  ))}
                  {selectedStatuses.map(s => (
                    <FilterChip key={s} selected removable
                      onClick={() => { setSelectedStatuses(prev => prev.filter(v => v !== s)); resetPage() }}
                    >
                      {STATUS_LABELS[s]}
                    </FilterChip>
                  ))}
                  {activeFilterCount > 0 && (
                    <button onClick={resetAllFilters} className="text-xs text-gray-400 hover:text-gray-600 underline px-1 cursor-pointer">
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

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-6 py-6">
        {pagedTasks.length > 0 ? (
          <>
            {totalPages > 1 && (
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalCount={filteredAndSortedTasks.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
            <div className="divide-y divide-gray-200 my-4">
              {pagedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  label={getLabel(task.labelId)}
                  exiting={isExiting(task.id)}
                  onToggle={handleToggle}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalCount={filteredAndSortedTasks.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-body">タスクがありません</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="p-6">読み込み中...</div>}>
      <TasksPageContent />
    </Suspense>
  )
}