"use client"

import { useRouter } from "next/navigation"

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = "auth=; path=/; max-age=0"
    router.push("/login")
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold  mb-2">ログアウト</h2>
        <p className="text-sm text-gray-400 mb-6">ログアウトしますか？</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>
    </div>
  )
}