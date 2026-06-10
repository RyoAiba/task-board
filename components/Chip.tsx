"use client"

import type { LucideIcon } from "lucide-react"

type Props = {
  icon: LucideIcon
  iconClassName?: string
  label: string
  labelClassName?: string
  onClick?: () => void
  className?: string
}

export function Chip({
  icon: Icon,
  iconClassName = "text-gray-400",
  label,
  labelClassName = "text-gray-400",
  onClick,
  className = "",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer text-sm bg-white ${className}`}
    >
      <Icon size={14} className={iconClassName} />
      <span className={labelClassName}>{label}</span>
    </button>
  )
}