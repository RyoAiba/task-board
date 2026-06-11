"use client"

import { useLabels } from "../../contexts/LabelsContext"
import { LabelChip } from "./LabelChip"

type Props = {
  mode: "create" | "edit"
  labelId: string
  onLabelChange: (labelId: string) => void
  onSave: () => void
}

export function TaskFormFooter({ mode, labelId, onLabelChange, onSave }: Props) {
  const { labels } = useLabels()
  const submitLabel = mode === "create" ? "追加" : "保存"

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex-1 md:flex-none overflow-x-auto md:overflow-visible">
          <LabelChip labels={labels} value={labelId} onChange={onLabelChange} />
        </div>
        <button
          type="button"
          onClick={onSave}
          className="md:hidden flex-shrink-0 py-1.5 px-4 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-colors cursor-pointer"
        >
          {submitLabel}
        </button>
      </div>

      <div className="hidden md:flex justify-end">
        <button
          type="button"
          onClick={onSave}
          className="py-2 px-6 bg-brand-500 text-white font-semibold rounded-lg hover:opacity-90 transition-colors cursor-pointer"
        >
          {submitLabel}
        </button>
      </div>
    </>
  )
}