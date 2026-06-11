"use client"

import { memo } from "react"
import { CalendarDays, CheckCircle, Circle, Flame } from "lucide-react"

import { useTaskModal } from "../../contexts/TaskModalContext"
import { type Label, type Task, PRIORITY_TEXT } from "../../types"
import { getDueDateInfo } from "../../utils/dueDate"
import { LabelBadge } from "./LabelBadge"

type TaskCardProps = {
  task: Task
  label: Label | undefined
  exiting?: boolean
  onToggle: (id: string) => void
}

export const TaskCard = memo(function TaskCard({ task, label, exiting = false, onToggle }: TaskCardProps) {
  const { openEdit } = useTaskModal()
  const dueDateInfo = getDueDateInfo(task.dueDate, task.completed)
  const displayTitle = task.title || "(タイトルなし)"

  return (
    <div
      className={`transition-opacity duration-[250ms] ${exiting ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="group/card relative px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggle(task.id)}
            className="group/toggle relative z-10 flex-shrink-0 flex items-center justify-center p-1 -m-1 cursor-pointer bg-transparent"
          >
            {task.completed ? (
              <CheckCircle size={22} className="text-gray-400" />
            ) : (
              <span className="flex items-center text-gray-300 group-hover/toggle:text-gray-400 transition-colors">
                <Circle size={22} className="block group-hover/toggle:hidden" />
                <CheckCircle size={22} className="hidden group-hover/toggle:block" />
              </span>
            )}
          </button>

          <button
            onClick={() => openEdit(task.id)}
            className="absolute inset-0 cursor-pointer"
            aria-label={`${displayTitle}を編集`}
          />

          <div className="flex-1 min-w-0">
            <span className={`block text-sm truncate ${task.completed
              ? "text-gray-400 line-through"
              : !task.title
                ? "text-gray-400"
                : ""
              }`}>
              {displayTitle}
            </span>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {dueDateInfo && (
                <span className={`inline-flex items-center gap-0.5 text-xs ${dueDateInfo.className}`}>
                  <CalendarDays size={11} />
                  {dueDateInfo.label}
                </span>
              )}
              {task.priority && (
                <Flame size={11} className={PRIORITY_TEXT[task.priority]} />
              )}
              {label && <LabelBadge label={label} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})