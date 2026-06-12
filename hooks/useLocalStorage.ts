"use client"

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react"

const DEFAULT_DEBOUNCE_MS = 300

function safeRead<T>(key: string): T | undefined {
  if (typeof window === "undefined") return undefined
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return undefined
    return JSON.parse(raw) as T
  } catch {
    return undefined
  }
}

function safeWrite<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // quota超過などは握り潰す（必要ならToast連携をここに足す）
  }
}

/**
 * useStateスタイルでlocalStorage同期できるフック。
 * マウント後にlocalStorageから読み込んで、値の変更はdebounce保存。
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: { debounceMs?: number } = {},
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const { debounceMs = DEFAULT_DEBOUNCE_MS } = options
  const [value, setValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)
  const isInitialized = useRef(false)

  useEffect(() => {
    const stored = safeRead<T>(key)
    if (stored !== undefined) setValue(stored)
    setIsLoaded(true)
  }, [key])

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }
    const timer = setTimeout(() => safeWrite(key, value), debounceMs)
    return () => clearTimeout(timer)
  }, [key, value, debounceMs])

  return [value, setValue, isLoaded]
}

/**
 * useReducer などstateの管理を自前でやってるケース向け。
 * マウント時のロードと、値変更時のdebounce保存だけを担当する。
 */
export function useLocalStorageSync<T>(
  key: string,
  value: T,
  onLoad: (data: T | undefined) => void,
  options: { debounceMs?: number } = {},
): boolean {
  const { debounceMs = DEFAULT_DEBOUNCE_MS } = options
  const [isLoaded, setIsLoaded] = useState(false)
  const isInitialized = useRef(false)
  const onLoadRef = useRef(onLoad)

  useEffect(() => {
    onLoadRef.current = onLoad
  })

  useEffect(() => {
    onLoadRef.current(safeRead<T>(key))
    setIsLoaded(true)
  }, [key])

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      return
    }
    const timer = setTimeout(() => safeWrite(key, value), debounceMs)
    return () => clearTimeout(timer)
  }, [key, value, debounceMs])

  return isLoaded
}