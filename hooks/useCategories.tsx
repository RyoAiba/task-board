"use client"

import { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from "react"
import { Category, CategoryColor, DEFAULT_CATEGORIES } from "../types"

const STORAGE_KEY = "task-board-categories"
const COLOR_CYCLE: CategoryColor[] = ["blue", "violet", "slate", "pink", "teal", "cyan"]

function migrateCategory(c: Category, index: number): Category {
  if (c.color) return c
  return { ...c, color: COLOR_CYCLE[index % COLOR_CYCLE.length] }
}

// ─── アクション定義 ───────────────────────────────────────
type CategoryAction =
  | { type: "INIT"; payload: Category[] }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "UPDATE_CATEGORY"; payload: { id: string; name: string } }
  | { type: "DELETE_CATEGORY"; payload: string }

// ─── reducer ─────────────────────────────────────────────
function categoryReducer(state: Category[], action: CategoryAction): Category[] {
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
type CategoriesContextType = {
  categories: Category[]
  addCategory: (name: string) => Category
  updateCategory: (id: string, name: string) => void
  deleteCategory: (id: string) => void
}

const CategoriesContext = createContext<CategoriesContextType | null>(null)

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, dispatch] = useReducer(categoryReducer, DEFAULT_CATEGORIES)
  const isInitialized = useRef(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        dispatch({ type: "INIT", payload: JSON.parse(stored).map((c: Category, i: number) => migrateCategory(c, i)) })
      } catch {
        dispatch({ type: "INIT", payload: DEFAULT_CATEGORIES })
      }
    } else {
      dispatch({ type: "INIT", payload: DEFAULT_CATEGORIES })
    }
  }, [])

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
  }, [categories])

  const addCategory = (name: string): Category => {
    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name,
      order: Math.max(0, ...categories.map(c => c.order)) + 1,
      color: COLOR_CYCLE[categories.length % COLOR_CYCLE.length],
    }
    dispatch({ type: "ADD_CATEGORY", payload: newCategory })
    return newCategory
  }

  const updateCategory = (id: string, name: string): void => {
    dispatch({ type: "UPDATE_CATEGORY", payload: { id, name } })
  }

  const deleteCategory = (id: string): void => {
    dispatch({ type: "DELETE_CATEGORY", payload: id })
  }

  return (
    <CategoriesContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategories() {
  const ctx = useContext(CategoriesContext)
  if (!ctx) throw new Error("CategoriesProvider未設定")
  return ctx
}