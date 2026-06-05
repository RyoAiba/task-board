"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { EyeOff, Home, List, LogOut, MoreVertical, PanelLeft, Plus, Settings, Tag } from "lucide-react"

import { useLabels } from "../hooks/useLabels"
import { useTasks } from "../hooks/useTasks"
import { useToast } from "../hooks/useToast"
import { LogoutModal } from "./LogoutModal"
import { ToastStack } from "./Toast"

type Props = {
  collapsed: boolean
  onToggle: () => void
}

const ITEM_CLASS = "flex items-center gap-2 pl-4 py-2 text-sm text-gray-600 hover:text-brand-500 transition-colors"

export function Sidebar({ collapsed, onToggle }: Props) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { labels, isLoaded, updateLabel } = useLabels()
  const { tasks } = useTasks()
  const { toasts, showToast, dismiss } = useToast()

  // 表示するラベル（非表示ではないもの）
  const visibleLabels = useMemo(() =>
    labels.filter(label => !label.hidden),
    [labels]
  )

  // ラベルごとの未完了タスク数
  const incompleteCountByLabel = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const task of tasks) {
      if (task.completed) continue
      counts[task.labelId] = (counts[task.labelId] ?? 0) + 1
    }
    return counts
  }, [tasks])

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClick)
      return () => document.removeEventListener("mousedown", handleClick)
    }
  }, [openMenuId])

  const handleHide = (labelId: string) => {
    updateLabel(labelId, { hidden: true })
    setOpenMenuId(null)
    showToast("ラベルを非表示にしました", () => updateLabel(labelId, { hidden: false }))
  }

  return (
    <>
      <aside className={`hidden md:flex flex-col h-screen fixed left-0 top-0 bg-white border-r border-gray-200 overflow-hidden transition-[width] duration-300 ease-in-out ${collapsed ? "w-13" : "w-64"
        }`}>
        <div className={`flex p-2 ${collapsed ? "justify-center" : "justify-end"}`}>
          <button
            onClick={onToggle}
            className="p-1 text-gray-600 hover:text-brand-500 transition-colors cursor-pointer"
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
            {!collapsed && isLoaded && visibleLabels.map(label => {
              const count = incompleteCountByLabel[label.id] ?? 0
              const menuOpen = openMenuId === label.id
              return (
                <div key={label.id} className="group relative flex items-center">
                  <Link
                    href={`/tasks?label=${label.id}`}
                    className="flex items-center gap-2 py-2 pl-12 pr-2 text-sm text-gray-600 group-hover:text-brand-500 transition-colors flex-1 min-w-0"
                  >
                    <Tag size={14} className="flex-shrink-0 text-gray-400 group-hover:text-brand-500 transition-colors" />
                    <span className="whitespace-nowrap">{label.name}</span>
                  </Link>

                  <div className="pr-3 relative" ref={menuOpen ? menuRef : null}>
                    <div className="flex items-center justify-center w-6 h-6">
                      {count > 0 && (
                        <span className={`text-xs text-gray-400 group-hover:text-brand-500 transition-colors ${menuOpen ? "hidden" : "group-hover:hidden"}`}>
                          {count}
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setOpenMenuId(menuOpen ? null : label.id)
                        }}
                        className={`p-1 rounded-full text-gray-400 hover:bg-brand-100 hover:text-brand-500 transition-colors cursor-pointer ${menuOpen
                          ? "flex bg-brand-100 text-brand-500"
                          : "hidden group-hover:flex"
                          }`}
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>

                    {menuOpen && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 whitespace-nowrap min-w-32">
                        <button
                          onClick={() => handleHide(label.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <EyeOff size={14} />
                          非表示にする
                        </button>
                      </div>
                    )}
                  </div>
                </div>
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
            className={`${ITEM_CLASS} w-full cursor-pointer`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>ログアウト</span>
          </button>
        </div>
      </aside>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  )
}