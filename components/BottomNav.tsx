"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, List, Plus, Settings, LogOut } from "lucide-react"
import { LogoutModal } from "./LogoutModal"

const NAV_ITEM_CLASS = "flex flex-col items-center justify-center flex-1  hover:text-primary transition-colors"

export function BottomNav() {
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <>
      <nav className="md:hidden flex items-center border-t border-gray-200 justify-between bg-white z-40 h-20 pt-2 px-2 pb-6">
        <Link href="/" className={NAV_ITEM_CLASS}>
          <Home size={24} strokeWidth={1.5} />
          <span className="text-[10px]">ホーム</span>
        </Link>
        <Link href="/tasks" className={`${NAV_ITEM_CLASS} mr-2`}>
          <List size={24} strokeWidth={1.5} />
          <span className="text-[10px]">タスク</span>
        </Link>
        <Link
          href="/tasks/new"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white hover:bg-orange-600 transition-colors -mt-4 shadow-md flex-shrink-0"
        >
          <Plus size={28} />
        </Link>
        <Link href="/settings" className={`${NAV_ITEM_CLASS} ml-2`}>
          <Settings size={24} strokeWidth={1.5} />
          <span className="text-[10px]">設定</span>
        </Link>
        <button
          onClick={() => setShowLogoutModal(true)}
          className={NAV_ITEM_CLASS}
        >
          <LogOut size={24} strokeWidth={1.5} />
          <span className="text-[10px]">ログアウト</span>
        </button>
      </nav>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </>
  )
}