"use client"

import { CheckCircle, Circle } from "lucide-react"

import { Chip } from "./Chip"

type Props = {
  completed: boolean
  onToggle: () => void
}

export function StatusChip({ completed, onToggle }: Props) {
  return (
    <Chip
      icon={completed ? CheckCircle : Circle}
      iconClassName="text-gray-400"
      label={completed ? "完了済" : "未完了"}
      labelClassName={completed ? "text-gray-400" : "text-gray-600"}
      onClick={onToggle}
      className="min-w-22"
    />
  )
}