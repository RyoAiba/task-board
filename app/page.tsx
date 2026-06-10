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
  const { tasks } = useTasks()
  const { labels } = useLabels()
  const { handleToggle } = useTaskToggle()

  const { todayIncomplete, todayEmptyMessage, overdueTasks } = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0]
    const allTodayTasks = tasks.filter(t => t.dueDate === todayStr)
    const todayIncomplete = allTodayTasks.filter(t => !t.completed)
    const allTodayCompleted = allTodayTasks.length > 0 && todayIncomplete.length === 0
    const todayEmptyMessage = allTodayCompleted
      ? "今日のタスクは完了です！🎉"
      : "今日のタスクはありません"
    const overdueTasks = tasks.filter(t =>
      !t.completed && t.dueDate && t.dueDate < todayStr
    )
    return { todayIncomplete, todayEmptyMessage, overdueTasks }
  }, [tasks])

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
          viewAllHref="/tasks?status=incomplete"
          getLabel={getLabel}
          onToggle={handleToggle}
        />
        <TaskListSection
          title="期限切れのタスク"
          tasks={overdueTasks}
          emptyMessage="期限切れのタスクはありません 👍"
          viewAllHref="/tasks?status=incomplete"
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