"use client"

import Link from "next/link"
import { useTasks } from "../hooks/useTasks"
import { useLabels } from "../hooks/useLabels"
import { Priority, PRIORITY_LABELS } from "../types"
import { PieChart, Pie, Cell, Label } from "recharts"
import { PageContainer } from "../components/PageContainer"
import { WeeklyCalendar } from "../components/WeeklyCalendar"
import { TaskCard } from "../components/TaskCard"

const PRIORITY_ITEMS = (Object.entries(PRIORITY_LABELS) as [Priority, string][]).map(
  ([key, label]) => ({ href: `/tasks?priority=${key}`, label, key })
)

export default function Dashboard() {
  const { tasks, toggleCompleted } = useTasks()
  const { labels } = useLabels()

  // ─── 今日 / 期限切れ ─────────────────────────────────
  const todayStr = new Date().toISOString().split("T")[0]

  const allTodayTasks = tasks.filter(t => t.dueDate === todayStr)
  const todayIncomplete = allTodayTasks.filter(t => !t.completed)
  const allTodayCompleted = allTodayTasks.length > 0 && todayIncomplete.length === 0

  const overdueTasks = tasks.filter(t =>
    !t.completed && t.dueDate && t.dueDate < todayStr
  )

  // ─── 統計（あとで圧縮） ──────────────────────────────
  const incompleteTasks = tasks.filter(t => !t.completed)
  const completedCount = tasks.filter(t => t.completed).length
  const completionRate =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  const labelTaskCounts = labels.map(label => ({
    ...label,
    count: tasks.filter(t => t.labelId === label.id).length,
  }))

  const incompleteByCounts: Record<string, number> = {
    high: incompleteTasks.filter(t => t.priority === "high").length,
    medium: incompleteTasks.filter(t => t.priority === "medium").length,
    low: incompleteTasks.filter(t => t.priority === "low").length,
  }

  const getLabel = (labelId: string) =>
    labels.find(label => label.id === labelId)

  const chartData = [
    { name: "完了", value: completedCount },
    { name: "未完了", value: tasks.length - completedCount },
  ]

  return (
    <PageContainer>

      <WeeklyCalendar tasks={tasks} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 今日のタスク */}
        <section className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-section-title">今日のタスク</h2>
            {todayIncomplete.length > 5 && (
              <Link href="/tasks?status=incomplete" className="text-xs text-brand-500 hover:underline">
                全て見る →
              </Link>
            )}
          </div>
          {todayIncomplete.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {todayIncomplete.slice(0, 5).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  label={getLabel(task.labelId)}
                  onToggle={toggleCompleted}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white md:flex-1 md:flex md:items-center md:justify-center">
              <p className="text-gray-400">
                {allTodayCompleted
                  ? "今日のタスクは完了です！🎉"
                  : "今日のタスクはありません"}
              </p>
            </div>
          )}
        </section>

        {/* 期限切れのタスク */}
        <section className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-section-title">期限切れのタスク</h2>
            {overdueTasks.length > 5 && (
              <Link href="/tasks?status=incomplete" className="text-xs text-brand-500 hover:underline">
                全て見る →
              </Link>
            )}
          </div>
          {overdueTasks.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {overdueTasks.slice(0, 5).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  label={getLabel(task.labelId)}
                  onToggle={toggleCompleted}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white md:flex-1 md:flex md:items-center md:justify-center">
              <p className="text-gray-400">期限切れのタスクはありません 👍</p>
            </div>
          )}
        </section>
      </div>

      {/* 完了率（仮配置：あとで圧縮） */}
      <section className="mb-8">
        <h2 className="text-section-title mb-4">完了率</h2>
        <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
          <PieChart width={280} height={200}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              <Cell className="fill-brand-500" />
              <Cell className="fill-gray-200" />
              <Label
                value={`${completionRate}%`}
                position="center"
                fontSize={24}
                className="fill-brand-500"
                fontWeight="bold"
              />
            </Pie>
          </PieChart>
          <span className="text-badge text-gray-600 mt-4">全体</span>
          <p className="text-caption text-gray-600 mt-2">
            {completedCount} / {tasks.length} 完了
          </p>
        </div>
      </section>

      {/* ラベル別タスク数 */}
      <section className="mb-8">
        <h2 className="text-section-title mb-4">ラベル別タスク数</h2>
        <div className="grid grid-cols-3 gap-4">
          {labelTaskCounts.map(label => (
            <Link
              key={label.id}
              href={`/tasks?label=${label.id}`}
              className={`p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow`}
            >
              <p className="text-body font-semibold">{label.name}</p>
              <p className="text-2xl font-bold mt-2 text-brand-500">{label.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 優先度別未完了タスク数 */}
      <section className="mb-8">
        <h2 className="text-section-title mb-4">未完了のタスク数（優先度別）</h2>
        <div className="grid grid-cols-3 gap-4">
          {PRIORITY_ITEMS.map(({ href, label, key }) => (
            <Link
              key={key}
              href={href}
              className={`p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow`}
            >
              <p className="text-body font-semibold">{label}</p>
              <p className="text-2xl font-bold mt-2 text-brand-500">
                {incompleteByCounts[key]}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}