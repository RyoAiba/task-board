"use client"

import { useRouter } from "next/navigation"
import { useTasks } from "../../../hooks/useTasks"
import { TaskForm } from "../../../components/TaskForm"
import { PageContainer } from "../../../components/PageContainer"

export default function NewTaskPage() {
  const router = useRouter()
  const { addTask } = useTasks()

  return (
    <PageContainer className="max-w-2xl">
      <TaskForm
        mode="create"
        onSave={({ title, priority, labelId, dueDate }) => {
          addTask(title, priority, labelId, dueDate)
          router.push("/tasks?toast=created")
        }}
        onCancel={() => router.push("/tasks")}
      />
    </PageContainer>
  )
}