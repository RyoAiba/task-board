"use client"

import { usePathname } from "next/navigation"

import { LabelsProvider } from "@/contexts/LabelsContext"
import { SettingsProvider } from "@/contexts/SettingsContext"
import { TaskModalProvider } from "@/contexts/TaskModalContext"
import { TasksProvider } from "@/contexts/TasksContext"
import { ToastProvider } from "@/contexts/ToastContext"
import { useLocalStorage } from "@/hooks/useLocalStorage"

import { BottomNav } from "./BottomNav"
import { Sidebar } from "./Sidebar"

const STORAGE_KEY = "sidebar-collapsed"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"
  const [collapsed, setCollapsed] = useLocalStorage<boolean>(STORAGE_KEY, false)

  const toggleCollapsed = () => setCollapsed(prev => !prev)

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