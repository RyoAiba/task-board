"use client"

import { useMemo } from "react"

import { useLabels } from "../contexts/LabelsContext"
import { useTasks } from "../contexts/TasksContext"
import { useTaskToggle } from "../hooks/useTaskToggle"
import { CompletionRateCard } from "../components/dashboard/CompletionRateCard"
import { TaskListSection } from "../components/dashboard/TaskListSection"
import { WeeklyCalendar } from "../components/dashboard/WeeklyCalendar"
import { PageContainer } from "../components/PageContainer"

export default function Dashboard() {
  const { tasks, isExiting } = useTasks()
  const { labels } = useLabels()
  const { handleToggle } = useTaskToggle()

  const { todayIncomplete, todayEmptyMessage, overdueTasks } = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0]
    const allTodayTasks = tasks.filter(t => t.dueDate === todayStr)
    // 退場アニメ中のタスクも残す
    const todayIncomplete = allTodayTasks.filter(t => !t.completed || isExiting(t.id))
    // 「完了！🎉」判定は退場中を除いた純粋な未完了数で判断
    const realIncompleteCount = allTodayTasks.filter(t => !t.completed).length
    const allTodayCompleted = allTodayTasks.length > 0 && realIncompleteCount === 0
    const todayEmptyMessage = allTodayCompleted
      ? "今日のタスクは完了です！🎉"
      : "今日のタスクはありません"
    const overdueTasks = tasks.filter(t =>
      (!t.completed || isExiting(t.id)) && t.dueDate && t.dueDate < todayStr
    )
    return { todayIncomplete, todayEmptyMessage, overdueTasks }
  }, [tasks, isExiting])

  const { completedCount, completionRate } = useMemo(() => {
    const completedCount = tasks.filter(t => t.completed).length
    const completionRate =
      tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0
    return { completedCount, completionRate }
  }, [tasks])

  const getLabel = (labelId: string) =>
    labels.find(label => label.id === labelId)

  return (
    <PageContainer>
      <WeeklyCalendar tasks={tasks} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <TaskListSection
          title="今日のタスク"
          tasks={todayIncomplete}
          emptyMessage={todayEmptyMessage}
          viewAllHref="/tasks?dateFilter=today"
          getLabel={getLabel}
          onToggle={handleToggle}
        />
        <TaskListSection
          title="期限切れのタスク"
          tasks={overdueTasks}
          emptyMessage="期限切れのタスクはありません 👍"
          viewAllHref="/tasks?dateFilter=overdue"
          getLabel={getLabel}
          onToggle={handleToggle}
        />
      </div>

      <CompletionRateCard
        completedCount={completedCount}
        totalCount={tasks.length}
        completionRate={completionRate}
      />
    </PageContainer>
  )
}