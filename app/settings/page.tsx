"use client"

import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import { Plus } from "lucide-react"

import { LabelAddModal } from "@/components/labels/LabelAddModal"
import { PageContainer } from "@/components/PageContainer"
import { Pagination } from "@/components/Pagination"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Tooltip } from "@/components/shared/Tooltip"
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
            <div className="flex items-center gap-2 px-3 pb-2 text-xs text-gray-400">
              <span className="w-[18px] flex-shrink-0" />
              <span className="flex-1 pl-2">ラベル名</span>
              <div className="hidden md:flex md:items-center md:justify-center md:w-24 md:mx-1">
                <span>サイドバーに表示</span>
              </div>
              <span className="hidden md:inline-block md:w-6 md:flex-shrink-0" aria-hidden />
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
            <div className="flex items-center">
              <div className="flex-1 flex items-center gap-1.5">
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
                  <Tooltip open={tooltipOpen} className="w-48">
                    オフにすると完了済みタスクをカレンダーに表示しません
                  </Tooltip>
                </div>
              </div>
              <div className="md:w-24 md:flex md:items-center md:justify-center md:mr-8">
                <Toggle
                  checked={settings.showCompletedInCalendar}
                  onChange={v => updateSetting("showCompletedInCalendar", v)}
                />
              </div>
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