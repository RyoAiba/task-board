import { useCallback, useEffect, useRef } from "react"

import { useToast } from "../contexts/ToastContext"
import { useTasks } from "../contexts/TasksContext"

export function useTaskToggle() {
  const { tasks, toggleCompleted, toggleCompletedImmediate } = useTasks()
  const { showToast } = useToast()

  const tasksRef = useRef(tasks)
  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  const handleToggle = useCallback((id: string) => {
    const task = tasksRef.current.find(t => t.id === id)
    if (!task) return
    toggleCompleted(id)
    if (!task.completed) {
      showToast("タスクを完了しました", () => toggleCompletedImmediate(id))
    }
  }, [toggleCompleted, toggleCompletedImmediate, showToast])

  return { handleToggle }
}