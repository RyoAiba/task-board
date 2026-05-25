"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTasks } from "../../../hooks/useTasks"
import { useCategories } from "../../../hooks/useCategories"
import { Priority } from "../../../types"
import { CategorySelector } from "../../../components/CategorySelector"
import { PrioritySelector } from "../../../components/PrioritySelector"

const TITLE_MAX_LENGTH = 50

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