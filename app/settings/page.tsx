"use client"

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"

import { useLabels } from "../../contexts/LabelsContext"
import { useSettings } from "../../hooks/useSettings"
import { LabelRow } from "../../components/LabelRow"
import { PageContainer } from "../../components/PageContainer"

export default function SettingsPage() {
  const { labels, updateLabel } = useLabels()
  const { settings, updateSetting, isLoaded } = useSettings()
  const [tooltipOpen, setTooltipOpen] = useState(false)

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

    const reordered = [...labels]
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
          <div className="flex items-center gap-3 px-3 pb-2 text-xs text-gray-400">
            <span className="w-[18px] flex-shrink-0" />
            <span className="flex-1 pl-2">ラベル名（10文字まで）</span>
            <span className="hidden md:inline">サイドバーに表示</span>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={labels.map(l => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {labels.map(label => (
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