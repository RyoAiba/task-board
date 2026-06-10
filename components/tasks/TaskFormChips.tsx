"use client"

import { DueDateChip } from "../DueDateChip"
import { PriorityChip } from "../PriorityChip"
import { StatusChip } from "../StatusChip"

import type { Priority } from "../../types"

type Props = {
  mode: "create" | "edit"
  priority?: Priority
  onPriorityChange: (priority: Priority | undefined) => void
  dueDate: string
  onDueDateChange: (dueDate: string) => void
  completed: boolean
  onCompletedChange: (completed: boolean) => void
}

export function TaskFormChips({
  mode,
  priority,
  onPriorityChange,
  dueDate,
  onDueDateChange,
  completed,
  onCompletedChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {mode === "edit" && (
        <StatusChip
          completed={completed}
          onToggle={() => onCompletedChange(!completed)}
        />
      )}
      <PriorityChip value={priority} onChange={onPriorityChange} />
      <DueDateChip value={dueDate} onChange={onDueDateChange} />
    </div>
  )
}