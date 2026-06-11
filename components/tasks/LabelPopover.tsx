import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Label } from "../../types"

export function LabelModal({
  labels,
  selected,
  onToggle,
  onClose,
}: {
  labels: Label[]
  selected: string[]
  onToggle: (id: string) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  return (
    <div ref={ref} className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-modal w-64 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-600">ラベルを選択</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {labels.map(label => {
          const checked = selected.includes(label.id)
          return (
            <label key={label.id} className="flex items-center gap-2.5 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(label.id)}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
              <div className="w-2 h-2 rounded-full flex-shrink-0 bg-gray-400" />
              <span className={`text-sm ${checked ? " font-medium" : "text-gray-400"}`}>
                {label.name}
              </span>
            </label>
          )
        })}
      </div>
      {selected.length > 0 && (
        <button
          onClick={() => selected.forEach(id => onToggle(id))}
          className="mt-3 text-xs text-gray-400 hover:text-gray-600 underline"
        >
          選択をリセット
        </button>
      )}
    </div>
  )
}