"use client"

import { useState, useEffect } from "react"
import { Task, Priority } from "../types"
import { generateDummyTasks } from "../lib/dummyData"

const STORAGE_KEY = "task-board-tasks"

function initTasks(): Task[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return generateDummyTasks()
    }
  }
  return generateDummyTasks()
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(initTasks)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = (title: string, priority: Priority, categoryId: string): Task => {
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title,
      priority,
      categoryId,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [...prev, newTask])
    return newTask
  }

  const updateTask = (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>): void => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)))
  }

  const deleteTask = (id: string): void => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const toggleCompleted = (id: string): void => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find(t => t.id === id)
  }

  return { tasks, addTask, updateTask, deleteTask, toggleCompleted, getTaskById }
}