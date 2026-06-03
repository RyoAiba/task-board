import { Label, CATEGORY_BADGE_CLASSES } from "../types"
import { truncate } from "../utils/string"

const NAME_MAX_LENGTH = 6

type Props = {
  label: Label
}

export function LabelBadge({ label }: Props) {
  return (
    <span className={`text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap ${CATEGORY_BADGE_CLASSES[label.color]}`}>
      {truncate(label.name, NAME_MAX_LENGTH)}
    </span>
  )
}