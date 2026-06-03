import { Priority } from "../types"

export const getPriorityBadgeClass = (priority: Priority) => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-600"
    case "medium": return "bg-amber-100 text-amber-600"
    case "low": return "bg-blue-100 text-blue-600"
  }
}

export const getPriorityCircleClass = (priority: Priority | undefined, completed: boolean) => {
  if (completed) return "bg-green-100 text-green-600"
  switch (priority) {
    case "high": return "bg-red-50 text-red-500"
    case "medium": return "bg-amber-50 text-amber-500"
    case "low": return "bg-blue-50 text-blue-500"
    default: return "text-gray-300"
  }
}