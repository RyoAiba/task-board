import { Tag } from "lucide-react"
import { Label } from "../types"
import { truncate } from "../utils/string"

const NAME_MAX_LENGTH = 6

type Props = {
  label: Label
}

export function LabelBadge({ label }: Props) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
      <Tag size={12} />
      {truncate(label.name, NAME_MAX_LENGTH)}
    </span>
  )
}