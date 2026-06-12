"use client"

import { Suspense, useState } from "react"

import { TaskListBody } from "@/components/tasks/TaskListBody"
import { TaskListHeader } from "@/components/tasks/TaskListHeader"
import { useLabels } from "@/contexts/LabelsContext"
import { useTaskFiltering } from "@/hooks/useTaskFiltering"
import { type PageSize } from "@/types"

function TasksPageContent() {
  const filtering = useTaskFiltering()
  const { labels } = useLabels()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(10)

  const resetPage = () => setCurrentPage(1)

  const handlePageSizeChange = (size: PageSize) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col h-full">
      <TaskListHeader
        filtering={filtering}
        labels={labels}
        onResetPage={resetPage}
      />
      <TaskListBody
        tasks={filtering.filteredAndSortedTasks}
        labels={labels}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="p-6">読み込み中...</div>}>
      <TasksPageContent />
    </Suspense>
  )
}