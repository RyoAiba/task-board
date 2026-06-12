"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { type SortKey, type SortOrder } from "@/components/tasks/SortPopup"
import { useLabels } from "@/contexts/LabelsContext"
import { useTasks } from "@/contexts/TasksContext"
import { type DateFilter, type Priority, type Status, PRIORITY_ORDER } from "@/types"
import { formatDate } from "@/utils/calendar"
import {
  parseDateFilterParam,
  parsePriorityParam,
  parseStatusParam,
} from "@/utils/searchParams"

export function useTaskFiltering() {
  const searchParams = useSearchParams()
  const { tasks, isExiting } = useTasks()
  const { labels } = useLabels()

  const urlLabel = searchParams.get("label") || ""
  const urlPriority = parsePriorityParam(searchParams.get("priority"))
  const urlStatus = parseStatusParam(searchParams.get("status"))
  const urlDateFilter = parseDateFilterParam(searchParams.get("dateFilter"))

  const [searchText, setSearchText] = useState("")
  const [selectedLabels, setSelectedLabels] = useState<string[]>(urlLabel ? [urlLabel] : [])
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>(urlPriority ? [urlPriority] : [])
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>(urlStatus ? [urlStatus] : ["incomplete"])
  const [selectedDateFilters, setSelectedDateFilters] = useState<DateFilter[]>(urlDateFilter ? [urlDateFilter] : [])
  const [sortKey, setSortKey] = useState<SortKey | null>(urlStatus ? null : "dueDate")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  useEffect(() => { setSelectedLabels(urlLabel ? [urlLabel] : []) }, [urlLabel])
  useEffect(() => { setSelectedPriorities(urlPriority ? [urlPriority] : []) }, [urlPriority])
  useEffect(() => { setSelectedStatuses(urlStatus ? [urlStatus] : ["incomplete"]) }, [urlStatus])
  useEffect(() => { setSelectedDateFilters(urlDateFilter ? [urlDateFilter] : []) }, [urlDateFilter])

  const { todayStr, weekEndStr } = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    const w = new Date(t)
    w.setDate(w.getDate() + 6)
    return { todayStr: formatDate(t), weekEndStr: formatDate(w) }
  }, [])

  const activeFilterCount =
    selectedLabels.length + selectedPriorities.length + selectedStatuses.length + selectedDateFilters.length

  const hasActiveFilters = searchText !== "" || activeFilterCount > 0

  const resetAllFilters = () => {
    setSelectedLabels([])
    setSelectedPriorities([])
    setSelectedStatuses([])
    setSelectedDateFilters([])
    setSearchText("")
  }

  const filteredAndSortedTasks = useMemo(() => {
    const filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchText.toLowerCase())
      const matchesLabel = selectedLabels.length === 0 || selectedLabels.includes(task.labelId)
      const matchesPriority = selectedPriorities.length === 0 ||
        (task.priority !== undefined && selectedPriorities.includes(task.priority))
      const matchesStatus = selectedStatuses.length === 0 ||
        (selectedStatuses.includes("incomplete") && !task.completed) ||
        (selectedStatuses.includes("completed") && task.completed)
      const matchesDateFilter = selectedDateFilters.length === 0 ||
        selectedDateFilters.some(f => {
          if (f === "noDueDate") return !task.dueDate
          if (!task.dueDate) return false
          if (f === "overdue") return task.dueDate < todayStr
          if (f === "today") return task.dueDate === todayStr
          if (f === "thisWeek") return task.dueDate >= todayStr && task.dueDate <= weekEndStr
          return false
        })

      if (matchesSearch && matchesLabel && matchesPriority && matchesStatus && matchesDateFilter) {
        return true
      }
      if (isExiting(task.id) && matchesSearch && matchesLabel && matchesPriority && matchesDateFilter) {
        return true
      }
      return false
    })

    if (!sortKey) return filtered

    return [...filtered].sort((a, b) => {
      let result = 0
      if (sortKey === "label") {
        const orderA = labels.find(l => l.id === a.labelId)?.order ?? 0
        const orderB = labels.find(l => l.id === b.labelId)?.order ?? 0
        result = orderA - orderB
      } else if (sortKey === "priority") {
        const orderA = a.priority ? PRIORITY_ORDER[a.priority] : 99
        const orderB = b.priority ? PRIORITY_ORDER[b.priority] : 99
        result = orderA - orderB
      } else if (sortKey === "status") {
        result = Number(a.completed) - Number(b.completed)
      } else if (sortKey === "dueDate") {
        if (!a.dueDate && !b.dueDate) result = 0
        else if (!a.dueDate) result = 1
        else if (!b.dueDate) result = -1
        else result = a.dueDate.localeCompare(b.dueDate)
      }
      return sortOrder === "asc" ? result : -result
    })
  }, [searchText, selectedLabels, selectedPriorities, selectedStatuses, selectedDateFilters, sortKey, sortOrder, tasks, labels, todayStr, weekEndStr, isExiting])

  return {
    searchText, setSearchText,
    selectedLabels, setSelectedLabels,
    selectedPriorities, setSelectedPriorities,
    selectedStatuses, setSelectedStatuses,
    selectedDateFilters, setSelectedDateFilters,
    sortKey, setSortKey,
    sortOrder, setSortOrder,
    activeFilterCount,
    hasActiveFilters,
    resetAllFilters,
    filteredAndSortedTasks,
  }
}

export type TaskFiltering = ReturnType<typeof useTaskFiltering>