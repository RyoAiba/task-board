"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

import { LabelsProvider } from "@/hooks/useLabels"
import { TasksProvider } from "@/hooks/useTasks"
import { TaskModalProvider } from "@/contexts/TaskModalContext"
import { Sidebar } from "./Sidebar"
import { BottomNav } from "./BottomNav"

const STORAGE_KEY = "sidebar-collapsed"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "true")
  }, [])

  const toggleCollapsed = () => {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  return (
    <LabelsProvider>
      <TasksProvider>
        <TaskModalProvider>
          <div className="flex flex-col h-[100dvh] overscroll-none">
            {!isLoginPage && <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />}
            <main className={`flex-1 overflow-hidden flex flex-col transition-[margin] duration-300 ease-in-out ${isLoginPage ? "" : collapsed ? "md:ml-13" : "md:ml-64"
              }`}>
              {children}
            </main>
            {!isLoginPage && <BottomNav />}
          </div>
        </TaskModalProvider>
      </TasksProvider>
    </LabelsProvider>
  )
}