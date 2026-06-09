"use client"

import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useTasks } from "../../../contexts/TasksContext"
import { TaskForm } from "../../../components/TaskForm"
import { PageContainer } from "../../../components/PageContainer"

export default function TaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { getTaskById, updateTask, deleteTask } = useTasks()
  const task = getTaskById(id)

  if (!task) {
    return (
      <PageContainer>
        <p className="text-gray-400">タスクが見つかりません</p>
        <Link href="/tasks" className="text-brand-500 hover:underline mt-4 block">
          タスク一覧に戻る
        </Link>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="max-w-2xl">
      <TaskForm
        mode="edit"
        initialValues={{
          title: task.title,
          priority: task.priority,
          labelId: task.labelId,
          dueDate: task.dueDate ?? "",
          completed: task.completed,
        }}
        onSave={({ title, priority, labelId, dueDate, completed }) => {
          updateTask(id, { title, priority, labelId, dueDate: dueDate || undefined, completed })
          router.push("/tasks?toast=saved")
        }}
        onDelete={() => {
          deleteTask(id)
          router.push("/tasks?toast=deleted")
        }}
        onCancel={() => router.back()}
      />
    </PageContainer>
  )
}