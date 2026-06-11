"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"

const STORAGE_KEY = "task-board-settings"
const SAVE_DEBOUNCE_MS = 300

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
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)
  const isInitialized = useRef(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) })
      } catch {
        setSettings(DEFAULT_SETTINGS)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    }, SAVE_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [settings])

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