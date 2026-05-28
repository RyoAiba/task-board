"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { BottomNav } from "./BottomNav"
import { CategoriesProvider } from "@/hooks/useCategories"

export function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  return (
    <CategoriesProvider>
      <div>
        {!isLoginPage && <Sidebar />}
        <main className={isLoginPage ? "" : "md:ml-56 p-6 pt-4 pb-24 md:pb-4"}>
          {children}
        </main>
        {false && <BottomNav />}
      </div>
    </CategoriesProvider>
  )
}