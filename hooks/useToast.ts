import { useCallback, useRef, useState } from "react"

export type ToastItem = {
  id: string
  message: string
  onUndo?: () => void
}

export function useToast() {
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

  return { toasts, showToast, dismiss }
}