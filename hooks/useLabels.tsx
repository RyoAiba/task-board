"use client"

import { createContext, useContext, useReducer, useEffect, useRef, useState, ReactNode } from "react"
import { Label, DEFAULT_LABELS } from "../types"

const STORAGE_KEY = "task-board-labels"

// ─── アクション定義 ───────────────────────────────────────
type LabelAction =
  | { type: "INIT"; payload: Label[] }
  | { type: "ADD_LABEL"; payload: Label }
  | { type: "UPDATE_LABEL"; payload: { id: string; name: string } }
  | { type: "DELETE_LABEL"; payload: string }

// ─── reducer ─────────────────────────────────────────────
function labelReducer(state: Label[], action: LabelAction): Label[] {
  switch (action.type) {
    case "INIT":
      return action.payload
    case "ADD_LABEL":
      return [...state, action.payload]
    case "UPDATE_LABEL":
      return state.map(label =>
        label.id === action.payload.id ? { ...label, name: action.payload.name } : label
      )
    case "DELETE_LABEL":
      return state.filter(label => label.id !== action.payload)
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
    try {
      const parsed = stored ? JSON.parse(stored) : DEFAULT_LABELS
      dispatch({ type: "INIT", payload: parsed })
    } catch {
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
      order: Math.max(0, ...labels.map(l => l.order)) + 1,
    }
    dispatch({ type: "ADD_LABEL", payload: newLabel })
    return newLabel
  }

  const updateLabel = (id: string, name: string): void => {
    dispatch({ type: "UPDATE_LABEL", payload: { id, name } })
  }

  const deleteLabel = (id: string): void => {
    dispatch({ type: "DELETE_LABEL", payload: id })
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