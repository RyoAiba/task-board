"use client"

import { createContext, useContext, useReducer, useEffect, useRef, useState, ReactNode } from "react"
import { Label, LabelColor, DEFAULT_LABELS } from "../types"

const STORAGE_KEY = "task-board-labels"
const COLOR_CYCLE: LabelColor[] = ["blue", "violet", "slate", "pink", "teal", "cyan"]

function migrateLabel(c: Label, index: number): Label {
  if (c.color) return c
  return { ...c, color: COLOR_CYCLE[index % COLOR_CYCLE.length] }
}

// ─── アクション定義 ───────────────────────────────────────
type LabelAction =
  | { type: "INIT"; payload: Label[] }
  | { type: "ADD_CATEGORY"; payload: Label }
  | { type: "UPDATE_CATEGORY"; payload: { id: string; name: string } }
  | { type: "DELETE_CATEGORY"; payload: string }

// ─── reducer ─────────────────────────────────────────────
function labelReducer(state: Label[], action: LabelAction): Label[] {
  switch (action.type) {
    case "INIT":
      return action.payload
    case "ADD_CATEGORY":
      return [...state, action.payload]
    case "UPDATE_CATEGORY":
      return state.map(c =>
        c.id === action.payload.id ? { ...c, name: action.payload.name } : c
      )
    case "DELETE_CATEGORY":
      return state.filter(c => c.id !== action.payload)
  }
}

// ─── Context ─────────────────────────────────────────────
type LabelsContextType = {
  labels: Label[]
  isLoaded: boolean
  addLabel: (name: string) => Label
  updateLabel: (id: string, name: string) => void
  deleteLabel: (id: string) => void
}

const LabelsContext = createContext<LabelsContextType | null>(null)

export function LabelsProvider({ children }: { children: ReactNode }) {
  const [labels, dispatch] = useReducer(labelReducer, DEFAULT_LABELS)
  const isInitialized = useRef(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        dispatch({ type: "INIT", payload: JSON.parse(stored).map((c: Label, i: number) => migrateLabel(c, i)) })
      } catch {
        dispatch({ type: "INIT", payload: DEFAULT_LABELS })
      }
    } else {
      dispatch({ type: "INIT", payload: DEFAULT_LABELS })
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(labels))
  }, [labels])

  const addLabel = (name: string): Label => {
    const newLabel: Label = {
      id: `cat_${Date.now()}`,
      name,
      order: Math.max(0, ...labels.map(c => c.order)) + 1,
      color: COLOR_CYCLE[labels.length % COLOR_CYCLE.length],
    }
    dispatch({ type: "ADD_CATEGORY", payload: newLabel })
    return newLabel
  }

  const updateLabel = (id: string, name: string): void => {
    dispatch({ type: "UPDATE_CATEGORY", payload: { id, name } })
  }

  const deleteLabel = (id: string): void => {
    dispatch({ type: "DELETE_CATEGORY", payload: id })
  }

  return (
    <LabelsContext.Provider value={{ labels, isLoaded, addLabel, updateLabel, deleteLabel }}>
      {children}
    </LabelsContext.Provider>
  )
}

export function useLabels() {
  const ctx = useContext(LabelsContext)
  if (!ctx) throw new Error("LabelsProvider未設定")
  return ctx
}