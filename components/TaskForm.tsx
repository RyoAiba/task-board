"use client"

import { useState } from "react"
import { Trash2, X } from "lucide-react"

import { useLabels } from "../contexts/LabelsContext"
import { type Priority } from "../types"
import { ConfirmDialog } from "./ConfirmDialog"
import { DueDateChip } from "./DueDateChip"
import { LabelChip } from "./LabelChip"
import { PriorityChip } from "./PriorityChip"
import { StatusChip } from "./StatusChip"

const TITLE_MAX_LENGTH = 50

type FormValues = {
  title: string
  priority?: Priority
  labelId: string
  dueDate: string
  completed: boolean
}

type Props = {
  mode: "create" | "edit"
  initialValues?: FormValues
  onSave: (data: FormValues) => void
  onDelete?: () => void
  onCancel: () => void
}

export function TaskForm({ mode, initialValues, onSave, onDelete, onCancel }: Props) {
  const { labels } = useLabels()

  const [title, setTitle] = useState(initialValues?.title ?? "")
  const [priority, setPriority] = useState<Priority | undefined>(initialValues?.priority)
  const [labelId, setLabelId] = useState(initialValues?.labelId ?? "")
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ?? "")
  const [completed, setCompleted] = useState(initialValues?.completed ?? false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleSave = () => {
    onSave({ title: title.trim(), priority, labelId, dueDate, completed })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* トップアクション */}
      <div className="flex items-center justify-end gap-3">
        {mode === "edit" && onDelete && (
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            aria-label="削除"
          >
            <Trash2 size={20} />
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

      {/* タイトル + カウンター */}
      <div className="relative">
        <input
          type="text"
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={TITLE_MAX_LENGTH}
          placeholder="タスク名を入力..."
          className="w-full px-3 py-2 pr-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
          {title.length}/{TITLE_MAX_LENGTH}
        </span>
      </div>

      {/* Status・Priority・DueDate */}
      <div className="flex flex-wrap gap-2">
        {mode === "edit" && (
          <StatusChip completed={completed} onToggle={() => setCompleted(prev => !prev)} />
        )}
        <PriorityChip value={priority} onChange={setPriority} />
        <DueDateChip value={dueDate} onChange={setDueDate} />
      </div>

      {/* ラベル行（SPは保存ボタンと同行） */}
      <div className="flex items-center gap-2">
        <div className="flex-1 md:flex-none overflow-x-auto md:overflow-visible">
          <LabelChip labels={labels} value={labelId} onChange={setLabelId} />
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="md:hidden flex-shrink-0 py-1.5 px-4 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-colors cursor-pointer"
        >
          保存
        </button>
      </div>

      {/* PC専用 保存行 */}
      <div className="hidden md:flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="py-2 px-6 bg-brand-500 text-white font-semibold rounded-lg hover:opacity-90 transition-colors cursor-pointer"
        >
          保存する
        </button>
      </div>

      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="タスクを削除しますか？"
        message="この操作は取り消せません。"
        confirmLabel="削除する"
        variant="danger"
        onConfirm={() => onDelete?.()}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  )
}