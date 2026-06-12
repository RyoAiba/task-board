"use client"

import { useCallback } from "react"

import { useLabels } from "@/contexts/LabelsContext"
import { useTasks } from "@/contexts/TasksContext"
import { useToast } from "@/contexts/ToastContext"

export function useLabelDelete() {
  const { labels, updateLabel, deleteLabel, restoreLabel } = useLabels()
  const { tasks, bulkUpdateLabelId } = useTasks()
  const { showToast } = useToast()

  const handleDelete = useCallback((labelId: string) => {
    const target = labels.find(l => l.id === labelId)
    if (!target) return

    // スナップショット
    const affectedTaskIds = tasks
      .filter(t => t.labelId === labelId)
      .map(t => t.id)
    const orderSnapshot = labels.map(l => ({ id: l.id, order: l.order }))

    // 紐づくタスクを未分類化
    bulkUpdateLabelId(affectedTaskIds, "")

    // ラベル削除
    deleteLabel(labelId)

    // 残ラベルの order を詰める
    const remaining = labels.filter(l => l.id !== labelId)
    remaining.forEach((l, i) => {
      const newOrder = i + 1
      if (l.order !== newOrder) {
        updateLabel(l.id, { order: newOrder })
      }
    })

    // Undo
    showToast(`ラベルを削除しました`, () => {
      // 残ラベルの order を元に戻す
      orderSnapshot.forEach(({ id, order }) => {
        if (id === labelId) return
        updateLabel(id, { order })
      })
      // ラベル復活
      restoreLabel(target)
      // 紐づきタスクの labelId を元に戻す
      bulkUpdateLabelId(affectedTaskIds, labelId)
    })
  }, [labels, tasks, updateLabel, deleteLabel, restoreLabel, bulkUpdateLabelId, showToast])

  return { handleDelete }
}