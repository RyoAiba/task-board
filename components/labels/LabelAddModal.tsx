"use client"

import { useEffect, useMemo, useState } from "react"

import { ModalHeader } from "@/components/shared/ModalHeader"
import { Overlay } from "@/components/shared/Overlay"
import { useLabels } from "@/contexts/LabelsContext"
import { useToast } from "@/contexts/ToastContext"

const NAME_MAX_LENGTH = 10

const normalize = (s: string) => s.replace(/\s/g, "")

type Props = {
  isOpen: boolean
  onClose: () => void
}

export function LabelAddModal({ isOpen, onClose }: Props) {
  const { labels, addLabel } = useLabels()
  const { showToast } = useToast()
  const [name, setName] = useState("")

  useEffect(() => {
    if (isOpen) setName("")
  }, [isOpen])

  const trimmed = name.trim()
  const normalized = normalize(name)

  const isDuplicate = useMemo(() => {
    if (normalized === "") return false
    return labels.some(l => normalize(l.name) === normalized)
  }, [labels, normalized])

  const canSubmit = trimmed !== "" && !isDuplicate

  const handleSubmit = () => {
    if (!canSubmit) return
    addLabel(trimmed)
    showToast(`ラベル「${trimmed}」を追加しました`)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canSubmit) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!isOpen) return null

  return (
    <Overlay dim onBackdropClick={onClose} level="above">
      <div
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <ModalHeader title="ラベルを追加" onClose={onClose} />

        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={NAME_MAX_LENGTH}
              placeholder="ラベル名を入力..."
              className={`w-full px-3 py-2 pr-14 border rounded-lg focus:outline-none focus:ring-1 transition-colors ${isDuplicate
                  ? "border-red-300 focus:ring-red-400"
                  : "border-gray-300 focus:ring-brand-500"
                }`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              {name.length}/{NAME_MAX_LENGTH}
            </span>
          </div>
          {isDuplicate && (
            <p className="mt-2 text-xs text-red-500">そのラベル名はすでに存在します</p>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-2 font-semibold rounded-lg transition-colors bg-brand-500 text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            追加
          </button>
        </div>
      </div>
    </Overlay>
  )
}