"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { Task, PRIORITY_ORDER, PRIORITY_PRIMARY } from "../types"
import { useSettings } from "../hooks/useSettings"

type Props = {
  tasks: Task[]
}

const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"]

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const INITIAL_DAYS = 7
const LOAD_MORE_DAYS = 7
const MAX_VISIBLE_TASKS = 3

export function WeeklyCalendar({ tasks }: Props) {
  const { settings } = useSettings()
  const [displayDays, setDisplayDays] = useState(INITIAL_DAYS)
  const [popupDate, setPopupDate] = useState<string | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dates = Array.from({ length: displayDays }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    return d
  })

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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopupDate(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <section className="mb-8 bg-gray-50 rounded-xl p-4 px-2">
      <div className="overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <div className="flex gap-2 pb-2">
          {dates.map(date => {
            const dateStr = formatDate(date)
            const isToday = dateStr === formatDate(today)
            const dayOfWeek = date.getDay()
            const allTasks = getTasksForDate(dateStr)
            const visibleTasks = allTasks.slice(0, MAX_VISIBLE_TASKS)
            const remainingCount = allTasks.length - MAX_VISIBLE_TASKS

            return (
              <div
                key={dateStr}
                className="flex-shrink-0 w-32 sm:w-36 rounded-xl border border-gray-200 bg-white overflow-hidden"
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
                        <Link
                          key={task.id}
                          href={`/tasks/${task.id}`}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors ${task.completed ? "opacity-40" : ""}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${task.priority ? PRIORITY_PRIMARY[task.priority] : "bg-gray-300"}`} />
                          <span className="text-xs text-gray-600 truncate">{task.title}</span>
                        </Link>
                      ))}
                      {remainingCount > 0 && (
                        <button
                          onClick={() => setPopupDate(dateStr)}
                          className="w-full text-left px-2 py-1 text-xs text-brand-500 hover:bg-brand-100 rounded-lg transition-colors font-medium"
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

      <div className="mt-1 flex justify-end">
        <button
          onClick={() => setDisplayDays(prev => prev + LOAD_MORE_DAYS)}
          className="text-sm text-gray-400 hover:text-brand-500 transition-colors"
        >
          次の7日を読み込む →
        </button>
      </div>

      {popupDate && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPopupDate(null)} />
          <div
            ref={popupRef}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-xl w-72 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">
                {(() => {
                  const d = new Date(`${popupDate}T00:00:00`)
                  return `${d.getMonth() + 1}/${d.getDate()}（${DAY_NAMES[d.getDay()]}）`
                })()}
              </h3>
              <button onClick={() => setPopupDate(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {getTasksForDate(popupDate).map(task => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  onClick={() => setPopupDate(null)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${task.completed ? "opacity-40" : ""}`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority ? PRIORITY_PRIMARY[task.priority] : "bg-gray-300"}`} />
                  <span className="text-sm text-gray-600">{task.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}