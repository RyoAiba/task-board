"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTasks } from "../../../hooks/useTasks"
import { useCategories } from "../../../hooks/useCategories"
import { Priority, PRIORITY_LABELS } from "../../../types"

export default function NewTaskPage() {
  const router = useRouter()
  const { addTask } = useTasks()
  const { categories } = useCategories()

  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [categoryId, setCategoryId] = useState("")
  const [errors, setErrors] = useState<{ title?: string; categoryId?: string }>({})

  const validate = () => {
    const newErrors: { title?: string; categoryId?: string } = {}
    if (!title.trim()) newErrors.title = "タスク名を入力してください"
    if (!categoryId) newErrors.categoryId = "カテゴリを選択してください"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    addTask(title.trim(), priority, categoryId)
    router.push("/tasks")
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-page-title mb-8">タスクを作成</h1>

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
            placeholder="タスク名を入力..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FA6218]"
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
            <option value="">カテゴリを選択...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
          )}
        </div>

        {/* ボタン */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/tasks"
            className="flex-1 py-2 text-center border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </Link>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 bg-[#FA6218] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            作成する
          </button>
        </div>
      </div>
    </div>
  )
}