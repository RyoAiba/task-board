import { Priority, PRIORITY_SOFT } from "../types"

export const getPriorityCircleClass = (priority: Priority | undefined, completed: boolean) => {
  if (completed) return "bg-green-100 text-green-600"
  if (!priority) return "text-gray-300"
  return PRIORITY_SOFT[priority]
}
