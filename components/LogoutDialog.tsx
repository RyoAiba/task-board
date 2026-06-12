"use client"

import { useRouter } from "next/navigation"

import { logout } from "@/utils/auth"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"

type LogoutDialogProps = {
  isOpen: boolean
  onClose: () => void
}

export function LogoutDialog({ isOpen, onClose }: LogoutDialogProps) {
  const router = useRouter()

  const handleLogout = () => {
    logout()
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