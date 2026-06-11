"use client"

type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export function Toggle({ checked, onChange, className = "" }: Props) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${checked ? "bg-brand-500" : "bg-gray-200"} ${className}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  )
}