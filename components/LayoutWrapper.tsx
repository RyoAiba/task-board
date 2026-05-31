"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { BottomNav } from "./BottomNav"
import { CategoriesProvider } from "@/hooks/useCategories"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  return (
    <CategoriesProvider>
      <div className="flex flex-col h-[100dvh] overscroll-none">
        {!isLoginPage && <Sidebar />}
        <main className={`flex-1 overflow-hidden flex flex-col ${isLoginPage ? "" : "md:ml-56"}`}>
          {children}
        </main>
        {!isLoginPage && <BottomNav />}
      </div>
    </CategoriesProvider>
  )
}