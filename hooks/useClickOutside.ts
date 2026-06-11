import { useEffect } from "react"

/**
 * 指定したref要素の外側でmousedownが発生した時にonOutsideを呼ぶ。
 * enabledがfalseの間はリスナーを登録しない。
 */
export function useClickOutside<T extends HTMLElement>(
  ref: { current: T | null },
  onOutside: () => void,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled) return
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutside()
      }
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [ref, onOutside, enabled])
}