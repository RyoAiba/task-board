"use client"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { LabelRow } from "@/components/settings/LabelRow"
import { type Label } from "@/types"

type Props = {
  labels: Label[]
  onUpdateLabel: (id: string, updates: Partial<Pick<Label, "name" | "hidden" | "order">>) => void
  onDeleteLabel: (id: string) => void
}

export default function LabelRowList({ labels, onUpdateLabel, onDeleteLabel }: Props) {
  // PCのみDnD（TouchSensorは除外）
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return

    const oldIndex = labels.findIndex(l => l.id === active.id)
    const newIndex = labels.findIndex(l => l.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    // ページ内の order スロットを保持したまま並び替え
    const originalOrders = labels.map(l => l.order)
    const reordered = [...labels]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)

    reordered.forEach((label, i) => {
      const newOrder = originalOrders[i]
      if (label.order !== newOrder) {
        onUpdateLabel(label.id, { order: newOrder })
      }
    })
  }

  const swapOrder = (idA: string, idB: string) => {
    const a = labels.find(l => l.id === idA)
    const b = labels.find(l => l.id === idB)
    if (!a || !b) return
    onUpdateLabel(a.id, { order: b.order })
    onUpdateLabel(b.id, { order: a.order })
  }

  const handleMoveUp = (id: string) => {
    const idx = labels.findIndex(l => l.id === id)
    if (idx <= 0) return
    swapOrder(id, labels[idx - 1].id)
  }

  const handleMoveDown = (id: string) => {
    const idx = labels.findIndex(l => l.id === id)
    if (idx === -1 || idx >= labels.length - 1) return
    swapOrder(id, labels[idx + 1].id)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={labels.map(l => l.id)} strategy={verticalListSortingStrategy}>
        <div className="">
          {labels.map((label, i) => (
            <LabelRow
              key={label.id}
              label={label}
              isFirst={i === 0}
              isLast={i === labels.length - 1}
              onUpdateName={(id, name) => onUpdateLabel(id, { name })}
              onToggleVisible={(id, hidden) => onUpdateLabel(id, { hidden })}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onDelete={onDeleteLabel}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}