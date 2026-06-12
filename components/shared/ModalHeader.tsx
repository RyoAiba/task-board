"use client"

import type { ReactNode } from "react"
import { X } from "lucide-react"

type Props = {
  title: string
  onClose: () => void
  actions?: ReactNode
}

export function ModalHeader({ title, onClose, actions }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold text-gray-700">{title}</h2>
      <div className="flex items-center gap-3">
        {actions}
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="閉じる"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}