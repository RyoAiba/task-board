import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Category, CATEGORY_DOT_CLASSES } from "../types"

export function CategoryModal({
  categories,
  selected,
  onToggle,
  onClose,
}: {
  categories: Category[]
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
    <div ref={ref} className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-xl w-64 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700">カテゴリを選択</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {categories.map(cat => {
          const checked = selected.includes(cat.id)
          return (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(cat.id)}
                className="w-4 h-4 accent-[#FA6218] cursor-pointer"
              />
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${CATEGORY_DOT_CLASSES[cat.color]}`} />
              <span className={`text-sm ${checked ? "text-gray-800 font-medium" : "text-gray-500"}`}>
                {cat.name}
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