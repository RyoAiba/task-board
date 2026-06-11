"use client"

import Link from "next/link"

import { useTasks } from "../../contexts/TasksContext"
import { type Label, type Task } from "../../types"
import { TaskCard } from "../tasks/TaskCard"

const VISIBLE_LIMIT = 5

type Props = {
  title: string
  tasks: Task[]
  emptyMessage: string
  viewAllHref?: string
  getLabel: (labelId: string) => Label | undefined
  onToggle: (id: string) => void
}

export function TaskListSection({
  title,
  tasks,
  emptyMessage,
  viewAllHref,
  getLabel,
  onToggle,
}: Props) {
  const { isExiting } = useTasks()
  const visibleTasks = tasks.slice(0, VISIBLE_LIMIT)
  const showViewAll = viewAllHref && tasks.length > VISIBLE_LIMIT

  return (
    <section className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-section-title">{title}</h2>
        {showViewAll && (
          <Link href={viewAllHref} className="text-xs text-brand-500 hover:underline">
            全て見る →
          </Link>
        )}
      </div>
      {visibleTasks.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {visibleTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              label={getLabel(task.labelId)}
              exiting={isExiting(task.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white md:flex-1 md:flex md:items-center md:justify-center">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      )}
    </section>
  )
}