"use client"

import { PieChart, Pie, Cell, Label } from "recharts"

type Props = {
  completedCount: number
  totalCount: number
  completionRate: number
}

export function CompletionRateCard({ completedCount, totalCount, completionRate }: Props) {
  const chartData = [
    { name: "完了", value: completedCount },
    { name: "未完了", value: totalCount - completedCount },
  ]

  return (
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
            isAnimationActive={false}
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
          {completedCount} / {totalCount} 完了
        </p>
      </div>
    </section>
  )
}