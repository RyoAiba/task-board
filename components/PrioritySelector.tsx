import { Priority, PRIORITY_LABELS } from "../types"

type Props = {
  value: Priority
  onChange: (priority: Priority) => void
}

const PRIORITY_ACTIVE_CLASSES: Record<Priority, string> = {
  high: "border-red-500 bg-red-50 text-red-600",
  medium: "border-amber-500 bg-amber-50 text-amber-600",
  low: "border-green-500 bg-green-50 text-green-600",
}

const PRIORITY_DOT_CLASSES: Record<Priority, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-green-500",
}

export function PrioritySelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {(Object.keys(PRIORITY_LABELS) as Priority[]).map(p => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-semibold transition-colors ${value === p
              ? PRIORITY_ACTIVE_CLASSES[p]
              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }`}
        >
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${PRIORITY_DOT_CLASSES[p]}`} />
          {PRIORITY_LABELS[p]}
        </button>
      ))}
    </div>
  )
}