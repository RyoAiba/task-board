"use client"

import { Copy, Trash2 } from "lucide-react"

import { ModalHeader } from "@/components/shared/ModalHeader"

type Props = {
  mode: "create" | "edit"
  onDelete?: () => void
  onDuplicate?: () => void
  onCancel: () => void
}

export function TaskFormActions({ mode, onDelete, onDuplicate, onCancel }: Props) {
  return (
    <ModalHeader
      title={mode === "edit" ? "タスクを編集" : "タスクを追加"}
      onClose={onCancel}
      actions={
        <>
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
        </>
      }
    />
  )
}