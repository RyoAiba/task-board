export type Priority = "high" | "medium" | "low"

export type Label = {
  id: string
  name: string
  order: number
}

export type Task = {
  id: string
  title: string
  priority?: Priority
  labelId: string
  completed: boolean
  createdAt: string
  dueDate?: string
}

export const DEFAULT_LABELS: Label[] = [
  { id: "cat_1", name: "仕事", order: 1 },
  { id: "cat_2", name: "趣味", order: 2 },
  { id: "cat_3", name: "その他", order: 3 },
]

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

export const PAGE_SIZE_OPTIONS = [10, 30] as const
export type PageSize = typeof PAGE_SIZE_OPTIONS[number]

export const PRIORITY_PRIMARY: Record<Priority, string> = {
  high: "bg-priority-high",
  medium: "bg-priority-medium",
  low: "bg-priority-low",
}

export const PRIORITY_MIDDLE: Record<Priority, string> = {
  high: "bg-priority-high/10 text-priority-high",
  medium: "bg-priority-medium/5 text-priority-medium",
  low: "bg-priority-low/10 text-priority-low",
}

export const PRIORITY_SOFT: Record<Priority, string> = {
  high: "bg-priority-high/5 text-priority-high/80",
  medium: "bg-priority-medium/5 text-priority-medium/80",
  low: "bg-priority-low/5 text-priority-low/80",
}