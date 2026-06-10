"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Flame } from "lucide-react"

import { useTaskModal } from "../contexts/TaskModalContext"
import { type Task, PRIORITY_ORDER, PRIORITY_TEXT } from "../types"
import { useSettings } from "../hooks/useSettings"

type Props = {
  tasks: Task[]
}

const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"]

const MAX_VISIBLE_TASKS_BY_WEEKS: Record<number, number> = {
  4: 4,
  5: 3,
  6: 2,
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function getDayColor(dayOfWeek: number, isCurrentMonth: boolean, isToday: boolean): string {
  if (!isCurrentMonth) return "text-gray-300"
  if (isToday) return "text-brand-500 font-semibold"
  if (dayOfWeek === 0) return "text-red-500"
  if (dayOfWeek === 6) return "text-blue-500"
  return "text-gray-600"
}

export function WeeklyCalendarDesktop({ tasks }: Props) {
  const { settings } = useSettings()
  const { openEdit } = useTaskModal()

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const weeks = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    const lastDay = new Date(viewYear, viewMonth + 1, 0)

    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - startDate.getDay())

    const endDate = new Date(lastDay)
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))

    const result: Date[][] = []
    const current = new Date(startDate)
    while (current <= endDate) {
      const week: Date[] = []
      for (let i = 0; i < 7; i++) {
        week.push(new Date(current))
        current.setDate(current.getDate() + 1)
      }
      result.push(week)
    }
    return result
  }, [viewYear, viewMonth])

  const maxVisibleTasks = MAX_VISIBLE_TASKS_BY_WEEKS[weeks.length] ?? 3

  const getTasksForDate = (dateStr: string): Task[] => {
    return tasks
      .filter(t => {
        if (t.dueDate !== dateStr) return false
        if (!settings.showCompletedInCalendar && t.completed) return false
        return true
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed)
        const orderA = a.priority ? PRIORITY_ORDER[a.priority] : 99
        const orderB = b.priority ? PRIORITY_ORDER[b.priority] : 99
        return orderA - orderB
      })
  }

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(y => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth(m => m - 1)
    }
  }

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(y => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth(m => m + 1)
    }
  }

  const goToToday = () => {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
  }

  const todayStr = formatDate(today)

  return (
    <section className="mb-8">
      <h2 className="text-section-title mb-4">カレンダー</h2>

      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={goToToday}
          className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
        >
          今日
        </button>
        <button
          onClick={goToPrevMonth}
          className="p-1 text-gray-600 hover:text-brand-500 transition-colors cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goToNextMonth}
          className="p-1 text-gray-600 hover:text-brand-500 transition-colors cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
        <h3 className="text-base font-medium ml-2">
          {viewYear}年 {viewMonth + 1}月
        </h3>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col h-[600px]">
        <div className="grid grid-cols-7 flex-shrink-0">
          {DAY_NAMES.map((day, i) => (
            <div
              key={day}
              className={`px-2 py-1.5 text-xs text-center ${i < 6 ? "border-r border-gray-200" : ""} ${getDayColor(i, true, false)}`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 flex-1 min-h-0">
              {week.map((date, dayIndex) => {
                const dateStr = formatDate(date)
                const isToday = dateStr === todayStr
                const isCurrentMonth = date.getMonth() === viewMonth
                const dayColor = getDayColor(date.getDay(), isCurrentMonth, isToday)
                const allTasks = getTasksForDate(dateStr)
                const visibleTasks = allTasks.slice(0, maxVisibleTasks)
                const remainingCount = allTasks.length - maxVisibleTasks

                const borderTop = weekIndex > 0 ? "border-t border-gray-200" : ""
                const borderRight = dayIndex < 6 ? "border-r border-gray-200" : ""
                const bgToday = isToday ? "bg-brand-100/40" : ""

                return (
                  <div
                    key={dateStr}
                    className={`p-1.5 overflow-hidden ${borderTop} ${borderRight} ${bgToday}`}
                  >
                    <div className={`text-xs text-center mb-1 ${dayColor}`}>
                      {date.getDate()}
                    </div>

                    <div className="space-y-0.5">
                      {visibleTasks.map(task => {
                        const titleColor = !task.title
                          ? "text-gray-300"
                          : isCurrentMonth
                            ? "text-gray-600"
                            : "text-gray-300"
                        return (
                          <button
                            key={task.id}
                            type="button"
                            onClick={() => openEdit(task.id)}
                            className={`w-full text-left flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-gray-50 transition-colors cursor-pointer ${task.completed ? "opacity-40" : ""}`}
                          >
                            <Flame
                              size={10}
                              className={`flex-shrink-0 ${task.priority ? PRIORITY_TEXT[task.priority] : "text-gray-300"}`}
                            />
                            <span className={`text-xs truncate ${titleColor} ${task.completed ? "line-through" : ""}`}>
                              {task.title || "(タイトルなし)"}
                            </span>
                          </button>
                        )
                      })}
                      {remainingCount > 0 && (
                        <Link
                          href={`/tasks?dueDate=${dateStr}`}
                          className="block px-1.5 py-0.5 text-xs text-brand-500 hover:bg-brand-100 rounded transition-colors font-medium"
                        >
                          他{remainingCount}件
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}