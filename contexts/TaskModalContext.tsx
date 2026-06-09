"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import { TaskModal } from "../components/TaskModal"

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

  useEffect(() => {
    const handlePopState = () => {
      setState(prev => prev.mode === "closed" ? prev : { mode: "closed" })
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const pushHistoryIfNeeded = () => {
    if (!window.history.state?.taskModal) {
      window.history.pushState({ taskModal: true }, "")
    }
  }

  const openCreate = (opts?: { initialValues?: Partial<Task> }) => {
    pushHistoryIfNeeded()
    setState({ mode: "create", initialValues: opts?.initialValues })
  }

  const openEdit = (taskId: string) => {
    pushHistoryIfNeeded()
    setState({ mode: "edit", taskId })
  }

  const close = () => {
    if (window.history.state?.taskModal) {
      window.history.back()
    } else {
      setState({ mode: "closed" })
    }
  }

  return (
    <TaskModalContext.Provider value={{ state, openCreate, openEdit, close }}>
      {children}
      <TaskModal />
    </TaskModalContext.Provider>
  )
}

export function useTaskModal() {
  const ctx = useContext(TaskModalContext)
  if (!ctx) throw new Error("useTaskModal は TaskModalProvider の内側で呼んでください")
  return ctx
}