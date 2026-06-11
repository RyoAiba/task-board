"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, List, Plus, Settings, LogOut } from "lucide-react"

import { useTaskModal } from "../contexts/TaskModalContext"
import { LogoutDialog } from "./LogoutDialog"

const NAV_ITEM_CLASS = "flex flex-col items-center justify-center flex-1 transition-colors"

export function BottomNav() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const pathname = usePathname()
  const { openCreate } = useTaskModal()

  const navClass = (href: string) =>
    `${NAV_ITEM_CLASS} ${pathname === href ? "text-brand-500" : "text-gray-400"}`

  return (
    <>
      <nav className="md:hidden flex items-center border-t border-gray-200 justify-between bg-white z-30 h-20 pt-2 px-2 pb-6">
        <Link href="/" className={navClass("/")}>
          <Home size={24} strokeWidth={1.5} />
          <span className="text-[10px]">ホーム</span>
        </Link>
        <Link href="/tasks" className={`${navClass("/tasks")} mr-2`}>
          <List size={24} strokeWidth={1.5} />
          <span className="text-[10px]">タスク</span>
        </Link>
        <button
          onClick={() => openCreate()}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-500 text-white transition-colors -mt-4 shadow-md flex-shrink-0 cursor-pointer"
        >
          <Plus size={28} />
        </button>
        <Link href="/settings" className={`${navClass("/settings")} ml-2`}>
          <Settings size={24} strokeWidth={1.5} />
          <span className="text-[10px]">設定</span>
        </Link>
        <button
          onClick={() => setShowLogoutDialog(true)}
          className={`${NAV_ITEM_CLASS} text-gray-400`}
        >
          <LogOut size={24} strokeWidth={1.5} />
          <span className="text-[10px]">ログアウト</span>
        </button>
      </nav>

      <LogoutDialog isOpen={showLogoutDialog} onClose={() => setShowLogoutDialog(false)} />
    </>
  )
}