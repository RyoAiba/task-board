"use client"

import { useEffect, useState } from "react"

import { type TaskModalState, useTaskModal } from "../contexts/TaskModalContext"
import { useTasks } from "../contexts/TasksContext"
import { useToast } from "../contexts/ToastContext"
import { Overlay } from "./Overlay"
import { TaskForm } from "./TaskForm"

import type { Task } from "../types"

const ANIMATION_DURATION_MS = 200

type FormValues = {
  title: string
  priority?: Task["priority"]
  labelId: string
  dueDate: string
  completed: boolean
}

function toFormValues(task: Partial<Task>): FormValues {
  return {
    title: task.title ?? "",
    priority: task.priority,
    labelId: task.labelId ?? "",
    dueDate: task.dueDate ?? "",
    completed: task.completed ?? false,
  }
}

export function TaskModal() {
  const { state, close } = useTaskModal()
  const { addTask, updateTask, deleteTask, getTaskById } = useTasks()
  const { showToast } = useToast()

  const isOpen = state.mode !== "closed"
  const [mounted, setMounted] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  // 退場アニメーション中も最後のopen状態をrenderするため、別state で保持
  const [renderState, setRenderState] = useState<TaskModalState>(state)
  if (state.mode !== "closed" && state !== renderState) {
    setRenderState(state)
  }

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      let raf2: number | undefined
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setAnimateIn(true))
      })
      return () => {
        cancelAnimationFrame(raf1)
        if (raf2 !== undefined) cancelAnimationFrame(raf2)
      }
    } else {
      setAnimateIn(false)
      const t = setTimeout(() => setMounted(false), ANIMATION_DURATION_MS)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [isOpen, close])

  if (!mounted) return null
  if (renderState.mode === "closed") return null

  let initialValues: FormValues | undefined = undefined

  if (renderState.mode === "edit") {
    const task = getTaskById(renderState.taskId)
    if (!task) {
      close()
      return null
    }
    initialValues = toFormValues(task)
  } else if (renderState.initialValues) {
    initialValues = toFormValues(renderState.initialValues)
  }

  const handleSave = (data: FormValues) => {
    if (renderState.mode === "edit") {
      updateTask(renderState.taskId, {
        title: data.title,
        priority: data.priority,
        labelId: data.labelId,
        dueDate: data.dueDate || undefined,
        completed: data.completed,
      })
      showToast("タスクを保存しました")
    } else {
      addTask(data.title, data.priority, data.labelId, data.dueDate || undefined)
      showToast("タスクを作成しました")
    }
    close()
  }

  const handleDelete = renderState.mode === "edit"
    ? () => {
      deleteTask(renderState.taskId)
      showToast("タスクを削除しました")
      close()
    }
    : undefined

  return (
    <Overlay onBackdropClick={close} bottomSheetOnMobile>
      <div
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className={`bg-white shadow-modal max-h-[90dvh] overflow-y-auto w-full md:max-w-2xl md:mx-4 rounded-t-lg md:rounded-lg p-6 will-change-transform transition-all duration-200 ease-out ${animateIn
          ? "opacity-100 [transform:translateY(0)_scale(1)]"
          : "[transform:translateY(100%)_scale(1)] md:[transform:translateY(0)_scale(0.95)] md:opacity-0"
          }`}
      >
        <TaskForm
          mode={renderState.mode}
          initialValues={initialValues}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={close}
        />
      </div>
    </Overlay>
  )
}