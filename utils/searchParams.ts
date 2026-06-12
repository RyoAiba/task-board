import { type DateFilter, type Priority, type Status } from "@/types"

const PRIORITY_VALUES: readonly Priority[] = ["high", "medium", "low"]
const STATUS_VALUES: readonly Status[] = ["incomplete", "completed"]
const DATE_FILTER_VALUES: readonly DateFilter[] = ["overdue", "today", "thisWeek", "noDueDate"]

function parseEnum<T extends string>(
  value: string | null,
  validValues: readonly T[],
): T | null {
  if (value === null) return null
  return (validValues as readonly string[]).includes(value) ? (value as T) : null
}

export function parsePriorityParam(value: string | null): Priority | null {
  return parseEnum(value, PRIORITY_VALUES)
}

export function parseStatusParam(value: string | null): Status | null {
  return parseEnum(value, STATUS_VALUES)
}

export function parseDateFilterParam(value: string | null): DateFilter | null {
  return parseEnum(value, DATE_FILTER_VALUES)
}