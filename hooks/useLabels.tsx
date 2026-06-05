"use client"

import { createContext, useContext, useEffect, useReducer, useRef, useState, type ReactNode } from "react"

import { type Label, DEFAULT_LABELS } from "../types"

const STORAGE_KEY = "task-board-labels"
const SAVE_DEBOUNCE_MS = 300

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
  const isInitialized = useRef(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // 初期化（localStorageから復元）
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

  // 保存（debounce付き）
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(labels))
    }, SAVE_DEBOUNCE_MS)
    return () => clearTimeout(timer)
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

  const updateLabel = (id: string, updates: Partial<Pick<Label, "name" | "hidden" | "order">>) => {
    dispatch({ type: "UPDATE_LABEL", payload: { id, updates } })
  }

  const deleteLabel = (id: string) => {
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