"use client"

import { memo } from "react"
import Link from "next/link"
import { CalendarDays, CheckCircle, Circle } from "lucide-react"

import { type Label, type Task } from "../types"
import { getDueDateInfo } from "../utils/dueDate"
import { getPriorityCircleClass } from "../utils/priority"
import { LabelBadge } from "./LabelBadge"

type TaskCardProps = {
  task: Task
  label: Label | undefined
  onToggle: (id: string) => void
}

export const TaskCard = memo(function TaskCard({ task, label, onToggle }: TaskCardProps) {
  const dueDateInfo = getDueDateInfo(task.dueDate, task.completed)
  const priorityClass = getPriorityCircleClass(task.priority)

  return (
    <div className="group/card relative px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className="group/toggle relative z-10 flex-shrink-0 flex items-center justify-center p-1 -m-1 cursor-pointer bg-transparent"
        >
          <span className={`flex items-center rounded-full transition-colors ${priorityClass}`}>
            {task.completed ? (
              <CheckCircle size={22} />
            ) : (
              <>
                <Circle size={22} className="block group-hover/toggle:hidden" />
                <CheckCircle size={22} className="hidden group-hover/toggle:block" />
              </>
            )}
          </span>
        </button>

        <Link href={`/tasks/${task.id}`} className="absolute inset-0" />

        <div className="flex-1 min-w-0">
          <span className={`block text-sm truncate ${task.completed ? "text-gray-400 line-through" : ""}`}>
            {task.title}
          </span>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {dueDateInfo && (
              <span className={`inline-flex items-center gap-0.5 text-xs ${dueDateInfo.className}`}>
                <CalendarDays size={11} />
                {dueDateInfo.label}
              </span>
            )}
            {label && <LabelBadge label={label} />}
          </div>
        </div>
      </div>
    </div>
  )
})