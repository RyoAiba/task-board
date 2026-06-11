"use client"

import { useEffect, useRef, useState } from "react"
import { Flame, X } from "lucide-react"

import { useTaskModal } from "../../contexts/TaskModalContext"
import { useSettings } from "../../contexts/SettingsContext"
import { type Task, PRIORITY_TEXT } from "../../types"
import { DAY_NAMES, formatDate, getTasksForDate } from "../../utils/calendar"

type Props = {
  tasks: Task[]
}

const INITIAL_DAYS = 7
const LOAD_MORE_DAYS = 7
const MAX_VISIBLE_TASKS = 3

export function WeeklyCalendarMobile({ tasks }: Props) {
  const { settings } = useSettings()
  const { openCreate, openEdit } = useTaskModal()
  const [displayDays, setDisplayDays] = useState(INITIAL_DAYS)
  const [popupDate, setPopupDate] = useState<string | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const previousDaysRef = useRef(INITIAL_DAYS)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dates = Array.from({ length: displayDays }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    return d
  })

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopupDate(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  useEffect(() => {
    if (displayDays > previousDaysRef.current) {
      requestAnimationFrame(() => {
        const el = scrollContainerRef.current
        if (!el) return
        el.scrollTo({
          left: el.scrollWidth - el.clientWidth,
          behavior: "smooth",
        })
      })
    }
    previousDaysRef.current = displayDays
  }, [displayDays])

  const handleTaskClick = (taskId: string) => {
    setPopupDate(null)
    openEdit(taskId)
  }

  const handleLoadMore = () => {
    setDisplayDays(prev => prev + LOAD_MORE_DAYS)
  }

  const handleGoToToday = () => {
    setDisplayDays(INITIAL_DAYS)
    requestAnimationFrame(() => {
      scrollContainerRef.current?.scrollTo({ left: 0, behavior: "smooth" })
    })
  }

  return (
    <section className="mb-8">
      <h2 className="text-section-title mb-4">カレンダー</h2>

      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={handleGoToToday}
          className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          今日
        </button>
        <button
          onClick={handleLoadMore}
          className="text-sm text-gray-400 hover:text-brand-500 active:text-brand-500 active:scale-95 transition-all"
        >
          次の7日を読み込む →
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        <div className="flex gap-2 pb-2">
          {dates.map(date => {
            const dateStr = formatDate(date)
            const isToday = dateStr === formatDate(today)
            const dayOfWeek = date.getDay()
            const allTasks = getTasksForDate(tasks, dateStr, settings.showCompletedInCalendar)
            const visibleTasks = allTasks.slice(0, MAX_VISIBLE_TASKS)
            const remainingCount = allTasks.length - MAX_VISIBLE_TASKS

            return (
              <div
                key={dateStr}
                onClick={() => openCreate({ initialValues: { dueDate: dateStr } })}
                className="flex-shrink-0 w-32 sm:w-36 rounded-xl border border-gray-200 bg-white overflow-hidden cursor-pointer hover:border-brand-300 transition-colors"
              >
                <div className={`px-3 py-2 text-center ${isToday ? "bg-brand-500" : "bg-gray-50 border-b border-gray-200"}`}>
                  <div className={`text-xs font-medium ${isToday ? "text-white" :
                    dayOfWeek === 0 ? "text-red-500" :
                      dayOfWeek === 6 ? "text-blue-500" :
                        "text-gray-400"
                    }`}>
                    {DAY_NAMES[dayOfWeek]}
                  </div>
                  <div className={`text-sm ${isToday ? "text-white" : ""}`}>
                    {date.getMonth() + 1}月{date.getDate()}日
                  </div>
                </div>

                <div className="p-2 space-y-1 min-h-16">
                  {visibleTasks.length > 0 ? (
                    <>
                      {visibleTasks.map(task => (
                        <button
                          key={task.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            openEdit(task.id)
                          }}
                          className="w-full text-left flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <Flame
                            size={10}
                            className={`flex-shrink-0 ${task.priority ? PRIORITY_TEXT[task.priority] : "text-gray-300"}`}
                          />
                          <span className={`text-xs truncate ${task.completed ? "text-gray-400 line-through" : "text-gray-600"}`}>
                            {task.title || "(タイトルなし)"}
                          </span>
                        </button>
                      ))}
                      {remainingCount > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setPopupDate(dateStr)
                          }}
                          className="w-full text-left px-2 py-1 text-xs text-brand-500 hover:bg-brand-100 rounded-lg transition-colors font-medium cursor-pointer"
                        >
                          +{remainingCount}件
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-gray-200 text-center py-3">－</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {popupDate && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPopupDate(null)} />
          <div
            ref={popupRef}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-modal w-72 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">
                {(() => {
                  const d = new Date(`${popupDate}T00:00:00`)
                  return `${d.getMonth() + 1}/${d.getDate()}(${DAY_NAMES[d.getDay()]})`
                })()}
              </h3>
              <button onClick={() => setPopupDate(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {getTasksForDate(tasks, popupDate, settings.showCompletedInCalendar).map(task => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => handleTaskClick(task.id)}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Flame
                    size={12}
                    className={`flex-shrink-0 ${task.priority ? PRIORITY_TEXT[task.priority] : "text-gray-300"}`}
                  />
                  <span className={`text-sm ${task.completed ? "text-gray-400 line-through" : "text-gray-600"}`}>
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