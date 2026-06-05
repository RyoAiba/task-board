"use client"

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

import { type Label } from "../../types"
import { useLabels } from "../../hooks/useLabels"
import { useSettings } from "../../hooks/useSettings"
import { PageContainer } from "../../components/PageContainer"

const LABEL_NAME_MAX = 10

type LabelRowProps = {
  label: Label
  onUpdateName: (id: string, name: string) => void
  onToggleVisible: (id: string, hidden: boolean) => void
}

function LabelRow({ label, onUpdateName, onToggleVisible }: LabelRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: label.id })
  const [name, setName] = useState(label.name)
  const [isEditing, setIsEditing] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleBlur = () => {
    setIsEditing(false)
    const trimmed = name.trim()
    if (trimmed && trimmed !== label.name) {
      onUpdateName(label.id, trimmed)
    } else {
      setName(label.name)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur()
    }
    if (e.key === "Escape") {
      setName(label.name)
      setIsEditing(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white rounded-lg group"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-300 hover:text-gray-500 transition-colors cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </button>

      <div className="flex-1">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          maxLength={LABEL_NAME_MAX}
          className={`w-full px-2 py-1 text-sm rounded border transition-colors focus:outline-none focus:border-brand-500 ${isEditing ? "border-gray-300" : "border-transparent hover:border-gray-200"
            }`}
        />
      </div>

      <button
        onClick={() => onToggleVisible(label.id, !label.hidden)}
        className={`hidden md:block relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${!label.hidden ? "bg-brand-500" : "bg-gray-200"
          }`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${!label.hidden ? "translate-x-5" : "translate-x-0"
          }`} />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const { labels, updateLabel } = useLabels()
  const { settings, updateSetting, isLoaded } = useSettings()
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const sortedLabels = [...labels].sort((a, b) => a.order - b.order)

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return

    const oldIndex = sortedLabels.findIndex(l => l.id === active.id)
    const newIndex = sortedLabels.findIndex(l => l.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    // 並び替え後の配列でorderを振り直す
    const reordered = [...sortedLabels]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    reordered.forEach((label, index) => {
      if (label.order !== index + 1) {
        updateLabel(label.id, { order: index + 1 })
      }
    })
  }

  return (
    <PageContainer>

      {/* ラベル設定 */}
      <section className="mb-8">
        <h2 className="text-section-title mb-4">ラベル</h2>
        <div className="sm:max-w-md">
          {/* ヘッダー行 */}
          <div className="flex items-center gap-3 px-3 pb-2 text-xs text-gray-400">
            <span className="w-[18px] flex-shrink-0" />
            <span className="flex-1 pl-2">ラベル名（10文字まで）</span>
            <span className="hidden md:inline">サイドバーに表示</span>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedLabels.map(l => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {sortedLabels.map(label => (
                  <LabelRow
                    key={label.id}
                    label={label}
                    onUpdateName={(id, name) => updateLabel(id, { name })}
                    onToggleVisible={(id, hidden) => updateLabel(id, { hidden })}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </section>

      {/* カレンダー表示設定 */}
      {isLoaded && (
        <section>
          <h2 className="text-section-title mb-4">カレンダー表示</h2>
          <div className="bg-white rounded-lg p-4 sm:max-w-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <p className="text-sm text-gray-600">完了済みタスクを表示</p>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setTooltipOpen(prev => !prev)}
                    className={`w-4 h-4 rounded-full border text-xs flex items-center justify-center leading-none transition-colors cursor-pointer ${tooltipOpen
                      ? "bg-brand-500 border-brand-500 text-white"
                      : "border-gray-400 text-gray-400 hover:bg-brand-500 hover:border-brand-500 hover:text-white"
                      }`}
                  >
                    ?
                  </button>
                  {tooltipOpen && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg z-10">
                      オフにすると完了済みタスクをカレンダーに表示しません
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => updateSetting("showCompletedInCalendar", !settings.showCompletedInCalendar)}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${settings.showCompletedInCalendar ? "bg-brand-500" : "bg-gray-200"
                  }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.showCompletedInCalendar ? "translate-x-5" : "translate-x-0"
                  }`} />
              </button>
            </div>
          </div>
        </section>
      )}
    </PageContainer>
  )
}