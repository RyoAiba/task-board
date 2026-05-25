export type DueDateStatus = "overdue" | "today" | "soon" | "none"

export type DueDateBadge = {
  status: DueDateStatus
  label: string
  className: string
}

export function getDueDateBadge(dueDate: string | undefined, completed: boolean): DueDateBadge | null {
  if (!dueDate || completed) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)

  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return {
      status: "overdue",
      label: "期限切れ",
      className: "bg-red-100 text-red-600",
    }
  }

  if (diffDays === 0) {
    return {
      status: "today",
      label: "今日まで",
      className: "bg-orange-100 text-orange-600",
    }
  }

  if (diffDays <= 3) {
    return {
      status: "soon",
      label: `あと${diffDays}日`,
      className: "bg-yellow-100 text-yellow-600",
    }
  }

  return null
}