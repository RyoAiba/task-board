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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleBlur = () => {
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
        ; (e.target as HTMLInputElement).blur()
    }
  }

  const chevronClass =
    "p-0.5 rounded text-gray-400 transition-colors disabled:opacity-30 disabled:cursor-default enabled:cursor-pointer enabled:hover:text-gray-600 enabled:hover:bg-gray-100"

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 rounded-lg group md:hover:bg-gray-50 transition-colors"
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

      {/* 名前 + 文字数カウンター */}
      <div className="flex-1 min-w-0 relative">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          maxLength={LABEL_NAME_MAX}
          className="peer w-full px-2 py-1 pr-11 text-sm rounded border bg-transparent border-transparent transition-colors focus:outline-none focus:bg-white focus:border-brand-500 hover:bg-white hover:border-gray-200"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none opacity-0 peer-focus:opacity-100 md:group-hover:opacity-100 transition-opacity">
          {name.length}/{LABEL_NAME_MAX}
        </span>
      </div>

      {/* 表示トグル（PCのみ）- ヘッダーの「サイドバーに表示」と中心揃え */}
      <div className="hidden md:flex md:items-center md:justify-center md:w-24 md:mx-1">
        <Toggle
          checked={!label.hidden}
          onChange={hidden => onToggleVisible(label.id, !hidden)}
        />
      </div>

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