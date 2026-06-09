"use client"

import { useTaskModal } from "../contexts/TaskModalContext"
import { useTasks } from "../contexts/TasksContext"
import { useToast } from "../contexts/ToastContext"
import { Overlay } from "./Overlay"
import { TaskForm } from "./TaskForm"

import type { Task } from "../types"

type FormValues = {
  title: string
  priority?: Task["priority"]
  labelId: string
  dueDate: string
  completed: boolean
}

function toFormValues(task: Partial<Task>): FormValues {
  return {
    title: task.title ?? "",
    priority: task.priority,
    labelId: task.labelId ?? "",
    dueDate: task.dueDate ?? "",
    completed: task.completed ?? false,
  }
}

export function TaskModal() {
  const { state, close } = useTaskModal()
  const { addTask, updateTask, deleteTask, getTaskById } = useTasks()
  const { showToast } = useToast()

  if (state.mode === "closed") return null

  let initialValues: FormValues | undefined = undefined

  if (state.mode === "edit") {
    const task = getTaskById(state.taskId)
    if (!task) {
      close()
      return null
    }
    initialValues = toFormValues(task)
  } else if (state.initialValues) {
    initialValues = toFormValues(state.initialValues)
  }

  const handleSave = (data: FormValues) => {
    if (state.mode === "edit") {
      updateTask(state.taskId, {
        title: data.title,
        priority: data.priority,
        labelId: data.labelId,
        dueDate: data.dueDate || undefined,
        completed: data.completed,
      })
      showToast("タスクを保存しました")
    } else {
      addTask(data.title, data.priority, data.labelId, data.dueDate || undefined)
      showToast("タスクを作成しました")
    }
    close()
  }

  const handleDelete = state.mode === "edit"
    ? () => {
      deleteTask(state.taskId)
      showToast("タスクを削除しました")
      close()
    }
    : undefined

  return (
    <Overlay onBackdropClick={close}>
      <div
        className="bg-white rounded-lg shadow-modal p-6 max-w-2xl w-full mx-4 max-h-[90dvh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <TaskForm
          mode={state.mode}
          initialValues={initialValues}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={close}
        />
      </div>
    </Overlay>
  )
}