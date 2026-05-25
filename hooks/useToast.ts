import { useState } from "react"

type Toast = {
  message: string
  visible: boolean
}

export function useToast() {
  const [toast, setToast] = useState<Toast>({ message: "", visible: false })

  const showToast = (message: string) => {
    setToast({ message, visible: true })
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2500)
  }

  return { toast, showToast }
}