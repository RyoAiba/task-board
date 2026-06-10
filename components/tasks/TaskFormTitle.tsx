"use client"

const TITLE_MAX_LENGTH = 50

type Props = {
  value: string
  onChange: (value: string) => void
}

export function TaskFormTitle({ value, onChange }: Props) {
  return (
    <div className="relative">
      <input
        type="text"
        autoFocus
        value={value}
        onChange={e => onChange(e.target.value)}
        maxLength={TITLE_MAX_LENGTH}
        placeholder="タスク名を入力..."
        className="w-full px-3 py-2 pr-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
        {value.length}/{TITLE_MAX_LENGTH}
      </span>
    </div>
  )
}