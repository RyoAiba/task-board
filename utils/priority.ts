export const getPriorityColorClass = (priority: string) => {
  if (priority === "high") return "bg-red-500"
  if (priority === "medium") return "bg-amber-500"
  return "bg-green-500"
}

export const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-600"
    case "medium":
      return "bg-amber-100 text-amber-600"
    case "low":
      return "bg-green-100 text-green-600"
    default:
      return "bg-gray-100 text-gray-600"
  }
}
