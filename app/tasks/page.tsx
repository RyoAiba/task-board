"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { TaskCard } from "../../components/TaskCard"
import { useTasks } from "../../hooks/useTasks"
import { useCategories } from "../../hooks/useCategories"
import { Search, X, ChevronDown } from "lucide-react"
import { Category, CATEGORY_DOT_CLASSES, PageSize } from "../../types"
import { Pagination } from "../../components/Pagination"

// ─── 型 ────────────────────────────────────────────────
type Priority = "high" | "medium" | "low"
type Status = "incomplete" | "completed"
type SortKey = "category" | "priority" | "status"
type SortOrder = "asc" | "desc"

// ─── 定数 ──────────────────────────────────────────────
const STATUS_OPTIONS: { label: string; value: Status }[] = [
  { label: "未完了", value: "incomplete" },
  { label: "完了済", value: "completed" },
]

const PRIORITY_OPTIONS: { label: string; value: Priority }[] = [
  { label: "高", value: "high" },
  { label: "中", value: "medium" },
  { label: "低", value: "low" },
]

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

const SORT_OPTIONS: { label: string; key: SortKey; order: SortOrder }[] = [
  { label: "カテゴリ：昇順", key: "category", order: "asc" },
  { label: "カテゴリ：降順", key: "category", order: "desc" },
  { label: "優先度：高い順", key: "priority", order: "asc" },
  { label: "優先度：低い順", key: "priority", order: "desc" },
  { label: "未完了を先に", key: "status", order: "asc" },
  { label: "完了済を先に", key: "status", order: "desc" },
]

// ─── チェックボックスグループ ───────────────────────────
function CheckboxGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: { label: string; value: T }[]
  selected: T[]
  onToggle: (value: T) => void
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{label}</span>
      {options.map(opt => {
        const checked = selected.includes(opt.value)
        return (
          <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(opt.value)}
              className="w-4 h-4 accent-[#FA6218] cursor-pointer"
            />
            <span className={`text-sm ${checked ? "text-gray-800 font-medium" : "text-gray-500"}`}>
              {opt.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}

// ─── カテゴリモーダル ────────────────────────────────────
function CategoryModal({
  categories,
  selected,
  onToggle,
  onClose,
}: {
  categories: Category[]
  selected: string[]
  onToggle: (id: string) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div
        className="relative bg-white rounded-xl shadow-xl w-72 p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">カテゴリを選択</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {categories.map(cat => {
            const checked = selected.includes(cat.id)
            return (
              <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(cat.id)}
                  className="w-4 h-4 accent-[#FA6218] cursor-pointer"
                />
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${CATEGORY_DOT_CLASSES[cat.color]}`} />
                <span className={`text-sm ${checked ? "text-gray-800 font-medium" : "text-gray-500"}`}>
                  {cat.name}
                </span>
              </label>
            )
          })}
        </div>
        {selected.length > 0 && (
          <button
            onClick={() => selected.forEach(id => onToggle(id))}
            className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline"
          >
            選択をリセット
          </button>
        )}
      </div>
    </div>
  )
}

// ─── メイン ─────────────────────────────────────────────
function TasksPageContent() {
  const searchParams = useSearchParams()
  const { tasks, toggleCompleted } = useTasks()
  const { categories } = useCategories()

  const urlPriority = searchParams.get("priority") as Priority | null
  const urlCategory = searchParams.get("category") || ""

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

  const resetPage = () => setCurrentPage(1)

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

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedTasks.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pagedTasks = filteredAndSortedTasks.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  )

  const getCategory = (categoryId: string) => categories.find(c => c.id === categoryId)
  const categoryLabel =
    selectedCategories.length === 0 ? "すべて" : `${selectedCategories.length}件選択中`
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FA6218]"
            />
          </div>
          <select
            value={currentSortValue}
            onChange={handleSortChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FA6218] whitespace-nowrap"
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
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-400 whitespace-nowrap">カテゴリ</span>
            <button
              onClick={() => setCategoryModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-[#FA6218] focus:outline-none focus:ring-2 focus:ring-[#FA6218] text-gray-500"
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

      {categoryModalOpen && (
        <CategoryModal
          categories={categories}
          selected={selectedCategories}
          onToggle={toggleItem(setSelectedCategories)}
          onClose={() => setCategoryModalOpen(false)}
        />
      )}
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