"use client"

import { useState } from "react"
import { CalendarDays } from "lucide-react"

import { Chip } from "./Chip"
import { DatePickerModal } from "./DatePickerModal"

type Props = {
  value: string
  onChange: (value: string) => void
}

export function DueDateChip({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)

  const formatted = value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })
    : "期限"

  return (
    <>
      <Chip
        icon={CalendarDays}
        iconClassName={value ? "text-gray-600" : "text-gray-400"}
        label={formatted}
        labelClassName={value ? "text-gray-600" : "text-gray-400"}
        onClick={() => setOpen(true)}
        className="min-w-22"
      />
      {open && (
        <DatePickerModal
          selectedDate={value}
          onSelect={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}