"use client"

import { useState, useEffect, useRef } from "react"
import { Priority } from "../types"
import { useCategories } from "../hooks/useCategories"
import { PrioritySelector } from "./PrioritySelector"
import { CategorySelector } from "./CategorySelector"
import { DatePickerModal } from "./DatePickerModal"
import { CalendarDays, CheckCircle, Circle } from "lucide-react"

const TITLE_MAX_LENGTH = 50

type FormValues = {
  title: string
  priority?: Priority
  categoryId: string
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
  const { categories } = useCategories()

  const [title, setTitle] = useState(initialValues?.title ?? "")
  const [priority, setPriority] = useState<Priority | undefined>(initialValues?.priority)
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? "")
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ?? "")
  const [completed, setCompleted] = useState(initialValues?.completed ?? false)
  const [errors, setErrors] = useState<{ title?: string }>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const initialized = useRef(false)
  const dateInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (mode === "edit" && initialValues && !initialized.current) {
      setTitle(initialValues.title)
      setPriority(initialValues.priority)
      setCategoryId(initialValues.categoryId)
      setDueDate(initialValues.dueDate ?? "")
      setCompleted(initialValues.completed)
      initialized.current = true
    }
  }, [initialValues, mode])

  const hasChanges = mode === "edit" && initialValues
    ? title !== initialValues.title ||
    priority !== initialValues.priority ||
    categoryId !== initialValues.categoryId ||
    dueDate !== initialValues.dueDate ||
    completed !== initialValues.completed
    : true

  const validate = () => {
    const newErrors: { title?: string } = {}
    if (!title.trim()) newErrors.title = "タスク名を入力してください"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave({ title: title.trim(), priority, categoryId, dueDate, completed })
  }

  return (
    <div className="space-y-6">

      {/* ステータスバッジ（編集時のみ） */}
      {mode === "edit" && (
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">ステータス</label>
          <button
            type="button"
            onClick={() => setCompleted(prev => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${completed
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
          >
            {completed
              ? <CheckCircle size={16} />
              : <Circle size={16} />
            }
            {completed ? "完了済" : "未完了"}
          </button>
        </div>
      )}

      {/* タスク名 */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold text-gray-600">
            タスク名 <span className="text-red-500">*</span>
          </label>
          <span className={`text-xs ${title.length >= TITLE_MAX_LENGTH ? "text-red-500" : "text-gray-400"}`}>
            {title.length} / {TITLE_MAX_LENGTH}
          </span>
        </div>
        <input
          type="text"
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={TITLE_MAX_LENGTH}
          placeholder="タスク名を入力..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* 優先度（任意） */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          優先度
          <span className="text-xs text-gray-400 font-normal ml-2">任意</span>
        </label>
        <PrioritySelector value={priority} onChange={setPriority} />
        {priority && (
          <button
            type="button"
            onClick={() => setPriority(undefined)}
            className="mt-1 text-xs text-gray-400 hover:text-gray-600 underline"
          >
            優先度を削除
          </button>
        )}
      </div>

      {/* カテゴリ（任意） */}
      <div className="w-full sm:w-1/2">
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          カテゴリ
          <span className="text-xs text-gray-400 font-normal ml-2">任意</span>
        </label>
        <CategorySelector categories={categories} value={categoryId} onChange={setCategoryId} />
        {categoryId && (
          <button
            type="button"
            onClick={() => setCategoryId("")}
            className="mt-1 text-xs text-gray-400 hover:text-gray-600 underline"
          >
            カテゴリを削除
          </button>
        )}
      </div>

      {/* 期限（任意） */}
      <div className="w-full sm:w-1/2">
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          期限
          <span className="text-xs text-gray-400 font-normal ml-2">任意</span>
        </label>
        <div className="relative">
          <input
            ref={dateInputRef}
            type="text"
            value={dueDate ? new Date(dueDate + "T00:00:00").toLocaleDateString("ja-JP") : ""}
            readOnly
            placeholder="期限を選択..."
            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 text-gray-600 cursor-pointer bg-white"
            onClick={() => setShowDatePicker(true)}
          />
          <button
            type="button"
            onClick={() => setShowDatePicker(true)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CalendarDays size={16} />
          </button>
        </div>
        {showDatePicker && (
          <DatePickerModal
            selectedDate={dueDate}
            onSelect={setDueDate}
            onClose={() => setShowDatePicker(false)}
          />
        )}
      </div>

      {/* ボタン */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2 text-center border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`flex-1 py-2 font-semibold rounded-lg transition-colors ${hasChanges
            ? "bg-brand-500 text-white hover:opacity-90"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          保存する
        </button>
      </div>

      {/* 削除ボタン（編集時のみ） */}
      {mode === "edit" && onDelete && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="w-full py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-semibold"
          >
            タスクを削除
          </button>
        </div>
      )}

      {/* 削除確認ダイアログ */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowDeleteDialog(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold  mb-2">タスクを削除しますか？</h2>
            <p className="text-sm text-gray-400 mb-6">この操作は取り消せません。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={onDelete}
                className="flex-1 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}