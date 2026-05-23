"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Category, CategoryColor, DEFAULT_CATEGORIES } from "../types"

const STORAGE_KEY = "task-board-categories"
const COLOR_CYCLE: CategoryColor[] = ["blue", "violet", "slate", "pink", "teal", "cyan"]

function migrateCategory(c: Category, index: number): Category {
  if (c.color) return c
  return { ...c, color: COLOR_CYCLE[index % COLOR_CYCLE.length] }
}

type CategoriesContextType = {
  categories: Category[]
  addCategory: (name: string) => Category
  updateCategory: (id: string, name: string) => void
  deleteCategory: (id: string) => void
}

const CategoriesContext = createContext<CategoriesContextType | null>(null)

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCategories(JSON.parse(stored).map((c: Category, i: number) => migrateCategory(c, i)))
      } catch {
        // fallback: DEFAULT_CATEGORIESのまま
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
  }, [categories])

  const addCategory = (name: string): Category => {
    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name,
      order: Math.max(0, ...categories.map(c => c.order)) + 1,
      color: COLOR_CYCLE[categories.length % COLOR_CYCLE.length],
    }
    setCategories(prev => [...prev, newCategory])
    return newCategory
  }

  const updateCategory = (id: string, name: string): void => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, name } : c)))
  }

  const deleteCategory = (id: string): void => {
    setCategories(prev => prev.filter(c => c.id !== id))
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