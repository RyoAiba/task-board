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
    <div className="group/card relative px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`relative z-10 flex-shrink-0 flex items-center rounded-full transition-colors cursor-pointer ${task.completed
            ? "bg-brand-200 text-brand-500 hover:bg-green-200"
            : "text-gray-200"
            }`}
        >
          {task.completed ? (
            <CheckCircle size={20} />
          ) : (
            <>
              <Circle size={20} className="block group-hover/card:hidden" />
              <CheckCircle size={20} className="hidden group-hover/card:block" />
            </>
          )}
        </button>

        <Link href={`/tasks/${task.id}`} className="absolute inset-0" />

        <div className="flex-1 min-w-0">
          <span className={`block text-sm truncate ${task.completed ? "text-gray-400 line-through" : ""}`}>
            {task.title}
          </span>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {category && <CategoryBadge category={category} />}
            <span className={`text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap ${getPriorityBadgeClass(task.priority)}`}>
              {PRIORITY_LABELS[task.priority]}
            </span>
            {dueBadge && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap ${dueBadge.className}`}>
                {dueBadge.label}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})