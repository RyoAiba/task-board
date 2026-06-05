"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Home, List, LogOut, PanelLeft, Plus, Settings, Tag } from "lucide-react"

import { useLabels } from "../hooks/useLabels"
import { useTasks } from "../hooks/useTasks"
import { LogoutModal } from "./LogoutModal"

type Props = {
  collapsed: boolean
  onToggle: () => void
}

const ITEM_CLASS = "flex items-center gap-2 pl-4 py-2 text-sm text-gray-600 hover:text-brand-500 transition-colors"

export function Sidebar({ collapsed, onToggle }: Props) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { labels, isLoaded } = useLabels()
  const { tasks } = useTasks()

  // ラベルごとの未完了タスク数
  const incompleteCountByLabel = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const task of tasks) {
      if (task.completed) continue
      counts[task.labelId] = (counts[task.labelId] ?? 0) + 1
    }
    return counts
  }, [tasks])

  return (
    <>
      <aside className={`hidden md:flex flex-col h-screen fixed left-0 top-0 bg-white border-r border-gray-200 overflow-hidden transition-[width] duration-300 ease-in-out ${collapsed ? "w-13" : "w-64"
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
            {!collapsed && isLoaded && labels.map(label => {
              const count = incompleteCountByLabel[label.id] ?? 0
              return (
                <Link
                  key={label.id}
                  href={`/tasks?label=${label.id}`}
                  className="flex items-center gap-2 py-2 pl-12 pr-4 text-sm text-gray-600 hover:text-brand-500 transition-colors"
                >
                  <Tag size={14} className="flex-shrink-0 text-gray-400" />
                  <span className="whitespace-nowrap flex-1">{label.name}</span>
                  {count > 0 && (
                    <span className="text-xs text-gray-400">{count}</span>
                  )}
                </Link>
              )
            })}
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