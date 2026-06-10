import { type Task, PRIORITY_ORDER } from "../types"

export const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"]

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function getTasksForDate(
  tasks: Task[],
  dateStr: string,
  showCompleted: boolean,
): Task[] {
  return tasks
    .filter(t => {
      if (t.dueDate !== dateStr) return false
      if (!showCompleted && t.completed) return false
      return true
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed)
      const orderA = a.priority ? PRIORITY_ORDER[a.priority] : 99
      const orderB = b.priority ? PRIORITY_ORDER[b.priority] : 99
      return orderA - orderB
    })
}