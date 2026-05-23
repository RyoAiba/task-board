"use client"

import { useState } from "react"
import { useCategories } from "../../hooks/useCategories"
import { Pencil, Check, X } from "lucide-react"
import { CATEGORY_DOT_CLASSES } from "../../types"

export default function SettingsPage() {
  const { categories, updateCategory } = useCategories()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

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
    updateCategory(editingId, editingName.trim())
    setEditingId(null)
    setEditingName("")
  }

  return (
    <div>
      <h1 className="text-page-title mb-8">設定</h1>

      <section>
        <h2 className="text-section-title mb-4">カテゴリ名を編集</h2>
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
              {editingId === cat.id ? (
                <>
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${CATEGORY_DOT_CLASSES[cat.color]}`} />
                  <input
                    type="text"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && saveEdit()}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FA6218]"
                    autoFocus
                  />
                  <button onClick={saveEdit} className="text-[#FA6218] hover:opacity-70 transition-opacity">
                    <Check size={18} />
                  </button>
                  <button onClick={cancelEdit} className="text-gray-400 hover:opacity-70 transition-opacity">
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${CATEGORY_DOT_CLASSES[cat.color]}`} />
                  <span className="flex-1 text-gray-800 font-medium">{cat.name}</span>
                  <button onClick={() => startEdit(cat.id, cat.name)} className="text-gray-400 hover:text-[#FA6218] transition-colors">
                    <Pencil size={18} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}