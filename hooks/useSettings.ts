import { useState, useEffect, useRef } from "react"

const STORAGE_KEY = "task-board-settings"

type Settings = {
  showCompletedInCalendar: boolean
}

const DEFAULT_SETTINGS: Settings = {
  showCompletedInCalendar: true,
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
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
  }, [])

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return { settings, updateSetting }
}