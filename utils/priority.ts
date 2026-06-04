import { Priority, PRIORITY_SOFT } from "../types"

export const getPriorityCircleClass = (priority: Priority | undefined) => {
  if (!priority) return "text-gray-300"
  return PRIORITY_SOFT[priority]
}