"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

import type { Task } from "../types"

export type TaskModalState =
  | { mode: "closed" }
  | { mode: "create"; initialValues?: Partial<Task> }
  | { mode: "edit"; taskId: string }

type TaskModalContextValue = {
  state: TaskModalState
  openCreate: (opts?: { initialValues?: Partial<Task> }) => void
  openEdit: (taskId: string) => void
  close: () => void
}

const TaskModalContext = createContext<TaskModalContextValue | null>(null)

export function TaskModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TaskModalState>({ mode: "closed" })

  const openCreate = (opts?: { initialValues?: Partial<Task> }) => {
    setState({ mode: "create", initialValues: opts?.initialValues })
  }

  const openEdit = (taskId: string) => {
    setState({ mode: "edit", taskId })
  }

  const close = () => {
    setState({ mode: "closed" })
  }

  return (
    <TaskModalContext.Provider value={{ state, openCreate, openEdit, close }}>
      {children}
    </TaskModalContext.Provider>
  )
}

export function useTaskModal() {
  const ctx = useContext(TaskModalContext)
  if (!ctx) throw new Error("useTaskModal must be used within TaskModalProvider")
  return ctx
}