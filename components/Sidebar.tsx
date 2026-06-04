"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, Plus, Settings, LogOut, List, PanelLeft, Tag } from "lucide-react"
import { LogoutModal } from "./LogoutModal"
import { useLabels } from "../hooks/useLabels"

type Props = {
  collapsed: boolean
  onToggle: () => void
}

const ITEM_CLASS = "flex items-center gap-2 pl-4 py-2 text-sm text-gray-600 hover:text-brand-500 transition-colors"

export function Sidebar({ collapsed, onToggle }: Props) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { labels, isLoaded } = useLabels()

  return (
    <>
      <aside className={`hidden md:flex flex-col h-screen fixed left-0 top-0 bg-white border-r border-gray-200 z-100 overflow-hidden transition-[width] duration-300 ease-in-out ${collapsed ? "w-13" : "w-64"
        }`}>
        <div className={`flex p-2 ${collapsed ? "justify-center" : "justify-end"}`}>
          <button
            onClick={onToggle}
            className="p-1 text-gray-600 hover:text-brand-500 transition-colors"
            title={collapsed ? "サイドバーを開く" : "サイドバーを閉じる"}
          >
            <PanelLeft size={20} />
          </button>
        </div>

        <div className="flex-1">
          <Link href="/" className={ITEM_CLASS}>
            <Home size={20} className="flex-shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>ホーム</span>
          </Link>
          <Link href="/tasks/new" className={ITEM_CLASS}>
            <Plus size={20} className="flex-shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>新規作成</span>
          </Link>
          <div>
            <Link href="/tasks" className={ITEM_CLASS}>
              <List size={20} className="flex-shrink-0" />
              <span className={`whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>タスク一覧</span>
            </Link>
            {!collapsed && (
              <div>
                {isLoaded && labels.map(label => (
                  <Link
                    key={label.id}
                    href={`/tasks?label=${label.id}`}
                    className="flex items-center gap-2 py-2 pl-12 pr-2 text-sm text-gray-600 hover:text-brand-500 transition-colors"
                  >
                    <Tag size={14} className="flex-shrink-0 text-gray-400" />
                    <span className="whitespace-nowrap">{label.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200">
          <Link href="/settings" className={ITEM_CLASS}>
            <Settings size={20} className="flex-shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>設定</span>
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`${ITEM_CLASS} w-full`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>ログアウト</span>
          </button>
        </div>
      </aside>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </>
  )
}