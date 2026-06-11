"use client"

import { useEffect, useState } from "react"

import { type TaskModalState, useTaskModal } from "../../contexts/TaskModalContext"
import { useTasks } from "../../contexts/TasksContext"
import { useToast } from "../../contexts/ToastContext"
import { ConfirmDialog } from "../ConfirmDialog"
import { Overlay } from "../Overlay"
import { TaskForm } from "./TaskForm"

import type { Priority, Task } from "../../types"

const ANIMATION_DURATION_MS = 200
const DUPLICATE_DELAY_MS = 100

type FormValues = {
  title: string
  priority?: Priority
  labelId: string
  dueDate: string
  completed: boolean
}

const EMPTY_VALUES: FormValues = {
  title: "",
  priority: undefined,
  labelId: "",
  dueDate: "",
  completed: false,
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

function isFormDirty(values: FormValues, initial: FormValues): boolean {
  return (
    values.title !== initial.title ||
    values.priority !== initial.priority ||
    values.labelId !== initial.labelId ||
    values.dueDate !== initial.dueDate ||
    values.completed !== initial.completed
  )
}

export function TaskModal() {
  const { state, close, openCreate } = useTaskModal()
  const { addTask, updateTask, deleteTask, restoreTask, getTaskById } = useTasks()
  const { showToast } = useToast()

  const isOpen = state.mode !== "closed"
  const [mounted, setMounted] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  const [renderState, setRenderState] = useState<TaskModalState>(state)
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES)
  const [initialValues, setInitialValues] = useState<FormValues>(EMPTY_VALUES)

  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // モーダルが開く度にフォーム値を初期化
  if (state.mode !== "closed" && state !== renderState) {
    setRenderState(state)

    let initial = EMPTY_VALUES
    if (state.mode === "edit") {
      const task = getTaskById(state.taskId)
      if (task) initial = toFormValues(task)
    } else if (state.initialValues) {
      initial = toFormValues(state.initialValues)
    }
    setValues(initial)
    setInitialValues(initial)
  }

  // 編集対象のタスクが消えてたらモーダルを閉じる
  const editingTaskMissing =
    renderState.mode === "edit" && !getTaskById(renderState.taskId)

  useEffect(() => {
    if (editingTaskMissing) close()
  }, [editingTaskMissing, close])

  // 開閉アニメーション
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

  // Escapeキー（dirtyチェック込み）
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (isFormDirty(values, initialValues)) {
        setShowCancelConfirm(true)
      } else {
        close()
      }
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [isOpen, values, initialValues, close])

  if (!mounted) return null
  if (renderState.mode === "closed") return null
  if (editingTaskMissing) return null

  const requestClose = () => {
    if (isFormDirty(values, initialValues)) {
      setShowCancelConfirm(true)
    } else {
      close()
    }
  }

  const handleSave = () => {
    if (renderState.mode === "edit") {
      updateTask(renderState.taskId, {
        title: values.title.trim(),
        priority: values.priority,
        labelId: values.labelId,
        dueDate: values.dueDate || undefined,
        completed: values.completed,
      })
      showToast("タスクを保存しました")
    } else {
      addTask(
        values.title.trim(),
        values.priority,
        values.labelId,
        values.dueDate || undefined,
      )
      showToast("タスクを作成しました")
    }
    close()
  }

  const handleDelete = renderState.mode === "edit"
    ? () => setShowDeleteConfirm(true)
    : undefined

  const handleDeleteConfirmed = () => {
    if (renderState.mode !== "edit") return
    const task = getTaskById(renderState.taskId)
    if (!task) return

    deleteTask(renderState.taskId)
    showToast("タスクを削除しました", () => restoreTask(task))
    setShowDeleteConfirm(false)
    close()
  }

  const handleDuplicate = renderState.mode === "edit"
    ? () => {
      const task = getTaskById(renderState.taskId)
      if (!task) return
      close()
      setTimeout(() => {
        openCreate({
          initialValues: {
            title: task.title,
            priority: task.priority,
            labelId: task.labelId,
            dueDate: task.dueDate,
          },
        })
      }, DUPLICATE_DELAY_MS)
    }
    : undefined

  return (
    <>
      <Overlay onBackdropClick={requestClose} bottomSheetOnMobile>
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
            title={values.title}
            onTitleChange={title => setValues(v => ({ ...v, title }))}
            priority={values.priority}
            onPriorityChange={priority => setValues(v => ({ ...v, priority }))}
            labelId={values.labelId}
            onLabelChange={labelId => setValues(v => ({ ...v, labelId }))}
            dueDate={values.dueDate}
            onDueDateChange={dueDate => setValues(v => ({ ...v, dueDate }))}
            completed={values.completed}
            onCompletedChange={completed => setValues(v => ({ ...v, completed }))}
            onSave={handleSave}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onCancel={requestClose}
          />
        </div>
      </Overlay>

      <ConfirmDialog
        isOpen={showCancelConfirm}
        title="変更を破棄しますか？"
        message="編集内容は保存されません。"
        confirmLabel="破棄する"
        cancelLabel="編集を続ける"
        variant="danger"
        onConfirm={() => {
          setShowCancelConfirm(false)
          close()
        }}
        onCancel={() => setShowCancelConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="タスクを削除しますか？"
        message="この操作は取り消せません。"
        confirmLabel="削除する"
        variant="danger"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  )
}