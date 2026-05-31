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

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const formatDate = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day)
    onSelect(formatDate(newDate))
    onClose()
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

  const isSelected = (day: number) =>
    selectedDate === formatDate(new Date(displayDate.getFullYear(), displayDate.getMonth(), day))

  const dayNames = ["日", "月", "火", "水", "木", "金", "土"]

  return (
    <>
      {/* 透明オーバーレイ：サイドバー・ボトムナビも覆う */}
      <div className="fixed inset-0 z-[200]" onClick={onClose} />

      {/* カレンダー本体：画面中央 */}
      <div
        ref={ref}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] bg-white rounded-xl shadow-xl w-80 p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-600">
            {displayDate.getFullYear()}年{displayDate.getMonth() + 1}月
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1))}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <div className="flex-1" />
          <button
            onClick={() => setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1))}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-xs text-center font-semibold text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
          {days.map(day => (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`w-8 h-8 text-sm rounded transition-colors mx-auto flex items-center justify-center ${isSelected(day)
                ? "bg-primary text-white font-semibold"
                : isToday(day)
                  ? "border border-primary text-primary font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {day}
            </button>
          ))}
        </div>

        {selectedDate && (
          <button
            onClick={() => { onSelect(""); onClose() }}
            className="mt-3 w-full text-xs text-gray-400 hover:text-gray-600 underline py-1"
          >
            期限を削除
          </button>
        )}
      </div>
    </>
  )
}