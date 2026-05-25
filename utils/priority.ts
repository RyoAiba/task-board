import { Priority } from "../types"

export const getPriorityBadgeClass = (priority: Priority) => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-600"
    case "medium": return "bg-amber-100 text-amber-600"
    case "low": return "bg-green-100 text-green-600"
  }
}