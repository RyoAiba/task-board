"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import { EyeOff, Home, List, LogOut, MoreVertical, PanelLeft, Plus, Settings, Tag } from "lucide-react"

import { useLabels } from "@/contexts/LabelsContext"
import { useTaskModal } from "@/contexts/TaskModalContext"
import { useTasks } from "@/contexts/TasksContext"
import { useToast } from "@/contexts/ToastContext"
import { useClickOutside } from "@/hooks/useClickOutside"
import { LogoutDialog } from "./LogoutDialog"

type Props = {
  collapsed: boolean
  onToggle: () => void
}

const ITEM_CLASS = "flex items-center gap-2 pl-4 py-2 text-sm text-gray-600 hover:text-brand-500 transition-colors"

export function Sidebar({ collapsed, onToggle }: Props) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { labels, isLoaded, updateLabel } = useLabels()
  const { tasks } = useTasks()
  const { showToast } = useToast()
  const { openCreate } = useTaskModal()

  useClickOutside(menuRef, () => setOpenMenuId(null), openMenuId !== null)

  const visibleLabels = useMemo(
    () => labels.filter(label => !label.hidden),
    [labels],
  )

  const incompleteCountByLabel = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const task of tasks) {
      if (task.completed) continue
      counts[task.labelId] = (counts[task.labelId] ?? 0) + 1
    }
    return counts
  }, [tasks])

  const handleHide = (labelId: string) => {
    updateLabel(labelId, { hidden: true })
    setOpenMenuId(null)
    showToast("ラベルを非表示にしました", () => updateLabel(labelId, { hidden: false }))
  }

  return (
    <>
      <aside className={`hidden md:flex flex-col fixed top-0 left-0 z-30 h-screen bg-white border-r border-gray-200 overflow-hidden transition-[width] duration-300 ease-in-out ${collapsed ? "w-13" : "w-64"
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
          <button onClick={() => openCreate()} className={`${ITEM_CLASS} w-full cursor-pointer`}>
            <Plus size={20} className="flex-shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>タスクを追加</span>
          </button>
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
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 whitespace-nowrap min-w-32">
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
            onClick={() => setShowLogoutDialog(true)}
            className={`${ITEM_CLASS} w-full cursor-pointer`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>ログアウト</span>
          </button>
        </div>
      </aside>

      <LogoutDialog isOpen={showLogoutDialog} onClose={() => setShowLogoutDialog(false)} />
    </>
  )
}