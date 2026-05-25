"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

type Props = {
  selectedDate: string
  onSelect: (date: string) => void
  onClose: () => void
}

export function DatePickerModal({ selectedDate, onSelect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [displayDate, setDisplayDate] = useState(new Date())

  useEffect(() => {
    if (selectedDate) {
      const [year, month, day] = selectedDate.split("-").map(Number)
      setDisplayDate(new Date(year, month - 1, day))
    } else {
      setDisplayDate(new Date())
    }
  }, [selectedDate])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1))
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day)
    onSelect(formatDate(newDate))
    onClose()
  }

  const handleReset = () => {
    onSelect("")
  }

  const daysInMonth = getDaysInMonth(displayDate)
  const firstDay = getFirstDayOfMonth(displayDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      displayDate.getMonth() === today.getMonth() &&
      displayDate.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    return selectedDate === formatDate(new Date(displayDate.getFullYear(), displayDate.getMonth(), day))
  }

  const dayNames = ["日", "月", "火", "水", "木", "金", "土"]

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-xl w-80 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">
          {displayDate.getFullYear()}年{displayDate.getMonth() + 1}月
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
        <div className="flex-1" />
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronRight size={18} className="text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-xs text-center font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map(day => (
          <button
            key={day}
            onClick={() => handleDateClick(day)}
            className={`w-8 h-8 text-sm rounded transition-colors ${isSelected(day)
                ? "bg-primary text-white font-semibold"
                : isToday(day)
                  ? "border-2 border-primary text-primary font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {day}
          </button>
        ))}
      </div>

      {selectedDate && (
        <button
          onClick={handleReset}
          className="mt-3 w-full text-xs text-gray-400 hover:text-gray-600 underline py-1"
        >
          期限を削除
        </button>
      )}
    </div>
  )
}
