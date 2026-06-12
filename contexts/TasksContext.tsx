"use client"

import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState, type ReactNode } from "react"

import { useLocalStorageSync } from "@/hooks/useLocalStorage"
import { generateDummyTasks } from "@/lib/dummyData"
import { type Priority, type Task } from "@/types"

const STORAGE_KEY = "task-board-tasks"
export const TASK_EXIT_DURATION_MS = 250

type TaskAction =
  | { type: "INIT"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: { id: string; updates: Partial<Omit<Task, "id" | "createdAt">> } }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "TOGGLE_COMPLETED"; payload: string }

function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "INIT":
      return action.payload
    case "ADD_TASK":
      return [...state, action.payload]
    case "UPDATE_TASK":
      return state.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
      )
    case "DELETE_TASK":
      return state.filter(t => t.id !== action.payload)
    case "TOGGLE_COMPLETED":
      return state.map(t =>
        t.id === action.payload ? { ...t, completed: !t.completed } : t
      )
  }
}

type TasksContextType = {
  tasks: Task[]
  isLoaded: boolean
  addTask: (title: string, priority: Priority | undefined, labelId: string, dueDate?: string) => Task
  updateTask: (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => void
  deleteTask: (id: string) => void
  toggleCompleted: (id: string) => void
  toggleCompletedImmediate: (id: string) => void
  isExiting: (id: string) => boolean
  getTaskById: (id: string) => Task | undefined
  restoreTask: (task: Task) => void
}

const TasksContext = createContext<TasksContextType | null>(null)

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, [])
  const [exitingTaskIds, setExitingTaskIds] = useState<Set<string>>(new Set())
  const exitTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const isLoaded = useLocalStorageSync<Task[]>(STORAGE_KEY, tasks, (data) => {
    dispatch({ type: "INIT", payload: data ?? generateDummyTasks() })
  })

  // アンマウント時の保留タイマー解放
  useEffect(() => {
    const timeouts = exitTimeouts.current
    return () => {
      timeouts.forEach(clearTimeout)
      timeouts.clear()
    }
  }, [])

  const clearExit = useCallback((id: string) => {
    const existing = exitTimeouts.current.get(id)
    if (existing) {
      clearTimeout(existing)
      exitTimeouts.current.delete(id)
    }
    setExitingTaskIds(prev => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const addTask = (title: string, priority: Priority | undefined, labelId: string, dueDate?: string): Task => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title,
      priority,
      labelId,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate,
    }
    dispatch({ type: "ADD_TASK", payload: newTask })
    return newTask
  }

  const restoreTask = (task: Task) => {
    dispatch({ type: "ADD_TASK", payload: task })
  }

  const updateTask = (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
    dispatch({ type: "UPDATE_TASK", payload: { id, updates } })
  }

  const deleteTask = (id: string) => {
    dispatch({ type: "DELETE_TASK", payload: id })
  }

  const toggleCompleted = (id: string) => {
    dispatch({ type: "TOGGLE_COMPLETED", payload: id })

    const existing = exitTimeouts.current.get(id)
    if (existing) clearTimeout(existing)

    setExitingTaskIds(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })

    const timeout = setTimeout(() => {
      setExitingTaskIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      exitTimeouts.current.delete(id)
    }, TASK_EXIT_DURATION_MS)

    exitTimeouts.current.set(id, timeout)
  }

  const toggleCompletedImmediate = (id: string) => {
    dispatch({ type: "TOGGLE_COMPLETED", payload: id })
    clearExit(id)
  }

  const isExiting = useCallback((id: string) => exitingTaskIds.has(id), [exitingTaskIds])

  const getTaskById = (id: string) => {
    return tasks.find(t => t.id === id)
  }

  return (
    <TasksContext.Provider value={{
      tasks,
      isLoaded,
      addTask,
      updateTask,
      deleteTask,
      toggleCompleted,
      toggleCompletedImmediate,
      isExiting,
      getTaskById,
      restoreTask,
    }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error("useTasks は TasksProvider の内側で呼んでください")
  return ctx
}