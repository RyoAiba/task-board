import { Priority, PRIORITY_LABELS, PRIORITY_DOT_CLASSES } from "../types"

type Props = {
  value: Priority | undefined
  onChange: (priority: Priority | undefined) => void
}

const PRIORITY_ACTIVE_CLASSES: Record<Priority, string> = {
  high: "border-red-500 bg-red-50 text-red-600",
  medium: "border-amber-500 bg-amber-50 text-amber-600",
  low: "border-blue-500 bg-blue-50 text-blue-600",  // ← 変更
}

export function PrioritySelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {(Object.keys(PRIORITY_LABELS) as Priority[]).map(p => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(value === p ? undefined : p)}
          className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold transition-colors ${value === p
            ? PRIORITY_ACTIVE_CLASSES[p]
            : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
            }`}
        >
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${PRIORITY_DOT_CLASSES[p]}`} />
          {PRIORITY_LABELS[p]}
        </button>
      ))}
    </div>
  )
}