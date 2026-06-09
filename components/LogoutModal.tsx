"use client"

import { useRouter } from "next/navigation"

import { ConfirmDialog } from "./ConfirmDialog"

type LogoutModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = "auth=; path=/; max-age=0"
    router.push("/login")
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="ログアウト"
      message="ログアウトしますか？"
      confirmLabel="ログアウト"
      variant="danger"
      onConfirm={handleLogout}
      onCancel={onClose}
    />
  )
}