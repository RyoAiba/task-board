"use client"
import { useEffect } from "react"

export default function Page() {
  useEffect(() => {
    alert(`standalone=${(window.navigator as Navigator & { standalone?: boolean }).standalone}`)
  }, [])
  return <div>Hello</div>
}