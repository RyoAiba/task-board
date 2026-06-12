"use client"

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react"

import { useLocalStorageSync } from "@/hooks/useLocalStorage"
import { type Label, DEFAULT_LABELS } from "@/types"

const STORAGE_KEY = "task-board-labels"

type LabelAction =
  | { type: "INIT"; payload: Label[] }
  | { type: "ADD_LABEL"; payload: Label }
  | { type: "UPDATE_LABEL"; payload: { id: string; updates: Partial<Pick<Label, "name" | "hidden" | "order">> } }
  | { type: "DELETE_LABEL"; payload: string }

function labelReducer(state: Label[], action: LabelAction): Label[] {
  switch (action.type) {
    case "INIT":
      return action.payload
    case "ADD_LABEL":
      return [...state, action.payload]
    case "UPDATE_LABEL":
      return state.map(label =>
        label.id === action.payload.id ? { ...label, ...action.payload.updates } : label
      )
    case "DELETE_LABEL":
      return state.filter(label => label.id !== action.payload)
  }
}

type LabelsContextType = {
  labels: Label[]
  isLoaded: boolean
  addLabel: (name: string) => Label
  updateLabel: (id: string, updates: Partial<Pick<Label, "name" | "hidden" | "order">>) => void
  deleteLabel: (id: string) => void
}

const LabelsContext = createContext<LabelsContextType | null>(null)

export function LabelsProvider({ children }: { children: ReactNode }) {
  const [labels, dispatch] = useReducer(labelReducer, DEFAULT_LABELS)

  const isLoaded = useLocalStorageSync<Label[]>(STORAGE_KEY, labels, (data) => {
    dispatch({ type: "INIT", payload: data ?? DEFAULT_LABELS })
  })

  const sortedLabels = useMemo(
    () => [...labels].sort((a, b) => a.order - b.order),
    [labels]
  )

  const addLabel = (name: string): Label => {
    const newLabel: Label = {
      id: `cat_${Date.now()}`,
      name,
      order: Math.max(0, ...labels.map(l => l.order)) + 1,
    }
    dispatch({ type: "ADD_LABEL", payload: newLabel })
    return newLabel
  }

  const updateLabel = (id: string, updates: Partial<Pick<Label, "name" | "hidden" | "order">>) => {
    dispatch({ type: "UPDATE_LABEL", payload: { id, updates } })
  }

  const deleteLabel = (id: string) => {
    dispatch({ type: "DELETE_LABEL", payload: id })
  }

  return (
    <LabelsContext.Provider value={{ labels: sortedLabels, isLoaded, addLabel, updateLabel, deleteLabel }}>
      {children}
    </LabelsContext.Provider>
  )
}

export function useLabels() {
  const ctx = useContext(LabelsContext)
  if (!ctx) throw new Error("useLabels は LabelsProvider の内側で呼んでください")
  return ctx
}