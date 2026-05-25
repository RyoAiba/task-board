"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Search, X, ChevronDown } from "lucide-react"
import { PageSize, Priority, PRIORITY_LABELS, PRIORITY_ORDER } from "../../types"
import { useTasks } from "../../hooks/useTasks"
import { useCategories } from "../../hooks/useCategories"
import { useToast } from "../../hooks/useToast"
import { TaskCard } from "../../components/TaskCard"
import { Pagination } from "../../components/Pagination"
import { CheckboxGroup } from "../../components/CheckboxGroup"
import { CategoryModal } from "../../components/CategoryModal"
import { Toast } from "../../components/Toast"

// ─── 型 ────────────────────────────────────────────────
type Status = "incomplete" | "completed"
type SortKey = "category" | "priority" | "status"
type SortOrder = "asc" | "desc"

// ─── 定数 ──────────────────────────────────────────────
const STATUS_OPTIONS: { label: string; value: Status }[] = [
  { label: "未完了", value: "incomplete" },
  { label: "完了済", value: "completed" },
]

const PRIORITY_OPTIONS = (Object.entries(PRIORITY_LABELS) as [Priority, string][]).map(
  ([value, label]) => ({ label, value })
)

const SORT_OPTIONS: { label: string; key: SortKey; order: SortOrder }[] = [
  { label: "カテゴリ：昇順", key: "category", order: "asc" },
  { label: "カテゴリ：降順", key: "category", order: "desc" },
  { label: "優先度：高い順", key: "priority", order: "asc" },
  { label: "優先度：低い順", key: "priority", order: "desc" },
  { label: "未完了を先に", key: "status", order: "asc" },
  { label: "完了済を先に", key: "status", order: "desc" },
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
  const { categories } = useCategories()
  const { toast, showToast } = useToast()

  const urlCategory = searchParams.get("category") || ""
  const urlPriority = searchParams.get("priority") as Priority | null

  // ─── state ───────────────────────────────────────────
  const [searchText, setSearchText] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    urlCategory ? [urlCategory] : []
  )
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>(
    urlPriority ? [urlPriority] : []
  )
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([])
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(10)

  // ─── effect ──────────────────────────────────────────
  useEffect(() => {
    setSelectedCategories(urlCategory ? [urlCategory] : [])
  }, [urlCategory])

  useEffect(() => {
    setSelectedPriorities(urlPriority ? [urlPriority] : [])
  }, [urlPriority])

  useEffect(() => {
    setCategoryModalOpen(false)
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

  const hasActiveFilters =
    searchText !== "" ||
    selectedCategories.length > 0 ||
    selectedPriorities.length > 0 ||
    selectedStatuses.length > 0

  const resetAllFilters = () => {
    setSearchText("")
    setSelectedCategories([])
    setSelectedPriorities([])
    setSelectedStatuses([])
    resetPage()
  }

  const toggleItem =
    <T extends string>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
      (value: T) => {
        setter(prev =>
          prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        )
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

  // ─── フィルタ・ソート ──────────────────────────────────
  const filteredAndSortedTasks = useMemo(() => {
    const filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchText.toLowerCase())
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(task.categoryId)
      const matchesPriority =
        selectedPriorities.length === 0 || selectedPriorities.includes(task.priority)
      const matchesStatus =
        selectedStatuses.length === 0 ||
        (selectedStatuses.includes("incomplete") && !task.completed) ||
        (selectedStatuses.includes("completed") && task.completed)
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus
    })

    if (!sortKey) return filtered

    return [...filtered].sort((a, b) => {
      let result = 0
      if (sortKey === "category") {
        const orderA = categories.find(c => c.id === a.categoryId)?.order ?? 0
        const orderB = categories.find(c => c.id === b.categoryId)?.order ?? 0
        result = orderA - orderB
      } else if (sortKey === "priority") {
        result = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      } else if (sortKey === "status") {
        result = Number(a.completed) - Number(b.completed)
      }
      return sortOrder === "asc" ? result : -result
    })
  }, [searchText, selectedCategories, selectedPriorities, selectedStatuses, sortKey, sortOrder, tasks, categories])

  // ─── ページネーション ──────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedTasks.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pagedTasks = filteredAndSortedTasks.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  )

  const getCategory = (categoryId: string) => categories.find(c => c.id === categoryId)
  const categoryLabel = selectedCategories.length === 0 ? "すべて" : `${selectedCategories.length}件選択中`
  const currentSortValue = sortKey ? `${sortKey}_${sortOrder}` : ""

  return (
    <div>
      <h1 className="text-page-title mb-6">タスク一覧</h1>

      {/* Filter Bar */}
      <div className="sticky top-0 bg-white z-30 mb-6 -mx-6 px-6 py-4 border-b border-gray-200 space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="タスクを検索..."
              value={searchText}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={currentSortValue}
            onChange={handleSortChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary whitespace-nowrap"
          >
            <option value="">並び替え</option>
            {SORT_OPTIONS.map(opt => (
              <option key={`${opt.key}_${opt.order}`} value={`${opt.key}_${opt.order}`}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
          <div className="relative flex items-center gap-3">
            <span className="text-xs font-medium text-gray-400 whitespace-nowrap">カテゴリ</span>
            <button
              onClick={() => setCategoryModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary text-gray-500"
            >
              {categoryLabel}
              <ChevronDown size={14} />
            </button>
            {selectedCategories.length > 0 && (
              <button
                onClick={() => { setSelectedCategories([]); resetPage() }}
                className="text-gray-300 hover:text-gray-500"
              >
                <X size={14} />
              </button>
            )}
            {categoryModalOpen && (
              <CategoryModal
                categories={categories}
                selected={selectedCategories}
                onToggle={toggleItem(setSelectedCategories)}
                onClose={() => setCategoryModalOpen(false)}
              />
            )}
          </div>
          <CheckboxGroup
            label="優先度"
            options={PRIORITY_OPTIONS}
            selected={selectedPriorities}
            onToggle={toggleItem(setSelectedPriorities)}
          />
          <CheckboxGroup
            label="ステータス"
            options={STATUS_OPTIONS}
            selected={selectedStatuses}
            onToggle={toggleItem(setSelectedStatuses)}
          />
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-gray-400 hover:text-gray-600 underline whitespace-nowrap"
            >
              リセット
            </button>
          )}
        </div>
      </div>

      {/* タスク一覧 */}
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
          <div className="space-y-2 my-4">
            {pagedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                category={getCategory(task.categoryId)}
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
          <p className="text-gray-500 text-body">タスクがありません</p>
        </div>
      )}

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