"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useTasks } from "../../../hooks/useTasks"
import { useCategories } from "../../../hooks/useCategories"
import { Priority } from "../../../types"
import { CategorySelector } from "../../../components/CategorySelector"
import { PrioritySelector } from "../../../components/PrioritySelector"

const TITLE_MAX_LENGTH = 50

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { getTaskById, updateTask, deleteTask } = useTasks()
  const { categories } = useCategories()

  const task = getTaskById(id)

  const [title, setTitle] = useState(task?.title ?? "")
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "medium")
  const [categoryId, setCategoryId] = useState(task?.categoryId ?? "")
  const [errors, setErrors] = useState<{ title?: string; categoryId?: string }>({})
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const initialized = useRef(false)

  // tasksの非同期読み込み後にフォームを初期化する
  useEffect(() => {
    if (task && !initialized.current) {
      setTitle(task.title)
      setPriority(task.priority)
      setCategoryId(task.categoryId)
      initialized.current = true
    }
  }, [task])

  if (!task) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <p className="text-gray-500">タスクが見つかりません</p>
        <Link href="/tasks" className="text-primary hover:underline mt-4 block">
          タスク一覧に戻る
        </Link>
      </div>
    )
  }

  const validate = () => {
    const newErrors: { title?: string; categoryId?: string } = {}
    if (!title.trim()) newErrors.title = "タスク名を入力してください"
    if (!categoryId) newErrors.categoryId = "カテゴリを選択してください"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    updateTask(id, { title: title.trim(), priority, categoryId })
    router.back()
  }

  const handleDelete = () => {
    deleteTask(id)
    router.back()
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-page-title mb-8">タスクを編集</h1>

      <div className="space-y-6">
        {/* タスク名 */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              タスク名 <span className="text-red-500">*</span>
            </label>
            <span className={`text-xs ${title.length >= TITLE_MAX_LENGTH ? "text-red-500" : "text-gray-400"}`}>
              {title.length} / {TITLE_MAX_LENGTH}
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={TITLE_MAX_LENGTH}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* 優先度 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            優先度
          </label>
          <PrioritySelector value={priority} onChange={setPriority} />
        </div>

        {/* カテゴリ */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            カテゴリ
          </label>
          <CategorySelector
            categories={categories}
            value={categoryId}
            onChange={setCategoryId}
          />
          {errors.categoryId && (
            <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
          )}
        </div>

        {/* ボタン */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => router.back()}
            className="flex-1 py-2 text-center border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            保存する
          </button>
        </div>

        {/* 削除ボタン */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="w-full py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-semibold"
          >
            タスクを削除
          </button>
        </div>
      </div>

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
            <h2 className="text-lg font-bold text-gray-800 mb-2">タスクを削除しますか？</h2>
            <p className="text-sm text-gray-500 mb-6">この操作は取り消せません。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
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