import { Category, CATEGORY_BADGE_CLASSES } from "../types"
import { truncate } from "../utils/string"

const NAME_MAX_LENGTH = 6

type Props = {
  category: Category
}

export function CategoryBadge({ category }: Props) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap ${CATEGORY_BADGE_CLASSES[category.color]}`}>
      {truncate(category.name, NAME_MAX_LENGTH)}
    </span>
  )
}