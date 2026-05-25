"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, Plus, Settings, LogOut, List } from "lucide-react"
import { LogoutModal } from "./LogoutModal"
import { useCategories } from "../hooks/useCategories"
import { CATEGORY_DOT_CLASSES } from "../types"

const NAV_ITEM_CLASS = "flex items-center gap-4 p-4 font-bold text-gray-600 hover:text-primary transition-colors"
const CATEGORY_ITEM_CLASS = "block py-3 pr-3 text-sm text-gray-600 hover:text-primary transition-colors"

export function Sidebar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { categories } = useCategories()

  return (
    <>
      <aside className="hidden md:flex flex-col w-56 h-screen fixed left-0 top-0 bg-white shadow-[2px_0_8px_rgba(0,0,0,0.08)] z-100">
        <div className="flex-1">
          <Link href="/" className={NAV_ITEM_CLASS}>
            <Home size={24} />
            <span>ホーム</span>
          </Link>
          <Link href="/tasks/new" className={NAV_ITEM_CLASS}>
            <Plus size={24} />
            <span>新規作成</span>
          </Link>
          <div>
            <Link href="/tasks" className={NAV_ITEM_CLASS}>
              <List size={24} />
              <span>タスク一覧</span>
            </Link>
            <div>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/tasks?category=${cat.id}`}
                  className={`${CATEGORY_ITEM_CLASS} pl-16 flex items-center gap-2`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${CATEGORY_DOT_CLASSES[cat.color]}`} />
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <Link href="/settings" className={NAV_ITEM_CLASS}>
            <Settings size={24} />
            <span>設定</span>
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`${NAV_ITEM_CLASS} w-full`}
          >
            <LogOut size={24} />
            <span>ログアウト</span>
          </button>
        </div>
      </aside>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </>
  )
}