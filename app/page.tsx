"use client"

import Link from "next/link"
import { useTasks } from "../hooks/useTasks"
import { useCategories } from "../hooks/useCategories"
import { Priority, PRIORITY_LABELS, PRIORITY_ORDER, CATEGORY_BADGE_CLASSES, CATEGORY_BORDER_CLASSES, PRIORITY_BORDER_CLASSES } from "../types"
import { PieChart, Pie, Cell, Label } from "recharts"
import { getPriorityBadgeClass } from "../utils/priority"
import { PageContainer } from "../components/PageContainer"
import { WeeklyCalendar } from "../components/WeeklyCalendar"

const PRIORITY_ITEMS = (Object.entries(PRIORITY_LABELS) as [Priority, string][]).map(
  ([key, label]) => ({ href: `/tasks?priority=${key}`, label, key })
)

export default function Dashboard() {
  const { tasks } = useTasks()
  const { categories } = useCategories()

  const incompleteTasks = tasks.filter(t => !t.completed)
  const completedCount = tasks.filter(t => t.completed).length
  const completionRate =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  const sortedIncompleteTasks = [...incompleteTasks]
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, 5)

  const categoryTaskCounts = categories.map(cat => ({
    ...cat,
    count: tasks.filter(t => t.categoryId === cat.id).length,
  }))

  const incompleteByCounts: Record<string, number> = {
    high: incompleteTasks.filter(t => t.priority === "high").length,
    medium: incompleteTasks.filter(t => t.priority === "medium").length,
    low: incompleteTasks.filter(t => t.priority === "low").length,
  }

  const getCategory = (categoryId: string) =>
    categories.find(c => c.id === categoryId)

  const chartData = [
    { name: "完了", value: completedCount },
    { name: "未完了", value: tasks.length - completedCount },
  ]

  return (
    <PageContainer>

      <WeeklyCalendar tasks={tasks} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 未完了のタスク */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-section-title">未完了のタスク</h2>
            {incompleteTasks.length > 5 && (
              <Link href="/tasks?status=incomplete" className="text-xs text-primary hover:underline">
                全て見る →
              </Link>
            )}
          </div>
          {sortedIncompleteTasks.length > 0 ? (
            <div className="space-y-2">
              {sortedIncompleteTasks.map(task => {
                const category = getCategory(task.categoryId)
                const categoryBadgeClass = category
                  ? CATEGORY_BADGE_CLASSES[category.color]
                  : "bg-gray-100 text-gray-600"
                return (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="block py-2 px-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-medium  block truncate">
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        {category && (
                          <span className={`text-badge px-2 py-1 rounded ${categoryBadgeClass}`}>
                            {category.name}
                          </span>
                        )}
                        <span className={`text-badge px-2 py-1 rounded ${getPriorityBadgeClass(task.priority)}`}>
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-400">未完了のタスクはありません</p>
          )}
        </section>

        {/* 完了率 */}
        <section className="flex flex-col">
          <h2 className="text-section-title mb-4">完了率</h2>
          <div className="bg-white p-6 rounded-lg border border-gray-200 flex-1 flex flex-col items-center justify-center">
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
                <Cell fill="var(--color-primary)" />
                <Cell fill="#E5E7EB" />
                <Label
                  value={`${completionRate}%`}
                  position="center"
                  fontSize={24}
                  fill="var(--color-primary)"
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
      </div>

      {/* カテゴリ別タスク数 */}
      <section className="mb-8">
        <h2 className="text-section-title mb-4">カテゴリ別タスク数</h2>
        <div className="grid grid-cols-3 gap-4">
          {categoryTaskCounts.map(cat => (
            <Link
              key={cat.id}
              href={`/tasks?category=${cat.id}`}
              className={`p-4 bg-white border border-gray-200 border-l-4 ${CATEGORY_BORDER_CLASSES[cat.color]} rounded-lg hover:shadow-md transition-shadow`}
            >
              <p className="text-body font-semibold ">{cat.name}</p>
              <p className="text-2xl font-bold mt-2 text-primary">{cat.count}</p>
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
              className={`p-4 bg-white border border-gray-200 border-l-4 ${PRIORITY_BORDER_CLASSES[key]} rounded-lg hover:shadow-md transition-shadow`}
            >
              <p className="text-body font-semibold ">{label}</p>
              <p className="text-2xl font-bold mt-2 text-primary">
                {incompleteByCounts[key]}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}