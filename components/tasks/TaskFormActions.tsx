"use client"

import { Copy, Trash2, X } from "lucide-react"

type Props = {
  mode: "create" | "edit"
  onDelete?: () => void
  onDuplicate?: () => void
  onCancel: () => void
}

export function TaskFormActions({ mode, onDelete, onDuplicate, onCancel }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold text-gray-700">
        {mode === "edit" ? "タスクを編集" : "タスクを追加"}
      </h2>
      <div className="flex items-center gap-3">
        {mode === "edit" && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            aria-label="削除"
          >
            <Trash2 size={20} />
          </button>
        )}
        {mode === "edit" && onDuplicate && (
          <button
            type="button"
            onClick={onDuplicate}
            className="text-gray-400 hover:text-brand-500 transition-colors cursor-pointer"
            aria-label="複製"
          >
            <Copy size={20} />
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="閉じる"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}