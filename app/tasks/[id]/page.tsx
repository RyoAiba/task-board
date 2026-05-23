"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useTasks } from "../../../hooks/useTasks"
import { useCategories } from "../../../hooks/useCategories"
import { Priority, PRIORITY_LABELS } from "../../../types"

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  if (!task) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <p className="text-gray-500">タスクが見つかりません</p>
        <Link href="/tasks" className="text-[#FA6218] hover:underline mt-4 block">
          タスク一覧に戻る
        </Link>
      </div>
    )
  }

  const handleSave = () => {
    if (!title.trim()) return
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            タスク名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FA6218]"
          />
        </div>

        {/* 優先度 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            優先度
          </label>
          <div className="flex gap-2">
            {(Object.keys(PRIORITY_LABELS) as Priority[]).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-semibold transition-colors ${priority === p
                  ? p === "high"
                    ? "border-red-500 bg-red-50 text-red-600"
                    : p === "medium"
                      ? "border-amber-500 bg-amber-50 text-amber-600"
                      : "border-green-500 bg-green-50 text-green-600"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
              >
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${p === "high" ? "bg-red-500" : p === "medium" ? "bg-amber-500" : "bg-green-500"
                  }`} />
                {PRIORITY_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* カテゴリ */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            カテゴリ
          </label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FA6218]"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
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
            className="flex-1 py-2 bg-[#FA6218] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
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