"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Flame, X } from "lucide-react"

import { useTaskModal } from "../../contexts/TaskModalContext"
import { useSettings } from "../../contexts/SettingsContext"
import { type Task, PRIORITY_TEXT } from "../../types"
import { DAY_NAMES, formatDate, getTasksForDate } from "../../utils/calendar"

type Props = {
  tasks: Task[]
}

const MAX_VISIBLE_TASKS_BY_WEEKS: Record<number, number> = {
  4: 4,
  5: 3,
  6: 2,
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
  const { openCreate, openEdit } = useTaskModal()

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [popupDate, setPopupDate] = useState<string | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopupDate(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

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

  const handlePopupTaskClick = (taskId: string) => {
    setPopupDate(null)
    openEdit(taskId)
  }

  const todayStr = formatDate(today)
  const firstWeek = weeks[0]

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
          {DAY_NAMES.map((day, i) => {
            const headerDate = firstWeek?.[i]
            return (
              <div
                key={day}
                onClick={() => headerDate && openCreate({ initialValues: { dueDate: formatDate(headerDate) } })}
                className={`px-2 py-1.5 text-xs text-center cursor-pointer ${i < 6 ? "border-r border-gray-200" : ""} ${getDayColor(i, true, false)}`}
              >
                {day}
              </div>
            )
          })}
        </div>

        <div className="flex-1 flex flex-col">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 flex-1 min-h-0">
              {week.map((date, dayIndex) => {
                const dateStr = formatDate(date)
                const isToday = dateStr === todayStr
                const isCurrentMonth = date.getMonth() === viewMonth
                const dayColor = getDayColor(date.getDay(), isCurrentMonth, isToday)
                const allTasks = getTasksForDate(tasks, dateStr, settings.showCompletedInCalendar)
                const visibleTasks = allTasks.slice(0, maxVisibleTasks)
                const remainingCount = allTasks.length - maxVisibleTasks

                const borderTop = weekIndex > 0 ? "border-t border-gray-200" : ""
                const borderRight = dayIndex < 6 ? "border-r border-gray-200" : ""
                const bgToday = isToday ? "bg-brand-100/40" : ""
                const taskHover = isToday ? "hover:bg-brand-150" : "hover:bg-gray-50"

                return (
                  <div
                    key={dateStr}
                    onClick={() => openCreate({ initialValues: { dueDate: dateStr } })}
                    className={`p-1.5 overflow-hidden cursor-pointer ${borderTop} ${borderRight} ${bgToday}`}
                  >
                    <div className={`text-xs text-center mb-1 ${dayColor}`}>
                      {date.getDate()}
                    </div>

                    <div className="space-y-0.5">
                      {visibleTasks.map(task => (
                        <button
                          key={task.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            openEdit(task.id)
                          }}
                          className={`w-full text-left flex items-center gap-1.5 px-1.5 py-0.5 rounded transition-colors cursor-pointer ${taskHover}`}
                        >
                          <Flame
                            size={10}
                            className={`flex-shrink-0 ${task.priority ? PRIORITY_TEXT[task.priority] : "text-gray-300"}`}
                          />
                          <span className={`text-xs truncate ${task.completed
                            ? "text-gray-400 line-through"
                            : isCurrentMonth
                              ? "text-gray-600"
                              : "text-gray-300"
                            }`}>
                            {task.title || "(タイトルなし)"}
                          </span>
                        </button>
                      ))}
                      {remainingCount > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPopupDate(dateStr)
                          }}
                          className="block w-full text-left px-1.5 py-0.5 text-xs text-brand-500 hover:bg-brand-100 rounded transition-colors font-medium cursor-pointer"
                        >
                          他{remainingCount}件
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {popupDate && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPopupDate(null)} />
          <div
            ref={popupRef}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-modal w-120 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">
                {(() => {
                  const d = new Date(`${popupDate}T00:00:00`)
                  return `${d.getMonth() + 1}/${d.getDate()}(${DAY_NAMES[d.getDay()]})`
                })()}
              </h3>
              <button onClick={() => setPopupDate(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {getTasksForDate(tasks, popupDate, settings.showCompletedInCalendar).map(task => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => handlePopupTaskClick(task.id)}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Flame
                    size={12}
                    className={`flex-shrink-0 ${task.priority ? PRIORITY_TEXT[task.priority] : "text-gray-300"}`}
                  />
                  <span className={`text-sm ${task.completed
                    ? "text-gray-400 line-through"
                    : task.title
                      ? "text-gray-600"
                      : "text-gray-400"
                    }`}>
                    {task.title || "(タイトルなし)"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}