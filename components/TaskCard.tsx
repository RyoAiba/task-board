"use client"

import { memo } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { Task, PRIORITY_LABELS, CATEGORY_BADGE_CLASSES, Category } from "../types"
import { getPriorityBadgeClass } from "../utils/priority"
import { getDueDateBadge } from "../utils/dueDate"

type TaskCardProps = {
  task: Task
  category: Category | undefined
  onToggle: (id: string) => void
}

export const TaskCard = memo(function TaskCard({ task, category, onToggle }: TaskCardProps) {
  const categoryBadgeClass = category
    ? CATEGORY_BADGE_CLASSES[category.color as keyof typeof CATEGORY_BADGE_CLASSES]
    : null

  const dueBadge = getDueDateBadge(task.dueDate, task.completed)

  return (
    <div className="relative px-4 py-2 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${task.completed ? "bg-primary" : "border-2 border-gray-300 bg-white"
            }`}
        >
          {task.completed && <Check size={14} className="text-white" />}
        </button>

        <Link href={`/tasks/${task.id}`} className="absolute inset-0 ml-11" />

        <div className="flex-1 min-w-0">
          <span
            className={`block truncate ${task.completed ? "text-gray-400 line-through" : "text-gray-800 font-medium"
              }`}
          >
            {task.title}
          </span>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {categoryBadgeClass && (
              <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${categoryBadgeClass}`}>
                {category!.name}
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${getPriorityBadgeClass(task.priority)}`}>
              {PRIORITY_LABELS[task.priority]}
            </span>
            {dueBadge && (
              <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${dueBadge.className}`}>
                {dueBadge.label}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})