"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

import { type Label } from "../../types"
import { Toggle } from "./Toggle"

const LABEL_NAME_MAX = 10

type Props = {
  label: Label
  onUpdateName: (id: string, name: string) => void
  onToggleVisible: (id: string, hidden: boolean) => void
}

export function LabelRow({ label, onUpdateName, onToggleVisible }: Props) {
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

      <Toggle
        checked={!label.hidden}
        onChange={hidden => onToggleVisible(label.id, !hidden)}
        className="hidden md:block"
      />
    </div>
  )
}