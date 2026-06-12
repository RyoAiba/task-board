"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

import { LabelsProvider } from "@/contexts/LabelsContext"
import { SettingsProvider } from "@/contexts/SettingsContext"
import { TaskModalProvider } from "@/contexts/TaskModalContext"
import { TasksProvider } from "@/contexts/TasksContext"
import { ToastProvider } from "@/contexts/ToastContext"

import { BottomNav } from "@/components/BottomNav"
import { Sidebar } from "@/components/Sidebar"

const SIDEBAR_COOKIE_KEY = "sidebar-collapsed"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1年

type Props = {
  children: React.ReactNode
  initialSidebarCollapsed: boolean
}

export function LayoutWrapper({ children, initialSidebarCollapsed }: Props) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"
  const [collapsed, setCollapsed] = useState(initialSidebarCollapsed)

  const toggleCollapsed = () => {
    setCollapsed(prev => {
      const next = !prev
      document.cookie = `${SIDEBAR_COOKIE_KEY}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}; samesite=lax`
      return next
    })
  }

  return (
    <ToastProvider>
      <SettingsProvider>
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
      </SettingsProvider>
    </ToastProvider>
  )
}