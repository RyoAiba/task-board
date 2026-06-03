import { Priority, PRIORITY_LABELS, PRIORITY_PRIMARY, PRIORITY_MIDDLE } from "../types"

type Props = {
  value: Priority | undefined
  onChange: (priority: Priority | undefined) => void
}

const PRIORITY_BORDER: Record<Priority, string> = {
  high: "border-priority-high",
  medium: "border-priority-medium",
  low: "border-priority-low",
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
            ? `${PRIORITY_MIDDLE[p]} ${PRIORITY_BORDER[p]}`
            : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
            }`}
        >
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${PRIORITY_PRIMARY[p]}`} />
          {PRIORITY_LABELS[p]}
        </button>
      ))}
    </div>
  )
}