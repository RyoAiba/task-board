"use client"

import { useRouter } from "next/navigation"
import { useTasks } from "../../../hooks/useTasks"
import { TaskForm } from "../../../components/TaskForm"

export default function NewTaskPage() {
  const router = useRouter()
  const { addTask } = useTasks()

  return (
    <div className="max-w-2xl">
      <h1 className="text-page-title mb-8">タスクを作成</h1>
      <TaskForm
        mode="create"
        onSave={({ title, priority, categoryId, dueDate }) => {
          addTask(title, priority, categoryId, dueDate)
          router.push("/tasks?toast=created")
        }}
        onCancel={() => router.push("/tasks")}
      />
    </div>
  )
}