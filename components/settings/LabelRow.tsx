"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react"

import { Toggle } from "@/components/settings/Toggle"
import { type Label } from "@/types"

const LABEL_NAME_MAX = 10

type Props = {
  label: Label
  isFirst: boolean
  isLast: boolean
  onUpdateName: (id: string, name: string) => void
  onToggleVisible: (id: string, hidden: boolean) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onDelete: (id: string) => void
}

export function LabelRow({
  label,
  isFirst,
  isLast,
  onUpdateName,
  onToggleVisible,
  onMoveUp,
  onMoveDown,
  onDelete,
}: Props) {
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

  const chevronClass =
    "p-0.5 rounded text-gray-400 transition-colors disabled:opacity-30 disabled:cursor-default enabled:cursor-pointer enabled:hover:text-gray-600 enabled:hover:bg-gray-100"

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg group"
    >
      {/* ドラッグハンドル（PC） */}
      <button
        {...attributes}
        {...listeners}
        className="hidden md:block text-gray-300 hover:text-gray-500 transition-colors cursor-grab active:cursor-grabbing"
        aria-label="並び替え"
      >
        <GripVertical size={18} />
      </button>

      {/* 上下ボタン（SP） */}
      <div className="md:hidden flex flex-col">
        <button
          type="button"
          onClick={() => onMoveUp(label.id)}
          disabled={isFirst}
          className={chevronClass}
          aria-label="上に移動"
        >
          <ChevronUp size={14} />
        </button>
        <button
          type="button"
          onClick={() => onMoveDown(label.id)}
          disabled={isLast}
          className={chevronClass}
          aria-label="下に移動"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      {/* 名前 */}
      <div className="flex-1 min-w-0">
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

      {/* 表示トグル（PCのみ） */}
      <Toggle
        checked={!label.hidden}
        onChange={hidden => onToggleVisible(label.id, !hidden)}
        className="hidden md:block"
      />

      {/* 削除 */}
      <button
        type="button"
        onClick={() => onDelete(label.id)}
        className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
        aria-label="削除"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}