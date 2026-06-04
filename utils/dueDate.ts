import { CalendarDays } from "lucide-react"

export type DueDateStatus = "overdue" | "yesterday" | "today" | "soon" | "normal"

export type DueDateInfo = {
  status: DueDateStatus
  label: string
  className: string
}

function formatMD(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export function getDueDateInfo(dueDate: string | undefined, completed: boolean): DueDateInfo | null {
  if (!dueDate) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const due = new Date(`${dueDate}T00:00:00`)
  due.setHours(0, 0, 0, 0)

  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (completed) {
    return { status: "normal", label: formatMD(dueDate), className: "text-gray-400" }
  }

  if (diffDays < -1) {
    return { status: "overdue", label: formatMD(dueDate), className: "text-due-overdue" }
  }
  if (diffDays === -1) {
    return { status: "yesterday", label: "昨日", className: "text-due-overdue" }
  }
  if (diffDays === 0) {
    return { status: "today", label: "今日", className: "text-due-today" }
  }
  if (diffDays <= 3) {
    return { status: "soon", label: diffDays === 1 ? "明日" : formatMD(dueDate), className: "text-due-soon" }
  }
  return { status: "normal", label: formatMD(dueDate), className: "text-gray-400" }
}

export { CalendarDays }