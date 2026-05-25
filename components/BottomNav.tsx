"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, List, Plus, Settings, LogOut } from "lucide-react"
import { LogoutModal } from "./LogoutModal"

const NAV_ITEM_CLASS = "flex flex-col items-center justify-center gap-1 flex-1 py-3 text-gray-500 hover:text-primary transition-colors"

export function BottomNav() {
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-between bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.08)] z-40 pt-3 px-2">
        <Link href="/" className={NAV_ITEM_CLASS}>
          <Home size={24} />
          <span className="text-xs">ホーム</span>
        </Link>
        <Link href="/tasks" className={NAV_ITEM_CLASS}>
          <List size={24} />
          <span className="text-xs">タスク</span>
        </Link>
        <Link
          href="/tasks/new"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white hover:bg-orange-600 transition-colors -mt-4 shadow-md"
        >
          <Plus size={28} />
        </Link>
        <Link href="/settings" className={NAV_ITEM_CLASS}>
          <Settings size={24} />
          <span className="text-xs">設定</span>
        </Link>
        <button
          onClick={() => setShowLogoutModal(true)}
          className={NAV_ITEM_CLASS}
        >
          <LogOut size={24} />
          <span className="text-xs">ログアウト</span>
        </button>
      </nav>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </>
  )
}