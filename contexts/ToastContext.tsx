"use client"

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"

import { ToastStack } from "../components/ToastStack"

export type ToastItem = {
  id: string
  message: string
  onUndo?: () => void
}

type ToastContextValue = {
  showToast: (message: string, onUndo?: () => void) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const showToast = useCallback((message: string, onUndo?: () => void) => {
    const id = `toast_${Date.now()}`
    setToasts(prev => [...prev, { id, message, onUndo }])
    const timer = setTimeout(() => dismiss(id), 4000)
    timersRef.current.set(id, timer)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}