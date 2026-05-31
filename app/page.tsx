"use client"
import { useEffect } from "react"

export default function Page() {
  useEffect(() => {
    alert(`standalone=${window.navigator.standalone}`)
  }, [])
  return <div>Hello</div>
}