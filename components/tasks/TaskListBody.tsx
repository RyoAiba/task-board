"use client"

import { Pagination } from "@/components/Pagination"
import { TaskCard } from "@/components/tasks/TaskCard"
import { useTasks } from "@/contexts/TasksContext"
import { useTaskToggle } from "@/hooks/useTaskToggle"
import { type Label, type PageSize, type Task } from "@/types"

type Props = {
  tasks: Task[]
  labels: Label[]
  currentPage: number
  pageSize: PageSize
  onPageChange: (page: number) => void
  onPageSizeChange: (size: PageSize) => void
}

export function TaskListBody({ tasks, labels, currentPage, pageSize, onPageChange, onPageSizeChange }: Props) {
  const { isExiting } = useTasks()
  const { handleToggle } = useTaskToggle()

  const totalPages = Math.max(1, Math.ceil(tasks.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pagedTasks = tasks.slice((safePage - 1) * pageSize, safePage * pageSize)

  const getLabel = (labelId: string) => labels.find(label => label.id === labelId)

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-6 py-6">
      {pagedTasks.length > 0 ? (
        <>
          {totalPages > 1 && (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalCount={tasks.length}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          )}
          <div className="divide-y divide-gray-200 my-4">
            {pagedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                label={getLabel(task.labelId)}
                exiting={isExiting(task.id)}
                onToggle={handleToggle}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalCount={tasks.length}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-body">タスクがありません</p>
        </div>
      )}
    </div>
  )
}