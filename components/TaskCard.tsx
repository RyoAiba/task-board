"use client"

import { memo } from "react"
import Link from "next/link"
import { CheckCircle, Circle } from "lucide-react"
import { Task, PRIORITY_LABELS, Category } from "../types"
import { getPriorityBadgeClass } from "../utils/priority"
import { getDueDateBadge } from "../utils/dueDate"
import { CategoryBadge } from "./CategoryBadge"

type TaskCardProps = {
  task: Task
  category: Category | undefined
  onToggle: (id: string) => void
}

export const TaskCard = memo(function TaskCard({ task, category, onToggle }: TaskCardProps) {

  const dueBadge = getDueDateBadge(task.dueDate, task.completed)

  return (
    <div className="relative px-4 py-2 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`relative z-10 flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${task.completed
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
        >
          {task.completed ? <CheckCircle size={11} /> : <Circle size={11} />}
          {task.completed ? "完了済" : "未完了"}
        </button>

        <Link href={`/tasks/${task.id}`} className="absolute inset-0 ml-20" />

        <div className="flex-1 min-w-0">
          <span className={`block truncate ${task.completed ? "text-gray-400 line-through" : " font-medium"}`}>
            {task.title}
          </span>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {category && (
              <CategoryBadge category={category} />
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