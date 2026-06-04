import { X } from "lucide-react"
import { ToastItem } from "../hooks/useToast"

type Props = {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export function ToastStack({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-22 left-4 md:bottom-6 md:left-6 z-50 flex flex-col-reverse gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="flex items-center gap-3 bg-gray-800 text-white text-xs font-light px-4 py-3 rounded-lg shadow-lg animate-slide-up"
        >
          <span className="whitespace-nowrap">{toast.message}</span>
          {toast.onUndo && (
            <button
              onClick={() => {
                toast.onUndo?.()
                onDismiss(toast.id)
              }}
              className="text-brand-200 font-normal hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              元に戻す
            </button>
          )}
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}