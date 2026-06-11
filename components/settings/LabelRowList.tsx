"use client"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { type Label } from "../../types"
import { LabelRow } from "../../components/settings/LabelRow"

type Props = {
  labels: Label[]
  onUpdateLabel: (id: string, updates: Partial<Pick<Label, "name" | "hidden" | "order">>) => void
}

export default function LabelRowList({ labels, onUpdateLabel }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return

    const oldIndex = labels.findIndex(l => l.id === active.id)
    const newIndex = labels.findIndex(l => l.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = [...labels]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    reordered.forEach((label, index) => {
      if (label.order !== index + 1) {
        onUpdateLabel(label.id, { order: index + 1 })
      }
    })
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={labels.map(l => l.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {labels.map(label => (
            <LabelRow
              key={label.id}
              label={label}
              onUpdateName={(id, name) => onUpdateLabel(id, { name })}
              onToggleVisible={(id, hidden) => onUpdateLabel(id, { hidden })}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
