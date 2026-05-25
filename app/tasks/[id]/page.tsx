"use client"

import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useTasks } from "../../../hooks/useTasks"
import { TaskForm } from "../../../components/TaskForm"

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { getTaskById, updateTask, deleteTask } = useTasks()
  const task = getTaskById(id)

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

  return (
    <div className="max-w-2xl">
      <h1 className="text-page-title mb-8">タスクを編集</h1>
      <TaskForm
        mode="edit"
        initialValues={{
          title: task.title,
          priority: task.priority,
          categoryId: task.categoryId,
          dueDate: task.dueDate ?? "",
        }}
        onSave={({ title, priority, categoryId, dueDate }) => {
          updateTask(id, { title, priority, categoryId, dueDate: dueDate || undefined })
          router.push("/tasks?toast=saved")
        }}
        onDelete={() => {
          deleteTask(id)
          router.push("/tasks?toast=deleted")
        }}
        onCancel={() => router.back()}
      />
    </div>
  )
}