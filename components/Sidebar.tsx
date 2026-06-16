"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClipboardPen, EyeOff, Home, List, LogOut, MoreVertical, PanelLeft, Plus, Settings, Tag, Trash2 } from "lucide-react"

import { LabelAddModal } from "@/components/labels/LabelAddModal"
import { LogoutDialog } from "@/components/LogoutDialog"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Tooltip } from "@/components/shared/Tooltip"
import { useLabels } from "@/contexts/LabelsContext"
import { useTaskModal } from "@/contexts/TaskModalContext"
import { useTasks } from "@/contexts/TasksContext"
import { useToast } from "@/contexts/ToastContext"
import { useClickOutside } from "@/hooks/useClickOutside"
import { useLabelDelete } from "@/hooks/useLabelDelete"

type Props = {
  collapsed: boolean
  onToggle: () => void
}

const BASE_ITEM_CLASS = "flex items-center gap-2 pl-4 py-2 text-sm transition-colors"
const INACTIVE_CLASS = "text-gray-600 hover:text-brand-500"
const ACTIVE_CLASS = "text-brand-500 bg-brand-100 font-medium"

function navItemClass(active: boolean): string {
  return `${BASE_ITEM_CLASS} ${active ? ACTIVE_CLASS : INACTIVE_CLASS}`
}

export function Sidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [pendingDeleteLabelId, setPendingDeleteLabelId] = useState<string | null>(null)
  const [labelAddTooltipOpen, setLabelAddTooltipOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollTopRef = useRef(0)

  const { labels, isLoaded: labelsLoaded, updateLabel } = useLabels()
  const { tasks } = useTasks()
  const { showToast } = useToast()
  const { openCreate } = useTaskModal()
  const { handleDelete } = useLabelDelete()

  // 削除確認ダイアログ表示中は click-outside を無効化（メニューを開きっぱなしにするため）
  useClickOutside(
    menuRef,
    () => setOpenMenuId(null),
    openMenuId !== null && pendingDeleteLabelId === null,
  )

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

  const handleConfirmDelete = () => {
    if (pendingDeleteLabelId) {
      handleDelete(pendingDeleteLabelId)
    }
    setPendingDeleteLabelId(null)
    setOpenMenuId(null)
  }

  // サイドバー開閉時にラベル一覧のスクロール位置を保持
  const handleToggle = () => {
    if (!collapsed && scrollRef.current) {
      scrollTopRef.current = scrollRef.current.scrollTop
    }
    onToggle()
  }

  useEffect(() => {
    if (!collapsed && scrollRef.current) {
      scrollRef.current.scrollTop = scrollTopRef.current
    }
  }, [collapsed])

  const isHomeActive = pathname === "/"
  const isTasksActive = pathname === "/tasks"
  const isSettingsActive = pathname === "/settings"

  const pendingDeleteLabel = pendingDeleteLabelId
    ? labels.find(l => l.id === pendingDeleteLabelId)
    : null

  return (
    <>
      <aside className={`hidden md:flex flex-col fixed top-0 left-0 z-30 h-screen bg-white border-r border-gray-200 overflow-hidden transition-[width] duration-300 ease-in-out ${collapsed ? "w-13" : "w-64"}`}>
        {/* トグル */}
        <div className={`flex p-2 flex-shrink-0 ${collapsed ? "justify-center" : "justify-end"}`}>
          <button
            onClick={handleToggle}
            className="p-1 text-gray-600 hover:text-brand-500 transition-colors cursor-pointer"
            title={collapsed ? "サイドバーを開く" : "サイドバーを閉じる"}
          >
            <PanelLeft size={20} />
          </button>
        </div>

        {/* 固定上部ナビ */}
        <div className="flex-shrink-0">
          <Link href="/" className={navItemClass(isHomeActive)}>
            <Home size={20} className="flex-shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>ホーム</span>
          </Link>
          <button onClick={() => openCreate()} className={`${BASE_ITEM_CLASS} ${INACTIVE_CLASS} w-full cursor-pointer`}>
            <ClipboardPen size={20} className="flex-shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>タスクを追加</span>
          </button>

          {/* タスク一覧 + ラベル追加ボタン */}
          <div className="relative">
            <Link href="/tasks" className={navItemClass(isTasksActive)}>
              <List size={20} className="flex-shrink-0" />
              <span className={`whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>タスク一覧</span>
            </Link>
            {!collapsed && (
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onMouseEnter={() => setLabelAddTooltipOpen(true)}
                onMouseLeave={() => setLabelAddTooltipOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  onFocus={() => setLabelAddTooltipOpen(true)}
                  onBlur={() => setLabelAddTooltipOpen(false)}
                  className="p-1 rounded text-gray-400 hover:bg-brand-100 hover:text-brand-500 transition-colors cursor-pointer"
                  aria-label="ラベルを追加"
                >
                  <Plus size={16} />
                </button>
                <Tooltip open={labelAddTooltipOpen}>ラベルを追加</Tooltip>
              </div>
            )}
          </div>
        </div>

        {/* スクロール可能なラベル一覧 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
          {!collapsed && labelsLoaded && visibleLabels.map(label => {
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
                      className={`p-1 rounded-full text-gray-400 hover:bg-brand-100 hover:text-brand-500 transition-colors cursor-pointer ${menuOpen ? "flex bg-brand-100 text-brand-500" : "hidden group-hover:flex"
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
                      <button
                        onClick={() => setPendingDeleteLabelId(label.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                        削除
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* 固定下部 */}
        <div className="border-t border-gray-200 flex-shrink-0">
          <Link href="/settings" className={navItemClass(isSettingsActive)}>
            <Settings size={20} className="flex-shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>設定</span>
          </Link>
          <button
            onClick={() => setShowLogoutDialog(true)}
            className={`${BASE_ITEM_CLASS} ${INACTIVE_CLASS} w-full cursor-pointer`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}>ログアウト</span>
          </button>
        </div>
      </aside>

      <LogoutDialog isOpen={showLogoutDialog} onClose={() => setShowLogoutDialog(false)} />
      <LabelAddModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

      <ConfirmDialog
        isOpen={pendingDeleteLabel !== null}
        title="ラベルを削除しますか？"
        message={`ラベル「${pendingDeleteLabel?.name ?? ""}」を削除すると、紐づくタスクは未分類になります。`}
        confirmLabel="削除する"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteLabelId(null)}
      />
    </>
  )
}