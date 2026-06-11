"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"

import { TaskModal } from "../components/tasks/TaskModal"

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
  const closingRef = useRef(false)

  useEffect(() => {
    const handlePopState = () => {
      setState(prev => prev.mode === "closed" ? prev : { mode: "closed" })
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // closeが完了（state.mode === "closed"）したらロック解除
  useEffect(() => {
    if (state.mode === "closed") {
      closingRef.current = false
    }
  }, [state.mode])

  const pushHistoryIfNeeded = () => {
    if (!window.history.state?.taskModal) {
      window.history.pushState({ taskModal: true }, "")
    }
  }

  const openCreate = useCallback((opts?: { initialValues?: Partial<Task> }) => {
    pushHistoryIfNeeded()
    setState({ mode: "create", initialValues: opts?.initialValues })
  }, [])

  const openEdit = useCallback((taskId: string) => {
    pushHistoryIfNeeded()
    setState({ mode: "edit", taskId })
  }, [])

  const close = useCallback(() => {
    if (closingRef.current) return  // 多重close防止
    closingRef.current = true

    if (window.history.state?.taskModal) {
      window.history.back()
    } else {
      setState({ mode: "closed" })
    }
  }, [])

  const value = useMemo(
    () => ({ state, openCreate, openEdit, close }),
    [state, openCreate, openEdit, close]
  )

  return (
    <TaskModalContext.Provider value={value}>
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