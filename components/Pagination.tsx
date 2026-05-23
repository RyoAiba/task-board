import { ChevronLeft, ChevronRight } from "lucide-react"
import { PageSize, PAGE_SIZE_OPTIONS } from "../types"

// ─── ページ番号生成 ──────────────────────────────────────
function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages]
  }
  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
}

// ─── コンポーネント ──────────────────────────────────────
interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: PageSize
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: PageSize) => void
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div className="flex items-center justify-center md:justify-start gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="w-8 h-8 flex items-center justify-center text-sm text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 text-sm rounded transition-colors ${page === currentPage
                  ? "bg-[#FA6218] text-white font-semibold"
                  : "text-gray-500 hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex items-center justify-end md:justify-start gap-3">
        <span className="text-sm text-gray-400">
          {totalCount}件中 {startItem}〜{endItem}件
        </span>
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value) as PageSize)}
          className="text-xs px-2 py-1 border border-gray-200 rounded text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FA6218]"
        >
          {PAGE_SIZE_OPTIONS.map(size => (
            <option key={size} value={size}>{size}件表示</option>
          ))}
        </select>
      </div>
    </div>
  )
}