export type Priority = "high" | "medium" | "low"

export type CategoryColor = "blue" | "violet" | "slate" | "pink" | "teal" | "cyan"

export type Category = {
  id: string
  name: string
  order: number
  color: CategoryColor
}

export type Task = {
  id: string
  title: string
  priority: Priority
  categoryId: string
  completed: boolean
  createdAt: string
  dueDate?: string
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat_1", name: "仕事", order: 1, color: "blue" },
  { id: "cat_2", name: "趣味", order: 2, color: "violet" },
  { id: "cat_3", name: "その他", order: 3, color: "slate" },
]

export const CATEGORY_BADGE_CLASSES: Record<CategoryColor, string> = {
  blue: "bg-blue-100 text-blue-600",
  violet: "bg-violet-100 text-violet-600",
  slate: "bg-slate-100 text-slate-600",
  pink: "bg-pink-100 text-pink-600",
  teal: "bg-teal-100 text-teal-600",
  cyan: "bg-cyan-100 text-cyan-600",
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: "高",
  medium: "中",
  low: "低",
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

export const CATEGORY_DOT_CLASSES: Record<CategoryColor, string> = {
  blue: "bg-blue-400",
  violet: "bg-violet-400",
  slate: "bg-slate-400",
  pink: "bg-pink-400",
  teal: "bg-teal-400",
  cyan: "bg-cyan-400",
}

export const PAGE_SIZE_OPTIONS = [10, 30] as const
export type PageSize = typeof PAGE_SIZE_OPTIONS[number]

export const CATEGORY_BORDER_CLASSES: Record<CategoryColor, string> = {
  blue: "border-l-blue-400",
  violet: "border-l-violet-400",
  slate: "border-l-slate-400",
  pink: "border-l-pink-400",
  teal: "border-l-teal-400",
  cyan: "border-l-cyan-400",
}

export const PRIORITY_BORDER_CLASSES: Record<Priority, string> = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-green-500",
}