import { useCallback, useEffect, useRef } from "react"

import { useToast } from "../contexts/ToastContext"
import { useTasks } from "./useTasks"

export function useTaskToggle() {
  const { tasks, toggleCompleted } = useTasks()
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
      showToast("タスクを完了しました", () => toggleCompleted(id))
    }
  }, [toggleCompleted, showToast])

  return { handleToggle }
}