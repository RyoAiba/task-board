"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { PageSize, Priority, PRIORITY_LABELS, PRIORITY_ORDER } from "../../types"
import { useTasks } from "../../hooks/useTasks"
import { useLabels } from "../../hooks/useLabels"
import { useToast } from "../../hooks/useToast"
import { TaskCard } from "../../components/TaskCard"
import { Pagination } from "../../components/Pagination"
import { TaskFilterPopup } from "../../components/TaskFilterPopup"
import { Toast } from "../../components/Toast"
import { truncate } from "../../utils/string"

// ─── 型 ────────────────────────────────────────────────
type Status = "incomplete" | "completed"
type SortKey = "label" | "priority" | "status" | "dueDate"
type SortOrder = "asc" | "desc"

// ─── 定数 ──────────────────────────────────────────────
const STATUS_LABELS: Record<Status, string> = {
  incomplete: "未完了",
  completed: "完了済",
}

const SORT_OPTIONS: { label: string; key: SortKey; order: SortOrder }[] = [
  { label: "ラベル：昇順", key: "label", order: "asc" },
  { label: "ラベル：降順", key: "label", order: "desc" },
  { label: "優先度：高い順", key: "priority", order: "asc" },
  { label: "優先度：低い順", key: "priority", order: "desc" },
  { label: "未完了を先に", key: "status", order: "asc" },
  { label: "完了済を先に", key: "status", order: "desc" },
  { label: "期限：古い順", key: "dueDate", order: "asc" },
  { label: "期限：新しい順", key: "dueDate", order: "desc" },
]

const TOAST_MESSAGES: Record<string, string> = {
  created: "タスクを作成しました",
  saved: "タスクを保存しました",
  deleted: "タスクを削除しました",
}

// ─── メイン ─────────────────────────────────────────────
function TasksPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tasks, toggleCompleted } = useTasks()
  const { labels } = useLabels()
  const { toast, showToast } = useToast()

  const urlLabel = searchParams.get("label") || ""
  const urlPriority = searchParams.get("priority") as Priority | null
  const urlStatus = searchParams.get("status") as Status | null

  // ─── state ───────────────────────────────────────────
  const [searchText, setSearchText] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    urlLabel ? [urlLabel] : []
  )
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>(
    urlPriority ? [urlPriority] : []
  )
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>(
    urlStatus ? [urlStatus] : ["incomplete"]
  )
  const [filterPopupOpen, setFilterPopupOpen] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey | null>(urlStatus ? null : "dueDate")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(10)

  // ─── effect ──────────────────────────────────────────
  useEffect(() => {
    setSelectedCategories(urlLabel ? [urlLabel] : [])
  }, [urlLabel])

  useEffect(() => {
    setSelectedPriorities(urlPriority ? [urlPriority] : [])
  }, [urlPriority])

  useEffect(() => {
    setSelectedStatuses(urlStatus ? [urlStatus] : ["incomplete"])
  }, [urlStatus])

  useEffect(() => {
    setFilterPopupOpen(false)
  }, [searchParams])

  useEffect(() => {
    const toastParam = searchParams.get("toast")
    if (toastParam && TOAST_MESSAGES[toastParam]) {
      showToast(TOAST_MESSAGES[toastParam])
      const params = new URLSearchParams(searchParams.toString())
      params.delete("toast")
      const newUrl = params.toString() ? `/tasks?${params.toString()}` : "/tasks"
      router.replace(newUrl)
    }
  }, [searchParams, router, showToast])

  // ─── ハンドラ ─────────────────────────────────────────
  const resetPage = () => setCurrentPage(1)

  const activeFilterCount =
    selectedCategories.length + selectedPriorities.length + selectedStatuses.length

  const hasActiveFilters = searchText !== "" || activeFilterCount > 0

  const resetAllFilters = () => {
    setSelectedCategories([])
    setSelectedPriorities([])
    setSelectedStatuses([])
    setSearchText("")
    resetPage()
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (!val) {
      setSortKey(null)
    } else {
      const found = SORT_OPTIONS.find(o => `${o.key}_${o.order}` === val)
      if (found) {
        setSortKey(found.key)
        setSortOrder(found.order)
      }
    }
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
    labels: string[],
    priorities: Priority[],
    statuses: Status[]
  ) => {
    setSelectedCategories(labels)
    setSelectedPriorities(priorities)
    setSelectedStatuses(statuses)
    setFilterPopupOpen(false)
    resetPage()
  }

  // ─── フィルタ・ソート ──────────────────────────────────
  const filteredAndSortedTasks = useMemo(() => {
    const filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchText.toLowerCase())
      const matchesLabel =
        selectedCategories.length === 0 || selectedCategories.includes(task.labelId)
      const matchesPriority =
        selectedPriorities.length === 0 ||
        (task.priority !== undefined && selectedPriorities.includes(task.priority))
      const matchesStatus =
        selectedStatuses.length === 0 ||
        (selectedStatuses.includes("incomplete") && !task.completed) ||
        (selectedStatuses.includes("completed") && task.completed)
      return matchesSearch && matchesLabel && matchesPriority && matchesStatus
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
  }, [searchText, selectedCategories, selectedPriorities, selectedStatuses, sortKey, sortOrder, tasks, labels])

  // ─── ページネーション ──────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedTasks.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pagedTasks = filteredAndSortedTasks.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  )

  const getLabel = (labelId: string) => labels.find(label => label.id === labelId)
  const currentSortValue = sortKey ? `${sortKey}_${sortOrder}` : ""

  return (
    <div className="flex flex-col h-full">

      {/* ヘッダー（スクロールしない） */}
      <div className="flex-shrink-0 p-4 md:p-5 bg-white border-b border-gray-200">

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
            <select
              value={currentSortValue}
              onChange={handleSortChange}
              className="flex-1 md:flex-none px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">並び替え</option>
              {SORT_OPTIONS.map(opt => (
                <option key={`${opt.key}_${opt.order}`} value={`${opt.key}_${opt.order}`}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="relative">
              <button
                onClick={() => setFilterPopupOpen(prev => !prev)}
                className={`h-full flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${activeFilterCount > 0
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
                  selectedCategories={selectedCategories}
                  selectedPriorities={selectedPriorities}
                  selectedStatuses={selectedStatuses}
                  onApply={handleFilterApply}
                  onClose={() => setFilterPopupOpen(false)}
                />
              )}
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex gap-2 flex-wrap items-center pt-3">
            {selectedCategories.map(labelId => {
              const label = labels.find(l => l.id === labelId)
              if (!label) return null
              return (
                <button
                  key={labelId}
                  onClick={() => { setSelectedCategories(prev => prev.filter(id => id !== labelId)); resetPage() }}
                  className="flex items-center gap-1 px-3 py-1 bg-brand-100 border border-brand-500 text-brand-500 text-xs font-semibold rounded-full hover:bg-orange-100 transition-colors"
                >
                  {truncate(label.name, 6)}
                  <X size={11} />
                </button>
              )
            })}
            {selectedPriorities.map(p => (
              <button
                key={p}
                onClick={() => { setSelectedPriorities(prev => prev.filter(v => v !== p)); resetPage() }}
                className="flex items-center gap-1 px-3 py-1 bg-brand-100 border border-brand-500 text-brand-500 text-xs font-semibold rounded-full hover:bg-orange-100 transition-colors"
              >
                {PRIORITY_LABELS[p]}
                <X size={11} />
              </button>
            ))}
            {selectedStatuses.map(s => (
              <button
                key={s}
                onClick={() => { setSelectedStatuses(prev => prev.filter(v => v !== s)); resetPage() }}
                className="flex items-center gap-1 px-3 py-1 bg-brand-100 border border-brand-500 text-brand-500 text-xs font-semibold rounded-full hover:bg-orange-100 transition-colors"
              >
                {STATUS_LABELS[s]}
                <X size={11} />
              </button>
            ))}
            {activeFilterCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-gray-400 hover:text-gray-600 underline px-1"
              >
                すべて解除
              </button>
            )}
          </div>
        )}
      </div>

      {/* スクロール領域 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-6 py-6">
        {pagedTasks.length > 0 ? (
          <>
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalCount={filteredAndSortedTasks.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
            />
            <div className="divide-y divide-gray-200 my-4">
              {pagedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  label={getLabel(task.labelId)}
                  onToggle={toggleCompleted}
                />
              ))}
            </div>
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalCount={filteredAndSortedTasks.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-body">タスクがありません</p>
          </div>
        )}
      </div>

      <Toast message={toast.message} visible={toast.visible} />
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