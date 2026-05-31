"use client"

import { useState } from "react"
import { PageContainer } from "../../components/PageContainer"
import { useCategories } from "../../hooks/useCategories"
import { useSettings } from "../../hooks/useSettings"
import { Pencil } from "lucide-react"
import { CATEGORY_DOT_CLASSES } from "../../types"

const CATEGORY_NAME_MAX = 10

export default function SettingsPage() {
  const { categories, updateCategory } = useCategories()
  const { settings, updateSetting, isLoaded } = useSettings()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [editingError, setEditingError] = useState("")
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const startEdit = (id: string, name: string) => {
    setEditingId(id)
    setEditingName(name)
    setEditingError("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName("")
    setEditingError("")
  }

  const saveEdit = () => {
    if (!editingId) return
    if (!editingName.trim()) {
      setEditingError("カテゴリ名を入力してください")
      return
    }
    updateCategory(editingId, editingName.trim())
    setEditingId(null)
    setEditingName("")
    setEditingError("")
  }

  return (
    <PageContainer>

      {/* カテゴリ名を編集 */}
      <section className="mb-8">
        <h2 className="text-section-title mb-4">カテゴリ名を編集</h2>
        <div className="space-y-2 sm:max-w-md">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg sm:max-w-md">
              {editingId === cat.id ? (
                <>
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${CATEGORY_DOT_CLASSES[cat.color]}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={e => {
                          setEditingName(e.target.value)
                          setEditingError("")
                        }}
                        onKeyDown={e => e.key === "Enter" && saveEdit()}
                        maxLength={CATEGORY_NAME_MAX}
                        className="w-full sm:w-48 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        autoFocus
                      />
                      <span className={`text-xs whitespace-nowrap ${editingName.length >= CATEGORY_NAME_MAX ? "text-red-500" : "text-gray-400"}`}>
                        {editingName.length} / {CATEGORY_NAME_MAX}
                      </span>
                    </div>
                    {editingError && (
                      <p className="text-red-500 text-xs mt-1">{editingError}</p>
                    )}
                  </div>
                  <button onClick={saveEdit} className="text-sm font-semibold text-primary hover:opacity-70 transition-opacity whitespace-nowrap">
                    保存
                  </button>
                  <button onClick={cancelEdit} className="text-sm font-semibold text-gray-400 hover:opacity-70 transition-opacity whitespace-nowrap">
                    キャンセル
                  </button>
                </>
              ) : (
                <>
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${CATEGORY_DOT_CLASSES[cat.color]}`} />
                  <span className="flex-1  font-medium">{cat.name}</span>
                  <button onClick={() => startEdit(cat.id, cat.name)} className="text-gray-400 hover:text-primary transition-colors">
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
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:max-w-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium ">完了済みタスクを表示</p>
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => setTooltipOpen(prev => !prev)}
                    className={`w-4 h-4 rounded-full border text-xs flex items-center justify-center leading-none transition-colors ${tooltipOpen
                      ? "bg-primary border-primary text-white"
                      : "border-gray-400 text-gray-400 hover:bg-primary hover:border-primary hover:text-white"
                      }`}
                  >
                    ?
                  </button>
                  <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-normal z-10 transition-opacity ${tooltipOpen ? "opacity-100" : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                    }`}>
                    オフにすると完了済みタスクをカレンダーに表示しません
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => updateSetting("showCompletedInCalendar", !settings.showCompletedInCalendar)}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${settings.showCompletedInCalendar ? "bg-primary" : "bg-gray-200"
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