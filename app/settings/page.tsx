"use client"

import { useState } from "react"
import { PageContainer } from "../../components/PageContainer"
import { useLabels } from "../../hooks/useLabels"
import { useSettings } from "../../hooks/useSettings"
import { Pencil } from "lucide-react"

const LABEL_NAME_MAX = 10

export default function SettingsPage() {
  const { labels, updateLabel } = useLabels()
  const { settings, updateSetting, isLoaded } = useSettings()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const startEdit = (id: string, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  const saveEdit = () => {
    if (!editingId || !editingName.trim()) return
    updateLabel(editingId, { name: editingName.trim() })
    setEditingId(null)
    setEditingName("")
  }

  return (
    <PageContainer>

      {/* ラベル名を編集 */}
      <section className="mb-8">
        <h2 className="text-section-title mb-4">ラベル名を編集</h2>
        <div className="space-y-2 sm:max-w-md">
          {labels.map(label => (
            <div key={label.id} className="flex items-center gap-3 p-4 bg-white rounded-lg hover:bg-gray-50">
              {editingId === label.id ? (
                <>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && saveEdit()}
                        maxLength={LABEL_NAME_MAX}
                        className="w-full sm:w-48 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                        autoFocus
                      />
                      <span className={`text-xs whitespace-nowrap ${editingName.length >= LABEL_NAME_MAX ? "text-red-500" : "text-gray-400"}`}>
                        {editingName.length} / {LABEL_NAME_MAX}
                      </span>
                    </div>
                    {!editingName.trim() && (
                      <p className="text-red-500 text-xs mt-1">ラベル名を入力してください</p>
                    )}
                  </div>
                  <button
                    onClick={saveEdit}
                    disabled={!editingName.trim()}
                    className="text-sm font-semibold text-brand-500 hover:opacity-70 transition-opacity whitespace-nowrap disabled:opacity-30"
                  >
                    保存
                  </button>
                  <button onClick={cancelEdit} className="text-sm font-semibold text-gray-400 hover:opacity-70 transition-opacity whitespace-nowrap">
                    キャンセル
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-600">{label.name}</span>
                  <button onClick={() => startEdit(label.id, label.name)} className="text-gray-400 hover:text-brand-500 transition-colors">
                    <Pencil size={18} />
                  </button>
                </>
              )}
            </div>
          ))}
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
                    className={`w-4 h-4 rounded-full border text-xs flex items-center justify-center leading-none transition-colors ${tooltipOpen
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
              <button
                onClick={() => updateSetting("showCompletedInCalendar", !settings.showCompletedInCalendar)}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${settings.showCompletedInCalendar ? "bg-brand-500" : "bg-gray-200"
                  }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.showCompletedInCalendar ? "translate-x-5" : "translate-x-0"
                  }`} />
              </button>
            </div>
          </div>
        </section>
      )}
    </PageContainer>
  )
}