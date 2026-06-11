"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

import { useLabels } from "../../contexts/LabelsContext"
import { useSettings } from "../../hooks/useSettings"
import { Toggle } from "../../components/settings/Toggle"
import { PageContainer } from "../../components/PageContainer"

const LabelRowList = dynamic(() => import("../../components/settings/LabelRowList"), {
  ssr: false,
  loading: () => <div className="text-sm text-gray-400">読み込み中...</div>,
})

export default function SettingsPage() {
  const { labels, updateLabel } = useLabels()
  const { settings, updateSetting, isLoaded } = useSettings()
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <PageContainer>

      {/* ラベル設定 */}
      <section className="mb-8">
        <h2 className="text-section-title mb-4">ラベル</h2>
        <div className="sm:max-w-md">
          <div className="flex items-center gap-3 px-3 pb-2 text-xs text-gray-400">
            <span className="w-[18px] flex-shrink-0" />
            <span className="flex-1 pl-2">ラベル名（10文字まで）</span>
            <span className="hidden md:inline">サイドバーに表示</span>
          </div>

          <LabelRowList labels={labels} onUpdateLabel={updateLabel} />
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
    </PageContainer>
  )
}