"use client"

import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import { Plus } from "lucide-react"

import { LabelAddModal } from "@/components/labels/LabelAddModal"
import { PageContainer } from "@/components/PageContainer"
import { Pagination } from "@/components/Pagination"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Toggle } from "@/components/settings/Toggle"
import { useLabels } from "@/contexts/LabelsContext"
import { useSettings } from "@/contexts/SettingsContext"
import { useLabelDelete } from "@/hooks/useLabelDelete"
import { type PageSize } from "@/types"

const LabelRowList = dynamic(() => import("@/components/settings/LabelRowList"), {
  ssr: false,
  loading: () => <div className="text-sm text-gray-400">読み込み中...</div>,
})

export default function SettingsPage() {
  const { labels, updateLabel } = useLabels()
  const { settings, updateSetting, isLoaded } = useSettings()
  const { handleDelete } = useLabelDelete()

  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [pendingDeleteLabelId, setPendingDeleteLabelId] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(10)

  const totalPages = Math.max(1, Math.ceil(labels.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pagedLabels = useMemo(
    () => labels.slice((safePage - 1) * pageSize, safePage * pageSize),
    [labels, safePage, pageSize],
  )

  const handlePageSizeChange = (size: PageSize) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const pendingDeleteLabel = pendingDeleteLabelId
    ? labels.find(l => l.id === pendingDeleteLabelId)
    : null

  const handleConfirmDelete = () => {
    if (pendingDeleteLabelId) handleDelete(pendingDeleteLabelId)
    setPendingDeleteLabelId(null)
  }

  return (
    <PageContainer>
      {/* ラベル設定 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4 sm:max-w-md">
          <h2 className="text-section-title">ラベル</h2>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-2 py-1 text-sm text-brand-500 hover:bg-brand-100 rounded transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>ラベルを追加</span>
          </button>
        </div>

        <div className="sm:max-w-md">
          {labels.length > 0 && (
            <div className="flex items-center gap-3 px-3 pb-2 text-xs text-gray-400">
              <span className="w-[18px] flex-shrink-0" />
              <span className="flex-1 pl-2">ラベル名（10文字まで）</span>
              <span className="hidden md:inline">サイドバーに表示</span>
            </div>
          )}

          {labels.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">ラベルがありません</p>
          ) : (
            <>
              {totalPages > 1 && (
                <div className="mb-3">
                  <Pagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalCount={labels.length}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>
              )}

              <LabelRowList
                labels={pagedLabels}
                onUpdateLabel={updateLabel}
                onDeleteLabel={setPendingDeleteLabelId}
              />

              {totalPages > 1 && (
                <div className="mt-3">
                  <Pagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalCount={labels.length}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* カレンダー表示設定 */}
      {isLoaded && (
        <section>
          <h2 className="text-section-title mb-4">カレンダー表示</h2>
          <div className="bg-white rounded-lg p-4 sm:max-w-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <p className="text-sm text-gray-600">完了済みタスクを表示</p>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setTooltipOpen(prev => !prev)}
                    className={`w-4 h-4 rounded-full border text-xs flex items-center justify-center leading-none transition-colors cursor-pointer ${tooltipOpen
                        ? "bg-brand-500 border-brand-500 text-white"
                        : "border-gray-400 text-gray-400 hover:bg-brand-500 hover:border-brand-500 hover:text-white"
                      }`}
                  >
                    ?
                  </button>
                  {tooltipOpen && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg z-10">
                      オフにすると完了済みタスクをカレンダーに表示しません
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                    </div>
                  )}
                </div>
              </div>
              <Toggle
                checked={settings.showCompletedInCalendar}
                onChange={v => updateSetting("showCompletedInCalendar", v)}
              />
            </div>
          </div>
        </section>
      )}

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
    </PageContainer>
  )
}