"use client"

import { useReducer, useEffect, useRef } from "react"
import { Task, Priority } from "../types"
import { generateDummyTasks } from "../lib/dummyData"

const STORAGE_KEY = "task-board-tasks"

// ─── アクション定義 ───────────────────────────────────────
type TaskAction =
  | { type: "INIT"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: { id: string; updates: Partial<Omit<Task, "id" | "createdAt">> } }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "TOGGLE_COMPLETED"; payload: string }

// ─── reducer ─────────────────────────────────────────────
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

// ─── フック ───────────────────────────────────────────────
export function useTasks() {
  const [tasks, dispatch] = useReducer(taskReducer, [])
  const isInitialized = useRef(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        dispatch({ type: "INIT", payload: JSON.parse(stored) })
      } catch {
        dispatch({ type: "INIT", payload: generateDummyTasks() })
      }
    } else {
      dispatch({ type: "INIT", payload: generateDummyTasks() })
    }
  }, [])

  useEffect(() => {
    // 初回レンダリング（tasks=[]）では保存しない
    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = (title: string, priority: Priority | undefined, categoryId: string, dueDate?: string): Task => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title,
      priority,
      categoryId,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate,
    }
    dispatch({ type: "ADD_TASK", payload: newTask })
    return newTask
  }

  const updateTask = (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>): void => {
    dispatch({ type: "UPDATE_TASK", payload: { id, updates } })
  }

  const deleteTask = (id: string): void => {
    dispatch({ type: "DELETE_TASK", payload: id })
  }

  const toggleCompleted = (id: string): void => {
    dispatch({ type: "TOGGLE_COMPLETED", payload: id })
  }

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find(t => t.id === id)
  }

  return { tasks, addTask, updateTask, deleteTask, toggleCompleted, getTaskById }
}