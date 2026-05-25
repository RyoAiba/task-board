import { Priority } from "../types"

export const getPriorityColorClass = (priority: Priority) => {
  if (priority === "high") return "bg-red-500"
  if (priority === "medium") return "bg-amber-500"
  return "bg-green-500"
}

export const getPriorityBadgeClass = (priority: Priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-600"
    case "medium":
      return "bg-amber-100 text-amber-600"
    case "low":
      return "bg-green-100 text-green-600"
  }
}