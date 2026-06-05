import { useCallback, useEffect, useRef } from "react"

import { type Task } from "../types"

type ShowToast = (message: string, onUndo?: () => void) => void

export function useTaskToggle(
  tasks: Task[],
  toggleCompleted: (id: string) => void,
  showToast: ShowToast,
) {
  const tasksRef = useRef(tasks)
  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  const handleToggle = useCallback((id: string) => {
    const task = tasksRef.current.find(t => t.id === id)
    if (!task) return
    toggleCompleted(id)
    if (!task.completed) {
      showToast("タスクを完了しました", () => toggleCompleted(id))
    }
  }, [toggleCompleted, showToast])

  return { handleToggle }
}