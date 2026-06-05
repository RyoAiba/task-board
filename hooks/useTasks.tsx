"use client"

import { createContext, useContext, useReducer, useEffect, useRef, useState, ReactNode } from "react"
import { Task, Priority } from "../types"
import { generateDummyTasks } from "../lib/dummyData"

const STORAGE_KEY = "task-board-tasks"

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
  getTaskById: (id: string) => Task | undefined
}

const TasksContext = createContext<TasksContextType | null>(null)

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, [])
  const isInitialized = useRef(false)
  const [isLoaded, setIsLoaded] = useState(false)

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
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

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

  return (
    <TasksContext.Provider value= {{ tasks, isLoaded, addTask, updateTask, deleteTask, toggleCompleted, getTaskById }
}>
  { children }
  </TasksContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error("TasksProvider未設定")
  return ctx
}