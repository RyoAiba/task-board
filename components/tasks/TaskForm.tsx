"use client"

import { TaskFormActions } from "./TaskFormActions"
import { TaskFormChips } from "./TaskFormChips"
import { TaskFormFooter } from "./TaskFormFooter"
import { TaskFormTitle } from "./TaskFormTitle"

import type { Priority } from "../../types"

type Props = {
  mode: "create" | "edit"
  title: string
  onTitleChange: (title: string) => void
  priority?: Priority
  onPriorityChange: (priority: Priority | undefined) => void
  labelId: string
  onLabelChange: (labelId: string) => void
  dueDate: string
  onDueDateChange: (dueDate: string) => void
  completed: boolean
  onCompletedChange: (completed: boolean) => void
  onSave: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onCancel: () => void
}

export function TaskForm({
  mode,
  title,
  onTitleChange,
  priority,
  onPriorityChange,
  labelId,
  onLabelChange,
  dueDate,
  onDueDateChange,
  completed,
  onCompletedChange,
  onSave,
  onDelete,
  onDuplicate,
  onCancel,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <TaskFormActions
        mode={mode}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onCancel={onCancel}
      />
      <TaskFormTitle value={title} onChange={onTitleChange} />
      <TaskFormChips
        mode={mode}
        priority={priority}
        onPriorityChange={onPriorityChange}
        dueDate={dueDate}
        onDueDateChange={onDueDateChange}
        completed={completed}
        onCompletedChange={onCompletedChange}
      />
      <TaskFormFooter
        mode={mode}
        labelId={labelId}
        onLabelChange={onLabelChange}
        onSave={onSave}
      />
    </div>
  )
}