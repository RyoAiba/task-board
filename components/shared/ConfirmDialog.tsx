"use client"

import { Overlay } from "@/components/shared/Overlay"

type Props = {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "default"
  onConfirm: () => void
  onCancel: () => void
}

const CONFIRM_CLASS = {
  danger: "bg-red-500 text-white hover:bg-red-600",
  default: "bg-brand-500 text-white hover:opacity-90",
} as const

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "キャンセル",
  variant = "default",
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null

  return (
    <Overlay dim onBackdropClick={onCancel} level="above">
      <div
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-sm text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 font-semibold rounded-lg transition-colors ${CONFIRM_CLASS[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Overlay>
  )
}