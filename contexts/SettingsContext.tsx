"use client"

import { createContext, useContext, type ReactNode } from "react"

import { useLocalStorage } from "@/hooks/useLocalStorage"

const STORAGE_KEY = "task-board-settings"

type Settings = {
  showCompletedInCalendar: boolean
}

const DEFAULT_SETTINGS: Settings = {
  showCompletedInCalendar: true,
}

type SettingsContextType = {
  settings: Settings
  isLoaded: boolean
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings, isLoaded] = useLocalStorage<Settings>(STORAGE_KEY, DEFAULT_SETTINGS)

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error("useSettings は SettingsProvider の内側で呼んでください")
  return ctx
}